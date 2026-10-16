'use strict';
/* Local test harness for the BKB mailer.
   Generates a preview of the HTML email and attempts a real send. */
const fs = require('fs');
const path = require('path');
const mailer = require('../lib/mailer');

const to = process.env.TEST_SEND_TO || process.env.GMAIL_USER || 'binkamalbuilders@gmail.com';

const sample = {
  form: 'Arabian Villa — Project Enquiry',
  page: '/arabian-villa.html',
  fields: {
    name: 'Test Client',
    phone: '0300 1234567',
    email: 'test.client@example.com',
    interest: 'Request Payment Plan',
    message: 'Please share availability and the 3-year payment plan.\nThanks!'
  }
};

const html = mailer.buildHtml(sample.form, sample.fields, { timestamp: new Date().toISOString(), page: sample.page });
fs.writeFileSync(path.join(__dirname, 'email-preview.html'), html);
console.log('Wrote email-preview.html (' + html.length + ' bytes)');
console.log('----- PLAIN TEXT -----');
console.log(mailer.buildText(sample.form, sample.fields, { timestamp: new Date().toISOString(), page: sample.page }, sample.fields.email));

if (process.argv.indexOf('--send') !== -1) {
  console.log('\n----- SENDING for real to ' + to + ' -----');
  mailer.sendEnquiry(sample)
    .then(function (r) { console.log('SENT OK:', r); })
    .catch(function (e) { console.log('SEND FAILED:', e.statusCode, '|', e.publicMessage, '|', e.message); });
} else {
  console.log('\n(preview only — pass --send to attempt a real send)');
}
