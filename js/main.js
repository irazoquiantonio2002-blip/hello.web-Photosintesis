/* ══════════════════════════════════════════════════════════
   PHOTOSINTESIS — main.js
   TODO: reemplaza FACEBOOK_URL con la cuenta de Facebook real del negocio.
   TODO: reemplaza MESSENGER_URL con el enlace m.me real del negocio
   (formato "https://m.me/usuario-o-id-de-la-pagina").
══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FACEBOOK_URL = 'https://www.facebook.com/PENDIENTE';
  var MESSENGER_URL = 'https://m.me/PENDIENTE';

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbar();
    initScrollProgress();
    initMobileMenu();
    initHeroCanvas();
    initHeroParallax();
    initMarquee();
    initReveal();
    initPortfolioLightbox();
    initFaqAccordion();
    initCardTilt();
    initMessengerLinks();
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

  /* ---------- Navbar scroll state — solid bg + hide on scroll down / show on scroll up ---------- */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var mobMenu = document.getElementById('mob-menu');
    if (!navbar) return;
    var lastY = window.scrollY;

    function onScroll() {
      var y = window.scrollY;

      if (y > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      var menuOpen = mobMenu && mobMenu.classList.contains('open');
      if (!menuOpen) {
        if (y > lastY && y > 160) {
          navbar.classList.add('nav-hidden');
        } else if (y < lastY) {
          navbar.classList.remove('nav-hidden');
        }
      } else {
        navbar.classList.remove('nav-hidden');
      }
      lastY = y;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var fill = document.getElementById('scroll-progress-fill');
    if (!fill) return;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = pct + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
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
      var count = w < 700 ? 85 : 150;
      particles = [];
      for (var i = 0; i < count; i++) {
        var big = Math.random() < 0.26;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? (Math.random() * 3.6 + 2.8) : (Math.random() * 1.9 + 1),
          vy: -(Math.random() * 0.34 + 0.08),
          vx: (Math.random() - 0.5) * 0.18,
          a: big ? (Math.random() * 0.25 + 0.6) : (Math.random() * 0.45 + 0.45),
          glow: big,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.022 + 0.012
        });
      }
    }

    var t = 0;
    function tick() {
      var w = canvas.width / window.devicePixelRatio;
      var h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);
      t += 1;
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        var twinkle = 0.5 + 0.5 * Math.sin(t * p.speed + p.phase);
        ctx.save();
        if (p.glow) {
          ctx.shadowColor = 'rgba(231,200,119,0.9)';
          ctx.shadowBlur = p.r * 3.5;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(231,205,140,' + (p.a * twinkle) + ')';
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) tick();
  }

  /* ---------- Hero parallax — subtle translateY on scroll ---------- */
  function initHeroParallax() {
    var hero = document.getElementById('hero');
    var layer = document.getElementById('hero-parallax');
    if (!hero || !layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    function update() {
      var rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var offset = Math.max(0, -rect.top) * 0.18;
        layer.style.transform = 'translateY(' + offset + 'px)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
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

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var wrap = item.querySelector('.faq-a-wrap');
      if (!btn || !wrap) return;

      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        items.forEach(function (other) {
          if (other === item) return;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a-wrap').style.height = '0px';
        });

        if (isOpen) {
          btn.setAttribute('aria-expanded', 'false');
          wrap.style.height = '0px';
        } else {
          btn.setAttribute('aria-expanded', 'true');
          wrap.style.height = wrap.scrollHeight + 'px';
        }
      });
    });

    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        var btn = item.querySelector('.faq-q');
        var wrap = item.querySelector('.faq-a-wrap');
        if (btn.getAttribute('aria-expanded') === 'true') {
          wrap.style.height = wrap.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- Magnetic tilt on package / service cards ---------- */
  function initCardTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = document.querySelectorAll('.pkg-card, .amb-card');
    cards.forEach(function (card) {
      var raf = null;

      function onMove(e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width;
          var py = (e.clientY - rect.top) / rect.height;
          var ry = (px - 0.5) * 10;
          var rx = (0.5 - py) * 8;
          card.style.transition = 'transform .08s linear';
          card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
          raf = null;
        });
      }
      function onLeave() {
        card.style.transition = 'transform .6s ' + 'cubic-bezier(.22,.9,.25,1)';
        card.style.transform = '';
      }

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
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

  /* ---------- Messenger links (floating button, contact card, footer) ---------- */
  function initMessengerLinks() {
    document.querySelectorAll('.js-messenger-link').forEach(function (a) {
      a.setAttribute('href', MESSENGER_URL);
    });
  }

  /* ---------- Facebook links (botón "Agenda tu Sesión") ---------- */
  function initFacebookLinks() {
    document.querySelectorAll('.js-fb-link').forEach(function (a) {
      a.setAttribute('href', FACEBOOK_URL);
    });
  }

  /* ---------- Contact form → Messenger ----------
     Messenger deep links (m.me) can't carry a prefilled message like wa.me
     did, so the composed text is copied to the clipboard and Messenger opens
     for the visitor to paste it in. ---------- */
  function initContactForm() {
    var form = document.getElementById('messenger-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';
      var text = 'Hola, soy ' + name + '. Me interesa una sesión de: ' + interest + '.\n' + msg;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
      window.open(MESSENGER_URL, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Footer year ---------- */
  function initFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
