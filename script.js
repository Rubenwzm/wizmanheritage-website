// =====================================================================
//   FICHIER SCRIPT.JS - VERSION FINALE ET CORRIGÉE
// =====================================================================

class WizmanHeritage {
  constructor() {
    this.currentLanguage = 'fr';
    this.isMenuOpen = false;
    this.selectedFiles = [];
    this.toastCounter = 0;
    this.cookieConsent = null;

    // Messages de notification multilingues (avec apostrophes corrigées)
    this.notificationMessages = {
      fr: {
        'form-success': 'Votre demande a été transmise avec succès',
        'form-error': 'Erreur lors de l’envoi de votre demande',
        'form-sending': 'Transmission en cours...',
        'language-changed': 'Français',
        'email-missing': 'Veuillez saisir votre adresse email',
        'name-missing': 'Veuillez indiquer votre nom complet',
        'message-missing': 'Veuillez préciser votre demande',
        'consent-missing': 'Veuillez accepter les conditions de confidentialité',
        'file-selected': 'Document(s) sélectionné(s)',
        'file-removed': 'Document supprimé',
        'file-limit': 'Maximum 5 documents autorisés',
        'file-size': 'Fichier trop volumineux (max 10MB)',
        'file-type': 'Type de fichier non autorisé',
        'cookies-accepted': 'Cookies acceptés',
        'cookies-declined': 'Cookies refusés'
      },
      en: { /* ... autres langues ... */ },
      he: { /* ... autres langues ... */ }
    };

    // Traductions complètes multilingues (avec apostrophes corrigées)
    this.translations = {
      fr: {
        home: 'Accueil',
        services: 'Services',
        international: 'International',
        faq: 'FAQ',
        about: 'À propos',
        contact: 'Contact',
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
      en: { /* ... traductions anglaises ... */ },
      he: { /* ... traductions hébreu ... */ }
    };

    this.init();
  }

  init() { /* ... le reste de la fonction init ... */ }

  sanitizeInput(input) { /* ... */ }
  isValidEmail(email) { /* ... */ }
  loadCookieConsent() { /* ... */ }
  saveCookieConsent(accepted) { /* ... */ }
  showCookieBanner() { /* ... */ }
  hideCookieBanner() { /* ... */ }
  loadSavedLanguage() { /* ... */ }
  saveLanguage(lang) { /* ... */ }
  updateLanguageDOM() { /* ... */ }
  updateSEOTags() { /* ... */ }
  setLanguage(lang) { /* ... */ }
  setupEventListeners() { /* ... */ }
  toggleMenu() { /* ... */ }
  closeMenu() { /* ... */ }
  setupFAQ() { /* ... */ }
  setupIntersectionObservers() { /* ... */ }
  animateCounters() { /* ... */ }
  addFiles(files) { /* ... */ }
  removeFile(index) { /* ... */ }
  renderFileNames() { /* ... */ }
  setupFileUpload() { /* ... */ }


  // ===== SOUMISSION FORMULAIRE (VERSION 100% CORRIGÉE) =====
  async handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Récupération et validation des champs texte (inchangé)
    const formData = new FormData(form);
    const name = this.sanitizeInput(formData.get('name')?.toString().trim() || '');
    const email = this.sanitizeInput(formData.get('email')?.toString().trim() || '');
    const phone = this.sanitizeInput(formData.get('phone')?.toString().trim() || '');
    const message = this.sanitizeInput(formData.get('message')?.toString().trim() || '');
    const consent = formData.get('consent');

    if (!name || name.length < 2 || name.length > 100) {
      this.showToast(this.notificationMessages[this.currentLanguage]['name-missing'], 'error');
      return;
    }
    if (!email || !this.isValidEmail(email)) {
      this.showToast(this.notificationMessages[this.currentLanguage]['email-missing'], 'error');
      return;
    }
    if (!message || message.length < 10 || message.length > 2000) {
      this.showToast(this.notificationMessages[this.currentLanguage]['message-missing'], 'error');
      return;
    }
    if (!consent) {
      this.showToast(this.notificationMessages[this.currentLanguage]['consent-missing'], 'error');
      return;
    }
    if (phone && (phone.length > 20 || !/^[\d\s\-\+\(\)]+$/.test(phone))) {
      this.showToast('Numéro de téléphone invalide', 'error');
      return;
    }

    this.showToast(this.notificationMessages[this.currentLanguage]['form-sending'], 'info');

    try {
        // On crée un NOUVEL objet FormData pour construire notre envoi.
        // C'est plus sûr que de réutiliser celui du formulaire.
        const payload = new FormData();
        
        // On ajoute tous les champs texte
        payload.append('name', name);
        payload.append('email', email);
        payload.append('phone', phone);
        payload.append('message', message);
        payload.append('consent', consent);
        payload.append('lang', this.currentLanguage);

        // =====================================================================
        //                    LA CORRECTION EST ICI
        // On parcourt la liste des fichiers que vous avez sélectionnés 
        // (this.selectedFiles) et on les ajoute un par un au "colis" (payload).
        // =====================================================================
        this.selectedFiles.forEach(file => {
            payload.append('document', file, file.name);
        });

        // Envoi du colis complet (textes + fichiers) au serveur
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: payload,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        // Si tout a réussi
        this.showToast(this.notificationMessages[this.currentLanguage]['form-success'], 'success');
        form.reset();
        this.selectedFiles = [];
        this.renderFileNames();

    } catch (error) {
        console.error('Form submission error:', error);
        this.showToast(this.notificationMessages[this.currentLanguage]['form-error'], 'error');
    }
  }

  showToast(message, type = 'info') { /* ... */ }
  updateLanguage(lang = this.currentLanguage) { /* ... */ }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.wizmanHeritage = new WizmanHeritage();
});
