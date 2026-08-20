/* ══════════════════════════════════════════════════════════
   PHOTOSINTESIS — main.js
   TODO: reemplaza WHATSAPP_NUMBER con el número real del negocio
   (formato internacional sin signos, ej. "521XXXXXXXXXX").
   TODO: reemplaza FACEBOOK_URL con la cuenta de Facebook real del negocio.
══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '521XXXXXXXXXX';
  var FACEBOOK_URL = 'https://www.facebook.com/PENDIENTE';

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbar();
    initMobileMenu();
    initHeroCanvas();
    initMarquee();
    initReveal();
    initCounters();
    initPortfolioLightbox();
    initWhatsAppLinks();
    initFacebookLinks();
    initContactForm();
    initFooterYear();
  });

  /* ---------- Loader ---------- */
  function initLoader() {
    function finish() {
      document.body.classList.add('loaded');
    }
    if (document.readyState === 'complete') {
      setTimeout(finish, 300);
    } else {
      window.addEventListener('load', function () { setTimeout(finish, 300); });
      setTimeout(finish, 2200); // safety fallback
    }
  }

  /* ---------- Navbar scroll state ---------- */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mob-menu');
    if (!btn || !menu) return;

    function close() {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
    function toggle() {
      var isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    btn.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Hero canvas — floating light particles ---------- */
  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var particles = [];
    var raf;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      var rect = hero.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      seed(rect.width, rect.height);
    }

    function seed(w, h) {
      var count = w < 700 ? 22 : 44;
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.6,
          vy: -(Math.random() * 0.25 + 0.06),
          vx: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      var w = canvas.width / window.devicePixelRatio;
      var h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(231,200,119,' + p.a + ')';
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) tick();
  }

  /* ---------- Marquee content ---------- */
  function initMarquee() {
    var el = document.getElementById('marquee');
    if (!el) return;
    var words = ['Bodas', 'XV Años', 'Sesiones Personales', 'Retratos Familiares', 'Graduaciones', 'Creamos recuerdos para siempre'];
    var unit = words.map(function (w) {
      return '<span>' + w + ' <i class="fa-solid fa-star" style="font-size:9px; opacity:.6;"></i></span>';
    }).join('');
    el.innerHTML = unit + unit; // duplicated for seamless loop
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Portfolio lightbox ---------- */
  function initPortfolioLightbox() {
    var items = document.querySelectorAll('.portfolio-item');
    if (!items.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<div class="lightbox-frame">' +
        '<button type="button" class="lightbox-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>' +
        '<img src="" alt="">' +
        '<div class="lightbox-caption"></div>' +
      '</div>';
    document.body.appendChild(box);

    var frameImg = box.querySelector('img');
    var caption = box.querySelector('.lightbox-caption');
    var closeBtn = box.querySelector('.lightbox-close');

    function open(item) {
      var img = item.querySelector('img');
      frameImg.src = item.getAttribute('href');
      frameImg.alt = img ? img.alt : '';
      caption.textContent = item.getAttribute('data-caption') || '';
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      box.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        open(item);
      });
    });
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('open')) close();
    });
  }

  /* ---------- WhatsApp links (floating button, contact card, footer) ---------- */
  function initWhatsAppLinks() {
    var defaultMsg = 'Hola, visité su sitio web y me gustaría más información.';
    document.querySelectorAll('.js-wa-link').forEach(function (a) {
      a.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(defaultMsg));
    });
  }

  /* ---------- Facebook links (botón "Agenda tu Sesión") ---------- */
  function initFacebookLinks() {
    document.querySelectorAll('.js-fb-link').forEach(function (a) {
      a.setAttribute('href', FACEBOOK_URL);
    });
  }

  /* ---------- Contact form → WhatsApp ---------- */
  function initContactForm() {
    var form = document.getElementById('wa-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';

      var text = 'Hola, soy ' + name + '. Me interesa una sesión de: ' + interest + '.\n' + msg;
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Footer year ---------- */
  function initFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
