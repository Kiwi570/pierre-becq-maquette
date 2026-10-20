/* Générateur des pages statiques (FR + EN) de la maquette Pierre Becq.
   Usage : node _build/build.js
   Le site produit n'a besoin d'aucune étape de construction : ce script sert
   seulement à régénérer les pages après une modification des contenus. */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const C = require('./content/objets.js');
const PHOTOS = require('./photos.json');
const GROK = require('./grok.json');
const T = require('./content/textes.js');

const YEAR_NOW = new Date().getFullYear();
const LANGS = ['fr', 'en'];

/* ---------- routes ---------- */
const ROUTES = {
  home: { fr: 'index.html', en: 'en/index.html' },
  galerie: { fr: 'galerie.html', en: 'en/gallery.html' },
  expertises: { fr: 'expertises.html', en: 'en/appraisals.html' },
  maison: { fr: 'maison.html', en: 'en/the-house.html' },
  contact: { fr: 'contact.html', en: 'en/contact.html' },
  mentions: { fr: 'mentions-legales.html', en: 'en/legal-notice.html' }
};
const objRoute = (slug, lang) => (lang === 'fr' ? `objets/${slug}.html` : `en/objects/${slug}.html`);

const OBJETS = C.objets.filter(o => !o.masque);
const bySlug = Object.fromEntries(OBJETS.map(o => [o.slug, o]));

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tbc = s => esc(s).replace(/\[\[(.+?)\]\]/g, '<span class="tbc">$1</span>');
const plain = s => String(s).replace(/\s*\[\[.+?\]\]/g, '');
const tr = (x, lang) => (x == null ? '' : typeof x === 'string' ? x : x[lang]);
function rel(from, to) {
  const depth = from.split('/').length - 1;
  return '../'.repeat(depth) + to;
}
const fmt = (n, lang) => (lang === 'fr' ? String(n).replace('.', ',') : String(n));

function dimsText(d, lang) {
  if (!d) return null;
  const parts = [];
  const lab = lang === 'fr' ? { h: 'H', l: 'l', p: 'P', d: 'Ø', L: 'L' } : { h: 'H', l: 'W', p: 'D', d: 'Ø', L: 'L' };
  for (const k of ['h', 'l', 'L', 'p', 'd']) if (d[k] != null) parts.push(`${lab[k]} ${fmt(d[k], lang)}`);
  return parts.join(' · ') + ' cm';
}

/* Photo of a piece: crops the white margin only (never the object). */
function photo(key, o = {}) {
  const p = PHOTOS[key];
  if (!p) throw new Error('photo manquante ' + key);
  const [fx, fy, fw, fh] = p.frame || [0, 0, p.w, p.h];
  const scene = p.bg === 'scene';
  const folder = key.split('/')[0];
  const base = key.split('/')[1];
  const src = s => o.A(`img/${folder}/${base}-${s}.webp`);
  const srcset = p.sizes.map(s => `${src(s)} ${s}w`).join(', ');
  const mid = p.sizes.find(s => s >= 960) || p.sizes[p.sizes.length - 1];
  let style, bbox = '';
  if (scene) {
    style = `--ar:${p.w}/${p.h};--arn:${(p.w / p.h).toFixed(4)}`;
  } else {
    style = `--ar:${fw}/${fh};--arn:${(fw / fh).toFixed(4)};--iw:${(p.w / fw * 100).toFixed(3)}%;--ix:${(-fx / fw * 100).toFixed(3)}%;--iy:${(-fy / fh * 100).toFixed(3)}%`;
    if (p.bbox) {
      const [bx, by, bw, bh] = p.bbox;
      bbox = ` data-bbox="${((bx - fx) / fw).toFixed(4)},${((by - fy) / fh).toFixed(4)},${(bw / fw).toFixed(4)},${(bh / fh).toFixed(4)}"`;
    }
  }
  const cls = ['photo', scene ? 'photo--scene' : '', o.cls || ''].filter(Boolean).join(' ');
  const attrs = [
    o.dims ? ` data-dims='${JSON.stringify(o.dims)}'` : '',
    o.etch ? ' data-etch' : '',
    o.cotes ? ' data-cotes' : '',
    o.extra || ''
  ].join('');
  return `<div class="${cls}" style="${style}${o.style ? ';' + o.style : ''}"${bbox}${attrs}><img src="${src(mid)}" srcset="${srcset}" sizes="${o.sizes || '(max-width: 860px) 90vw, 40vw'}" width="${p.w}" height="${p.h}" alt="${esc(o.alt || '')}"${o.eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></div>`;
}

function grok(name, o = {}) {
  const g = GROK[name];
  const src = s => o.A(`img/grok/${name}-${s}.webp`);
  const big = g.sizes[g.sizes.length - 1];
  return `<img src="${src(big)}" srcset="${g.sizes.map(s => `${src(s)} ${s}w`).join(', ')}" sizes="${o.sizes || '100vw'}" width="${g.w}" height="${g.h}" alt="${esc(o.alt || '')}"${o.eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${o.cls ? ` class="${o.cls}"` : ''}${o.extra || ''}>`;
}
function grokPicture(wide, tall, o) {
  const g = GROK[tall];
  const srcT = s => o.A(`img/grok/${tall}-${s}.webp`);
  return `<picture><source media="(max-width: 760px)" srcset="${g.sizes.map(s => `${srcT(s)} ${s}w`).join(', ')}" sizes="100vw">${grok(wide, o)}</picture>`;
}
const grokPhoto = (name, o) => `<div class="photo photo--scene${o.cls ? ' ' + o.cls : ''}" style="--ar:${GROK[name].w}/${GROK[name].h}${o.style ? ';' + o.style : ''}"${o.etch ? ' data-etch' : ''}${o.parallax ? ` data-parallax="${o.parallax}"` : ''}>${grok(name, o)}</div>`;

const mainPhoto = ob => 'objets/' + ob.photos[0];
const colorOf = ob => PHOTOS[mainPhoto(ob)].color || '#b5a690';

/* ---------- icons ---------- */
const I = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  arrowL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12H4M10 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  loupe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="1.3"/></svg>',
  wall: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="14" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1 21h22M8 8h8v5H8z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.3"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18M3 16h18" stroke="currentColor" stroke-width="1.3"/></svg>',
  motion: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M12 4v8l5 3" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  logo: '<svg class="brand-mark" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" stroke-width="1.6"/><text x="40" y="51" text-anchor="middle" font-family="Instrument Serif, Times New Roman, serif" font-size="34" fill="currentColor">PB</text></svg>'
};

/* ---------- shared partials ---------- */
function head(ctx, title, desc) {
  const { lang, file, A } = ctx;
  const alt = ctx.alt ? ctx.alt : null;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F2EEE7">
<meta name="pb-page" content="${ctx.page}">
<meta name="pb-lang" content="${lang}">
<meta name="pb-root" content="${rel(file, '')}">
${alt ? `<link rel="alternate" hreflang="${lang === 'fr' ? 'en' : 'fr'}" href="${alt}">` : ''}
<link rel="icon" href="${A('img/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${A('fonts/instrument-serif-regular.woff')}" as="font" type="font/woff" crossorigin>
<link rel="preload" href="${A('fonts/inter-tight-var.woff')}" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="${A('vendor/lenis.css')}">
<link rel="stylesheet" href="${A('css/site.css')}">
<script>(function(d){var c=d.documentElement.classList;c.add('js');try{if(localStorage.getItem('pb-motion')==='reduced')c.add('is-reduced')}catch(e){}try{if(sessionStorage.getItem('pb-veil')==='1')c.add('veil-on')}catch(e){}})(document)</script>
</head>
<body>`;
}

function header(ctx) {
  const { lang, file, A, L } = ctx;
  const nav = [['galerie', T.nav.galerie], ['expertises', T.nav.expertises], ['maison', T.nav.maison], ['contact', T.nav.contact]];
  const cur = ctx.navKey;
  const other = lang === 'fr' ? 'en' : 'fr';
  const links = nav.map(([k, lab]) => `<a href="${L(ROUTES[k][lang])}"${cur === k ? ' aria-current="page"' : ''}>${esc(tr(lab, lang))}</a>`).join('');
  return `<a class="skip" href="#contenu">${esc(tr(T.ui.skip, lang))}</a>
<header class="hdr" id="hdr">
  <div class="wrap">
    <a class="brand" href="${L(ROUTES.home[lang])}" aria-label="${esc(tr(T.ui.home, lang))}">${I.logo}<span class="brand-name"><b>Pierre Becq</b><span>${esc(tr(T.ui.tagline, lang))}</span></span></a>
    <nav class="nav" aria-label="${esc(tr(T.ui.mainNav, lang))}">${links}</nav>
    <div class="hdr-tools">
      <span class="hdr-tel">03 87 63 61 61</span>
      <a class="tool" href="${L(ctx.altFile)}" hreflang="${other}" lang="${other}" data-lang-switch>${other.toUpperCase()}</a>
      <button class="tool tool--motion" type="button" data-motion-toggle aria-pressed="false" title="${esc(tr(T.ui.motion, lang))}">${I.motion}<span class="tool-label">${esc(tr(T.ui.motionShort, lang))}</span></button>
      <button class="tool burger" type="button" data-menu-open aria-expanded="false" aria-controls="menu">${I.menu}<span class="sr-only">${esc(tr(T.ui.menu, lang))}</span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(tr(T.ui.menu, lang))}">
  <button class="tool menu-close" type="button" data-menu-close>${I.close}<span class="sr-only">${esc(tr(T.ui.close, lang))}</span></button>
  <nav><a href="${L(ROUTES.home[lang])}">${esc(tr(T.ui.homeShort, lang))}</a>${links}</nav>
  <div class="menu-foot"><span class="sel">5 rue Gambetta, 57000 Metz</span><span class="sel">03 87 63 61 61</span></div>
</div>
<div class="veil" aria-hidden="true"><div class="veil-label"><span class="eyebrow">Pierre Becq</span><b data-veil-title>${esc(ctx.veilTitle || 'Pierre Becq')}</b></div></div>
<div class="cursor" aria-hidden="true"><div class="cursor-ring"><span data-cursor-label></span></div><div class="cursor-dot"></div></div>`;
}

function footer(ctx) {
  const { lang, L } = ctx;
  const t = k => esc(tr(T.footer[k], lang));
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr-big" data-ftr-cote><span class="ftr-name">Pierre Becq</span></div>
    <div class="ftr-grid">
      <div class="ftr-col"><h4>${t('boutique')}</h4><span class="sel">5 rue Gambetta</span><span class="sel">57000 Metz</span><span class="sel">03 87 63 61 61</span><span class="open-now" data-open-now></span></div>
      <div class="ftr-col"><h4>Senon (Meuse)</h4><span class="sel">3 rue de la Fontaine</span><span class="sel">55230 Senon</span><span class="sel">03 29 85 98 17</span></div>
      <div class="ftr-col"><h4>${t('plan')}</h4>
        <a class="link" href="${L(ROUTES.galerie[lang])}">${esc(tr(T.nav.galerie, lang))}</a>
        <a class="link" href="${L(ROUTES.expertises[lang])}">${esc(tr(T.nav.expertises, lang))}</a>
        <a class="link" href="${L(ROUTES.maison[lang])}">${esc(tr(T.nav.maison, lang))}</a>
        <a class="link" href="${L(ROUTES.contact[lang])}">${esc(tr(T.nav.contact, lang))}</a>
      </div>
      <div class="ftr-col"><h4>${t('suivre')}</h4>
        <a class="link" href="https://www.instagram.com/pierrebecqantiquaire" rel="noopener" target="_blank">Instagram</a>
        <a class="link" href="https://www.facebook.com/pierrebecqantiquaire" rel="noopener" target="_blank">Facebook</a>
        <a class="link" href="https://www.linkedin.com/in/pierre-andré-becq-947790132/" rel="noopener" target="_blank">LinkedIn</a>
      </div>
    </div>
    <div class="ftr-base"><span>© <span data-year>${YEAR_NOW}</span> Pierre Becq Antiquaire</span><a class="link" href="${L(ROUTES.mentions[lang])}">${t('mentions')}</a><span>${t('maquette')}</span></div>
  </div>
</footer>`;
}

function scripts(ctx, extra = []) {
  const { A } = ctx;
  const libs = ['vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/SplitText.min.js', 'vendor/Flip.min.js', 'vendor/CustomEase.min.js', 'vendor/lenis.min.js', ...extra, 'js/data.js', 'js/site.js'];
  return libs.map(s => `<script src="${A(s)}" defer></script>`).join('\n') + '\n</body>\n</html>\n';
}

function page(ctx, title, desc, body, extraScripts) {
  return head(ctx, title, desc) + '\n' + header(ctx) + '\n<main id="contenu">\n' + body + '\n</main>\n' + footer(ctx) + '\n' + scripts(ctx, extraScripts);
}

/* ---------- reusable blocks ---------- */
function pieceCard(ob, ctx, i, n, o = {}) {
  const { lang, L } = ctx;
  const key = mainPhoto(ob);
  const p = PHOTOS[key];
  const fr = p.frame || [0, 0, p.w, p.h];
  const ar = p.bg === 'scene' ? p.w / p.h : fr[2] / fr[3];
  const h = ob.dims && ob.dims.h ? ob.dims.h : 95;
  const f = Math.max(0.56, Math.min(1, Math.sqrt(Math.min(h, 145) / 145) * 1.08));
  const salle = C.salles.find(s => s.id === ob.salle);
  return `<a class="piece-card" href="${L(objRoute(ob.slug, lang))}" data-cursor="${esc(tr(T.ui.voir, lang))}" data-color="${colorOf(ob)}" data-salle="${ob.salle}" data-type="${ob.type}" data-flip-id="${ob.slug}" style="--f:${f.toFixed(3)};--ar:${ar.toFixed(4)}" data-tilt>
  <div class="vitrine socle">${photo(key, { A: ctx.A, alt: plain(tr(ob.titre, lang)), dims: ob.dims, cotes: !!ob.dims, sizes: '(max-width: 860px) 70vw, 30vw' })}</div>
  <div class="cartel"><span class="piece-idx num">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}${o.salleLabel ? ' · ' + esc(tr(salle.titre, lang)) : ''}</span><span class="cartel-title">${esc(plain(tr(ob.titre, lang)))}</span><span>${esc(plain(tr(ob.epoque, lang)))}</span><span class="muted">${esc(tr(ob.materiaux, lang))}</span><span class="cartel-foot"><span>${esc(tr(T.ui.prix, lang))}</span><span><i class="dot"></i>${esc(tr(T.ui.dispo, lang))}</span></span></div>
</a>`;
}

function tape() {
  return `<div class="tape" aria-hidden="true"><svg data-tape preserveAspectRatio="none"></svg><div class="tape-pointer"><span data-tape-label></span></div></div>`;
}

function mapBlock(ctx) {
  return `<figure class="map" data-map style="margin:0"><svg data-map-svg role="img" aria-label="${esc(tr(T.ui.mapLabel, ctx.lang))}"></svg><figcaption class="map-note">${esc(tr(T.ui.mapNote, ctx.lang))}</figcaption></figure>`;
}

function addrCards(ctx, full) {
  const { lang } = ctx;
  return `<div class="venir-cards">
  <article class="addr" data-reveal>
    <span class="eyebrow">${esc(tr(T.venir.metzLabel, lang))}</span>
    <h3>Metz</h3>
    <div class="addr-line"><span class="sel">5 rue Gambetta, 57000 Metz</span><button class="copy" type="button" data-copy="5 rue Gambetta, 57000 Metz">${esc(tr(T.ui.copy, lang))}</button></div>
    <div class="addr-line"><a class="sel" href="tel:+33387636161">03 87 63 61 61</a><button class="copy" type="button" data-copy="03 87 63 61 61">${esc(tr(T.ui.copy, lang))}</button></div>
    <div class="addr-line"><span class="open-now" data-open-now></span></div>
    ${full ? `<div class="addr-line"><span>${esc(tr(T.venir.email, lang))}</span><span class="tbc">${esc(tr(T.ui.aCompleter, lang))}</span></div>` : ''}
    <p class="muted">${esc(tr(T.venir.metzNote, lang))}</p>
  </article>
  <article class="addr" data-reveal>
    <span class="eyebrow">${esc(tr(T.venir.senonLabel, lang))}</span>
    <h3>Senon</h3>
    <div class="addr-line"><span class="sel">3 rue de la Fontaine, 55230 Senon</span><button class="copy" type="button" data-copy="3 rue de la Fontaine, 55230 Senon">${esc(tr(T.ui.copy, lang))}</button></div>
    <div class="addr-line"><a class="sel" href="tel:+33329859817">03 29 85 98 17</a><button class="copy" type="button" data-copy="03 29 85 98 17">${esc(tr(T.ui.copy, lang))}</button></div>
    <p class="muted">${esc(tr(T.venir.senonNote, lang))} <span class="tbc">${esc(tr(T.ui.aPreciser, lang))}</span></p>
  </article>
</div>`;
}

const titres = (ctx, cls = 'titres') => `<div class="${cls}">
  <div class="titre" data-reveal><img src="${ctx.A('img/maison/insigne-expert-judiciaire-226.webp')}" width="226" height="223" alt="${esc(tr(T.titres.insigneAlt, ctx.lang))}" loading="lazy"><p>${esc(tr(T.titres.judiciaire, ctx.lang))}</p></div>
  <div class="titre" data-reveal><img src="${ctx.A('img/maison/logo-cne-480.webp')}" width="512" height="512" alt="${esc(tr(T.titres.cneAlt, ctx.lang))}" loading="lazy"><p>${esc(tr(T.titres.cne, ctx.lang))}</p></div>
</div>`;

module.exports = { ROUTES, objRoute, OBJETS, bySlug, C, PHOTOS, GROK, T, I, YEAR_NOW, esc, tbc, plain, tr, rel, fmt, dimsText, photo, grok, grokPicture, grokPhoto, mainPhoto, colorOf, page, pieceCard, tape, mapBlock, addrCards, titres };

if (require.main === module) require('./pages.js').buildAll();
