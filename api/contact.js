// api/contact.js (VERSION FINALE DÉFINITIVE AVEC LOGO INTÉGRÉ)

import sgMail from '@sendgrid/mail';
import busboy from 'busboy';
// =======================================================
// ON AJOUTE LES OUTILS POUR LIRE LE FICHIER DU LOGO
// =======================================================
import fs from 'fs/promises';
import path from 'path';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function createStyledEmail(content) {
    const { title, preheader, body_content, footer_text } = content;
    const sandBeige = '#F3F0E7';
    const textPrimary = '#2D2A25';
    const textSecondary = '#6B6358';
    return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><style>body { font-family: 'Inter', Arial, sans-serif; }</style></head><body style="margin: 0; padding: 0; background-color: ${sandBeige}; font-family: Inter, Arial, sans-serif;"><div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border: 1px solid #E6E2DB; border-radius: 16px; box-shadow: 0 8px 32px rgba(45, 42, 37, 0.06);"><tr><td align="center" style="padding: 20px 0;">
    
    <!-- =================================================================== -->
    <!-- CORRECTION DU LOGO : On utilise un ID "cid:logo" au lieu d'une URL -->
    <!-- =================================================================== -->
    <img src="cid:logo" alt="WizmanHeritage Logo" width="180" style="display: block;">
    
    </td></tr><tr><td style="padding: 30px; color: ${textPrimary};">${body_content}</td></tr><tr><td align="center" style="padding: 20px 30px; background-color: #FEFCF8; border-top: 1px solid #E6E2DB; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;"><p style="margin: 0; color: ${textSecondary}; font-size: 12px;">${footer_text}</p></td></tr></table></body></html>`;
}

const confirmationContent = { /* ... (Vos traductions ici, pas de changement) ... */ };

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
    try {
        // --- Lecture du logo ---
        // On cherche le fichier Logo_WizmanHeritage.png qui est à la racine de votre projet
        const logoPath = path.join(process.cwd(), 'Logo_WizmanHeritage.png');
        const logoBuffer = await fs.readFile(logoPath);
        const logoBase64 = logoBuffer.toString('base64');

        // On prépare le logo comme une pièce jointe spéciale "inline"
        const logoAttachment = {
            content: logoBase64,
            filename: 'Logo_WizmanHeritage.png',
            type: 'image/png',
            disposition: 'inline',
            contentId: 'logo', // Cet ID doit correspondre au "cid:logo" dans l'image HTML
        };

        // --- Le reste du code ne change pas ---
        const requestBodyBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', (err) => reject(err));
        });
        const parseMultipartForm = (headers, bodyBuffer) => {
            return new Promise((resolve, reject) => {
                const fields = {}, files = [];
                const bb = busboy({ headers });
                bb.on('file', (name, file, info) => {
                    const { filename, mimeType } = info;
                    if (!filename) { file.resume(); return; }
                    const chunks = [];
                    file.on('data', (chunk) => chunks.push(chunk));
                    file.on('end', () => files.push({ content: Buffer.concat(chunks), filename, type: mimeType, disposition: 'attachment' }));
                });
                bb.on('field', (name, val) => { fields[name] = val; });
                bb.on('close', () => resolve({ fields, files }));
                bb.on('error', (err) => reject(err));
                bb.end(bodyBuffer);
            });
        };
        const { fields, files: clientFiles } = await parseMultipartForm(req.headers, requestBodyBuffer);
        const { name, email, phone, message, lang = 'fr' } = fields;
        if (!name || !email || !message || fields.consent !== 'on') {
            return res.status(400).json({ message: 'Missing required fields or consent' });
        }
        if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const submissionDate = new Date().toLocaleString(lang === 'he' ? 'he-IL' : `${lang}-FR`, { timeZone: 'Europe/Paris' });
        const ipAddress = req.headers['x-forwarded-for'] || 'Non disponible';
        const engagementSheetHtml = `<hr style="border: none; border-top: 1px solid #E6E2DB; margin: 30px 0;"><div style="padding: 20px; border: 1px solid #4B5320; border-radius: 8px; background-color: #FAFAF8;"><h2 style="margin-top: 0; color: #4B5320; font-size: 18px; text-align: center;">Fiche d'Engagement & de Consentement</h2><p style="font-size: 12px; text-align: center; margin-bottom: 20px;">Générée le : ${submissionDate}</p><p><strong>Client :</strong> ${name}</p><p><strong>Email :</strong> ${email}</p><p><strong>Adresse IP de Soumission :</strong> ${ipAddress}</p><p><strong>Statut du Consentement :</strong> <span style="color: green; font-weight: bold;">✔ ACCEPTÉ</span></p><p style="font-size: 12px;">Le client a coché la case de consentement, acceptant ainsi le traitement de ses données personnelles et des fichiers joints, conformément à la politique de confidentialité.</p><p><strong>Documents Partagés :</strong></p><p style="font-weight: bold;">${clientFiles.length > 0 ? clientFiles.map(f => f.filename).join(', ') : 'Aucun document partagé.'}</p></div>`;
        
        const formattedClientFiles = clientFiles.map(f => ({
            content: f.content.toString('base64'),
            filename: f.filename,
            type: 'application/octet-stream',
            disposition: 'attachment'
        }));

        const notificationBody = `<h1 style="color: #4B5320; font-size: 22px;">Nouvelle demande de ${name}</h1><p>Vous avez reçu une nouvelle demande de contact.</p><div style="background-color: #F8F6F3; padding: 15px; border-radius: 8px;"><p><strong>Client :</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p><p><strong>Téléphone :</strong> ${phone || 'Non fourni'}</p><p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p></div>${engagementSheetHtml}`;
        const notificationMsg = {
            to: ['contact@wizmanheritage.com', 'rubenwzm@gmail.com'],
            from: 'noreply@wizmanheritage.com',
            subject: `WizmanHeritage | Nouvelle demande de ${name} | Consentement inclus`,
            html: createStyledEmail({ title: `Nouvelle demande de ${name}`, preheader: message.substring(0, 50), body_content: notificationBody, footer_text: "Email envoyé depuis wizmanheritage.com" }),
            // On ajoute les fichiers du client ET le logo
            attachments: [...formattedClientFiles, logoAttachment]
        };
        const clientContent = confirmationContent[lang] || confirmationContent.fr;
        const confirmationBody = `<h1 style="color: #4B5320; font-size: 22px;">${clientContent.greeting.replace('{name}', name)}</h1><p style="font-size: 16px; line-height: 1.6;">${clientContent.main_text}</p><br><p style="font-size: 16px; line-height: 1.6;">${clientContent.closing}<br><strong>${clientContent.team_name}</strong></p>`;
        const autoresponderMsg = {
            to: email,
            from: 'contact@wizmanheritage.com',
            subject: clientContent.title,
            html: createStyledEmail({ title: clientContent.title, preheader: clientContent.preheader, body_content: confirmationBody, footer_text: clientContent.footer_text }),
            // On ajoute le logo ici aussi pour l'e-mail du client
            attachments: [logoAttachment]
        };
        await Promise.all([ sgMail.send(notificationMsg), sgMail.send(autoresponderMsg) ]);
        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error in form handler:', error.response?.body || error);
        return res.status(500).json({ message: 'Error processing your request' });
    }
};
