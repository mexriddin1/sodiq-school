import { env } from '../config/env.js';

let transporterPromise;
let warnedMissingSmtp = false;

function isConfigured() {
  return Boolean(env.mail.smtpHost && env.mail.from && env.mail.leadNotifyTo.length);
}

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = import('nodemailer').then(({ default: nodemailer }) => nodemailer.createTransport({
      host: env.mail.smtpHost,
      port: env.mail.smtpPort,
      secure: env.mail.smtpSecure,
      auth: env.mail.smtpUser && env.mail.smtpPass
        ? { user: env.mail.smtpUser, pass: env.mail.smtpPass }
        : undefined,
    }));
  }
  return transporterPromise;
}

function leadText(lead) {
  return [
    'Yangi lead / ariza',
    '',
    `Sayt: ${lead.siteName}`,
    `Forma: ${lead.source_form || 'contact'}`,
    `Ism: ${lead.name}`,
    `Telefon: ${lead.phone}`,
    `Yosh: ${lead.age || '-'}`,
    `Sinf: ${lead.grade || '-'}`,
    `Viloyat: ${lead.region || '-'}`,
    `Xabar: ${lead.message || '-'}`,
  ].join('\n');
}

function leadHtml(lead) {
  const esc = (value) => String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return `
    <h2>Yangi lead / ariza</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif">
      <tr><td><strong>Sayt</strong></td><td>${esc(lead.siteName)}</td></tr>
      <tr><td><strong>Forma</strong></td><td>${esc(lead.source_form || 'contact')}</td></tr>
      <tr><td><strong>Ism</strong></td><td>${esc(lead.name)}</td></tr>
      <tr><td><strong>Telefon</strong></td><td>${esc(lead.phone)}</td></tr>
      <tr><td><strong>Yosh</strong></td><td>${esc(lead.age)}</td></tr>
      <tr><td><strong>Sinf</strong></td><td>${esc(lead.grade)}</td></tr>
      <tr><td><strong>Viloyat</strong></td><td>${esc(lead.region)}</td></tr>
      <tr><td><strong>Xabar</strong></td><td>${esc(lead.message)}</td></tr>
    </table>
  `;
}

export async function notifyLeadSubmission(lead) {
  if (!isConfigured()) {
    if (!warnedMissingSmtp) {
      console.warn('[lead-notifications] SMTP is not configured; email notification skipped');
      warnedMissingSmtp = true;
    }
    return;
  }

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: env.mail.from,
      to: env.mail.leadNotifyTo,
      subject: `Yangi lead: ${lead.siteName} - ${lead.name}`,
      text: leadText(lead),
      html: leadHtml(lead),
    });
  } catch (err) {
    console.error('[lead-notifications] failed to send email', err);
  }
}
