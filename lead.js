// Vercel serverless function — receives the quote form and forwards it to GoHighLevel.
// Put this file in your repo at:  api/lead.js
// Set GHL_WEBHOOK_URL in Vercel (Settings -> Environment Variables) to your GHL Inbound Webhook URL.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    return res.status(500).json({ ok: false, error: 'GHL_WEBHOOK_URL is not set' });
  }

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: 'Webhook responded ' + r.status });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Failed to forward lead' });
  }
}
