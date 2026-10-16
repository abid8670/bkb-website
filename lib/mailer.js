'use strict';

/* ============================================================
   Bin Kamal Builders — enquiry mailer
   Sends branded HTML notification emails through Google SMTP.
   Shared by the Vercel function (api/send.js) and the local
   dev server (dev-server.js).
   ============================================================ */

const nodemailer = require('nodemailer');

const BRAND = {
  navy: '#07182B',
  gold: '#C89B4A',
  ivory: '#F7F4EE',
  muted: '#7A8896'
};

const LABELS = {
  name: 'Name',
  fullname: 'Full Name',
  fullName: 'Full Name',
  phone: 'Phone',
  mobile: 'Mobile',
  email: 'Email',
  company: 'Company',
  city: 'City',
  teamSize: 'Team Size',
  message: 'Message',
  enquiryType: 'Enquiry Type',
  interest: 'Interested In',
  subject: 'Subject',
  project: 'Project'
};

/* Keys that should be treated as the reply-to address */
const EMAIL_KEY = /e-?mail/i;

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function titleCase(key) {
  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

function labelFor(key) {
  return LABELS[key] || titleCase(key);
}

function renderValueHTML(key, value) {
  const text = String(value == null ? '' : value);
  if (!text.trim()) return '<span style="color:#B0B8C1;">—</span>';
  if (isEmail(text)) {
    const safe = escapeHtml(text.trim());
    return '<a href="mailto:' + safe + '" style="color:' + BRAND.navy + ';text-decoration:none;border-bottom:1px solid ' + BRAND.gold + ';">' + safe + '</a>';
  }
  if (/phone|tel|mobile/i.test(key) && /^[+()\d\s-]+$/.test(text.trim())) {
    const digits = text.replace(/[^\d+]/g, '');
    return '<a href="tel:' + escapeHtml(digits) + '" style="color:' + BRAND.navy + ';text-decoration:none;">' + escapeHtml(text.trim()) + '</a>';
  }
  return escapeHtml(text).replace(/\r?\n/g, '<br>');
}

function buildHtml(formName, fields, meta) {
  const rows = Object.keys(fields)
    .map(function (key) {
      return '' +
        '<tr>' +
          '<td style="padding:11px 16px 11px 0;border-bottom:1px solid #ECE7DC;width:150px;vertical-align:top;' +
            'color:' + BRAND.muted + ';font-size:12px;text-transform:uppercase;letter-spacing:.09em;font-weight:700;">' +
            escapeHtml(labelFor(key)) +
          '</td>' +
          '<td style="padding:11px 0;border-bottom:1px solid #ECE7DC;color:#1C1C1C;font-size:15px;line-height:1.55;">' +
            renderValueHTML(key, fields[key]) +
          '</td>' +
        '</tr>';
    })
    .join('');

  return '' +
  '<!doctype html><html><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
  '<body style="margin:0;padding:0;background:' + BRAND.ivory + ';">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" ' +
    'style="background:' + BRAND.ivory + ';padding:26px 14px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">' +
    '<tr><td align="center">' +
      '<table role="presentation" width="600" cellpadding="0" cellspacing="0" ' +
        'style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;' +
        'box-shadow:0 8px 30px rgba(7,24,43,.14);">' +
        '<tr><td style="background:' + BRAND.navy + ';padding:26px 30px;">' +
          '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:22px;letter-spacing:.18em;' +
            'color:' + BRAND.ivory + ';text-transform:uppercase;">Bin Kamal Builders</div>' +
          '<div style="font-size:11px;letter-spacing:.26em;color:' + BRAND.gold + ';margin-top:7px;' +
            'text-transform:uppercase;">Your Dream, Our Commitment</div>' +
        '</td></tr>' +
        '<tr><td style="padding:30px;">' +
          '<div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:' + BRAND.gold + ';font-weight:700;">' +
            'New Website Enquiry</div>' +
          '<h1 style="font-family:Georgia,\'Times New Roman\',serif;font-size:24px;margin:9px 0 4px;color:' + BRAND.navy + ';">' +
            escapeHtml(formName) + '</h1>' +
          '<p style="margin:0 0 20px;color:' + BRAND.muted + ';font-size:13px;">' +
            'Received ' + escapeHtml(meta.timestamp) + '</p>' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
            (rows || '<tr><td style="color:#1C1C1C;font-size:15px;">(no fields submitted)</td></tr>') +
          '</table>' +
        '</td></tr>' +
        '<tr><td style="padding:16px 30px;background:' + BRAND.ivory + ';border-top:1px solid #E6E1D6;' +
          'font-size:12px;color:' + BRAND.muted + ';line-height:1.6;">' +
          'Submitted from <strong>' + escapeHtml(meta.page || 'website') + '</strong><br>' +
          'Bin Kamal Builders &middot; Al Hafeez Executive, Gulberg III, Lahore &middot; 0332-4448445' +
        '</td></tr>' +
      '</table>' +
      '<div style="max-width:600px;color:#9AA6B2;font-size:11px;margin-top:14px;text-align:center;">' +
        'This message was generated automatically from the Bin Kamal Builders website contact forms.' +
      '</div>' +
    '</td></tr>' +
  '</table>' +
  '</body></html>';
}

function buildText(formName, fields, meta, replyTo) {
  const lines = ['New Website Enquiry: ' + formName, 'Received ' + meta.timestamp, ''];
  Object.keys(fields).forEach(function (key) {
    const value = fields[key];
    lines.push(labelFor(key) + ': ' + (value === '' || value == null ? '(not provided)' : String(value)));
  });
  lines.push('', 'Submitted from ' + (meta.page || 'website'));
  if (replyTo) lines.push('Reply to: ' + replyTo);
  return lines.join('\n');
}

/* Accept a few common environment-variable spellings so a small typo in the
   Vercel dashboard does not break the form. The documented names are
   GMAIL_USER / GMAIL_APP_PASSWORD. */
function envUser() {
  return process.env.GMAIL_USER || process.env.SMTP_USER || process.env.MAIL_USER ||
    process.env.EMAIL_USER || process.env.GMAIL_ADDRESS || '';
}
function envPass() {
  return process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS || process.env.GMAIL_PASSWORD ||
    process.env.APP_PASSWORD || process.env.SMTP_PASSWORD || process.env.MAIL_PASSWORD || '';
}
function envTo() {
  return process.env.MAIL_TO || process.env.CONTACT_TO || process.env.TO_EMAIL || '';
}

function createTransport() {
  const user = envUser();
  const pass = envPass();
  if (!user || !pass) {
    const err = new Error('Mail credentials are not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
    err.statusCode = 500;
    err.publicMessage = 'The enquiry form is not configured yet. Please WhatsApp us on 0332-4448445.';
    throw err;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_PORT || 465) === '465', // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: user, pass: pass },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 20000
  });
}

/* Normalise + validate the incoming payload */
function normalise(payload) {
  payload = payload || {};
  const formName = String(payload.form || payload.formName || 'Website Enquiry').slice(0, 120);
  const page = String(payload.page || '').slice(0, 300);
  const rawFields = payload.fields && typeof payload.fields === 'object' ? payload.fields : payload;

  const fields = {};
  let replyTo = '';
  Object.keys(rawFields).forEach(function (key) {
    if (key === 'form' || key === 'formName' || key === 'page' || key === 'fields') return;
    if (/^_/.test(key)) return; // email only
    let value = rawFields[key];
    if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
    value = String(value == null ? '' : value).trim().slice(0, 4000);
    fields[key] = value;
    if (!replyTo && EMAIL_KEY.test(key) && isEmail(value)) replyTo = value;
  });
  return { formName: formName, page: page, fields: fields, replyTo: replyTo };
}

async function sendEnquiry(payload) {
  const hp = payload && (payload._gotcha || (payload.fields && payload.fields._gotcha));
  if (hp && String(hp).trim()) {
    // Silently accept honeypot submissions without sending anything.
    return { messageId: 'honeypot-ignored', skipped: true };
  }

  const data = normalise(payload);
  const values = Object.keys(data.fields).map(function (k) { return data.fields[k]; });
  const hasSomething = values.some(function (v) { return v && v.length; });
  if (!hasSomething) {
    const err = new Error('Empty enquiry');
    err.statusCode = 400;
    err.publicMessage = 'Please fill in the form before sending.';
    throw err;
  }

  const meta = {
    timestamp: new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'medium',
      timeStyle: 'short'
    }) + ' (PKT)',
    page: data.page
  };

  const name = data.fields.name || data.fields.fullName || data.fields.fullname || '';
  const subject = 'New ' + data.formName + (name ? ' \u2014 ' + name : '');

  const transporter = createTransport();
  const user = envUser();
  const to = envTo() || user;

  try {
    const info = await transporter.sendMail({
      from: '"Bin Kamal Builders Website" <' + user + '>',
      to: to,
      replyTo: data.replyTo || undefined,
      subject: subject,
      text: buildText(data.formName, data.fields, meta, data.replyTo),
      html: buildHtml(data.formName, data.fields, meta)
    });
    return { messageId: info.messageId, accepted: info.accepted };
  } catch (e) {
    console.error('[mailer] send failed:', e && (e.response || e.message));
    const err = new Error(e && e.message ? e.message : 'send failed');
    err.statusCode = 502;
    err.publicMessage = 'We could not send your enquiry right now. Please try again, or WhatsApp us on 0332-4448445.';
    throw err;
  }
}

module.exports = { sendEnquiry: sendEnquiry, escapeHtml: escapeHtml, labelFor: labelFor, buildHtml: buildHtml, buildText: buildText, normalise: normalise };
