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

    // === TRADUCTIONS (inchangées) ===
    this.translations = { /* … garde tes traductions complètes ici (FR/EN/HE) … */ };

    this.init();
  }

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
  }

  // ---------- Utils ----------
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>&"']/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' }[m]));
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // ---------- Cookies ----------
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

  // ---------- Lang ----------
  loadSavedLanguage() {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && this.translations[urlLang]) { this.currentLanguage = urlLang; this.saveLanguage(urlLang); }
      else {
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
  updateLanguageDOM() {
    const isRtl = this.currentLanguage === 'he';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    const updateButtons = () => {
      document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
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
  setLanguage(lang) {
    if (!this.translations[lang] || lang === this.currentLanguage) return;
    this.saveLanguage(lang);
    const base = window.location.pathname;
    window.location.href = `${base}?lang=${lang}`;
  }

  // ---------- Email obfuscation (supporte .js-email ET .email-link) ----------
  setupEmailObfuscation() {
    // Prend les liens modernes (.js-email / data-*) ET ton ancien .email-link
    const selector = '[data-email],[data-email-user][data-email-domain],.js-email,.email-link';
    const links = document.querySelectorAll(selector);
    if (!links.length) return;

    const buildEmail = (el) => {
      // 1) Format data-email="user|domain|tld" ou "u|ser|domain|tld"
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
      // 2) Format data-email-user/domain/tld
      const u = el.getAttribute('data-email-user');
      const d = el.getAttribute('data-email-domain');
      const t = el.getAttribute('data-email-tld');
      if (u && d) return t ? `${u}@${d}.${t}` : `${u}@${d}`;

      // 3) Fallback lecture du texte (gère ton ancien markup avec -nospam- caché)
      let txt = (el.textContent || '');
      // Retire les tokens anti-spam les plus courants
      txt = txt.replace(/-?nospam-?/gi, '')
               .replace(/\s+/g, '')
               .replace(/\[at\]|\(at\)|\sat\s/gi, '@')
               .replace(/\[dot\]|\(dot\)|\sdot\s/gi, '.');
      // Garde seulement caractères utiles
      txt = txt.replace(/[^a-z0-9@._+-]/gi, '');
      return txt.includes('@') ? txt : '';
    };

    const applyVisibleTextIfNeeded = (el, email) => {
      // Par défaut : si c'est .email-link → on montre en clair
      const isLegacy = el.classList.contains('email-link');
      const wantsShow = el.getAttribute('data-email-show') === 'true' || isLegacy;
      if (!email || !wantsShow) return;

      const mask = el.getAttribute('data-email-mask') === 'true';
      const visible = mask ? email.replace('@', ' [at] ').replace(/\./g, ' [dot] ') : email;

      // Si pas d’i18n explicite
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

      // A11y + sécurité
      if (!a.getAttribute('role')) a.setAttribute('role', 'link');
      if (!a.getAttribute('tabindex')) a.setAttribute('tabindex', '0');
      a.setAttribute('rel', (a.getAttribute('rel') || 'nofollow noopener noreferrer').trim());

      // Evite href="#" → scroll top
      a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openMailto(a, email); });
      a.addEventListener('keydown', (e) => {
        const key = e.key || e.code;
        if (key === 'Enter' || key === ' ') { e.preventDefault(); openMailto(a, email); }
      });

      // Hover: href temporaire pour “copier le lien”
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

  // ---------- Events ----------
  setupEventListeners() {
    // Lang
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setLanguage(btn.dataset.lang));
    });

    const nav = document.getElementById('floating-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(15,23,40,0.12)' : 'var(--glass-shadow)';
      }, { passive: true });
    }

    // Accueil
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
      document.querySelectorAll('.mobile-lang-btn').forEach(btn => btn.addEventListener('click', () => this.setLanguage(btn.dataset.lang)));
      document.getElementById('hero-cta')?.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
      document.getElementById('contact-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));

      const privacyLink = document.getElementById('footer-privacy-link');
      if (privacyLink) privacyLink.href = `/privacy_policy.html?lang=${this.currentLanguage}`;
    }

    // Email obfuscation sur toutes pages
    this.setupEmailObfuscation();
  }

  // ---------- Menu ----------
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

  // ---------- FAQ ----------
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

  // ---------- Intersection/Animations ----------
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

  // ---------- Upload ----------
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

  // ---------- Form ----------
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

  // ---------- Toast ----------
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

  // ---------- i18n DOM ----------
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.wizmanHeritage = new WizmanHeritage();
});
