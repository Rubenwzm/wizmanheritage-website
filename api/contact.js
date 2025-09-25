// api/contact.js — VERSION FINALE AVEC reCAPTCHA

import sgMail from '@sendgrid/mail';
import Busboy from 'busboy';
import fs from 'fs/promises';
import path from 'path';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Fonction de vérification reCAPTCHA
async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET_KEY) {
    console.error("La clé secrète reCAPTCHA n'est pas définie dans les variables d'environnement.");
    return false;
  }
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await response.json();
  // reCAPTCHA v3 renvoie un score. 0.5 est un seuil commun.
  return data.success && data.score >= 0.5;
}


// -----------------------------
// Email templating (CID inline)
// -----------------------------
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

// -----------------------------
// Contenu d’auto-réponse
// -----------------------------
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

// -----------------------------
// Handler Vercel
// -----------------------------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const rawBody = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    const parseMultipartForm = (headers, bodyBuffer) =>
      new Promise((resolve, reject) => {
        const fields = {};
        const files = [];
        const bb = Busboy({ headers });

        bb.on('file', (fieldname, file, info) => {
          const { filename, mimeType } = info || {};
          if (!filename) {
            file.resume();
            return;
          }
          const chunks = [];
          file.on('data', (chunk) => chunks.push(chunk));
          file.on('end', () => {
            files.push({
              content: Buffer.concat(chunks),
              filename,
              type: 'application/octet-stream',
              disposition: 'attachment',
              _originalMime: mimeType,
            });
          });
        });

        bb.on('field', (name, val) => {
          fields[name] = val;
        });

        bb.on('close', () => resolve({ fields, files }));
        bb.on('error', reject);
        bb.end(bodyBuffer);
      });

    const { fields, files: clientFiles } = await parseMultipartForm(
      req.headers,
      rawBody
    );
    
    // --- VÉRIFICATION reCAPTCHA ---
    const recaptchaToken = fields.recaptchaToken;
    if (!recaptchaToken) {
        return res.status(400).json({ message: 'reCAPTCHA token missing' });
    }
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
        return res.status(403).json({ message: 'reCAPTCHA verification failed' });
    }
    // --- FIN DE LA VÉRIFICATION ---

    const { name, email, phone, message, lang = 'fr' } = fields;

    // Validation basique
    if (!name || !email || !message || fields.consent !== 'on') {
      return res
        .status(400)
        .json({ message: 'Missing required fields or consent' });
    }
    if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/i.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Lecture du logo en local
    const logoPath = path.join(process.cwd(), 'Logo_WizmanHeritage.png');
    const logoBuffer = await fs.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoAttachment = {
      content: logoBase64,
      filename: 'Logo_WizmanHeritage.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'logo',
    };

    // Contexte de soumission
    const submissionDate = new Date().toLocaleString(
      lang === 'he' ? 'he-IL' : `${lang}-FR`,
      { timeZone: 'Europe/Paris' }
    );
    const xff = (req.headers['x-forwarded-for'] || '').toString();
    const ipAddress = xff.split(',')[0] || 'Non disponible';

    // Feuille d’engagement (HTML)
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
          ${clientFiles.length > 0 ? clientFiles.map((f) => f.filename).join(', ') : 'Aucun document partagé.'}
        </p>
      </div>
    `;

    // Formatage des pièces jointes client → SendGrid
    const formattedClientFiles = clientFiles.map((f) => ({
      content: f.content.toString('base64'),
      filename: f.filename,
      type: 'application/octet-stream',
      disposition: 'attachment',
    }));

    // Notification interne (multi-destinataires)
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
      to: ['contact@wizmanheritage.com', 'rubenwzm@gmail.com'],
      from: 'noreply@wizmanheritage.com',
      subject: `WizmanHeritage | Nouvelle demande de ${name} | Consentement inclus`,
      html: createStyledEmail({
        title: `Nouvelle demande de ${name}`,
        preheader: String(message).slice(0, 50),
        body_content: notificationBody,
        footer_text: 'Email envoyé depuis wizmanheritage.com',
      }),
      attachments: [...formattedClientFiles, logoAttachment],
    };

    // Auto-répondeur client
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
      from: 'contact@wizmanheritage.com',
      subject: clientContent.title,
      html: createStyledEmail({
        title: clientContent.title,
        preheader: clientContent.preheader,
        body_content: confirmationBody,
        footer_text: clientContent.footer_text,
      }),
      attachments: [logoAttachment],
    };

    // Envoi concurrent
    await Promise.all([sgMail.send(notificationMsg), sgMail.send(autoresponderMsg)]);

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    const details = error?.response?.body ?? error;
    console.error('Error in form handler:', details);
    return res.status(500).json({ message: 'Error processing your request' });
  }
}
