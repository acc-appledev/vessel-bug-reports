import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Triggered by entity automation when a PendingInvite record is created.
// Uses the service token to call the invite endpoint directly.

Deno.serve(async (req) => {
  const body = await req.json();
  const { entity_id, data } = body;

  const email = data?.email;
  if (!email) {
    return Response.json({ error: 'No email in payload' }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);
  const appId = Deno.env.get('BASE44_APP_ID');

  try {
    // Extract the service token that Base44 injects into automation function calls
    const authHeader = req.headers.get('authorization') || '';
    const serviceToken = authHeader.replace('Bearer ', '').trim();

    console.log('Service token present:', !!serviceToken, 'length:', serviceToken.length);

    const response = await fetch(`https://base44.app/api/apps/${appId}/runtime/users/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': appId,
        'Authorization': `Bearer ${serviceToken}`,
      },
      body: JSON.stringify({ user_email: email, role: 'user' }),
    });

    const result = await response.json();
    console.log('Invite response:', response.status, JSON.stringify(result));

    if (!response.ok) {
      throw new Error(result?.message || `HTTP ${response.status}`);
    }

    await base44.asServiceRole.entities.PendingInvite.update(entity_id, { status: 'sent' });
    return Response.json({ success: true, invited: email });
  } catch (error) {
    const msg = error?.message || 'Failed to invite user';
    console.error('processPendingInvite error:', msg);
    await base44.asServiceRole.entities.PendingInvite.update(entity_id, { status: 'failed', error: msg });
    return Response.json({ error: msg }, { status: 500 });
  }
});