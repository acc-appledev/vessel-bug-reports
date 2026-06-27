import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// This function receives the Zapier webhook and saves the email as a PendingInvite.
// An entity automation then picks it up and sends the actual invite.

Deno.serve(async (req) => {
  let body = {};
  try {
    const contentType = req.headers.get('content-type') || '';
    const text = await req.text();
    if (contentType.includes('application/json') || text.startsWith('{')) {
      body = JSON.parse(text);
    } else {
      const params = new URLSearchParams(text);
      for (const [k, v] of params) body[k] = v;
    }
  } catch {
    return Response.json({ error: 'Could not parse request body' }, { status: 400 });
  }

  // Validate secret (allow __test flag to bypass during development)
  const secret = req.headers.get('x-webhook-secret');
  if (!body.__test && secret !== Deno.env.get('ZAPIER_WEBHOOK_SECRET')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email) {
    return Response.json({ error: 'email is required' }, { status: 400 });
  }

  try {
    const base44 = createClientFromRequest(req);
    // Save as pending invite — automation will send the actual invite
    await base44.asServiceRole.entities.PendingInvite.create({ email, status: 'pending' });
    return Response.json({ success: true, queued: email });
  } catch (error) {
    const msg = error?.message || 'Failed to queue invite';
    console.error('inviteUser error:', msg);
    return Response.json({ error: msg }, { status: 500 });
  }
});