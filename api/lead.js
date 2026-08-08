// Vercel serverless function: receives quote-form submissions from the website
// and forwards them to GoHighLevel via the GHL_WEBHOOK_URL environment variable.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    console.error('GHL_WEBHOOK_URL is not set in Vercel environment variables');
    return res.status(500).json({ error: 'Server not configured' });
  }
  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    if (!r.ok) {
      console.error('GHL webhook responded with status ' + r.status);
      return res.status(502).json({ error: 'Forwarding failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error forwarding lead:', err);
    return res.status(502).json({ error: 'Forwarding failed' });
  }
}
