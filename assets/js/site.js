/* Pierre Becq Antiquaire — maquette « Salle blanche »
   Animations : GSAP (ScrollTrigger, SplitText, CustomEase), Lenis, OGL. */
(function () {
  'use strict';

  var D = window.PB_DATA || { objets: {}, i18n: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var meta = function (n) { var m = document.querySelector('meta[name="' + n + '"]'); return m ? m.content : ''; };
  var PAGE = meta('pb-page');
  var LANG = meta('pb-lang') || 'fr';
  var TX = (D.i18n && D.i18n[LANG]) || {};
  var html = document.documentElement;
  html.lang = LANG;
  var YEAR = new Date().getFullYear();

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  };
  var sess = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) { } }
  };

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCED = mqReduce.matches || store.get('pb-motion') === 'reduced';
  html.classList.toggle('is-reduced', REDUCED);
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = window.gsap;
  var HAS = !!(G && window.ScrollTrigger);
  var lenis = null;

  if (HAS) {
    G.registerPlugin(ScrollTrigger);
    if (window.SplitText) G.registerPlugin(SplitText);
    if (window.CustomEase) {
      G.registerPlugin(CustomEase);
      CustomEase.create('pbInOut', '0.76,0,0.24,1');
      CustomEase.create('pbOut', '0.16,1,0.3,1');
    }
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (REDUCED) G.globalTimeline.timeScale(20);
  }
  var EIO = window.CustomEase ? 'pbInOut' : 'power4.inOut';
  var EO = window.CustomEase ? 'pbOut' : 'expo.out';

  function fmt(n) { var s = String(Math.round(n * 2) / 2); return LANG === 'fr' ? s.replace('.', ',') : s; }
  function mix(a, b, t) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    var g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    var bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }
  var PLASTER = '#F2EEE7';

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 1800);
  }

  /* ---------- year spans ---------- */
  $$('[data-year]').forEach(function (e) { e.textContent = YEAR; });

  /* ---------- motion toggle ---------- */
  $$('[data-motion-toggle]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(REDUCED));
    b.title = REDUCED ? TX.motionOn : TX.motionOff;
    b.addEventListener('click', function () {
      store.set('pb-motion', REDUCED ? 'full' : 'reduced');
      location.reload();
    });
  });

  /* ---------- menu ---------- */
  (function () {
    var menu = $('#menu'), open = $('[data-menu-open]'), close = $('[data-menu-close]');
    if (!menu || !open) return;
    menu.setAttribute('data-lenis-prevent', '');
    function set(on) {
      menu.classList.toggle('is-open', on);
      open.setAttribute('aria-expanded', String(on));
      html.classList.toggle('verrou', on);
      $$('body > main, body > footer, body > .skip').forEach(function (x) { x.inert = on; });
      if (lenis) { on ? lenis.stop() : lenis.start(); }
      if (on) {
        (close || menu).focus();
        if (HAS && !REDUCED) G.fromTo($$('nav a', menu), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .8, ease: EO, stagger: .06, delay: .2 });
      } else open.focus();
    }
    open.addEventListener('click', function () { set(true); });
    if (close) close.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { set(false); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled])', menu), i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted && menu.classList.contains('is-open')) set(false); });
  })();

  /* ---------- smooth scroll ---------- */
  if (HAS && !REDUCED && window.Lenis) {
    lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -90, duration: 1.4 });
    else target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + id);
  });

  /* ---------- header ---------- */
  (function () {
    var hdr = $('#hdr'); if (!hdr) return;
    var top = $('main > section:first-child');
    if (top && top.classList.contains('phero--full')) html.classList.add('dark-top');
    var last = 0;
    function onScroll(y) {
      hdr.classList.toggle('is-scrolled', y > 10);
      if (y > 320 && y > last + 4) hdr.classList.add('is-hidden');
      else if (y < last - 4 || y < 320) hdr.classList.remove('is-hidden');
      last = y;
    }
    if (lenis) lenis.on('scroll', function (l) { onScroll(l.scroll); });
    else window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });
    onScroll(window.scrollY);
  })();

  /* ---------- page transitions (veil) ---------- */
  var veil = $('.veil');
  (function () {
    if (!veil) return;
    var title = $('[data-veil-title]', veil);
    function hideVeil(instant) {
      sess.del('pb-veil');
      if (!html.classList.contains('veil-on')) return;
      if (!HAS || REDUCED || instant) { html.classList.remove('veil-on'); return; }
      G.fromTo(veil, { yPercent: 0 }, { yPercent: -100, duration: .95, ease: EIO, delay: .15, onComplete: function () { html.classList.remove('veil-on'); G.set(veil, { clearProps: 'transform' }); } });
    }
    hideVeil(false);
    window.addEventListener('pageshow', function (e) { if (e.persisted) { html.classList.remove('veil-on'); if (HAS) G.set(veil, { clearProps: 'transform' }); } });

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(tel|mailto|sms|javascript):/i.test(href)) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (er) { return; }
      if (url.origin !== location.origin) return;
      var norm = function (p) { return p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, ''); };
      if (norm(url.pathname) === norm(location.pathname) && url.search === location.search) {
        if (url.hash) { if (url.pathname !== location.pathname) { e.preventDefault(); history.replaceState(null, '', url.hash); var t = document.getElementById(decodeURIComponent(url.hash.slice(1))); if (t) (lenis ? lenis.scrollTo(t) : t.scrollIntoView()); } return; }
        e.preventDefault(); if (lenis) lenis.scrollTo(0); else window.scrollTo(0, 0); return;
      }
      if (REDUCED || !HAS) return;
      e.preventDefault();
      var label = (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim();
      if (title) title.textContent = label.length > 2 && label.length < 46 ? label : 'Pierre Becq';
      sess.set('pb-veil', '1');
      G.fromTo(veil, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: EIO, onComplete: function () { location.href = url.href; } });
    });
  })();

  /* ---------- cursor ---------- */
  (function () {
    var c = $('.cursor');
    if (!c || !FINE || REDUCED || !HAS) return;
    html.classList.add('has-cursor');
    var dot = $('.cursor-dot', c), ring = $('.cursor-ring', c), lab = $('[data-cursor-label]', c);
    var dx = G.quickTo(dot, 'x', { duration: .08 }), dy = G.quickTo(dot, 'y', { duration: .08 });
    var rx = G.quickTo(ring, 'x', { duration: .45, ease: 'power3' }), ry = G.quickTo(ring, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); c.style.opacity = 1; }, { passive: true });
    document.addEventListener('pointerleave', function () { c.style.opacity = 0; });
    document.addEventListener('pointerover', function (e) {
      var t = e.target;
      var lbl = t.closest('[data-cursor]');
      var ln = t.closest('a, button, label.choice, .chip, [data-copy]');
      if (lbl && lbl.getAttribute('data-cursor')) { lab.textContent = lbl.getAttribute('data-cursor'); c.classList.add('is-label'); c.classList.remove('is-link'); }
      else { c.classList.remove('is-label'); c.classList.toggle('is-link', !!ln); }
    });
  })();

  /* ---------- magnetic + tilt ---------- */
  if (FINE && !REDUCED && HAS) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        G.to(el, { x: (e.clientX - r.left - r.width / 2) * .28, y: (e.clientY - r.top - r.height / 2) * .38, duration: .6, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', function () { G.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .45)' }); });
    });
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        G.to(el, { rotateY: px * 9, rotateX: -py * 7, transformPerspective: 1000, duration: .6, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', function () { G.to(el, { rotateX: 0, rotateY: 0, duration: .9, ease: 'power3.out' }); });
    });
  }

  /* ---------- typing (cartels) ---------- */
  function typeText(el, text, delay) {
    if (!el) return;
    if (!HAS || REDUCED) { el.textContent = text; return; }
    var o = { n: 0 };
    el.textContent = '';
    return G.to(o, {
      n: text.length, duration: Math.min(1.1, .25 + text.length * .016), delay: delay || 0, ease: 'none',
      onUpdate: function () { var n = Math.round(o.n); el.textContent = text.slice(0, n) + (n < text.length ? '_' : ''); },
      onComplete: function () { el.textContent = text; }
    });
  }
  function typeCartel(card) {
    if (!card || card._typed) return; card._typed = true;
    $$('.cartel > span:not(.cartel-title):not(.cartel-foot):not(.piece-idx)', card).forEach(function (s, i) { typeText(s, s.textContent, .1 + i * .18); });
  }

  /* ---------- cotes (real dimensions as engineer's dimension lines) ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function setupCotes(photoEl) {
    if (photoEl._cotes !== undefined) return photoEl._cotes;
    var dims = null;
    try { dims = JSON.parse(photoEl.getAttribute('data-dims') || 'null'); } catch (e) { }
    if (!dims) { photoEl._cotes = null; return null; }
    var host = photoEl.parentElement;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'cotes'); svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute'; svg.style.inset = 'auto';
    host.appendChild(svg);
    function mk(tag, cls) { var e = document.createElementNS(NS, tag); if (cls) e.setAttribute('class', cls); svg.appendChild(e); return e; }
    var parts = [];
    var wv = dims.l != null ? dims.l : dims.d;
    var wp = dims.l != null ? (LANG === 'fr' ? 'l' : 'W') : 'Ø';
    function part(kind, value, prefix) {
      var g = { kind: kind, value: value, prefix: prefix, line: mk('line'), e1: mk('line', 'ext'), e2: mk('line', 'ext'), t1: mk('path', 'tick'), t2: mk('path', 'tick') };
      g.label = document.createElement('span'); g.label.className = 'cote-label' + (kind === 'h' ? ' cote-label--v' : '');
      g.label.textContent = prefix + ' ' + fmt(value) + ' cm';
      host.appendChild(g.label);
      parts.push(g);
    }
    if (wv != null) part('w', wv, wp);
    if (dims.h != null) part('h', dims.h, 'H');
    function L(e, x1, y1, x2, y2) { e.setAttribute('x1', x1); e.setAttribute('y1', y1); e.setAttribute('x2', x2); e.setAttribute('y2', y2); }
    function T(e, x, y) { e.setAttribute('d', 'M' + (x - 4) + ' ' + (y + 4) + 'L' + (x + 4) + ' ' + (y - 4)); }
    var api = { parts: parts, drawn: false };
    api.layout = function () {
      var W = photoEl.offsetWidth, H = photoEl.offsetHeight; if (!W || !H) return;
      var ox = photoEl.offsetLeft, oy = photoEl.offsetTop;
      svg.style.left = ox + 'px'; svg.style.top = oy + 'px'; svg.style.width = W + 'px'; svg.style.height = H + 'px';
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var bb = (photoEl.getAttribute('data-bbox') || '0,0,1,1').split(',').map(Number);
      var bx = bb[0] * W, by = bb[1] * H, bw = bb[2] * W, bh = bb[3] * H;
      var gap = Math.max(10, Math.min(18, Math.min(W, H) * .045));
      parts.forEach(function (g) {
        if (g.kind === 'w') {
          var y = by + bh + gap; if (y > H - 8) y = Math.max(by + bh, H) + gap;
          L(g.line, bx, y, bx + bw, y); L(g.e1, bx, by + bh + 3, bx, y + 6); L(g.e2, bx + bw, by + bh + 3, bx + bw, y + 6);
          T(g.t1, bx, y); T(g.t2, bx + bw, y);
          g.label.style.left = (ox + bx + bw / 2) + 'px'; g.label.style.top = (oy + y) + 'px';
          g.len = bw;
        } else {
          var x = bx + bw + gap; if (x > W - 8) x = Math.max(bx + bw, W) + gap;
          L(g.line, x, by, x, by + bh); L(g.e1, bx + bw + 3, by, x + 6, by); L(g.e2, bx + bw + 3, by + bh, x + 6, by + bh);
          T(g.t1, x, by); T(g.t2, x, by + bh);
          g.label.style.left = (ox + x) + 'px'; g.label.style.top = (oy + by + bh / 2) + 'px';
          g.len = bh;
        }
        g.line.style.strokeDasharray = g.len + ' ' + g.len;
        if (!api.drawn) g.line.style.strokeDashoffset = g.len;
      });
    };
    api.hide = function () {
      api.drawn = false;
      parts.forEach(function (g) {
        g.line.style.strokeDashoffset = g.len || 9999;
        [g.e1, g.e2, g.t1, g.t2, g.label].forEach(function (e) { e.style.opacity = 0; });
      });
    };
    api.draw = function (delay) {
      api.layout();
      api.drawn = true;
      if (!HAS || REDUCED) {
        parts.forEach(function (g) { g.line.style.strokeDashoffset = 0; [g.e1, g.e2, g.t1, g.t2, g.label].forEach(function (e) { e.style.opacity = 1; }); });
        return;
      }
      parts.forEach(function (g, i) {
        var d = (delay || 0) + i * .18;
        G.fromTo(g.line, { strokeDashoffset: g.len }, { strokeDashoffset: 0, duration: 1.1, ease: EIO, delay: d });
        G.fromTo([g.e1, g.e2], { opacity: 0 }, { opacity: 1, duration: .5, delay: d });
        G.fromTo([g.t1, g.t2], { opacity: 0 }, { opacity: 1, duration: .3, delay: d + .8 });
        var o = { v: 0 };
        G.fromTo(g.label, { opacity: 0 }, { opacity: 1, duration: .4, delay: d + .35 });
        G.to(o, { v: g.value, duration: 1, delay: d + .35, ease: 'power2.out', onUpdate: function () { g.label.textContent = g.prefix + ' ' + fmt(o.v) + ' cm'; } });
      });
    };
    api.hide();
    if (window.ResizeObserver) new ResizeObserver(function () { api.layout(); if (api.drawn) parts.forEach(function (g) { if (!G || !G.isTweening(g.line)) g.line.style.strokeDashoffset = 0; }); }).observe(photoEl);
    api.layout();
    photoEl._cotes = api;
    return api;
  }
  function drawCotes(photoEl, delay) { var c = photoEl && setupCotes(photoEl); if (c) c.draw(delay); }

  /* ---------- etch (« verre gravé ») reveals ---------- */
  function etchLayers(host) {
    var ov = $(':scope > .etch', host);
    if (!ov) { ov = document.createElement('div'); ov.className = 'etch'; ov.setAttribute('aria-hidden', 'true'); ov.innerHTML = '<i></i><i></i><i></i>'; host.appendChild(ov); }
    var cols = ['#DAD3C6', '#E8E2D8', '#F7F4EF'];
    $$('i', ov).forEach(function (l, i) { l.style.background = cols[i]; });
    return ov;
  }
  function etchReveal(el, opts) {
    opts = opts || {};
    if (!HAS || REDUCED) return;
    var ov = etchLayers(el);
    var layers = $$('i', ov);
    var img = $('img', el);
    ov.style.display = 'block';
    G.set(layers, { clipPath: 'inset(0% 0% 0% 0%)' });
    var tl = G.timeline({ paused: true, onComplete: function () { ov.style.display = 'none'; } });
    tl.to(layers, { clipPath: function (i) { return ['inset(0% 0% 100% 0%)', 'inset(100% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'][i]; }, duration: 1.2, ease: EIO, stagger: .13 });
    if (img && !el.hasAttribute('data-parallax-inner')) tl.from(img, { scale: 1.14, duration: 1.8, ease: EO }, .1);
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () { tl.play(); } });
  }

  /* ---------- generic scroll effects ---------- */
  function initReveals() {
    if (!HAS) return;
    if (window.SplitText && !REDUCED) {
      $$('[data-split]').forEach(function (el) {
        SplitText.create(el, { aria: 'none',
          type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
          onSplit: function (self) {
            return G.from(self.lines, { yPercent: 115, duration: 1.15, ease: EO, stagger: .09, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
          }
        });
      });
    }
    if (REDUCED) return;
    $$('[data-reveal]').forEach(function (el) {
      if (el.closest('[data-salle-track]') || el.matches('.public, .lp')) return;
      G.from(el, { y: 26, autoAlpha: 0, duration: 1.05, ease: EO, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    $$('[data-etch]').forEach(function (el) { if (!el.closest('[data-salle-track]')) etchReveal(el); });
    $$('[data-parallax]').forEach(function (el) {
      var v = parseFloat(el.getAttribute('data-parallax')) || -8;
      G.fromTo(el, { yPercent: -v / 2 }, { yPercent: v / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-parallax-inner]').forEach(function (el) {
      var img = $('img', el); if (!img) return;
      G.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-parallax-img]').forEach(function (img) {
      G.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-steps-line]').forEach(function (line) {
      var vertical = line.offsetHeight > line.offsetWidth;
      var p = {}; p[vertical ? 'scaleY' : 'scaleX'] = 0;
      var q = {}; q[vertical ? 'scaleY' : 'scaleX'] = 1; q.ease = 'none';
      q.scrollTrigger = { trigger: line.parentElement, start: 'top 82%', end: 'bottom 62%', scrub: .6 };
      G.fromTo(line, p, q);
    });
    $$('.public, .lp').forEach(function (el, i) {
      G.from(el, { y: 70, autoAlpha: 0, duration: 1.2, ease: EO, delay: (i % 3) * .1, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  }

  /* cotes on piece cards outside horizontal tracks, and obj page */
  function initStaticCotes() {
    $$('[data-cotes]').forEach(function (ph) {
      if (ph.closest('[data-salle-track]') || ph.closest('[data-hero-item]') || ph.closest('[data-slide]')) return;
      setupCotes(ph);
      if (!HAS) { drawCotes(ph); return; }
      ScrollTrigger.create({ trigger: ph, start: 'top 85%', once: true, onEnter: function () { drawCotes(ph, .2); typeCartel(ph.closest('.piece-card')); } });
    });
  }

  /* ---------- open now ---------- */
  function openNow() {
    var h = D.maison && D.maison.horaires;
    $$('[data-open-now]').forEach(function (el) {
      if (!h) { el.innerHTML = '<i class="dot dot--tbc"></i>' + TX.horairesTbc; return; }
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: D.maison.fuseau || 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var wd = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[parts.find(function (p) { return p.type === 'weekday'; }).value];
      var hh = parts.find(function (p) { return p.type === 'hour'; }).value, mm = parts.find(function (p) { return p.type === 'minute'; }).value;
      var now = hh + ':' + mm, open = false;
      (h[wd] || []).forEach(function (r) { if (now >= r[0] && now < r[1]) open = true; });
      el.innerHTML = open ? '<i class="dot"></i>' + TX.ouvert : '<i class="dot dot--off"></i>' + TX.ferme;
    });
  }
  openNow();

  /* ---------- copy buttons ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    var v = b.getAttribute('data-copy');
    function fallback() {
      var s = b.previousElementSibling;
      if (s) { var r = document.createRange(); r.selectNodeContents(s); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    }
    try {
      navigator.clipboard.writeText(v).then(function () { toast(TX.copie + (document.documentElement.lang === 'fr' ? '\u00a0: ' : ': ') + v); }, fallback);
    } catch (er) { fallback(); }
  });

  /* ---------- sphère armillaire ---------- */
  function sphere(svg) {
    var R = 92, n = function (t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; };
    n('circle', { r: R, class: 'ring-strong' });
    var mer = [0, 1, 2].map(function () { return n('ellipse', { rx: R, ry: R }); });
    var g = document.createElementNS(NS, 'g'); svg.appendChild(g);
    var eq = document.createElementNS(NS, 'ellipse'); eq.setAttribute('rx', R); eq.setAttribute('ry', R * .2); g.appendChild(eq);
    var b1 = document.createElementNS(NS, 'ellipse'); b1.setAttribute('class', 'band'); b1.setAttribute('rx', R); g.appendChild(b1);
    var b2 = document.createElementNS(NS, 'ellipse'); b2.setAttribute('class', 'band'); b2.setAttribute('rx', R * .97); g.appendChild(b2);
    n('line', { x1: 0, y1: -R - 16, x2: 0, y2: R + 16 });
    n('circle', { r: 9, class: 'globe' });
    n('path', { d: 'M0 ' + (R + 16) + ' L0 ' + (R + 24) + ' M-22 ' + (R + 26) + ' L22 ' + (R + 26) });
    function set(th) {
      mer.forEach(function (m, i) { m.setAttribute('rx', Math.abs(Math.cos(th + i * Math.PI / 3)) * R); });
      var tilt = 23.44;
      g.setAttribute('transform', 'rotate(' + (-tilt) + ')');
      eq.setAttribute('ry', R * (.18 + .06 * Math.sin(th)));
      b1.setAttribute('ry', R * (.3 + .12 * Math.cos(th * .8)));
      b2.setAttribute('ry', R * (.3 + .12 * Math.cos(th * .8)) - 5);
      b1.setAttribute('transform', 'rotate(' + (40 + Math.sin(th) * 8) + ')');
      b2.setAttribute('transform', 'rotate(' + (40 + Math.sin(th) * 8) + ')');
    }
    set(.6);
    if (!HAS || REDUCED) return;
    var state = { th: .6, spin: 0 };
    G.to(state, { spin: Math.PI * 2, duration: 40, repeat: -1, ease: 'none', onUpdate: function () { set(state.th + state.spin); } });
    G.to(state, { th: .6 + Math.PI * 3, ease: 'none', scrollTrigger: { trigger: svg.closest('section') || svg, start: 'top bottom', end: 'bottom top', scrub: .8 } });
  }

  function yearRoll() {
    $$('[data-year-roll]').forEach(function (el) {
      var from = +el.getAttribute('data-from') || 1969;
      if (!HAS || REDUCED) { return; }
      var o = { v: from };
      G.to(o, { v: YEAR, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top 70%', end: 'center 30%', scrub: .5 }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
    $$('[data-years-count]').forEach(function (el) {
      var v = YEAR - 1969; el.textContent = v;
      if (!HAS || REDUCED) return;
      var o = { v: 0 };
      G.to(o, { v: v, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  /* ---------- carte schématique ---------- */
  function buildMap(svg) {
    var M = D.map; if (!M) return;
    var lat0 = 48.5, lat1 = 49.74, lon0 = 4.95, lon1 = 7.2;
    var k = Math.cos(49 * Math.PI / 180);
    var W = 800, H = W * (lat1 - lat0) / ((lon1 - lon0) * k);
    var px = function (lat, lon) { return [(lon - lon0) / (lon1 - lon0) * W, (lat1 - lat) / (lat1 - lat0) * H]; };
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Math.round(H));
    var n = function (t, a, parent) { var e = document.createElementNS(NS, t); for (var x in a) e.setAttribute(x, a[x]); (parent || svg).appendChild(e); return e; };
    for (var la = 48.5; la <= 49.74; la += .25) {
      var y = px(la, lon0)[1];
      n('line', { x1: 0, y1: y, x2: W, y2: y, class: 'grat' });
      if (la % .5 === 0) { var t = n('text', { x: 4, y: y - 4, class: 'grat-label' }); t.textContent = la.toFixed(1).replace('.', LANG === 'fr' ? ',' : '.') + '°N'; }
    }
    for (var lo = 5; lo <= 7.2; lo += .25) {
      var x = px(lat0, lo)[0];
      n('line', { x1: x, y1: 0, x2: x, y2: H, class: 'grat' });
      if (lo % .5 === 0) { var t2 = n('text', { x: x + 4, y: H - 6, class: 'grat-label' }); t2.textContent = lo.toFixed(1).replace('.', LANG === 'fr' ? ',' : '.') + '°E'; }
    }
    var pts = M.moselle.map(function (p) { return px(p[0], p[1]); });
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6) + ',' + (p2[0] - (p3[0] - p1[0]) / 6) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6) + ',' + p2[0] + ' ' + p2[1];
    }
    var river = n('path', { d: d, class: 'river' });
    var rl = px(49.27, 6.2); var rlt = n('text', { x: rl[0] + 12, y: rl[1], class: 'river-label' }); rlt.textContent = 'la Moselle';
    var pins = {}; M.pins.forEach(function (p) { pins[p.id] = p; });
    var metz = pins.metz;
    function km(a, b) { var R = 6371, dl = (b.lat - a.lat) * Math.PI / 180, dn = (b.lon - a.lon) * Math.PI / 180; var h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dn / 2) * Math.sin(dn / 2); return Math.round(2 * R * Math.asin(Math.sqrt(h))); }
    var routes = [];
    ['lux', 'senon', 'nancy'].forEach(function (id) {
      var a = px(metz.lat, metz.lon), b = px(pins[id].lat, pins[id].lon);
      routes.push(n('path', { d: 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], class: 'route' }));
      var mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      var tx = n('text', { x: mid[0] + (id === 'senon' ? -6 : 8), y: mid[1] - 6, class: 'pin-sub', 'text-anchor': id === 'senon' ? 'end' : 'start' });
      tx.textContent = km(metz, pins[id]) + ' km';
    });
    var pinEls = M.pins.map(function (p) {
      var c = px(p.lat, p.lon);
      var g = n('g', { class: 'pin' + (p.main ? ' pin--main' : ''), transform: 'translate(' + c[0] + ' ' + c[1] + ')' });
      if (p.main) n('circle', { r: 9, class: 'pulse' }, g);
      n('circle', { r: 8 }, g); n('circle', { r: 3.4, class: 'core' }, g);
      var left = p.id === 'senon';
      var lb = n('text', { x: left ? -14 : 14, y: 6, class: 'pin-label', 'text-anchor': left ? 'end' : 'start' }, g); lb.textContent = p.label;
      if (p.sub) { var sb = n('text', { x: left ? -14 : 14, y: 22, class: 'pin-sub', 'text-anchor': left ? 'end' : 'start' }, g); sb.textContent = p.sub; }
      return g;
    });
    var note = n('text', { x: W - 6, y: 16, class: 'grat-label', 'text-anchor': 'end' }); note.textContent = LANG === 'fr' ? 'distances à vol d’oiseau' : 'straight-line distances';
    if (!HAS || REDUCED) return;
    var len = river.getTotalLength();
    river.style.strokeDasharray = len; river.style.strokeDashoffset = len;
    var tl = G.timeline({ scrollTrigger: { trigger: svg, start: 'top 80%', once: true } });
    tl.to(river, { strokeDashoffset: 0, duration: 2.2, ease: EIO })
      .from(pinEls, { scale: 0, transformOrigin: 'center', opacity: 0, duration: .6, ease: 'back.out(2)', stagger: .12 }, .9)
      .from(routes, { opacity: 0, duration: .8, stagger: .1 }, 1.3)
      .from(rlt, { opacity: 0, x: -10, duration: .8 }, 1.4);
  }

  /* ---------- footer cote ---------- */
  function footerCote() {
    var el = $('[data-ftr-cote]'); if (!el) return;
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'cotes'); svg.setAttribute('aria-hidden', 'true');
    svg.style.inset = 'auto 0 -34px 0'; svg.style.height = '30px'; svg.style.width = '100%';
    el.appendChild(svg);
    var lab = document.createElement('span'); lab.className = 'cote-label'; lab.textContent = '1969 — ' + YEAR; el.appendChild(lab);
    var line = document.createElementNS(NS, 'line'), t1 = document.createElementNS(NS, 'path'), t2 = document.createElementNS(NS, 'path');
    [line, t1, t2].forEach(function (e) { svg.appendChild(e); });
    function lay() {
      var w = el.offsetWidth; svg.setAttribute('viewBox', '0 0 ' + w + ' 30');
      line.setAttribute('x1', 0); line.setAttribute('x2', w); line.setAttribute('y1', 15); line.setAttribute('y2', 15);
      t1.setAttribute('d', 'M-4 19L4 11'); t2.setAttribute('d', 'M' + (w - 4) + ' 19L' + (w + 4) + ' 11');
      lab.style.left = w / 2 + 'px'; lab.style.top = 'calc(100% + 19px)';
      line.style.strokeDasharray = w + ' ' + w;
      return w;
    }
    var w = lay(); window.addEventListener('resize', lay);
    if (!HAS || REDUCED) return;
    line.style.strokeDashoffset = w;
    G.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      .to(line, { strokeDashoffset: 0, duration: 1.4, ease: EIO })
      .from([t1, t2, lab], { opacity: 0, duration: .5 }, .9);
    var name = $('.ftr-name', el);
    if (window.SplitText && name) {
      var st = SplitText.create(name, { type: 'chars', mask: 'chars', aria: 'none' });
      G.from(st.chars, { yPercent: 100, duration: 1.1, ease: EO, stagger: .035, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    }
  }

  /* ---------- marquee ---------- */
  function marquee() {
    $$('[data-marquee]').forEach(function (m) {
      var track = $('.marquee-track', m);
      if (!HAS || REDUCED) return;
      var tw = G.to(track, { xPercent: -50, duration: 38, repeat: -1, ease: 'none' });
      ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top', onUpdate: function (self) {
        var v = self.getVelocity() / 300;
        G.to(tw, { timeScale: (self.direction || 1) * Math.max(1, Math.min(6, Math.abs(v))), duration: .3, overwrite: true });
        G.to(tw, { timeScale: self.direction || 1, duration: 1.2, delay: .3, overwrite: false });
      } });
    });
  }

  /* ---------- horizontal salles ---------- */
  function tint(sec, color) {
    var c = mix(PLASTER, color || PLASTER, .12);
    if (HAS && !REDUCED) G.to(sec, { '--wall': c, duration: 1, ease: 'power2.out', overwrite: 'auto' });
    else sec.style.setProperty('--wall', c);
  }
  function buildTape(sec, n) {
    var svg = $('[data-tape]', sec); if (!svg) return function () { };
    var lab = $('[data-tape-label]', sec), ptr = $('.tape-pointer', sec);
    var W = 1000;
    svg.setAttribute('viewBox', '0 0 ' + W + ' 26');
    var s = '';
    for (var i = 0; i <= 100; i++) {
      var x = i / 100 * W, major = i % 10 === 0;
      s += '<line x1="' + x + '" x2="' + x + '" y1="' + (major ? 2 : 12) + '" y2="22" class="' + (major ? '' : 't-minor') + '"/>';
    }
    s += '<line x1="0" x2="' + W + '" y1="22" y2="22"/>';
    svg.innerHTML = s;
    return function (p) {
      var w = svg.getBoundingClientRect().width;
      if (ptr) ptr.style.transform = 'translateX(' + (p * w) + 'px)';
      if (lab) lab.textContent = String(Math.min(n, Math.floor(p * n) + 1)).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    };
  }
  function salles() {
    var desktop = window.matchMedia('(min-width: 861px)').matches;
    var list = [];
    $$('[data-salle]').forEach(function (sec) {
      var vp = $('[data-salle-viewport]', sec), track = $('[data-salle-track]', sec), pin = $('[data-salle-pin]', sec) || vp;
      if (!vp || !track) return;
      var cards = $$('.piece-card', track);
      if (cards[0]) sec.style.setProperty('--wall', mix(PLASTER, cards[0].getAttribute('data-color'), .12));
      if (!HAS || REDUCED || !desktop) {
        sec.classList.add('is-native');
        var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (ents) {
          ents.forEach(function (en) {
            if (!en.isIntersecting) return;
            var card = en.target;
            tint(sec, card.getAttribute('data-color'));
            $$('[data-cotes]', card).forEach(function (ph) { drawCotes(ph); });
            typeCartel(card);
          });
        }, { root: vp, threshold: .6 }) : null;
        cards.forEach(function (c) { if (io) io.observe(c); else $$('[data-cotes]', c).forEach(function (ph) { drawCotes(ph); }); });
        return;
      }
      var dist = function () { return Math.max(0, track.scrollWidth - document.documentElement.clientWidth); };
      if (dist() < 80) {
        sec.classList.add('is-static');
        cards.forEach(function (card) {
          ScrollTrigger.create({ trigger: card, start: 'top 70%', onEnter: function () { tint(sec, card.getAttribute('data-color')); } });
          G.from([$('.vitrine', card), $('.cartel', card)], { y: 70, autoAlpha: 0, duration: 1.1, ease: EO, stagger: .12, scrollTrigger: { trigger: card, start: 'top 90%', once: true, onEnter: function () { $$('[data-cotes]', card).forEach(function (ph) { drawCotes(ph, .45); }); typeCartel(card); } } });
        });
        return;
      }
      var update = buildTape(sec, cards.length);
      var tween = G.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: pin, start: 'center center', end: function () { return '+=' + dist(); }, pin: true, scrub: .7, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: function (self) { update(self.progress); } }
      });
      update(0);
      sec.classList.add('is-pinned');
      track.addEventListener('focusin', function (e) {
        var card = e.target.closest('.piece-card, .salle-end'); if (!card) return;
        var st = tween.scrollTrigger, d = dist(); if (!st || !d) return;
        vp.scrollLeft = 0;
        var y = st.start + Math.max(0, Math.min(1, (card.offsetLeft - window.innerWidth * .2) / d)) * (st.end - st.start);
        if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      });
      cards.forEach(function (card) {
        var vit = $('.vitrine', card);
        ScrollTrigger.create({ trigger: card, containerAnimation: tween, start: 'left 62%', end: 'right 38%', onToggle: function (self) { if (self.isActive) tint(sec, card.getAttribute('data-color')); } });
        var inView = card.offsetLeft < document.documentElement.clientWidth * .92;
        var trig = inView ? { trigger: pin, start: 'top 82%', once: true } : { trigger: card, containerAnimation: tween, start: 'left 96%', once: true };
        var tl = G.timeline({ scrollTrigger: trig, delay: inView ? cards.indexOf(card) * .12 : 0 });
        tl.from(vit, { y: 90, autoAlpha: 0, duration: 1.1, ease: EO })
          .from($('.cartel', card), { y: 30, autoAlpha: 0, duration: 1, ease: EO }, .15)
          .add(function () { $$('[data-cotes]', card).forEach(function (ph) { drawCotes(ph, .1); }); typeCartel(card); }, .4);
      });
      list.push({ sec: sec, tween: tween });
    });
    return list;
  }

  /* ---------- galerie filters ---------- */
  function filters() {
    var bar = $('[data-filters]'); if (!bar) return;
    var fs = 'all', ft = 'all';
    var count = $('[data-count]', bar);
    function apply() {
      var total = 0;
      $$('[data-salle]').forEach(function (sec) {
        var id = sec.getAttribute('data-salle-id');
        var showSalle = fs === 'all' || fs === id;
        sec.hidden = !showSalle;
        var shown = 0;
        $$('.piece-card', sec).forEach(function (c) {
          var ok = showSalle && (ft === 'all' || c.getAttribute('data-type') === ft);
          if (ok) shown++;
          if (ok && c.hidden) {
            c.hidden = false;
            if (HAS) G.set([$('.vitrine', c), $('.cartel', c)], { autoAlpha: 1, y: 0 });
            if (HAS && !REDUCED) G.fromTo(c, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .7, ease: EO });
            $$('[data-cotes]', c).forEach(function (ph) { drawCotes(ph, .3); });
            typeCartel(c);
          }
          else if (!ok) c.hidden = true;
        });
        var empty = $('[data-empty]', sec); if (empty) empty.hidden = shown > 0;
        total += shown;
      });
      if (count) count.textContent = total;
      if (HAS) ScrollTrigger.refresh();
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      var grp = b.hasAttribute('data-f-salle') ? 'data-f-salle' : 'data-f-type';
      $$('[' + grp + ']', bar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (grp === 'data-f-salle') fs = b.getAttribute(grp); else ft = b.getAttribute(grp);
      apply();
      var first = $('[data-salle]:not([hidden])');
      if (first && fs !== 'all') { if (lenis) lenis.scrollTo(first, { offset: -130 }); else first.scrollIntoView(); }
    });
  }

  /* ---------- hero (home) ---------- */
  function hero() {
    var sec = $('[data-hero]'); if (!sec) return;
    var items = $$('[data-hero-item]', sec), dots = $$('[data-hero-dot]', sec);
    var etchEl = etchLayers($('.hero-frame', sec));
    var hc = { t: $('[data-hc-title]', sec), l: $('[data-hc-line]', sec), n: $('[data-hc-note]', sec) };
    var data = (D.hero || []).map(function (h) { var o = D.objets[h.slug]; return { court: o.court[LANG], line: o.epoque[LANG] + ' · ' + o.materiaux[LANG], note: h.note[LANG] }; });
    var cur = 0, busy = false;
    items.forEach(function (it) { setupCotes($('.photo', it)); });

    function setCartel(i) { typeText(hc.t, data[i].court, 0); typeText(hc.l, data[i].line, .2); typeText(hc.n, data[i].note, .45); }
    function go(i) {
      if (i === cur || busy || !items[i]) return;
      var from = items[cur], to = items[i];
      dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
      cur = i;
      function swap() {
        from.classList.remove('is-current'); from.setAttribute('aria-hidden', 'true'); from.tabIndex = -1;
        to.classList.add('is-current'); to.removeAttribute('aria-hidden'); to.removeAttribute('tabindex');
        var c = setupCotes($('.photo', from)); if (c) c.hide();
        setCartel(i);
      }
      if (!HAS || REDUCED) { swap(); drawCotes($('.photo', to)); return; }
      busy = true;
      var layers = $$('i', etchEl);
      etchEl.style.display = 'block';
      G.timeline({ onComplete: function () { busy = false; etchEl.style.display = 'none'; } })
        .fromTo(layers, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .55, ease: 'expo.in', stagger: .07 })
        .add(swap)
        .to(layers, { clipPath: 'inset(0% 0% 100% 0%)', duration: .8, ease: EO, stagger: .08 })
        .add(function () { drawCotes($('.photo', to)); }, '-=.55');
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { if (st) { var y = st.start + (k + .5) / items.length * (st.end - st.start); lenis ? lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo(0, y); } else { go(k); restart(); } }); });

    /* scroll-driven on desktop, timed elsewhere */
    var st = null, timer = null;
    function restart() { clearInterval(timer); if (REDUCED) return; timer = setInterval(function () { if (!document.hidden && !sec._hover) go((cur + 1) % items.length); }, 5200); }
    sec.addEventListener('pointerenter', function () { sec._hover = true; });
    sec.addEventListener('pointerleave', function () { sec._hover = false; });
    if (HAS && !REDUCED && window.matchMedia('(min-width: 961px)').matches) {
      st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: '+=110%', pin: true, anticipatePin: 1, onUpdate: function (self) { go(Math.min(items.length - 1, Math.floor(self.progress * items.length * .999))); } });
      G.to($('.hero-copy', sec), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: '+=110%', scrub: true } });
    } else restart();

    /* light: WebGL or CSS fallback */
    var img = $('.hero-img', sec) || $('.hero-bg img', sec);
    var canvas = $('[data-gl]', sec);
    var gl = initGL(canvas, img, sec);
    if (!gl) {
      sec.addEventListener('pointermove', function (e) { var r = sec.getBoundingClientRect(); sec.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100) + '%'); sec.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100) + '%'); });
    }

    /* intro */
    var first = !sess.get('pb-intro');
    sess.set('pb-intro', '1');
    var title = $('[data-hero-title]', sec);
    var els = $$('[data-hero-el]', sec);
    var piece = $('[data-hero-piece]', sec);
    var ph0 = $('.photo', items[0]);
    if (!HAS || REDUCED) { if (gl) gl.intro(1); drawCotes(ph0); return; }
    var sp = window.SplitText ? SplitText.create($$('.hl', title), { type: 'chars', mask: 'chars', aria: 'none' }) : null;
    var k = first ? 1 : .6;
    var tl = G.timeline({ delay: html.classList.contains('veil-on') ? .5 : .15 });
    if (gl) tl.add(gl.introTween(1.5 * k), 0);
    else tl.from($('.hero-bg', sec), { filter: 'brightness(.55)', duration: 1.4 * k, ease: 'power2.inOut' }, 0);
    if (sp) tl.from(sp.chars, { yPercent: 110, duration: 1.2 * k, ease: EO, stagger: .045 * k }, .5 * k);
    tl.from(els[0], { autoAlpha: 0, x: -20, duration: .9 * k, ease: EO }, .55 * k)
      .from(piece, { y: 120, autoAlpha: 0, duration: 1.3 * k, ease: EO }, .9 * k)
      .add(function () { drawCotes(ph0); setCartel(0); }, 1.4 * k)
      .from(els.slice(1), { y: 24, autoAlpha: 0, duration: 1 * k, ease: EO, stagger: .1 * k }, 1.15 * k)
      .from($('.hero-scroll', sec), { autoAlpha: 0, duration: .8 }, 1.8 * k);
  }

  /* ---------- WebGL showcase light (OGL) ---------- */
  function initGL(canvas, img, sec) {
    if (!canvas || !img || !window.OGL) return null;
    var O = window.OGL, renderer;
    try { renderer = new O.Renderer({ canvas: canvas, dpr: Math.min(1.5, window.devicePixelRatio || 1), alpha: false, antialias: false, powerPreference: 'low-power' }); } catch (e) { return null; }
    var gl = renderer.gl; if (!gl) return null;
    var vertex = 'attribute vec2 uv;attribute vec2 position;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}';
    var fragment = [
      'precision highp float;',
      'uniform sampler2D uTex;uniform vec2 uRes;uniform vec2 uTexRes;uniform vec2 uMouse;uniform float uIntro;uniform float uTime;',
      'varying vec2 vUv;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'void main(){',
      ' vec2 s=uRes/uTexRes; float sc=max(s.x,s.y); vec2 size=uTexRes*sc; vec2 off=(size-uRes)*.5;',
      ' vec2 uv=(vUv*uRes+off)/size; uv+=(uMouse-.5)*vec2(-.010,-.006)*uIntro;',
      ' vec3 col=texture2D(uTex,uv).rgb;',
      ' float a=uRes.x/uRes.y; vec2 p=vec2(vUv.x*a,vUv.y); vec2 m=vec2(uMouse.x*a,uMouse.y);',
      ' float d=distance(p,m); float spot=exp(-d*d*6.);',
      ' float on=smoothstep(0.,1.,uIntro);',
      ' float beam=smoothstep(.0,.9,1.-abs(vUv.x*.8-vUv.y*.6-.05)*2.2);',
      ' col*=mix(.34,1.,on);',
      ' col+=vec3(1.,.94,.84)*spot*.17*on;',
      ' col+=vec3(1.,.96,.9)*beam*.05*on;',
      ' float v=smoothstep(1.3,.3,length(vUv-vec2(.6,.5))); col*=mix(.84,1.,v);',
      ' col+=(hash(vUv*uRes+uTime)-.5)*.022;',
      ' gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');
    var tex = new O.Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
    var uni = { uTex: { value: tex }, uRes: { value: [1, 1] }, uTexRes: { value: [1, 1] }, uMouse: { value: [.68, .5] }, uIntro: { value: 0 }, uTime: { value: 0 } };
    var program;
    try { program = new O.Program(gl, { vertex: vertex, fragment: fragment, uniforms: uni }); } catch (e) { return null; }
    var mesh = new O.Mesh(gl, { geometry: new O.Triangle(gl), program: program });
    var ready = false, visible = true, target = [.68, .5], mouse = [.68, .5];
    function resize() { var r = canvas.parentElement.getBoundingClientRect(); renderer.setSize(r.width, r.height); uni.uRes.value = [r.width, r.height]; }
    function load() {
      var im = new Image();
      im.onload = function () { tex.image = im; uni.uTexRes.value = [im.naturalWidth, im.naturalHeight]; ready = true; html.classList.add('gl-ready'); };
      im.src = img.currentSrc || img.src;
    }
    if (img.complete && (img.currentSrc || img.src)) load(); else img.addEventListener('load', load, { once: true });
    resize(); window.addEventListener('resize', resize);
    sec.addEventListener('pointermove', function (e) { var r = sec.getBoundingClientRect(); target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(sec);
    var t0 = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!ready || !visible || document.hidden) return;
      var e = REDUCED ? 1 : .06;
      mouse[0] += (target[0] - mouse[0]) * e; mouse[1] += (target[1] - mouse[1]) * e;
      uni.uMouse.value = mouse; uni.uTime.value = ((now - t0) / 1000) % 100;
      renderer.render({ scene: mesh });
    }
    requestAnimationFrame(frame);
    return {
      intro: function (v) { uni.uIntro.value = v; },
      introTween: function (d) { return G.fromTo(uni.uIntro, { value: 0 }, { value: 1, duration: d, ease: 'power2.inOut' }); }
    };
  }

  /* ---------- objet page ---------- */
  function objetPage() {
    var root = $('[data-obj]'); if (!root) return;
    var slug = root.getAttribute('data-obj');
    var ob = D.objets[slug];
    if (ob) html.style.setProperty('--wall', mix(PLASTER, ob.color, .07));
    var main = $('[data-obj-main]', root);
    var slides = $$('[data-slide]', main), thumbs = $$('[data-thumb]', root);
    var etchEl = $('.etch', main);
    var cur = 0, busy = false;
    var first = $('.photo', slides[0]);
    setupCotes(first);
    setTimeout(function () { drawCotes(first, .3); }, html.classList.contains('veil-on') ? 900 : 300);
    $$('.specs dd', root).forEach(function (dd, i) { if (!dd.querySelector('.tbc, .dot')) typeText(dd, dd.textContent, .4 + i * .12); });

    function go(i) {
      if (i === cur || busy) return;
      var from = slides[cur], to = slides[i];
      thumbs.forEach(function (t, k) { t.setAttribute('aria-current', String(k === i)); });
      cur = i;
      function swap() { from.hidden = true; from.classList.remove('is-current'); to.hidden = false; to.classList.add('is-current'); if (i === 0) drawCotes(first); }
      if (!HAS || REDUCED) { swap(); return; }
      busy = true;
      var layers = $$('i', etchEl);
      $$('i', etchEl).forEach(function (l, k) { l.style.background = ['#DAD3C6', '#E8E2D8', '#F7F4EF'][k]; });
      etchEl.style.display = 'block';
      G.timeline({ onComplete: function () { busy = false; etchEl.style.display = 'none'; } })
        .fromTo(layers, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .45, ease: 'expo.in', stagger: .06 })
        .add(swap)
        .to(layers, { clipPath: 'inset(0% 0% 0% 100%)', duration: .7, ease: EO, stagger: .07 });
    }
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    root.addEventListener('keydown', function (e) {
      if (!e.target.closest('.thumbs')) return;
      if (e.key === 'ArrowRight') { go((cur + 1) % slides.length); thumbs[cur].focus(); }
      if (e.key === 'ArrowLeft') { go((cur - 1 + slides.length) % slides.length); thumbs[cur].focus(); }
    });

    /* loupe */
    var lens = $('[data-loupe]', main), toggle = $('[data-loupe-toggle]', root);
    var on = false, ZOOM = 2.6;
    function setLoupe(v) {
      on = v; toggle.setAttribute('aria-pressed', String(v)); main.classList.toggle('is-loupe', v);
      if (!v) lens.classList.remove('is-on');
      main.setAttribute('data-cursor', v ? '' : (TX.loupe || 'Loupe'));
    }
    main.setAttribute('data-cursor', TX.loupe || 'Loupe');
    toggle.addEventListener('click', function () { setLoupe(!on); if (on) { var r = main.getBoundingClientRect(); move(r.left + r.width / 2, r.top + r.height / 2); } });
    main.addEventListener('click', function () { if (FINE) setLoupe(!on); });
    function bigSrc() {
      var p = ob && ob.photos[cur]; if (!p) return '';
      return (meta('pb-root') || '') + 'assets/img/objets/' + p.key + '-' + p.sizes[p.sizes.length - 1] + '.webp';
    }
    function move(x, y, touch) {
      if (!on) return;
      var img = $('img', slides[cur]); if (!img) return;
      var ir = img.getBoundingClientRect(), mr = main.getBoundingClientRect();
      var ly = touch ? y - 110 : y;
      var lx = x;
      lens.style.left = (lx - mr.left) + 'px'; lens.style.top = (ly - mr.top) + 'px';
      var src = bigSrc();
      if (lens._src !== src) { lens.style.backgroundImage = 'url("' + src + '")'; lens._src = src; }
      lens.style.backgroundSize = (ir.width * ZOOM) + 'px ' + (ir.height * ZOOM) + 'px';
      lens.style.backgroundPosition = (-(x - ir.left) * ZOOM + 95) + 'px ' + (-(y - ir.top) * ZOOM + 95) + 'px';
      lens.classList.add('is-on');
    }
    main.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY, e.pointerType === 'touch'); });
    main.addEventListener('pointerleave', function () { lens.classList.remove('is-on'); });
    main.addEventListener('touchmove', function (e) { if (on) e.preventDefault(); }, { passive: false });

    /* drawer (price request) */
    var drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
    var lastFocus = null;
    function setDrawer(v) {
      if (!drawer) return;
      drawer.classList.toggle('is-open', v); scrim.classList.toggle('is-open', v);
      html.classList.toggle('verrou', v);
      $$('body > main, body > footer, body > header').forEach(function (x) { x.inert = v; });
      if (lenis) { v ? lenis.stop() : lenis.start(); }
      if (v) { lastFocus = document.activeElement; setTimeout(function () { var f = $('input', drawer); if (f) f.focus(); }, 350); }
      else if (lastFocus) lastFocus.focus();
    }
    $$('[data-drawer-open]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(true); }); });
    $$('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(false); }); });
    if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
    if (drawer) $('.drawer-body', drawer).setAttribute('data-lenis-prevent', '');
    if (drawer) document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setDrawer(false); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input:not([type=hidden]), textarea, select', drawer), i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });

    /* wall view */
    var ov = $('[data-wall]'), openB = $('[data-wall-open]');
    if (ov && openB && ob && ob.dims) {
      openB.addEventListener('click', function () { openWall(); });
      $$('[data-wall-close]', ov).forEach(function (b) { b.addEventListener('click', closeWall); });
      ov.addEventListener('click', function (e) { if (e.target === ov) closeWall(); });
    }
    function closeWall() { ov.classList.remove('is-open'); html.classList.remove('verrou'); if (lenis) lenis.start(); openB.focus(); }
    function openWall() {
      ov.classList.add('is-open'); html.classList.add('verrou'); if (lenis) lenis.stop();
      var close = $('[data-wall-close]', ov); if (close) close.focus();
      requestAnimationFrame(buildWall);
    }
    function buildWall() {
      var scene = $('[data-wall-scene]', ov), layer = $('[data-wall-layer]', ov);
      var W = scene.clientWidth, H = scene.clientHeight;
      var FLOOR = .862, CEIL_CM = 300, TOP = 0;
      var ppc = (FLOOR - TOP) * H / CEIL_CM;
      var floorY = FLOOR * H;
      layer.innerHTML = '';
      var p = ob.photos[0];
      var bb = p.bbox || [0, 0, p.w, p.h];
      var hcm = ob.dims.h || (ob.dims.l ? ob.dims.l * bb[3] / bb[2] : 30);
      var s = hcm * ppc / bb[3];
      var iw = p.w * s, ih = p.h * s;
      var objW = bb[2] * s, objH = bb[3] * s;
      var cx = W * .58, bottomY;
      if (ob.place === 'mur') bottomY = floorY - ((ob.y || 150) * ppc) + objH / 2;
      else {
        bottomY = floorY - 85 * ppc;
        var cw = Math.max(120 * ppc, objW + 40 * ppc), ch = 85 * ppc;
        var con = document.createElement('div'); con.className = 'wall-console';
        con.style.left = (cx - cw / 2) + 'px'; con.style.top = (floorY - ch) + 'px'; con.style.width = cw + 'px'; con.style.height = ch + 'px';
        con.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="0" y="0" width="100" height="5"/><path d="M6 5 L8 100 M94 5 L92 100 M8 60 L92 60"/></svg>';
        layer.appendChild(con);
        var ct = document.createElement('span'); ct.className = 'wall-tag'; ct.textContent = TX.console; ct.style.left = (cx + cw / 2 - 40) + 'px'; ct.style.top = (floorY - ch * .4) + 'px'; layer.appendChild(ct);
      }
      var o = document.createElement('div'); o.className = 'wall-obj' + (p.bg === 'white' ? ' blend' : '');
      o.style.width = iw + 'px'; o.style.height = ih + 'px';
      o.style.left = (cx - (bb[0] + bb[2] / 2) * s) + 'px';
      o.style.top = (bottomY - (bb[1] + bb[3]) * s) + 'px';
      o.innerHTML = '<img alt="" src="' + (meta('pb-root') || '') + 'assets/img/objets/' + p.key + '-' + p.sizes[Math.min(p.sizes.length - 1, 1)] + '.webp">';
      layer.appendChild(o);
      var tag = document.createElement('span'); tag.className = 'wall-tag';
      var dt = []; if (ob.dims.h) dt.push('H ' + fmt(ob.dims.h)); if (ob.dims.l) dt.push((LANG === 'fr' ? 'l ' : 'W ') + fmt(ob.dims.l)); if (ob.dims.d) dt.push('Ø ' + fmt(ob.dims.d));
      tag.textContent = dt.join(' · ') + ' cm';
      tag.style.left = cx + 'px'; tag.style.top = (bottomY - objH - 10) + 'px';
      layer.appendChild(tag);
      var fh = 175 * ppc, fw = fh * .3;
      var fig = document.createElement('div'); fig.className = 'wall-figure';
      fig.style.left = (W * .16) + 'px'; fig.style.top = (floorY - fh) + 'px'; fig.style.width = fw + 'px'; fig.style.height = fh + 'px';
      fig.innerHTML = '<svg viewBox="0 0 30 100" preserveAspectRatio="none"><path d="M15 0c3.3 0 5.6 2.6 5.6 6.2S18.3 13 15 13s-5.6-3.2-5.6-6.8S11.7 0 15 0zM8.2 15.2h13.6c3 0 4.8 2.2 5.2 5.2l2.6 22.6c.2 1.8-2.8 2.2-3.2.4L23.6 24v27.5L22.4 99c0 1-2.9 1-3 0l-3.6-44h-1.6l-3.6 44c-.1 1-3 1-3 0L6.4 51.5V24L3.6 43.4c-.4 1.8-3.4 1.4-3.2-.4L3 20.4c.4-3 2.2-5.2 5.2-5.2z"/></svg>';
      layer.appendChild(fig);
      var ft = document.createElement('span'); ft.className = 'wall-tag'; ft.textContent = TX.fig; ft.style.left = (W * .16 + fw / 2) + 'px'; ft.style.top = (floorY - fh - 8) + 'px'; layer.appendChild(ft);
      if (HAS && !REDUCED) {
        G.from(o, { y: -24, autoAlpha: 0, duration: .9, ease: EO, delay: .15 });
        G.from([fig, ft], { autoAlpha: 0, duration: .8, delay: .35 });
        G.from(tag, { autoAlpha: 0, y: 8, duration: .6, delay: .7 });
      }
    }
    window.addEventListener('resize', function () { if (ov && ov.classList.contains('is-open')) buildWall(); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (ov && ov.classList.contains('is-open')) closeWall();
      if (drawer && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  /* ---------- forms ---------- */
  function validateField(f) {
    var wrap = f.closest('.field'); if (!wrap) return true;
    var err = $('.field-error', wrap);
    var v = (f.value || '').trim(), msg = '';
    if (f.required && !v) msg = f.form && f.form.getAttribute('data-msg-required') || (LANG === 'fr' ? 'Ce champ est requis.' : 'This field is required.');
    else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = LANG === 'fr' ? 'Indiquez une adresse e-mail complète, par exemple nom@domaine.fr.' : 'Enter a full email address, for example name@domain.com.';
    wrap.classList.toggle('is-invalid', !!msg);
    if (err) err.textContent = msg;
    f.setAttribute('aria-invalid', String(!!msg));
    return !msg;
  }
  function validateConsent(form, scope) {
    var c = $('input[name="consent"]', scope || form); if (!c) return true;
    var e = $('[data-consent-error]', scope || form);
    var ok = c.checked;
    if (e) e.textContent = ok ? '' : (LANG === 'fr' ? 'Cochez la case pour envoyer la demande.' : 'Tick the box to send the request.');
    return ok;
  }
  function success(form) {
    var ok = $('[data-success]', form);
    $$(':scope > :not([data-success])', form).forEach(function (el) { el.hidden = true; });
    ok.hidden = false; ok.focus();
    if (HAS && !REDUCED) G.from(ok, { y: 20, autoAlpha: 0, duration: .8, ease: EO });
  }
  $$('[data-form]').forEach(function (form) {
    $$('input, textarea', form).forEach(function (f) { f.addEventListener('blur', function () { if (f.value) setTimeout(function () { validateField(f); }, 220); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required]:not([type=checkbox]), textarea[required]', form).forEach(function (f) { if (!validateField(f)) ok = false; });
      if (!validateConsent(form)) ok = false;
      if (!ok) { var bad = $('[aria-invalid="true"]', form) || $('input[name="consent"]', form); if (bad) bad.focus(); return; }
      success(form);
    });
  });

  function wizard() {
    var form = $('[data-wizard]'); if (!form) return;
    var steps = $$('[data-wiz-step]', form), marks = $$('[data-wiz-mark]', form);
    var prev = $('[data-wiz-prev]', form), next = $('[data-wiz-next]', form), submit = $('[data-wiz-submit]', form);
    var cur = 0, files = [];
    function show(i) {
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      marks.forEach(function (m, k) { m.classList.toggle('is-current', k === i); m.classList.toggle('is-done', k < i); if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current'); });
      prev.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
      if (i === steps.length - 1) recap();
      cur = i;
      if (HAS && !REDUCED) G.from(steps[i], { x: 30, autoAlpha: 0, duration: .6, ease: EO });
      var f = $('input:not([type=radio]), textarea', steps[i]); if (f && i > 0) f.focus({ preventScroll: true });
    }
    function valid(i) {
      var ok = true;
      $$('input[required]:not([type=checkbox]), textarea[required]', steps[i]).forEach(function (f) { if (!validateField(f)) ok = false; });
      if ($('input[name="consent"]', steps[i]) && !validateConsent(form, steps[i])) ok = false;
      if (!ok) { var bad = $('[aria-invalid="true"]', steps[i]) || $('input[name="consent"]', steps[i]); if (bad) bad.focus(); }
      return ok;
    }
    function val(n) { var e = form.elements[n]; if (!e) return ''; if (e.length && e[0] && e[0].type === 'radio') { var c = $('input[name="' + n + '"]:checked', form); return c ? c.value : ''; } return (e.value || '').trim(); }
    function recap() {
      var dl = $('[data-recap]', form);
      var rows = [[TX.profil, val('profil')], [TX.motif, val('motif')], [TX.objets, val('objets')], [TX.nombre, val('nombre') || '—'], [TX.photos, files.length ? files.length + ' ' + TX.fichiers : TX.aucune], [TX.nom, val('nom')], [TX.ville, val('ville') || '—'], [TX.email, val('email')], [TX.tel, val('tel') || '—']];
      dl.innerHTML = '';
      rows.forEach(function (r) { var dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = r[0]; dd.textContent = r[1]; dl.appendChild(dt); dl.appendChild(dd); });
    }
    next.addEventListener('click', function () { if (valid(cur)) show(cur + 1); });
    prev.addEventListener('click', function () { show(cur - 1); });
    form.addEventListener('submit', function (e) { e.preventDefault(); if (cur !== steps.length - 1) { if (valid(cur)) show(cur + 1); return; } success(form); });
    $$('input, textarea', form).forEach(function (f) { f.addEventListener('blur', function () { if (f.value && f.required) setTimeout(function () { validateField(f); }, 220); }); });

    var drop = $('[data-drop]', form), input = $('[data-files]', form), prevs = $('[data-previews]', form);
    function addFiles(list) {
      Array.prototype.slice.call(list).forEach(function (f) {
        if (files.length >= 8 || !/^image\//.test(f.type)) return;
        files.push(f);
        var fig = document.createElement('figure'), img = document.createElement('img'), rm = document.createElement('button');
        img.alt = f.name; rm.type = 'button'; rm.textContent = '×'; rm.setAttribute('aria-label', TX.retirer + ' ' + f.name);
        rm.addEventListener('click', function () { files.splice(files.indexOf(f), 1); fig.remove(); });
        var r = new FileReader(); r.onload = function () { img.src = r.result; }; r.readAsDataURL(f);
        fig.appendChild(img); fig.appendChild(rm); prevs.appendChild(fig);
        if (HAS && !REDUCED) G.from(fig, { scale: .8, autoAlpha: 0, duration: .5, ease: 'back.out(2)' });
      });
    }
    if (drop && input) {
      input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
      ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
      ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
      drop.addEventListener('drop', function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });
    }
  }

  /* ---------- boot ---------- */
  function boot() {
    hero();
    salles();
    filters();
    initReveals();
    initStaticCotes();
    $$('[data-sphere]').forEach(sphere);
    yearRoll();
    $$('[data-map-svg]').forEach(buildMap);
    footerCote();
    marquee();
    objetPage();
    wizard();
    if (HAS) {
      ScrollTrigger.refresh();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
