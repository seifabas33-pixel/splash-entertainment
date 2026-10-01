/* Case-study pages: language, theme, reveals, phone parallax, visitor stats */
(function () {
  'use strict';
  var root = document.documentElement;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* shared interface text; each page adds its own text in window.CASE_T */
  var UI = {
    ar: { 'ui.back': 'كل الأعمال', 'ui.k': 'دراسة حالة', 'ui.client': 'العميل', 'ui.where': 'الموقع', 'ui.year': 'السنة', 'ui.langs': 'اللغات', 'ui.role': 'دوري',
      'ui.live': 'زيارة الموقع', 'ui.quote': 'اطلب عرض سعر', 'ui.wa': 'تواصل عبر واتساب', 'ui.brief': 'المطلوب', 'ui.built': 'ما صمّمته وبنيته', 'ui.feats': 'أهم المزايا',
      'ui.palette': 'الألوان', 'ui.type': 'الخطوط', 'ui.tech': 'التقنيات', 'ui.ctaH': 'تريد شيئًا مثل هذا <span class="serif gold">لفندقك؟</span>',
      'ui.ctaP': 'أخبرني بما تحتاجه وسأرد عليك عبر واتساب.', 'ui.next': 'المشروع التالي', 'ui.theme': 'المظهر', 'ui.lang': 'اللغة', 'role': 'التصميم والتطوير' },
    de: { 'ui.back': 'Alle Projekte', 'ui.k': 'Fallstudie', 'ui.client': 'Kunde', 'ui.where': 'Ort', 'ui.year': 'Jahr', 'ui.langs': 'Sprachen', 'ui.role': 'Rolle',
      'ui.live': 'Live-Seite ansehen', 'ui.quote': 'Angebot anfragen', 'ui.wa': 'Auf WhatsApp schreiben', 'ui.brief': 'Die Aufgabe', 'ui.built': 'Was ich gebaut habe', 'ui.feats': 'Die wichtigsten Funktionen',
      'ui.palette': 'Farbpalette', 'ui.type': 'Schriften', 'ui.tech': 'Gebaut mit', 'ui.ctaH': 'So etwas für <span class="serif gold">Ihr Hotel?</span>',
      'ui.ctaP': 'Sagen Sie mir, was Sie brauchen. Ich melde mich auf WhatsApp.', 'ui.next': 'Nächstes Projekt', 'ui.theme': 'Design', 'ui.lang': 'Sprache', 'role': 'Design & Entwicklung' },
    it: { 'ui.back': 'Tutti i progetti', 'ui.k': 'Case study', 'ui.client': 'Cliente', 'ui.where': 'Luogo', 'ui.year': 'Anno', 'ui.langs': 'Lingue', 'ui.role': 'Ruolo',
      'ui.live': 'Visita il sito', 'ui.quote': 'Chiedi un preventivo', 'ui.wa': 'Scrivimi su WhatsApp', 'ui.brief': 'La richiesta', 'ui.built': 'Cosa ho realizzato', 'ui.feats': 'Funzioni principali',
      'ui.palette': 'Palette colori', 'ui.type': 'Caratteri', 'ui.tech': 'Realizzato con', 'ui.ctaH': 'Vuoi qualcosa così per <span class="serif gold">il tuo hotel?</span>',
      'ui.ctaP': 'Dimmi di cosa hai bisogno e ti rispondo su WhatsApp.', 'ui.next': 'Progetto successivo', 'ui.theme': 'Tema', 'ui.lang': 'Lingua', 'role': 'Design e sviluppo' }
  };
  var PAGE = window.CASE_T || {};
  var LANGS = ['en', 'ar', 'de', 'it'];

  /* ── language ── */
  var ORIG = {};
  $$('[data-i]').forEach(function (el) { var k = el.getAttribute('data-i'); if (!(k in ORIG)) ORIG[k] = el.innerHTML.trim(); });
  $$('[data-ia]').forEach(function (el) {
    el.getAttribute('data-ia').split(';').forEach(function (pair) { var p = pair.split(':'); if (!(p[1] in ORIG)) ORIG[p[1]] = el.getAttribute(p[0]) || ''; });
  });
  function t(l, k) {
    if (l !== 'en') { var d = PAGE[l] || {}; if (k in d) return d[k]; d = UI[l] || {}; if (k in d) return d[k]; }
    return ORIG[k] !== undefined ? ORIG[k] : '';
  }
  function detect() {
    try {
      var q = new URLSearchParams(location.search).get('lang'); if (LANGS.indexOf(q) > -1) return q;
      var s = localStorage.getItem('sa-lang'); if (LANGS.indexOf(s) > -1) return s;
    } catch (e) {}
    var nav = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < nav.length; i++) { var c = String(nav[i]).slice(0, 2).toLowerCase(); if (LANGS.indexOf(c) > -1) return c; }
    return 'en';
  }
  function applyLang(l) {
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i]').forEach(function (el) { el.innerHTML = t(l, el.getAttribute('data-i')); });
    $$('[data-ia]').forEach(function (el) {
      el.getAttribute('data-ia').split(';').forEach(function (pair) { var p = pair.split(':'); el.setAttribute(p[0], t(l, p[1])); });
    });
    $$('.c-langs button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    try { localStorage.setItem('sa-lang', l); } catch (e) {}
    try { var u = new URL(location.href); if (l === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch (e) {}
    /* carry the language to the other pages */
    $$('a[data-keep]').forEach(function (a) {
      var base = a.getAttribute('data-keep'), hash = '';
      var i = base.indexOf('#'); if (i > -1) { hash = base.slice(i); base = base.slice(0, i); }
      a.href = base + (l === 'en' ? '' : (base.indexOf('?') > -1 ? '&' : '?') + 'lang=' + l) + hash;
    });
  }
  $$('.c-langs button').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); }); });
  applyLang(detect());

  /* ── theme: auto (by time of day) → light → dark ── */
  function themeFor(mode) { var h = new Date().getHours(); return mode === 'auto' ? (h >= 6 && h < 19 ? 'light' : 'dark') : mode; }
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var order = ['auto', 'light', 'dark'], mode = root.getAttribute('data-mode') || 'auto';
    mode = order[(order.indexOf(mode) + 1) % 3];
    try { localStorage.setItem('sa-theme', mode); } catch (e) {}
    root.setAttribute('data-mode', mode); root.setAttribute('data-theme', themeFor(mode));
  });
  setInterval(function () { if ((root.getAttribute('data-mode') || 'auto') === 'auto') root.setAttribute('data-theme', themeFor('auto')); }, 60000);

  /* ── reveals ── */
  var rv = $$('.rv');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ── phones drift at different speeds while scrolling ── */
  var par = $$('[data-par]');
  if (!reduce && par.length) {
    var ticking = false;
    var update = function () {
      ticking = false; var vh = innerHeight;
      par.forEach(function (el) {
        var r = el.parentNode.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (p * parseFloat(el.getAttribute('data-par'))).toFixed(1) + 'px,0)';
      });
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ── visitor stats: Vercel Web Analytics, live site only ── */
  if (/\.vercel\.app$|(^|\.)seifabas\.com$/.test(location.hostname)) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    var s = document.createElement('script'); s.defer = true; s.src = '/_vercel/insights/script.js'; document.head.appendChild(s);
  }
})();
