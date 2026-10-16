'use strict';
const fs = require('fs');
const m = require('../lib/mailer');

const fields = { name: 'Ali Raza', company: '', phone: '03001234567', email: 'ali@example.com', city: 'Lahore', teamSize: '', message: '' };
const form = 'Contact - Partner / Channel Partner';
const meta = { timestamp: 'now', page: '/contact.html' };

const html = m.buildHtml(form, fields, meta);
fs.writeFileSync(__dirname + '/email-preview.html', html);
const rows = (html.match(/padding:11px 16px/g) || []).length;
console.log('HTML rows (fields shown):', rows);
console.log('has dash placeholder:', html.indexOf('\u2014') !== -1);
console.log('----- PLAIN TEXT -----');
console.log(m.buildText(form, fields, meta, fields.email));
