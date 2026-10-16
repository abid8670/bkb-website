'use strict';

/* ============================================================
   POST /api/send  —  Vercel Serverless Function (Node.js)
   Receives a JSON submission from any website form and emails
   it (branded HTML) to the address in MAIL_TO via Google SMTP.

   Required environment variables (set in Vercel → Project →
   Settings → Environment Variables):
     GMAIL_USER          e.g. binkamalbuilders@gmail.com
     GMAIL_APP_PASSWORD  16-character Google App Password
   Optional:
     MAIL_TO             defaults to GMAIL_USER
     SMTP_HOST / SMTP_PORT  defaults to smtp.gmail.com:465
   ============================================================ */

const { sendEnquiry } = require('../lib/mailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  try {
    const result = await sendEnquiry(body);
    return res.status(200).json({ ok: true, id: result.messageId, skipped: !!result.skipped });
  } catch (err) {
    const status = (err && err.statusCode) || 500;
    console.error('[api/send]', err && (err.publicMessage || err.message));
    return res.status(status).json({
      ok: false,
      error: (err && err.publicMessage) || 'We could not send your enquiry right now. Please try again.'
    });
  }
};
