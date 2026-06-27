import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const stripeCustomerId = users[0]?.stripe_customer_id;
    if (!stripeCustomerId) {
      return Response.json({ error: 'No active subscription found.' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const { return_url } = await req.json().catch(() => ({}));

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: return_url || `${req.headers.get('origin')}/account`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});