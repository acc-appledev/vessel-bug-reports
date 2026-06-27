import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature error:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_email || session.metadata?.user_email;
      if (userEmail) {
        // Find the user and update their subscription status
        const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: 'active',
            stripe_customer_id: session.customer,
            subscription_id: session.subscription,
          });
          console.log(`Subscription activated for ${userEmail}`);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const status = subscription.status;

      const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_status: status === 'active' || status === 'trialing' ? 'active' : 'inactive',
        });
        console.log(`Subscription updated for customer ${customerId}: ${status}`);
      }
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object;
      // Only send for recurring billing cycles, not the first (trial start) checkout
      if (invoice.billing_reason === 'subscription_cycle') {
        const customerId = invoice.customer;
        const amountPaid = (invoice.amount_paid / 100).toFixed(2);
        const periodEnd = new Date(invoice.lines.data[0]?.period?.end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
        if (users.length > 0) {
          const user = users[0];
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: user.email,
            subject: 'Your Vessel subscription has been renewed',
            body: `Hi ${user.full_name || 'there'},\n\nThank you! Your Vessel membership has been successfully renewed.\n\nAmount charged: $${amountPaid}\nNext billing date: ${periodEnd}\n\nYou can manage your subscription anytime from the Account page inside the app.\n\nKeep pressing forward,\nThe Vessel Team`,
          });
          console.log(`Renewal email sent to ${user.email}`);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});