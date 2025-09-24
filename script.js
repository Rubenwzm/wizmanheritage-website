class WizmanHeritage {
  constructor() {
    this.currentLanguage = 'fr';
    this.isMenuOpen = false;
    this.selectedFiles = [];
    this.toastCounter = 0;
    this.cookieConsent = null;

    this.notificationMessages = {
      fr: { 'form-success': 'Votre demande a été transmise avec succès', 'form-error': 'Erreur lors de l’envoi de votre demande', 'form-sending': 'Transmission en cours...', 'language-changed': 'Français', 'email-missing': 'Veuillez saisir votre adresse email', 'name-missing': 'Veuillez indiquer votre nom complet', 'message-missing': 'Veuillez préciser votre demande', 'consent-missing': 'Veuillez accepter les conditions de confidentialité', 'file-selected': 'Document(s) sélectionné(s)', 'file-removed': 'Document supprimé', 'file-limit': 'Maximum 5 documents autorisés', 'file-size': 'Fichier trop volumineux (max 10MB)', 'file-type': 'Type de fichier non autorisé', 'cookies-accepted': 'Cookies acceptés', 'cookies-declined': 'Cookies refusés' },
      en: { 'form-success': 'Your request has been submitted successfully', 'form-error': 'Error sending your request', 'form-sending': 'Submitting...', 'language-changed': 'English', 'email-missing': 'Please enter your email address', 'name-missing': 'Please enter your full name', 'message-missing': 'Please specify your request', 'consent-missing': 'Please accept the privacy policy', 'file-selected': 'Document(s) selected', 'file-removed': 'Document removed', 'file-limit': 'Maximum 5 documents allowed', 'file-size': 'File too large (max 10MB)', 'file-type': 'File type not allowed', 'cookies-accepted': 'Cookies accepted', 'cookies-declined': 'Cookies declined' },
      he: { 'form-success': 'הבקשה שלך נשלחה בהצלחה', 'form-error': 'שגיאה בשליחת הבקשה', 'form-sending': 'שולח...', 'language-changed': 'עברית', 'email-missing': 'אנא הזן את כתובת האימייל שלך', 'name-missing': 'אנא הזן את שמך המלא', 'message-missing': 'אנא פרט את בקשתך', 'consent-missing': 'אנא אשר את מדיניות הפרטיות', 'file-selected': 'מסמך/ים נבחר/ו', 'file-removed': 'מסמך הוסר', 'file-limit': 'מקסימום 5 מסמכים מותרים', 'file-size': 'קובץ גדול מדי (מקס 10MB)', 'file-type': 'סוג קובץ לא מורשה', 'cookies-accepted': 'עוגיות התקבלו', 'cookies-declined': 'עוגיות נדחו' }
    };

    // === TES TRADUCTIONS (collées depuis ton message) ===
    this.translations = {
      fr: { /* --- FR --- */ 
        home: 'Accueil', services: 'Services', international: 'International', faq: 'FAQ', about: 'À propos', contact: 'Contact',
        'hero-badge': 'Cabinet International • Service Confidentiel',
        'hero-title': 'Expertise en Généalogie Successorale',
        'hero-description': 'Nous accompagnons avec discrétion les successions internationales complexes, identifiant les héritiers légitimes et sécurisant leurs droits avec rigueur et confidentialité.',
        'cta-button': 'Consultation confidentielle',
        'services-title': 'Services Spécialisés',
        'service1-title': 'Recherche Successorale',
        'service1-desc': 'Identification discrète et complète des héritiers et ayants droit à travers le monde avec méthodes d’investigation avancées.',
        'service2-title': 'Documentation Généalogique',
        'service2-desc': 'Constitution de dossiers juridiques complets avec preuves documentaires authentifiées et certifiées.',
        'service3-title': 'Conseil Juridique Spécialisé',
        'service3-desc': 'Accompagnement par des experts en droit successoral international et collaboration avec notaires partenaires.',
        'stat1-label': 'Années d’expérience',
        'stat2-label': 'Dossiers traités',
        'stat3-label': 'Disponible 24/7',
        'international-title': 'Présence Internationale',
        'france-title': 'France',
        'israel-title': 'Israël',
        'usa-title': 'États-Unis',
        'faq-title': 'Questions Fréquentes',
        'faq1-question': 'Comment identifiez-vous les héritiers à l’étranger ?',
        'faq1-answer': 'Nous utilisons des méthodes d’investigation documentées avec nos correspondants locaux.',
        'faq2-question': 'Mes données sont-elles confidentielles ?',
        'faq2-answer': 'Toutes les informations sont traitées selon le RGPD et ne sont jamais partagées sans consentement.',
        'faq3-question': 'Puis-je envoyer des documents en toute sécurité ?',
        'faq3-answer': 'Oui, les fichiers sont sécurisés et limités à 10MB chacun, conformément à notre politique de confidentialité.',
        'about-title': 'Excellence & Discrétion',
        'about-desc': 'WizmanHeritage est un cabinet international reconnu pour son expertise en recherche successorale. Nous servons une clientèle internationale avec la plus haute confidentialité, utilisant des méthodes d’investigation rigoureuses et respectant les législations de chaque pays d’intervention.',
        'feature1': 'Confidentialité absolue',
        'feature2': 'Expertise internationale',
        'feature3': 'Résultats garantis',
        'contact-title': 'Contact Confidentiel',
        'form-name': 'Nom complet',
        'form-email': 'Email',
        'form-phone': 'Téléphone (optionnel)',
        'form-message': 'Votre demande',
        'message-placeholder': 'Décrivez votre situation en quelques mots. Toutes les informations resteront strictement confidentielles.',
        'form-document': 'Documents (optionnel)',
        'file-upload-text': 'Cliquer ou déposer vos documents ici',
        'file-upload-hint': 'PDF, Word, Images acceptés (max 10MB chacun)',
        'consent-text': 'J’accepte que mes données soient traitées conformément à la politique de confidentialité.',
        'privacy-text': 'Vos informations sont traitées avec la plus stricte confidentialité et ne sont jamais partagées avec des tiers.',
        'form-submit': 'Envoyer ma demande',
        'footer-desc': 'Cabinet spécialisé en généalogie successorale internationale',
        'footer-certified': 'Certifié • Confidentiel • International',
        'footer-contact-title': 'Contact Professionnel',
        'footer-availability': 'Disponible 24/7 pour urgences',
        'footer-legal-title': 'Mentions Légales',
        'footer-design': 'Conçu par Ruben Wizman',
        'footer-compliance': 'Conforme RGPD • Données protégées',
        'footer-rights': 'Tous droits réservés.',
        'privacy-policy': 'Politique de confidentialité',
        'cookie-text': 'Nous utilisons des cookies nécessaires au fonctionnement du site.',
        'cookie-accept': 'Accepter',
        'cookie-decline': 'Refuser',
        'privacy-page-title': 'Politique de Confidentialité - WizmanHeritage',
        'privacy-description': 'Politique de confidentialité de WizmanHeritage. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.',
        'privacy-main-header': 'Politique de Confidentialité',
        'privacy-last-updated-label': 'Dernière mise à jour :',
        'privacy-date': '18 septembre 2025',
        'privacy-intro': 'WizmanHeritage s’engage à protéger vos données personnelles. Cette Politique de Confidentialité décrit comment nous collectons, utilisons, et protégeons les informations que vous nous fournissez via notre site web, conformément au Règlement Général sur la Protection des Données (RGPD).',
        'privacy-h2-collection': '1. Collecte des Données Personnelles',
        'privacy-p-collection-1': 'Nous collectons des informations lorsque vous utilisez notre formulaire de contact ou interagissez avec notre site. Les données collectées peuvent inclure :',
        'privacy-li-collection-name': 'Nom complet : Pour vous identifier.',
        'privacy-li-collection-email': 'Adresse email : Pour communiquer avec vous.',
        'privacy-li-collection-phone': 'Numéro de téléphone (optionnel) : Pour un contact direct si nécessaire.',
        'privacy-li-collection-message': 'Message : Toute information que vous fournissez concernant votre demande.',
        'privacy-li-collection-docs': 'Documents : Fichiers que vous téléchargez volontairement pour appuyer votre demande.',
        'privacy-li-collection-nav': 'Données de navigation : Telles que les cookies nécessaires au bon fonctionnement du site.',
        'privacy-h2-usage': '2. Utilisation de Vos Données',
        'privacy-p-usage-1': 'Vos données sont utilisées exclusivement pour :',
        'privacy-li-usage-reply': 'Répondre à vos demandes de consultation et fournir nos services de généalogie successorale.',
        'privacy-li-usage-manage': 'Gérer et sécuriser notre site web.',
        'privacy-li-usage-legal': 'Respecter nos obligations légales et réglementaires.',
        'privacy-p-usage-2': 'Nous ne partageons jamais vos données avec des tiers à des fins marketing. Vos informations ne sont transmises qu’avec votre consentement explicite ou si la loi l’exige.',
        'privacy-h2-security': '3. Sécurité des Données',
        'privacy-p-security-1': 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès, modification, divulgation ou destruction non autorisés. Les transferts de fichiers sont sécurisés et l’accès à vos informations est strictement limité.',
        'privacy-h2-retention': '4. Conservation des Données',
        'privacy-p-retention-1': 'Nous conservons vos données personnelles uniquement le temps nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, ou pour nous conformer à nos obligations légales.',
        'privacy-h2-rights': '5. Vos Droits',
        'privacy-p-rights-1': 'Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :',
        'privacy-li-rights-access': 'Droit d’accès : Vous pouvez demander une copie des données que nous détenons sur vous.',
        'privacy-li-rights-rectify': 'Droit de rectification : Vous pouvez demander la correction de données inexactes.',
        'privacy-li-rights-erase': 'Droit à l’effacement : Vous pouvez demander la suppression de vos données.',
        'privacy-li-rights-limit': 'Droit à la limitation du traitement : Vous pouvez demander à ce que nous limitions l’utilisation de vos données.',
        'privacy-p-rights-2': 'Pour exercer ces droits, veuillez nous contacter en utilisant le formulaire de contact de notre site.',
        'privacy-h2-cookies': '6. Cookies',
        'privacy-p-cookies-1': 'Notre site utilise des cookies essentiels à son fonctionnement. Un bandeau de consentement vous permet d’accepter ou de refuser leur utilisation lors de votre première visite.',
        'privacy-h2-contact': '7. Contact',
        'privacy-p-contact-1': 'Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter via le formulaire de contact sur notre site principal.',
        'privacy-back-to-home': 'Retour à l’accueil'
      },
      en: { /* --- EN --- */
        home: 'Home', services: 'Services', international: 'International', faq: 'FAQ', about: 'About', contact: 'Contact',
        'hero-badge': 'International Firm • Confidential Service',
        'hero-title': 'Heir Tracing & Probate Genealogy',
        'hero-description': 'We discreetly handle complex cross-border estates, identifying rightful heirs and securing their rights with rigor and confidentiality.',
        'cta-button': 'Confidential consultation',
        'services-title': 'Specialized Services',
        'service1-title': 'Heir Research',
        'service1-desc': 'Discrete and comprehensive identification of heirs and beneficiaries worldwide using advanced investigation methods.',
        'service2-title': 'Genealogical Documentation',
        'service2-desc': 'Compilation of complete legal files with authenticated and certified documentary evidence.',
        'service3-title': 'Specialized Legal Counsel',
        'service3-desc': 'Support by experts in international inheritance law and collaboration with partner notaries.',
        'stat1-label': 'Years of experience',
        'stat2-label': 'Cases handled',
        'stat3-label': 'Available 24/7',
        'international-title': 'International Presence',
        'france-title': 'France',
        'israel-title': 'Israel',
        'usa-title': 'United States',
        'faq-title': 'Frequently Asked Questions',
        'faq1-question': 'How do you identify heirs abroad?',
        'faq1-answer': 'We use documented investigation methods with local correspondents.',
        'faq2-question': 'Are my data confidential?',
        'faq2-answer': 'All information is processed under GDPR and never shared without consent.',
        'faq3-question': 'Can I upload files securely?',
        'faq3-answer': 'Yes, files are secured and limited to 10MB each, according to our privacy policy.',
        'about-title': 'Excellence & Discretion',
        'about-desc': 'WizmanHeritage is an international firm renowned for heir research. We serve an international clientele with the utmost confidentiality, using rigorous methods and complying with the laws of each country of operation.',
        'feature1': 'Absolute confidentiality',
        'feature2': 'International expertise',
        'feature3': 'Guaranteed results',
        'contact-title': 'Confidential Contact',
        'form-name': 'Full name',
        'form-email': 'Email',
        'form-phone': 'Phone (optional)',
        'form-message': 'Your request',
        'message-placeholder': 'Describe your situation in a few words. All information will remain strictly confidential.',
        'form-document': 'Documents (optional)',
        'file-upload-text': 'Click or drop your documents here',
        'file-upload-hint': 'PDF, Word, Images accepted (max 10MB each)',
        'consent-text': 'I consent to my data being processed according to the privacy policy.',
        'privacy-text': 'Your information is handled with strict confidentiality and never shared with third parties.',
        'form-submit': 'Send my request',
        'footer-desc': 'Firm specialized in international probate genealogy',
        'footer-certified': 'Certified • Confidential • International',
        'footer-contact-title': 'Professional Contact',
        'footer-availability': 'Available 24/7 for emergencies',
        'footer-legal-title': 'Legal Notice',
        'footer-design': 'Designed by Ruben Wizman',
        'footer-compliance': 'GDPR compliant • Protected data',
        'footer-rights': 'All rights reserved.',
        'privacy-policy': 'Privacy policy',
        'cookie-text': 'We use cookies necessary for the website to function.',
        'cookie-accept': 'Accept',
        'cookie-decline': 'Decline',
        'privacy-page-title': 'Privacy Policy - WizmanHeritage',
        'privacy-description': 'WizmanHeritage privacy policy. Learn how we collect, use, and protect your personal data.',
        'privacy-main-header': 'Privacy Policy',
        'privacy-last-updated-label': 'Last updated:',
        'privacy-date': 'September 18, 2025',
        'privacy-intro': 'WizmanHeritage is committed to protecting your personal data. This Privacy Policy describes how we collect, use, and protect the information you provide via our website, in accordance with the General Data Protection Regulation (GDPR).',
        'privacy-h2-collection': '1. Personal Data Collection',
        'privacy-p-collection-1': 'We collect information when you use our contact form or interact with our site. The data collected may include:',
        'privacy-li-collection-name': 'Full name: To identify you.',
        'privacy-li-collection-email': 'Email address: To communicate with you.',
        'privacy-li-collection-phone': 'Phone number (optional): For direct contact if necessary.',
        'privacy-li-collection-message': 'Message: Any information you provide regarding your request.',
        'privacy-li-collection-docs': 'Documents: Files you voluntarily upload to support your request.',
        'privacy-li-collection-nav': 'Browsing data: Such as cookies necessary for the site to function properly.',
        'privacy-h2-usage': '2. Use of Your Data',
        'privacy-p-usage-1': 'Your data is used exclusively to:',
        'privacy-li-usage-reply': 'Respond to your consultation requests and provide our probate genealogy services.',
        'privacy-li-usage-manage': 'Manage and secure our website.',
        'privacy-li-usage-legal': 'Comply with our legal and regulatory obligations.',
        'privacy-p-usage-2': 'We never share your data with third parties for marketing purposes. Your information is only shared with your explicit consent or if required by law.',
        'privacy-h2-security': '3. Data Security',
        'privacy-p-security-1': 'We implement technical and organizational security measures to protect your data from unauthorized access, modification, disclosure, or destruction. File transfers are secured, and access to your information is strictly limited.',
        'privacy-h2-retention': '4. Data Retention',
        'privacy-p-retention-1': 'We retain your personal data only for the time necessary to fulfill the purposes for which it was collected, or to comply with our legal obligations.',
        'privacy-h2-rights': '5. Your Rights',
        'privacy-p-rights-1': 'In accordance with the GDPR, you have the following rights regarding your personal data:',
        'privacy-li-rights-access': 'Right of access: You can request a copy of the data we hold about you.',
        'privacy-li-rights-rectify': 'Right to rectification: You can request the correction of inaccurate data.',
        'privacy-li-rights-erase': 'Right to erasure: You can request the deletion of your data.',
        'privacy-li-rights-limit': 'Right to restriction of processing: You can ask us to limit the use of your data.',
        'privacy-p-rights-2': 'To exercise these rights, please contact us using our website\'s contact form.',
        'privacy-h2-cookies': '6. Cookies',
        'privacy-p-cookies-1': 'Our site uses cookies that are essential for its operation. A consent banner allows you to accept or decline their use during your first visit.',
        'privacy-h2-contact': '7. Contact',
        'privacy-p-contact-1': 'If you have any questions about this privacy policy, please contact us via the contact form on our main site.',
        'privacy-back-to-home': 'Back to Home'
      },
      he: { /* --- HE --- */
        home: 'דף הבית', services: 'שירותים', international: 'בינלאומי', faq: 'שאלות נפוצות', about: 'אודות', contact: 'יצירת קשר',
        'hero-badge': 'משרד בינלאומי • שירות חסוי',
        'hero-title': 'מומחיות בגנאלוגיה ירושות',
        'hero-description': 'אנו מטפלים בדיסקרטיות בירושות בינלאומיות מורכבות, מזהים יורשים חוקיים ומבטיחים את זכויותיהם בקפדנות ובסודיות.',
        'cta-button': 'התייעצות חסויה',
        'services-title': 'שירותים מתמחים',
        'service1-title': 'חקירת יורשים',
        'service1-desc': 'זיהוי דיסקרטי ומקיף של יורשים ומוטבים ברחבי העולם בשיטות חקירה מתקדמות.',
        'service2-title': 'תיעוד גנאלוגי',
        'service2-desc': 'הכנת תיקי מסמכים משפטיים מלאים עם ראיות מאומתות ומאושרות.',
        'service3-title': 'ייעוץ משפטי מומחה',
        'service3-desc': 'ליווי ע״י מומחים בדיני ירושה בינלאומיים ושיתוף פעולה עם נוטריונים.',
        'stat1-label': 'שנות ניסיון',
        'stat2-label': 'תיקים טופלו',
        'stat3-label': 'זמינות 24/7',
        'international-title': 'נוכחות בינלאומית',
        'france-title': 'צרפת',
        'israel-title': 'ישראל',
        'usa-title': 'ארצות הברית',
        'faq-title': 'שאלות נפוצות',
        'faq1-question': 'כיצד אתם מזהים יורשים בחו״ל?',
        'faq1-answer': 'אנו משתמשים בשיטות חקירה מתועדות בשיתוף פעולה עם נציגים מקומיים.',
        'faq2-question': 'האם הנתונים שלי חסויים?',
        'faq2-answer': 'כל המידע מטופל בהתאם ל-GDPR ואינו משותף ללא הסכמה.',
        'faq3-question': 'האם ניתן לשלוח קבצים בצורה מאובטחת?',
        'faq3-answer': 'כן, הקבצים מאובטחים ומוגבלים ל-10MB כל אחד בהתאם למדיניות הפרטיות שלנו.',
        'about-title': 'מצוינות ודיסקרטיות',
        'about-desc': 'WizmanHeritage הוא משרד בינלאומי בעל מומחיות בחקר יורשים. אנו משרתים לקוחות בכל העולם בסודיות מלאה, בשיטות מחקר קפדניות ובהתאם לדיני כל מדינה.',
        'feature1': 'סודיות מוחלטת',
        'feature2': 'מומחיות בינלאומית',
        'feature3': 'תוצאות מובטחות',
        'contact-title': 'יצירת קשר חסויה',
        'form-name': 'שם מלא',
        'form-email': 'אימייל',
        'form-phone': 'טלפון (לא חובה)',
        'form-message': 'הפנייה שלך',
        'message-placeholder': 'תאר/י את מצבך בכמה מילים. כל המידע יישאר חסוי לחלוטין.',
        'form-document': 'מסמכים (לא חובה)',
        'file-upload-text': 'לחץ או גרור מסמכים לכאן',
        'file-upload-hint': 'PDF, Word, תמונות (מקס 10MB כל אחד)',
        'consent-text': 'אני מסכים/ה שהנתונים שלי יעובדו בהתאם למדיניות הפרטיות.',
        'privacy-text': 'המידע שלך נשמר בסודיות מוחלטת ואינו נמסר לצדדים שלישיים.',
        'form-submit': 'שלח את הבקשה',
        'footer-desc': 'משרד מומחה בגנאלוגיית ירושות בינלאומית',
        'footer-certified': 'מאושר • חסוי • בינלאומי',
        'footer-contact-title': 'יצירת קשר מקצועית',
        'footer-availability': 'זמינות 24/7 למצבי חירום',
        'footer-legal-title': 'מידע משפטי',
        'footer-design': 'עיצוב: רובן ויזמן',
        'footer-compliance': 'תואם GDPR • נתונים מוגנים',
        'footer-rights': 'כל הזכויות שמורות.',
        'privacy-policy': 'מדיניות פרטיות',
        'cookie-text': 'אנו משתמשים בעוגיות הנדרשות להפעלת האתר.',
        'cookie-accept': 'קבל',
        'cookie-decline': 'סרב',
        'privacy-page-title': 'מדיניות פרטיות - WizmanHeritage',
        'privacy-description': 'מדיניות הפרטיות של WizmanHeritage. למדו כיצד אנו אוספים, משתמשים ומגנים על הנתונים האישיים שלכם.',
        'privacy-main-header': 'מדיניות פרטיות',
        'privacy-last-updated-label': 'עדכון אחרון:',
        'privacy-date': '18 בספטמבר 2025',
        'privacy-intro': 'WizmanHeritage מחויבת להגנה על המידע האישי שלך. מדיניות פרטיות זו מפרטת כיצד אנו אוספים, משתמשים ומגנים על המידע הנמסר על ידך באתר האינטרנט שלנו, בהתאם לתקנה הכללית להגנה על מידע (GDPR).',
        'privacy-h2-collection': '1. איסוף מידע אישי',
        'privacy-p-collection-1': 'אנו אוספים מידע בעת שימושך בטופס יצירת הקשר באתר. המידע הנאסף עשוי לכלול:',
        'privacy-li-collection-name': 'שם מלא: לצורך זיהוי.',
        'privacy-li-collection-email': 'כתובת דוא"ל: לצורך יצירת קשר.',
        'privacy-li-collection-phone': 'מספר טלפון (אופציונלי): ליצירת קשר ישיר במידת הצורך.',
        'privacy-li-collection-message': 'הודעה: כל מידע הנמסר על ידך בנוגע לבקשתך.',
        'privacy-li-collection-docs': 'מסמכים: קבצים המועלים על ידך באופן וולונטרי לתמיכה בבקשתך.',
        'privacy-li-collection-nav': 'נתוני גלישה: כגון קובצי Cookie החיוניים לתפקוד האתר.',
        'privacy-h2-usage': '2. שימוש במידע',
        'privacy-p-usage-1': 'המידע שלך משמש אותנו אך ורק למטרות הבאות:',
        'privacy-li-usage-reply': 'מתן מענה לפניותיך ואספקת שירותי הגנאלוגיה שלנו.',
        'privacy-li-usage-manage': 'ניהול ואבטחת אתר האינטרנט.',
        'privacy-li-usage-legal': 'עמידה בדרישות משפטיות ורגולטוריות.',
        'privacy-p-usage-2': 'איננו חולקים את המידע שלך עם צדדים שלישיים למטרות שיווקיות. המידע יועבר רק בכפוף להסכמתך המפורשת או כנדרש על פי חוק.',
        'privacy-h2-security': '3. אבטחת מידע',
        'privacy-p-security-1': 'אנו נוקטים באמצעי אבטחה טכניים וארגוניים כדי להגן על המידע שלך מפני גישה, שינוי, חשיפה או השמדה בלתי מורשים. העברת קבצים מאובטחת והגישה למידע מוגבלת באופן מחמיר.',
        'privacy-h2-retention': '4. שמירת מידע',
        'privacy-p-retention-1': 'המידע האישי שלך יישמר למשך הזמן הדרוש להשגת המטרות שלשמן נאסף, או כפי שנדרש לעמידה בהתחייבויותינו המשפטיות.',
        'privacy-h2-rights': '5. זכויותיך',
        'privacy-p-rights-1': 'בהתאם ל-GDPR, עומדות לך הזכויות הבאות בנוגע למידע האישי שלך:',
        'privacy-li-rights-access': 'זכות עיון: הזכות לבקש עותק של המידע שאנו מחזיקים אודותיך.',
        'privacy-li-rights-rectify': 'זכות לתיקון: הזכות לבקש תיקון מידע שאינו מדויק.',
        'privacy-li-rights-erase': 'זכות למחיקה: הזכות לבקש את מחיקת המידע שלך.',
        'privacy-li-rights-limit': 'זכות להגבלת עיבוד: הזכות לבקש שנגביל את השימוש במידע שלך.',
        'privacy-p-rights-2': 'למימוש זכויותיך, ניתן ליצור עמנו קשר באמצעות טופס יצירת הקשר באתר.',
        'privacy-h2-cookies': '6. קובצי Cookie',
        'privacy-p-cookies-1': 'האתר משתמש בקובצי Cookie החיוניים לתפעולו. באפשרותך לקבל או לדחות את השימוש בהם באמצעות הודעת ההסכמה המופיעה בכניסה לאתר.',
        'privacy-h2-contact': '7. יצירת קשר',
        'privacy-p-contact-1': 'בכל שאלה הנוגעת למדיניות פרטיות זו, יש ליצור קשר באמצעות טופס יצירת הקשר באתר הראשי.',
        'privacy-back-to-home': 'חזרה לדף הבית'
      }
    };

    this.init();
  }

  // ================== INIT ==================
  init() {
    this.loadSavedLanguage();
    this.loadCookieConsent();
    this.updateLanguage(this.currentLanguage);
    this.setupEventListeners();

    if (document.getElementById('contact-form')) {
      this.setupIntersectionObservers();
      this.setupFileUpload();
      this.setupFAQ();
      this.animateCounters();
    }

    this.updateSEOTags();
    this.showCookieBanner();
    setTimeout(() => this.updateLanguageDOM(), 100);

    // Email obfuscation dispos sur toutes pages
    this.setupEmailObfuscation();
  }

  // ================== UTILS ==================
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>&"']/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' }[m]));
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  setUrlLangParam(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    history.replaceState({}, '', url.toString());
  }

  // ================== COOKIES ==================
  loadCookieConsent() {
    try { const saved = localStorage.getItem('wizman_cookies'); if (saved) this.cookieConsent = JSON.parse(saved); }
    catch (e) { console.warn('Unable to access localStorage:', e); }
  }
  saveCookieConsent(accepted) {
    try {
      this.cookieConsent = { accepted, timestamp: new Date().toISOString() };
      localStorage.setItem('wizman_cookies', JSON.stringify(this.cookieConsent));
    } catch (e) { console.warn('Unable to save to localStorage:', e); }
  }
  showCookieBanner() {
    if (this.cookieConsent) return;
    const banner = document.getElementById('cookie-banner');
    if (banner) setTimeout(() => banner.classList.add('show'), 1000);
  }
  hideCookieBanner() {
    document.getElementById('cookie-banner')?.classList.remove('show');
  }

  // ================== LANG ==================
  loadSavedLanguage() {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && this.translations[urlLang]) {
        this.currentLanguage = urlLang;
        this.saveLanguage(urlLang);
      } else {
        const saved = localStorage.getItem('wizman_lang');
        if (saved && this.translations[saved]) this.currentLanguage = saved;
        else {
          const htmlLang = document.documentElement.lang || 'fr';
          this.currentLanguage = this.translations[htmlLang] ? htmlLang : 'fr';
        }
      }
    } catch (e) {
      console.warn('URL/localStorage lang read failed:', e);
      this.currentLanguage = 'fr';
    }
    this.updateLanguageDOM();
  }
  saveLanguage(lang) {
    try { localStorage.setItem('wizman_lang', lang); } catch (e) { console.warn('Unable to save to localStorage:', e); }
  }
  setLanguage(lang) {
    if (!this.translations[lang] || lang === this.currentLanguage) return;
    this.currentLanguage = lang;
    this.saveLanguage(lang);
    this.setUrlLangParam(lang);         // garde ?lang= dans l’URL sans recharger
    this.updateLanguageDOM();           // dir + boutons actifs
    this.updateLanguage(lang);          // remplit tous les data-translate
    this.updateSEOTags();               // <title> + meta + og
    // Met à jour liens dépendants de la langue
    const privacyLink = document.getElementById('footer-privacy-link');
    if (privacyLink) privacyLink.href = `/privacy_policy.html?lang=${this.currentLanguage}`;

    // Ferme le menu mobile si ouvert
    this.closeMenu();

    // Optionnel : feedback
    const msg = this.notificationMessages[this.currentLanguage]?.['language-changed'];
    if (msg) this.showToast(msg, 'info');
  }
  updateLanguageDOM() {
    const isRtl = this.currentLanguage === 'he';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    const updateButtons = () => {
      document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        btn.setAttribute('aria-pressed', btn.dataset.lang === this.currentLanguage ? 'true' : 'false');
      });
    };
    updateButtons(); setTimeout(updateButtons, 50); setTimeout(updateButtons, 200);
  }
  updateSEOTags() {
    const dict = this.translations[this.currentLanguage] || {};
    const path = window.location.pathname;
    const isPrivacy = /privacy_policy\.html$/.test(path);

    document.title = isPrivacy
      ? (dict['privacy-page-title'] || 'Politique de Confidentialité - WizmanHeritage')
      : `WizmanHeritage - ${dict['hero-title'] || 'Expertise en Généalogie Successorale'}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const fallbackHome = 'Cabinet international spécialisé dans la recherche successorale et généalogie. Discrétion et professionnalisme garantis.';
      const fallbackPriv = 'Politique de confidentialité de WizmanHeritage. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.';
      metaDesc.setAttribute('content', isPrivacy ? (dict['privacy-description'] || fallbackPriv) : (dict['hero-description'] || fallbackHome));
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc  = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    if (ogDesc && metaDesc) ogDesc.setAttribute('content', metaDesc.getAttribute('content'));
  }
  updateLanguage(lang = this.currentLanguage) {
    const dict = this.translations[lang] || {};
    document.querySelectorAll('[data-translate]').forEach(node => {
      const key = node.getAttribute('data-translate');
      const val = dict[key];
      if (typeof val === 'string') {
        if (key === 'message-placeholder') node.placeholder = val;
        else node.textContent = val;
      }
    });
  }

  // ================== EVENTS ==================
  setupEventListeners() {
    // Switch langue (desktop + mobile)
    document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setLanguage(btn.dataset.lang));
    });

    const nav = document.getElementById('floating-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(15,23,40,0.12)' : 'var(--glass-shadow)';
      }, { passive: true });
    }

    if (document.getElementById('contact-form')) {
      document.getElementById('cookie-accept')?.addEventListener('click', () => {
        this.saveCookieConsent(true); this.hideCookieBanner();
        this.showToast(this.notificationMessages[this.currentLanguage]['cookies-accepted'], 'success');
      });
      document.getElementById('cookie-decline')?.addEventListener('click', () => {
        this.saveCookieConsent(false); this.hideCookieBanner();
        this.showToast(this.notificationMessages[this.currentLanguage]['cookies-declined'], 'info');
      });
      document.getElementById('mobile-menu-btn')?.addEventListener('click', () => this.toggleMenu());
      document.getElementById('mobile-menu-overlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) this.closeMenu();
      });
      document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => this.closeMenu()));
      document.getElementById('hero-cta')?.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
      document.getElementById('contact-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));

      const privacyLink = document.getElementById('footer-privacy-link');
      if (privacyLink) privacyLink.href = `/privacy_policy.html?lang=${this.currentLanguage}`;
    }

    // Page de confidentialité (liens retour localisés)
    if (document.querySelector('.privacy-page-body')) {
      const logoLink = document.getElementById('privacy-logo-link');
      if (logoLink) logoLink.href = `/?lang=${this.currentLanguage}`;
      const backLink = document.getElementById('privacy-back-link');
      if (backLink) backLink.href = `/?lang=${this.currentLanguage}`;
    }
  }

  // ================== EMAIL OBFUSCATION ==================
  setupEmailObfuscation() {
    const selector = '[data-email],[data-email-user][data-email-domain],.js-email,.email-link';
    const links = document.querySelectorAll(selector);
    if (!links.length) return;

    const buildEmail = (el) => {
      const packed = el.getAttribute('data-email');
      if (packed) {
        const parts = packed.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length >= 3) {
          const user = parts.length === 4 ? (parts[0] + parts[1]) : parts[0];
          const domain = parts.length === 4 ? parts[2] : parts[1];
          const tld = parts.length === 4 ? parts[3] : parts[2];
          return `${user}@${domain}${tld ? '.' + tld : ''}`;
        }
      }
      const u = el.getAttribute('data-email-user');
      const d = el.getAttribute('data-email-domain');
      const t = el.getAttribute('data-email-tld');
      if (u && d) return t ? `${u}@${d}.${t}` : `${u}@${d}`;

      // fallback legacy: nettoie -nospam- et variantes
      let txt = (el.textContent || '');
      txt = txt.replace(/-?nospam-?/gi, '')
               .replace(/\s+/g, '')
               .replace(/\[at\]|\(at\)|\sat\s/gi, '@')
               .replace(/\[dot\]|\(dot\)|\sdot\s/gi, '.')
               .replace(/[^a-z0-9@._+-]/gi, '');
      return txt.includes('@') ? txt : '';
    };

    const applyVisibleTextIfNeeded = (el, email) => {
      const isLegacy = el.classList.contains('email-link');
      const wantsShow = el.getAttribute('data-email-show') === 'true' || isLegacy;
      if (!email || !wantsShow) return;
      const mask = el.getAttribute('data-email-mask') === 'true';
      const visible = mask ? email.replace('@', ' [at] ').replace(/\./g, ' [dot] ') : email;
      if (!el.hasAttribute('data-translate')) el.textContent = visible;
      el.setAttribute('aria-label', `Envoyer un e-mail à ${email}`);
      el.setAttribute('title', email);
    };

    const openMailto = (el, email) => {
      if (!email) return;
      const subject = el.getAttribute('data-email-subject') || '';
      const body = el.getAttribute('data-email-body') || '';
      const qp = [];
      if (subject) qp.push(`subject=${encodeURIComponent(subject)}`);
      if (body) qp.push(`body=${encodeURIComponent(body)}`);
      window.location.href = `mailto:${email}${qp.length ? `?${qp.join('&')}` : ''}`;
    };

    links.forEach((a) => {
      const email = buildEmail(a);
      applyVisibleTextIfNeeded(a, email);
      if (!a.getAttribute('role')) a.setAttribute('role', 'link');
      if (!a.getAttribute('tabindex')) a.setAttribute('tabindex', '0');
      a.setAttribute('rel', (a.getAttribute('rel') || 'nofollow noopener noreferrer').trim());

      a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openMailto(a, email); });
      a.addEventListener('keydown', (e) => { const k = e.key || e.code; if (k === 'Enter' || k === ' ') { e.preventDefault(); openMailto(a, email); } });
      a.addEventListener('mouseenter', () => {
        const subject = a.getAttribute('data-email-subject') || '';
        const body = a.getAttribute('data-email-body') || '';
        const qp = [];
        if (subject) qp.push(`subject=${encodeURIComponent(subject)}`);
        if (body) qp.push(`body=${encodeURIComponent(body)}`);
        a.setAttribute('data-obf-prev-href', a.getAttribute('href') || '#');
        if (email) a.setAttribute('href', `mailto:${email}${qp.length ? `?${qp.join('&')}` : ''}`);
      });
      a.addEventListener('mouseleave', () => {
        const prev = a.getAttribute('data-obf-prev-href');
        if (prev !== null) a.setAttribute('href', prev || '#');
      });
    });
  }

  // ================== MENU MOBILE ==================
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.getElementById('mobile-menu-btn')?.classList.toggle('active', this.isMenuOpen);
    document.getElementById('mobile-menu-overlay')?.classList.toggle('active', this.isMenuOpen);
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  closeMenu() {
    if (!this.isMenuOpen) return;
    this.isMenuOpen = false;
    document.getElementById('mobile-menu-btn')?.classList.remove('active');
    document.getElementById('mobile-menu-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ================== FAQ ==================
  setupFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => {
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-item .faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.faq-item .faq-answer').forEach(a => a.classList.remove('open'));
        if (!isOpen) {
          question.setAttribute('aria-expanded', 'true');
          item.querySelector('.faq-answer')?.classList.add('open');
        }
      });
    });
  }

  // ================== ANIMATIONS ==================
  setupIntersectionObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .stat-card, .feature-item, .flag-item, .faq-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          observer.unobserve(el);
          const target = parseInt(el.getAttribute('data-count') || '0', 10);
          const duration = 1200;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = String(value);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => observer.observe(c));
  }

  // ================== UPLOAD ==================
  addFiles(files) {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [ 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg' ];
    const newFiles = [];
    for (const file of files) {
      if (this.selectedFiles.length + newFiles.length >= maxFiles) { this.showToast(this.notificationMessages[this.currentLanguage]['file-limit'], 'warning'); break; }
      if (!allowedTypes.includes(file.type)) { this.showToast(this.notificationMessages[this.currentLanguage]['file-type'], 'error'); continue; }
      if (file.size > maxSize) { this.showToast(this.notificationMessages[this.currentLanguage]['file-size'], 'error'); continue; }
      if (file.name.length > 255 || /[<>:"/\\|?*]/.test(file.name)) { this.showToast('Nom de fichier invalide', 'error'); continue; }
      newFiles.push(file);
    }
    if (newFiles.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.renderFileNames();
      this.showToast(this.notificationMessages[this.currentLanguage]['file-selected'], 'success');
    }
  }
  removeFile(index) {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.renderFileNames();
    this.showToast(this.notificationMessages[this.currentLanguage]['file-removed'], 'info');
  }
  renderFileNames() {
    const fileNamesEl = document.getElementById('file-upload-names');
    const fileWrapper = document.querySelector('.file-upload-wrapper');
    if (!fileNamesEl || !fileWrapper) return;
    fileNamesEl.innerHTML = '';
    fileWrapper.classList.toggle('has-file', this.selectedFiles.length > 0);
    this.selectedFiles.forEach((file, index) => {
      const container = document.createElement('div');
      container.className = 'file-name-container';
      const fileName = document.createElement('span');
      fileName.className = 'file-name';
      fileName.textContent = file.name;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'file-remove-btn';
      removeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
      removeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.removeFile(index); });
      container.append(fileName, removeBtn);
      fileNamesEl.appendChild(container);
    });
  }
  setupFileUpload() {
    const fileInput = document.getElementById('document');
    const fileDisplay = document.getElementById('file-upload-display');
    if (!fileInput || !fileDisplay) return;
    const openPicker = () => fileInput.click();
    fileDisplay.addEventListener('click', openPicker);
    fileDisplay.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(); } });
    ['dragenter', 'dragover'].forEach((evt) => fileDisplay.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); fileDisplay.classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach((evt) => fileDisplay.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); fileDisplay.classList.remove('dragover'); }));
    fileDisplay.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer?.files || []);
      this.addFiles(files);
    });
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target?.files || []);
      this.addFiles(files);
      fileInput.value = '';
    });
  }

  // ================== FORM ==================
  async handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = this.sanitizeInput(formData.get('name')?.toString().trim() || '');
    const email = this.sanitizeInput(formData.get('email')?.toString().trim() || '');
    const phone = this.sanitizeInput(formData.get('phone')?.toString().trim() || '');
    const message = this.sanitizeInput(formData.get('message')?.toString().trim() || '');
    const consent = formData.get('consent');

    if (!name || name.length < 2 || name.length > 100) { this.showToast(this.notificationMessages[this.currentLanguage]['name-missing'], 'error'); return; }
    if (!email || !this.isValidEmail(email)) { this.showToast(this.notificationMessages[this.currentLanguage]['email-missing'], 'error'); return; }
    if (!message || message.length < 10 || message.length > 2000) { this.showToast(this.notificationMessages[this.currentLanguage]['message-missing'], 'error'); return; }
    if (!consent) { this.showToast(this.notificationMessages[this.currentLanguage]['consent-missing'], 'error'); return; }
    if (phone && (phone.length > 20 || !/^[\d\s\-+()]+$/.test(phone))) { this.showToast('Numéro de téléphone invalide', 'error'); return; }

    this.showToast(this.notificationMessages[this.currentLanguage]['form-sending'], 'info');

    try {
      const payload = new FormData();
      payload.append('name', name);
      payload.append('email', email);
      payload.append('phone', phone);
      payload.append('message', message);
      payload.append('consent', consent);
      payload.append('lang', this.currentLanguage);
      this.selectedFiles.forEach(file => payload.append('document', file, file.name));

      const response = await fetch('/api/contact', { method: 'POST', body: payload });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      this.showToast(this.notificationMessages[this.currentLanguage]['form-success'], 'success');
      form.reset();
      this.selectedFiles = [];
      this.renderFileNames();
    } catch (error) {
      console.error('Form submission error:', error);
      this.showToast(this.notificationMessages[this.currentLanguage]['form-error'], 'error');
    }
  }

  // ================== TOAST ==================
  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
    };
    icon.innerHTML = icons[type] || icons.info;
    const messageSpan = document.createElement('span');
    messageSpan.textContent = this.sanitizeInput(message);
    const content = document.createElement('div');
    content.className = 'toast-content';
    content.append(icon, messageSpan);
    toast.appendChild(content);
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    const remove = () => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 320); };
    setTimeout(remove, 4000);
    toast.addEventListener('click', remove);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.wizmanHeritage = new WizmanHeritage();
});
