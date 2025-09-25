/**
 * /api/contact.js — VERSION FINALE (CommonJS)
 * - Garde TON style d’email (createStyledEmail + confirmationContent FR/EN/HE)
 * - Ajoute SÉCURITÉ: reCAPTCHA v3 (avant parsing), origin check, Busboy + limites, whitelist MIME
 * - Anti-spam: rate-limit (10 req / 10 min / IP)
 * - Confidentialité: destinataires cachés en BCC (To visible = 1er SENDGRID_TO, BCC = SENDGRID_BCC)
 * - Auto-répondeur client en FR/EN/HE (selon champ `lang`, défaut FR)
 *
 * ENV (Vercel → Project → Settings → Environment Variables)
 *  - SENDGRID_API_KEY (secret)
 *  - SENDGRID_FROM (ex. contact@wizmanheritage.com)
 *  - SENDGRID_TO (ex. contact@wizmanheritage.com)  ← visible
 *  - SENDGRID_BCC (ex. rubenwzm@gmail.com,autre@...) ← caché(s)
 *  - RECAPTCHA_SECRET_KEY (secret)
 *  - ALLOWED_ORIGINS (optionnel, liste CSV, ex. https://www.wizmanheritage.com,https://wizmanheritage.com)
 */

const sgMail = require('@sendgrid/mail');
const Busboy = require('busboy');
const fs = require('fs').promises;
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// ---------- Helpers sécurité ----------
function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB/fichier
const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB total
const MAX_FIELD_SIZE = 1 * 1024 * 1024; // 1 MB/champ

// Soft rate-limit (meilleure que rien ; pour du béton => KV/Redis)
const BUCKET = new Map();
function checkRateLimit(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'anon';
  const windowKey = `${ip}:${Math.floor(Date.now() / (10 * 60 * 1000))}`; // 10 min
  const count = (BUCKET.get(windowKey) ?? 0) + 1;
  BUCKET.set(windowKey, count);
  return count <= 10;
}

function isAllowedOrigin(req) {
  const origin = req.headers['origin'] || req.headers['Origin'];
  const host = req.headers['host'] || req.headers['Host'];
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

  const hostOk = typeof host === 'string' && (
    host.endsWith('wizmanheritage.com') || host.endsWith('vercel.app') || host.endsWith('localhost:3000')
  );
  const originOk = !origin || origin === 'null' || allowed.length === 0 || allowed.includes(origin);

  return hostOk && originOk;
}

async function verifyRecaptcha(token) {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) return false;
  const params = new URLSearchParams();
  params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
  params.append('response', token);

  try {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const json = await r.json();
    return !!(json && json.success && (json.score ?? 0) >= 0.5);
  } catch {
    return false;
  }
}

// ---------- Templating (TA mise en page conservée) ----------
function createStyledEmail(content) {
  const { title, preheader, body_content, footer_text } = content;
  const sandBeige = '#F3F0E7';
  const textPrimary = '#2D2A25';
  const textSecondary = '#6B6358';

  return `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${title}</title>
      <style>body { font-family: Inter, Arial, sans-serif; }</style>
    </head>
    <body style="margin:0;padding:0;background-color:${sandBeige};font-family:Inter,Arial,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>

      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
             style="max-width:600px;margin:20px auto;background:#FFFFFF;border:1px solid #E6E2DB;border-radius:16px;box-shadow:0 8px 32px rgba(45,42,37,0.06);">
        <tr>
          <td align="center" style="padding:20px 0;">
            <!-- Logo en inline CID -->
            <img src="cid:logo" alt="WizmanHeritage Logo" width="180" style="display:block;">
          </td>
        </tr>

        <tr>
          <td style="padding:30px;color:${textPrimary};">${body_content}</td>
        </tr>

        <tr>
          <td align="center"
              style="padding:20px 30px;background:#FEFCF8;border-top:1px solid #E6E2DB;border-bottom-left-radius:16px;border-bottom-right-radius:16px;">
            <p style="margin:0;color:${textSecondary};font-size:12px;">${footer_text}</p>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

const confirmationContent = {
  fr: {
    title: 'Confirmation de votre demande | WizmanHeritage',
    preheader: 'Nous avons bien reçu votre demande et revenons vers vous rapidement.',
    greeting: 'Bonjour {name},',
    main_text:
      "Nous avons bien reçu votre demande et nous vous remercions de votre confiance.<br><br>Un membre de notre cabinet l'examinera avec la plus grande attention. <strong>WizmanHeritage s'engage à vous répondre dans un délai de 48 heures ouvrées.</strong><br><br>Votre demande est traitée avec la plus stricte confidentialité.",
    closing: 'Cordialement,',
    team_name: "L'équipe WizmanHeritage",
    footer_text:
      '&copy; 2025 WizmanHeritage. Tous droits réservés. Cet email est une confirmation de réception.',
  },
  en: {
    title: 'Request Confirmation | WizmanHeritage',
    preheader: 'We have received your request and will get back to you shortly.',
    greeting: 'Dear {name},',
    main_text:
      'We have successfully received your request and thank you for your trust.<br><br>A member of our firm will review it with the utmost care. <strong>WizmanHeritage commits to responding within 48 business hours.</strong><br><br>Your request is being handled with the strictest confidentiality.',
    closing: 'Sincerely,',
    team_name: 'The WizmanHeritage Team',
    footer_text:
      '&copy; 2025 WizmanHeritage. All rights reserved. This email is a receipt confirmation.',
  },
  he: {
    title: 'אישור קבלת פנייתך | WizmanHeritage',
    preheader: 'קיבלנו את פנייתך ונחזור אליך בהקדם.',
    greeting: 'שלום {name},',
    main_text:
      'פנייתך התקבלה בהצלחה, ואנו מודים לך על אמונך.<br><br>נציג ממשרדנו יבחן את פנייתך בקפידה. <strong>WizmanHeritage מתחייבת להשיב לפנייתך תוך 48 שעות עסקים.</strong><br><br>פנייתך מטופלת בסודיות מוחלטת.',
    closing: 'בכבוד רב,',
    team_name: 'צוות WizmanHeritage',
    footer_text:
      '&copy; 2025 WizmanHeritage. כל הזכויות שמורות. אימייל זה מהווה אישור קבלה.',
  },
};

// ---------- Handler ----------
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { message: 'Method Not Allowed' });
  }

  if (!checkRateLimit(req)) {
    return json(res, 429, { code: 'too_many_requests', message: 'Too Many Requests' });
  }

  if (!isAllowedOrigin(req)) {
    return json(res, 403, { code: 'forbidden', message: 'Forbidden' });
  }

  // Vérif CAPTCHA AVANT parsing
  const captchaToken = req.headers['x-recaptcha-token'];
  const captchaOk = await verifyRecaptcha(captchaToken);
  if (!captchaOk) {
    return json(res, 400, { code: 'captcha_failed', message: 'Captcha failed' });
  }

  // Garde-fou sur Content-Length
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_TOTAL_BYTES) {
    return json(res, 413, { code: 'payload_too_large', message: 'Payload Too Large' });
  }

  // Bufferiser le corps brut (comme dans ta version)
  const rawBody = await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  // Parse multipart via Busboy avec limites + whitelist MIME
  const parseMultipartForm = (headers, bodyBuffer) =>
    new Promise((resolve, reject) => {
      const fields = {};
      const files = [];
      let totalBytes = 0;

      const bb = Busboy({
        headers,
        limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES, fieldSize: MAX_FIELD_SIZE }
      });

      bb.on('file', (fieldname, file, info = {}) => {
        const { filename, mimeType } = info;
        if (!filename) {
          file.resume();
          return;
        }
        if (!ALLOWED_MIME.has(mimeType || '')) {
          file.resume();
          return reject(Object.assign(new Error('Invalid file type'), { code: 'invalid_file_type' }));
        }

        const chunks = [];
        let bytes = 0;

        file.on('data', (chunk) => {
          bytes += chunk.length;
          totalBytes += chunk.length;
          if (bytes > MAX_FILE_BYTES || totalBytes > MAX_TOTAL_BYTES) {
            return reject(Object.assign(new Error('Payload Too Large'), { code: 'payload_too_large' }));
          }
          chunks.push(chunk);
        });

        file.on('limit', () => reject(Object.assign(new Error('File too large'), { code: 'payload_too_large' })));

        file.on('end', () => {
          const buff = Buffer.concat(chunks);
          files.push({
            content: buff,
            filename,
            type: 'application/octet-stream', // compat Outlook
            disposition: 'attachment',
            _originalMime: mimeType
          });
        });
      });

      bb.on('field', (name, val) => {
        if (Buffer.byteLength(val, 'utf8') > MAX_FIELD_SIZE) {
          return reject(Object.assign(new Error('Field too large'), { code: 'field_too_large' }));
        }
        fields[name] = val;
      });

      bb.on('error', reject);
      bb.on('close', () => resolve({ fields, files }));
      bb.end(bodyBuffer);
    });

  let fields, clientFiles;
  try {
    ({ fields, files: clientFiles } = await parseMultipartForm(req.headers, rawBody));
  } catch (e) {
    const code = e.code || 'server_error';
    const status = code === 'payload_too_large' ? 413 : code === 'invalid_file_type' ? 400 : 400;
    return json(res, status, { code, message: e.message });
  }

  const name = (fields.name || '').toString();
  const email = (fields.email || '').toString();
  const phone = (fields.phone || '').toString();
  const message = (fields.message || '').toString();
  const consentOk = String(fields.consent || fields.rgpd || '').toLowerCase() === 'on';
  const lang = (fields.lang || 'fr').toString().toLowerCase();

  if (!name || !email || !message || !consentOk) {
    return json(res, 400, { code: 'missing_required', message: 'Missing required fields or consent' });
  }
  if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/i.test(email)) {
    return json(res, 400, { code: 'invalid_email', message: 'Invalid email format' });
  }

  // Logo inline (CID)
  let logoAttachment = null;
  try {
    const logoPath = path.join(process.cwd(), 'Logo_WizmanHeritage.png');
    const logoBuffer = await fs.readFile(logoPath);
    logoAttachment = {
      content: logoBuffer.toString('base64'),
      filename: 'Logo_WizmanHeritage.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'logo' // clé correcte pour SendGrid
    };
  } catch {
    // Pas bloquant si le logo est absent
  }

  // Pièces jointes client (base64)
  const formattedClientFiles = (clientFiles || []).map((f) => ({
    content: f.content.toString('base64'),
    filename: f.filename,
    type: 'application/octet-stream',
    disposition: 'attachment'
  }));

  // Métadonnées soumission
  const submissionDate = new Date().toLocaleString(
    lang === 'he' ? 'he-IL' : (lang === 'en' ? 'en-GB' : 'fr-FR'),
    { timeZone: 'Europe/Paris' }
  );
  const xff = (req.headers['x-forwarded-for'] || '').toString();
  const ipAddress = xff.split(',')[0] || 'Non disponible';

  const engagementSheetHtml = `
    <hr style="border:none;border-top:1px solid #E6E2DB;margin:30px 0;">
    <div style="padding:20px;border:1px solid #4B5320;border-radius:8px;background-color:#FAFAF8;">
      <h2 style="margin-top:0;color:#4B5320;font-size:18px;text-align:center;">
        Fiche d'Engagement & de Consentement
      </h2>
      <p style="font-size:12px;text-align:center;margin-bottom:20px;">Générée le : ${submissionDate}</p>
      <p><strong>Client :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Adresse IP de Soumission :</strong> ${ipAddress}</p>
      <p><strong>Statut du Consentement :</strong> <span style="color:green;font-weight:bold;">✔ ACCEPTÉ</span></p>
      <p style="font-size:12px;">
        Le client a coché la case de consentement, acceptant ainsi le traitement de ses données personnelles et des fichiers joints, conformément à la politique de confidentialité.
      </p>
      <p><strong>Documents Partagés :</strong></p>
      <p style="font-weight:bold;">
        ${(clientFiles && clientFiles.length) ? clientFiles.map((f) => f.filename).join(', ') : 'Aucun document partagé.'}
      </p>
    </div>
  `;

  // ---------- Notification interne (To visible + BCC cachés) ----------
  const toFirst = String(process.env.SENDGRID_TO || '').split(',').map(s => s.trim()).filter(Boolean)[0];
  const bccList = String(process.env.SENDGRID_BCC || '').split(',').map(s => s.trim()).filter(Boolean);
  const from = process.env.SENDGRID_FROM;

  if (!toFirst || !from || !process.env.SENDGRID_API_KEY) {
    return json(res, 500, { code: 'server_error', message: 'Email not configured (TO/FROM/API)' });
  }

  const notificationBody = `
    <h1 style="color:#4B5320;font-size:22px;">Nouvelle demande de ${name}</h1>
    <p>Vous avez reçu une nouvelle demande de contact.</p>
    <div style="background-color:#F8F6F3;padding:15px;border-radius:8px;">
      <p><strong>Client :</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
      <p><strong>Téléphone :</strong> ${phone || 'Non fourni'}</p>
      <p><strong>Message :</strong><br>${String(message).replace(/\n/g, '<br>')}</p>
    </div>
    ${engagementSheetHtml}
  `;

  const notificationMsg = {
    to: toFirst,                               // visible
    bcc: bccList.length ? bccList : undefined, // cachés
    from,
    subject: `WizmanHeritage | Nouvelle demande de ${name} | Consentement inclus`,
    html: createStyledEmail({
      title: `Nouvelle demande de ${name}`,
      preheader: String(message).slice(0, 50),
      body_content: notificationBody,
      footer_text: 'Email envoyé depuis wizmanheritage.com'
    }),
    attachments: [...formattedClientFiles, ...(logoAttachment ? [logoAttachment] : [])]
  };

  // ---------- Auto-répondeur client ----------
  const clientContent = confirmationContent[lang] || confirmationContent.fr;
  const confirmationBody = `
    <h1 style="color:#4B5320;font-size:22px;">
      ${clientContent.greeting.replace('{name}', name)}
    </h1>
    <p style="font-size:16px;line-height:1.6;">${clientContent.main_text}</p>
    <br>
    <p style="font-size:16px;line-height:1.6;">
      ${clientContent.closing}<br><strong>${clientContent.team_name}</strong>
    </p>
  `;

  const autoresponderMsg = {
    to: email,
    from,
    subject: clientContent.title,
    html: createStyledEmail({
      title: clientContent.title,
      preheader: clientContent.preheader,
      body_content: confirmationBody,
      footer_text: clientContent.footer_text
    }),
    attachments: logoAttachment ? [logoAttachment] : undefined
  };

  try {
    await Promise.all([sgMail.send(notificationMsg), sgMail.send(autoresponderMsg)]);
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('SendGrid error:', error?.response?.body || error);
    return json(res, 502, { code: 'send_failed', message: 'Email send failed' });
  }
};
