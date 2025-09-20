// api/contact.js

// Importations des librairies nécessaires.
// Vercel gère ces importations via le 'package.json'.
import sgMail from '@sendgrid/mail';
import busboy from 'busboy';
import html_to_pdf from 'html-pdf-node';

// Configuration de SendGrid avec la clé API stockée dans les variables d'environnement de Vercel.
// La clé doit commencer par "SG.".
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ==================================================================
// FONCTION UTILITAIRE POUR CRÉER LE TEMPLATE D'EMAIL STYLISÉ
// Ceci encapsule le contenu spécifique (titre, corps) dans un design cohérent.
// ==================================================================
function createStyledEmail(content) {
    const { title, preheader, body_content, footer_text } = content;

    // Réutilisation des couleurs de votre CSS pour la cohérence visuelle.
    const primarySage = '#4B5320';
    const sandBeige = '#F3F0E7';
    const textPrimary = '#2D2A25';
    const textSecondary = '#6B6358';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            /* Utilisation d'une police web pour la cohérence avec le site */
            body { font-family: 'Inter', Arial, sans-serif; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${sandBeige}; font-family: Inter, Arial, sans-serif;">
        <!-- Le preheader est un court aperçu du message dans la boîte de réception -->
        <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border: 1px solid #E6E2DB; border-radius: 16px; box-shadow: 0 8px 32px rgba(45, 42, 37, 0.06);">
            <!-- En-tête avec le logo du site -->
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <!-- Assurez-vous que cette URL est l'URL finale de votre logo sur votre site -->
                    <img src="https://www.wizmanheritage.com/Logo_WizmanHeritage.svg" alt="WizmanHeritage Logo" width="180" style="display: block;">
                </td>
            </tr>
            <!-- Corps principal de l'email -->
            <tr>
                <td style="padding: 30px; color: ${textPrimary};">
                    ${body_content}
                </td>
            </tr>
            <!-- Pied de page de l'email -->
            <tr>
                <td align="center" style="padding: 20px 30px; background-color: #FEFCF8; border-top: 1px solid #E6E2DB; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
                    <p style="margin: 0; color: ${textSecondary}; font-size: 12px;">
                        ${footer_text}
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

// ==================================================================
// TEMPLATES MULTILINGUES POUR L'EMAIL DE CONFIRMATION CLIENT
// ==================================================================
const confirmationContent = {
    fr: {
        title: "Confirmation de votre demande | WizmanHeritage",
        preheader: "Nous avons bien reçu votre demande et revenons vers vous rapidement.",
        greeting: "Bonjour {name},",
        main_text: "Nous avons bien reçu votre demande et nous vous remercions de votre confiance.<br><br>Un membre de notre cabinet l'examinera avec la plus grande attention. <strong>WizmanHeritage s'engage à vous répondre dans un délai de 48 heures ouvrées.</strong><br><br>Votre demande est traitée avec la plus stricte confidentialité.",
        closing: "Cordialement,",
        team_name: "L'équipe WizmanHeritage",
        footer_text: "&copy; 2024 WizmanHeritage. Tous droits réservés. Cet email est une confirmation de réception."
    },
    en: {
        title: "Request Confirmation | WizmanHeritage",
        preheader: "We have received your request and will get back to you shortly.",
        greeting: "Dear {name},",
        main_text: "We have successfully received your request and thank you for your trust.<br><br>A member of our firm will review it with the utmost care. <strong>WizmanHeritage commits to responding within 48 business hours.</strong><br><br>Your request is being handled with the strictest confidentiality.",
        closing: "Sincerely,",
        team_name: "The WizmanHeritage Team",
        footer_text: "&copy; 2024 WizmanHeritage. All rights reserved. This email is a receipt confirmation."
    },
    he: {
        title: "אישור קבלת פנייתך | WizmanHeritage",
        preheader: "קיבלנו את פנייתך ונחזור אליך בהקדם.",
        greeting: "שלום {name},",
        main_text: "פנייתך התקבלה בהצלחה, ואנו מודים לך על אמונך.<br><br>נציג ממשרדנו יבחן את פנייתך בקפידה. <strong>WizmanHeritage מתחייבת להשיב לפנייתך תוך 48 שעות עסקים.</strong><br><br>פנייתך מטופלת בסודיות מוחלטת.",
        closing: "בכבוד רב,",
        team_name: "צוות WizmanHeritage",
        footer_text: "&copy; 2024 WizmanHeritage. כל הזכויות שמורות. אימייל זה מהווה אישור קבלה."
    }
};

// ==================================================================
// FONCTION DE GÉNÉRATION DU PDF DE CONSENTEMENT STYLISÉ
// Ce PDF est attaché à l'email de notification que vous recevez.
// ==================================================================
async function generateConsentPdf(data) {
    const { name, email, submissionDate, ipAddress, files } = data;
    const htmlContent = `
    <!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"><style>body{font-family:'Inter',Arial,sans-serif;color:#2D2A25;font-size:11pt}.container{width:90%;margin:auto}.logo{width:220px;margin-bottom:40px;display:block}h1{color:#4B5320;font-size:24pt;font-weight:700;border-bottom:2px solid #E6E2DB;padding-bottom:15px;margin-bottom:20px}h2{color:#4B5320;font-size:16pt;margin-top:30px;margin-bottom:10px}p{line-height:1.7;margin:0 0 10px 0}.info-box{background-color:#F8F6F3;border:1px solid #E6E2DB;padding:20px;border-radius:12px;margin-top:20px}.info-box p{margin-bottom:8px}strong{font-weight:700}.consent-status{color:#4B5320;font-weight:bold}.file-list{font-style:italic;color:#5D574F}.footer{margin-top:50px;font-size:9pt;color:#8B857C;text-align:center}</style></head><body><div class="container"><img src="https://www.wizmanheritage.com/Logo_WizmanHeritage.svg" alt="Logo WizmanHeritage" class="logo"><h1>Fiche de Consentement</h1><p>Ce document atteste du consentement libre et éclairé donné par l'utilisateur pour le traitement de ses données personnelles et des documents fournis, conformément à la politique de confidentialité.</p><div class="info-box"><p><strong>Date et Heure :</strong> ${submissionDate}</p><p><strong>Nom du Client :</strong> ${name}</p><p><strong>Adresse Email :</strong> ${email}</p><p><strong>Adresse IP de Soumission :</strong> ${ipAddress}</p></div><h2>Consentement & Documents</h2><p><span class="consent-status">✔ CONSENTEMENT EXPLICITE DONNÉ</span></p><p>L'utilisateur a coché la case de consentement, acceptant la politique de confidentialité du site wizmanheritage.com.</p><h2>Documents Partagés</h2><p class="file-list">${files.length > 0 ? files.map(f => f.filename).join('<br>') : 'Aucun document partagé.'}</p><div class="footer">WizmanHeritage | Preuve de consentement générée automatiquement</div></div></body></html>`;
    const options = { format: 'A4' };
    const file = { content: htmlContent };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    return pdfBuffer;
}

// ==================================================================
// GESTIONNAIRE PRINCIPAL DE LA REQUÊTE VERCEL (Exportation par défaut)
// ==================================================================
export default async (req, res) => {
    // S'assurer que la méthode HTTP est bien POST.
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        // Fonction pour "parser" les données du formulaire, incluant les fichiers.
        // Cette fonction est interne au gestionnaire car elle utilise 'req' de Vercel.
        const parseMultipartForm = (request) => {
            return new Promise((resolve, reject) => {
                const fields = {};
                const files = [];
                const bb = busboy({ headers: request.headers });

                bb.on('file', (name, file, info) => {
                    const { filename, mimeType } = info;
                    const chunks = [];
                    file.on('data', (chunk) => chunks.push(chunk));
                    file.on('end', () => {
                        files.push({ content: Buffer.concat(chunks), filename, type: mimeType, disposition: 'attachment' });
                    });
                });

                bb.on('field', (name, val) => {
                    fields[name] = val;
                });

                bb.on('close', () => {
                    resolve({ fields, files });
                });

                bb.on('error', (err) => {
                    reject(err);
                });

                // Le corps de la requête est en base64 sur Vercel, il faut le décoder.
                bb.end(Buffer.from(request.body, 'base64'));
            });
        };

        const { fields, files: clientFiles } = await parseMultipartForm(req);
        const { name, email, phone, message, lang = 'fr' } = fields; // 'lang' par défaut à 'fr'

        // Validation des champs côté serveur pour une sécurité accrue.
        if (!name || !email || !message || fields.consent !== 'on') {
            return res.status(400).json({ message: 'Missing required fields or consent' });
        }
        // Vérification du format de l'email avec une regex simple.
        if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const submissionDate = new Date().toLocaleString(lang === 'he' ? 'he-IL' : `${lang}-FR`, { timeZone: 'Europe/Paris' });
        const ipAddress = req.headers['x-forwarded-for'] || 'Non disponible'; // Récupère l'adresse IP du client.

        // Génération du PDF de consentement.
        const consentPdfBuffer = await generateConsentPdf({ name, email, submissionDate, ipAddress, files: clientFiles });
        const consentAttachment = {
            content: consentPdfBuffer.toString('base64'), // Le contenu du PDF doit être en base64 pour SendGrid.
            filename: `Consentement_${name.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
        };

        // Préparation des pièces jointes du client pour SendGrid (doivent être en base64).
        const formattedClientFiles = clientFiles.map(f => ({
            ...f,
            content: f.content.toString('base64') // Convertit le Buffer binaire en string Base64.
        }));

        // Compilation de toutes les pièces jointes (celles du client et le PDF de consentement).
        const allAttachments = [...formattedClientFiles, consentAttachment];

        // --- Configuration de l'EMAIL DE NOTIFICATION (POUR VOUS : contact@wizmanheritage.com) ---
        const notificationBody = `
            <h1 style="color: #4B5320; font-size: 22px;">Nouvelle demande de ${name}</h1>
            <p>Vous avez reçu une nouvelle demande de contact. La fiche de consentement signée est jointe à cet email en format PDF.</p>
            <div style="background-color: #F8F6F3; padding: 15px; border-radius: 8px;">
                <p><strong>Client :</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                <p><strong>Téléphone :</strong> ${phone || 'Non fourni'}</p>
                <p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        const notificationMsg = {
            to: 'contact@wizmanheritage.com', // <<<<< VOTRE ADRESSE EMAIL DE DESTINATION (Où vous recevez les notifications)
            from: 'noreply@wizmanheritage.com', // <<<<< VOTRE ADRESSE EMAIL VÉRIFIÉE PAR SENDGRID (Peut être contact@wizmanheritage.com aussi si vous la vérifiez)
            subject: `WizmanHeritage | Demande de ${name} | Consentement joint`,
            html: createStyledEmail({
                title: `Nouvelle demande de ${name}`,
                preheader: message.substring(0, 50),
                body_content: notificationBody,
                footer_text: "Email envoyé depuis wizmanheritage.com"
            }),
            attachments: allAttachments
        };

        // --- Configuration de l'EMAIL DE CONFIRMATION (POUR LE CLIENT) ---
        const clientContent = confirmationContent[lang] || confirmationContent.fr; // Choisit le template en fonction de la langue.
        const confirmationBody = `
            <h1 style="color: #4B5320; font-size: 22px;">${clientContent.greeting.replace('{name}', name)}</h1>
            <p style="font-size: 16px; line-height: 1.6;">${clientContent.main_text}</p>
            <br>
            <p style="font-size: 16px; line-height: 1.6;">
                ${clientContent.closing}<br>
                <strong>${clientContent.team_name}</strong>
            </p>
        `;
        const autoresponderMsg = {
            to: email, // L'email du client (celui qu'il a renseigné dans le formulaire).
            from: 'contact@wizmanheritage.com', // <<<<< UNE ADRESSE EMAIL VÉRIFIÉE ET PROFESSIONNELLE (Ex: votre contact@wizmanheritage.com)
            subject: clientContent.title,
            html: createStyledEmail({
                title: clientContent.title,
                preheader: clientContent.preheader,
                body_content: confirmationBody,
                footer_text: clientContent.footer_text
            })
        };

        // Envoi simultané des deux emails.
        await Promise.all([
            sgMail.send(notificationMsg),
            sgMail.send(autoresponderMsg)
        ]);

        // Réponse au frontend que tout s'est bien passé.
        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error('Error in form handler:', error.response?.body || error);
        // Retourner une erreur générique au frontend si quelque chose se passe mal.
        return res.status(500).json({ message: 'Error processing your request' });
    }
};
