const fs = require('fs');
const path = require('path');
const B = require('./build.js');
const { ROUTES, objRoute, OBJETS, bySlug, C, PHOTOS, GROK, T, I, YEAR_NOW, esc, tbc, plain, tr, rel, dimsText, photo, grok, grokPicture, grokPhoto, mainPhoto, colorOf, page, pieceCard, tape, mapBlock, addrCards, titres } = B;

const ROOT = path.resolve(__dirname, '..');
const L2 = (fr, en) => ({ fr, en });

function makeCtx(lang, file, pageId, navKey, altFile, veilTitle) {
  return {
    lang, file, page: pageId, navKey, veilTitle,
    A: p => rel(file, 'assets/' + p),
    L: target => rel(file, target),
    altFile
  };
}

/* ======================= ACCUEIL ======================= */
const HERO = ['applique-prouve', 'vase-daum', 'christ-sainte-lucie'];
const HERO_BOX = 1.2; // largeur / hauteur de la vitrine du héros
const SALLE_ORDER = ['applique-prouve', 'vase-daum', 'christ-sainte-lucie', 'pendule-empire', 'coffret-sainte-lucie', 'fauteuil-rene-cresson', 'vase-pinon', 'reliquaire', 'bougeoirs-empire', 'statue-terre-cuite', 'coffret-circulaire', 'fauteuil-louis-cresson', 'tableau-pogrebinsky', 'fauteuil-louis-xv'];

function home(ctx) {
  const { lang, A, L } = ctx;
  const H = T.home;
  const t = x => esc(tr(x, lang));

  const heroItems = HERO.map((slug, i) => {
    const ob = bySlug[slug];
    const p = PHOTOS[mainPhoto(ob)];
    const fr = p.frame;
    const ar = fr[2] / fr[3];
    const w = ar >= HERO_BOX ? 100 : (ar / HERO_BOX) * 100;
    return `<a class="hero-item${i === 0 ? ' is-current' : ''}" href="${L(objRoute(slug, lang))}" data-hero-item="${i}" data-cursor="${t(T.ui.voir)}" style="width:${w.toFixed(2)}%"${i ? ' aria-hidden="true" tabindex="-1"' : ''}>${photo(mainPhoto(ob), { A, alt: plain(tr(ob.titre, lang)), dims: ob.dims, cotes: true, eager: i === 0, sizes: '(max-width: 960px) 80vw, 36vw' })}</a>`;
  }).join('');
  const ob0 = bySlug[HERO[0]];
  const heroCartel = `<span class="cartel-title" data-hc-title>${esc(tr(ob0.court, lang))}</span><span data-hc-line>${esc(plain(tr(ob0.epoque, lang)))} · ${esc(tr(ob0.materiaux, lang))}</span><span class="muted" data-hc-note>${t(H.heroNote[HERO[0]])}</span>`;

  const cards = SALLE_ORDER.map((s, i) => pieceCard(bySlug[s], ctx, i, SALLE_ORDER.length)).join('\n');

  const panels = H.panels.map(pn => {
    const ob = bySlug[pn.slug];
    return `<a class="lp" href="${L(objRoute(pn.slug, lang))}" data-cursor="${t(T.ui.voir)}">
  <div class="lp-tex" data-parallax="-10">${grok(pn.tex, { A, sizes: '40vw', alt: '' })}</div>
  <div class="lp-top"><span>${t(pn.top)}</span><span>Nancy</span></div>
  <div class="lp-piece"><div class="vitrine socle">${photo(mainPhoto(ob), { A, alt: plain(tr(ob.titre, lang)), etch: true, sizes: '(max-width: 860px) 70vw, 22vw' })}</div></div>
  <div class="stack" style="gap:12px"><span class="lp-name">${esc(pn.name)}</span><p class="lp-text">${t(pn.text)}</p></div>
</a>`;
  }).join('\n');

  const publicsShort = [
    L2("Inventaire chiffré et photographié de vos biens, pour choisir la bonne assurance et prouver leur existence.", 'A priced, photographed inventory of your belongings, to choose the right insurance and prove they exist.'),
    L2("Évaluation du patrimoine mobilier d'une succession, à la demande des héritiers ou du notaire.", 'Valuation of the furniture and works of art in an estate, at the request of the heirs or the notary.'),
    L2("Inventaire descriptif du matériel et du mobilier, pour être assuré au plus juste.", 'A descriptive inventory of equipment and furniture, to be insured at the right level.')
  ];
  const publics = T.expertises.publics.map((pb, i) => `<a class="public" href="${L(ROUTES.expertises[lang])}" data-tilt>
  ${grokPhoto(pb.img, { A, sizes: '(max-width: 960px) 90vw, 30vw', alt: '' })}
  <div class="public-body"><h3>${t(pb.title)}</h3><p>${t(publicsShort[i])}</p></div>
</a>`).join('\n');

  const steps = T.expertises.steps.map(s => `<div class="step" data-reveal><h3>${t(s.t)}</h3><p>${t(s.d)}</p></div>`).join('');

  const services = H.services.map((s, i) => s.img ? `<article class="service">
  ${grokPhoto(s.img, { A, etch: true, sizes: i === 0 ? '(max-width: 860px) 92vw, 56vw' : '(max-width: 860px) 92vw, 32vw', alt: '', style: i === 0 ? '--ar:3/2' : '' })}
  <h3 data-reveal>${t(s.title)}</h3><p data-reveal>${t(s.text)}</p>
</article>` : `<article class="service service--text"><h3 data-split>${t(s.title)}</h3><p data-reveal>${t(s.text)}</p><a class="link-arrow" data-reveal href="${L(ROUTES.contact[lang])}">${t(s.cta)} ${I.arrow}</a></article>`).join('\n');

  const marquee = tr(H.marquee, lang).map(m => `<span class="marquee-item">${esc(m)}</span>`).join('');

  const body = `
<section class="hero" data-hero>
  <div class="hero-bg" aria-hidden="true">
    ${grokPicture('g01-hero-salle', 'g02-hero-salle', { A, eager: true, alt: '', cls: 'hero-img' })}
    <canvas data-gl></canvas>
    <div class="hero-light"></div>
  </div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="eyebrow" data-hero-el>${t(H.eyebrow)}</span>
      <h1 data-hero-title><span class="hl">Pierre</span><span class="hl it">Becq</span></h1>
      <p class="hero-sub" data-hero-el>${t(H.sub)}</p>
      <div class="btn-row" data-hero-el>
        <a class="btn btn--fill" href="${L(ROUTES.galerie[lang])}" data-magnetic>${t(H.cta1)} ${I.arrow}</a>
        <a class="btn" href="${L(ROUTES.expertises[lang])}" data-magnetic>${t(H.cta2)}</a>
      </div>
      <div class="hero-meta" data-hero-el><span class="sel">5 rue Gambetta, 57000 Metz</span><a class="sel" href="tel:+33387636161">03 87 63 61 61</a><span class="open-now" data-open-now></span></div>
    </div>
    <div class="hero-stage">
      <div class="hero-piece" data-hero-piece>
        <div class="vitrine socle hero-vitrine"><div class="hero-frame" style="aspect-ratio:${HERO_BOX}">${heroItems}<div class="etch" aria-hidden="true"><i></i><i></i><i></i></div></div></div>
        <div class="hero-switch">
          <div class="cartel hero-cartel" aria-live="polite">${heroCartel}</div>
          <div class="hero-dots" role="tablist" aria-label="${lang === 'fr' ? 'Pièces présentées' : 'Featured pieces'}">${HERO.map((s, i) => `<button type="button" role="tab" aria-current="${i === 0}" aria-label="${esc(tr(bySlug[s].court, lang))}" data-hero-dot="${i}"></button>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="hero-scroll" aria-hidden="true"><i></i>${t(H.scroll)}</div>
</section>

<section class="section" id="maison">
  <div class="wrap since">
    <figure class="since-media" style="margin:0">
      ${photo('maison/facade-rue-gambetta', { A, alt: tr(H.sinceCaption, lang), etch: true, sizes: '(max-width: 860px) 92vw, 46vw', extra: ' data-parallax-inner' })}
      <figcaption class="mono muted">${t(H.sinceCaption)}</figcaption>
      <div class="since-sphere" aria-hidden="true"><svg class="sphere" data-sphere viewBox="-120 -120 240 240"></svg></div>
    </figure>
    <div class="stack" style="gap:30px">
      <span class="eyebrow" data-reveal>${t(H.sinceEyebrow)}</span>
      <div class="since-year" data-reveal><span data-year-roll data-from="1969">1969</span><small><span data-years-count>${YEAR_NOW - 1969}</span> ${t(H.sinceYears)}</small></div>
      <h2 class="h3" data-split style="font-size:clamp(2rem,1.4rem + 2.2vw,3.4rem)">${t(H.sinceTitle)}</h2>
      <p class="lead" data-reveal>${t(H.sinceLead)}</p>
      <ul class="engagements">${H.engagements.map(e => `<li data-reveal><span>—</span><span>${t(e)}</span></li>`).join('')}</ul>
      <a class="link-arrow" href="${L(ROUTES.maison[lang])}" data-reveal>${t(H.sinceLink)} ${I.arrow}</a>
    </div>
  </div>
</section>

<section class="salle" data-salle data-wall id="coups-de-coeur">
  <div class="wrap salle-head">
    <div class="stack" style="gap:20px"><span class="eyebrow">${t(H.salleEyebrow)}</span><h2 data-split>${t(H.salleTitle)}</h2></div>
    <p class="lead">${t(H.salleLead)}</p>
  </div>
  <div class="salle-pin" data-salle-pin>
  <div class="salle-viewport" data-salle-viewport>
    <div class="salle-track" data-salle-track>
${cards}
      <div class="salle-end"><p class="h3">${t(H.salleEnd)}</p><a class="btn btn--fill" href="${L(ROUTES.galerie[lang])}" data-magnetic>${t(T.ui.toute)} ${I.arrow}</a></div>
    </div>
  </div>
  ${tape()}
  </div>
</section>

<section class="section" id="lorraine">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">${t(H.lorraineEyebrow)}</span><h2 data-split>${t(H.lorraineTitle)}</h2><p class="lead" data-reveal>${t(H.lorraineLead)}</p></div>
    <div class="lorraine-panels">
${panels}
    </div>
  </div>
</section>

<section class="section" id="expertise">
  <div class="wrap">
    <div class="expert-intro">
      <div class="expert-media">${grokPhoto('g07-expertise-loupe', { A, etch: true, sizes: '(max-width: 960px) 92vw, 56vw', alt: '', style: '--ar:1168/784' })}</div>
      <div class="stack" style="gap:26px">
        <span class="eyebrow">${t(H.expertEyebrow)}</span>
        <h2 class="h3" data-split style="font-size:clamp(2.2rem,1.4rem + 2.6vw,4rem)">${t(H.expertTitle)}</h2>
        <p class="lead" data-reveal>${t(H.expertLead)}</p>
        <p class="muted" data-reveal>${t(H.expertText)}</p>
        ${titres(ctx)}
        <div data-reveal><a class="btn btn--fill" href="${L(ROUTES.expertises[lang])}#demande" data-magnetic>${t(H.expertCta)} ${I.arrow}</a></div>
      </div>
    </div>
    <div class="publics">
${publics}
    </div>
    <div class="steps"><div class="steps-line" data-steps-line></div>${steps}</div>
  </div>
</section>

<section class="section" id="services">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">${t(H.servicesEyebrow)}</span><h2 data-split>${t(H.servicesTitle)}</h2></div>
    <div class="services">
${services}
    </div>
  </div>
  <div class="marquee" data-marquee aria-hidden="true"><div class="marquee-track">${marquee}${marquee}</div></div>
</section>

<section class="section" id="venir" style="padding-top:0">
  <div class="band">${grok('g18-pierre-jaumont', { A, alt: '', extra: ' data-parallax-img' })}<p class="band-title">${t(H.band)}</p></div>
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">${t(H.venirEyebrow)}</span><h2 data-split>${t(H.venirTitle)}</h2></div>
    <div class="venir">${addrCards(ctx)}${mapBlock(ctx)}</div>
  </div>
</section>`;
  return page(ctx, tr(H.title, lang), tr(H.desc, lang), body, ['vendor/ogl.min.js']);
}

/* ======================= GALERIE ======================= */
function galerie(ctx) {
  const { lang, A, L } = ctx;
  const G = T.galerie;
  const t = x => esc(tr(x, lang));
  const salles = C.salles.map(s => {
    const list = OBJETS.filter(o => o.salle === s.id);
    return `<section class="salle salle--g" data-salle data-wall data-salle-id="${s.id}" id="salle-${s.id}">
  <div class="wrap salle-head">
    <div class="stack" style="gap:14px"><span class="salle-num" aria-hidden="true">${s.num}</span><span class="eyebrow">${t(G.salle)} ${s.num}</span><h2 class="h3" style="font-size:clamp(2.2rem,1.4rem + 2.6vw,4rem)">${t(s.titre)}</h2></div>
    <p class="lead">${t(s.sous)} <span class="mono muted">${list.length} ${t(T.ui.pieces)}</span></p>
  </div>
  <div class="salle-pin" data-salle-pin>
  <div class="salle-viewport" data-salle-viewport>
    <div class="salle-track" data-salle-track>
${list.map((o, i) => pieceCard(o, ctx, i, list.length)).join('\n')}
      <p class="empty" data-empty hidden>${t(G.none)}</p>
    </div>
  </div>
  ${tape()}
  </div>
</section>`;
  }).join('\n');

  const body = `
<section class="phero">
  <div class="wrap phero-grid">
    <div class="phero-copy">
      <span class="eyebrow">Pierre Becq · ${lang === 'fr' ? 'Antiquaire' : 'Antiques'}</span>
      <h1 data-split>${t(T.nav.galerie)}</h1>
      <p class="lead" data-reveal>${t(G.lead)}</p>
      <p class="mono" data-reveal><span class="num">${OBJETS.length}</span> ${t(T.ui.pieces)} · ${t(T.ui.prix)}</p>
    </div>
    <div class="phero-media"><div class="photo photo--scene" style="--ar:1168/784" data-etch>${grokPicture('g04-salle-socles', 'g05-salle-socles', { A, eager: true, alt: '', sizes: '(max-width: 860px) 92vw, 48vw' })}</div></div>
  </div>
</section>
<div class="filters" data-filters>
  <div class="wrap">
    <div class="filter-group" role="group" aria-label="${t(G.epoque)}"><span>${t(G.epoque)}</span>
      <button class="chip" type="button" aria-pressed="true" data-f-salle="all">${t(G.toutes)}</button>
      ${C.salles.map(s => `<button class="chip" type="button" aria-pressed="false" data-f-salle="${s.id}" title="${t(s.titre)}">${s.num} · ${t(s.titre)}</button>`).join('')}
    </div>
    <div class="filter-group" role="group" aria-label="${t(G.type)}"><span>${t(G.type)}</span>
      <button class="chip" type="button" aria-pressed="true" data-f-type="all">${t(G.tous)}</button>
      ${C.types.map(ty => `<button class="chip" type="button" aria-pressed="false" data-f-type="${ty.id}">${esc(ty[lang])}</button>`).join('')}
    </div>
    <span class="filters-count" aria-live="polite"><b class="num" data-count>${OBJETS.length}</b> ${t(T.ui.pieces)}</span>
  </div>
</div>
${salles}
<section class="section section--tight">
  <div class="wrap" style="display:grid;gap:24px;justify-items:start">
    <h2 class="h3" data-split style="font-size:clamp(2rem,1.4rem + 2.2vw,3.6rem);max-width:20ch">${t(G.ctaTitle)}</h2>
    <p class="lead muted" data-reveal>${t(G.ctaText)}</p>
    <a class="btn btn--fill" href="${L(ROUTES.contact[lang])}" data-magnetic data-reveal>${t(G.ctaBtn)} ${I.arrow}</a>
  </div>
</section>`;
  return page(ctx, tr(G.title, lang), tr(G.desc, lang), body);
}

/* ======================= OBJET ======================= */
function objet(ctx, ob) {
  const { lang, A, L } = ctx;
  const O = T.objet;
  const t = x => esc(tr(x, lang));
  const salle = C.salles.find(s => s.id === ob.salle);
  const idx = OBJETS.indexOf(ob);
  const prev = OBJETS[(idx - 1 + OBJETS.length) % OBJETS.length];
  const next = OBJETS[(idx + 1) % OBJETS.length];
  const related = OBJETS.filter(o => o.salle === ob.salle && o !== ob);

  const slides = ob.photos.map((ph, i) => `<div class="obj-slide${i === 0 ? ' is-current' : ''}" data-slide="${i}"${i ? ' hidden' : ''}>${photo('objets/' + ph, { A, alt: `${plain(tr(ob.titre, lang))} — ${tr(O.photo, lang)} ${i + 1}`, dims: i === 0 ? ob.dims : null, cotes: i === 0 && !!ob.dims, eager: i === 0, sizes: '(max-width: 960px) 92vw, 54vw' })}</div>`).join('');
  const thumbs = ob.photos.length > 1 ? `<div class="thumbs" role="tablist" aria-label="${t(O.photo)}">${ob.photos.map((ph, i) => {
    const p = PHOTOS['objets/' + ph];
    return `<button class="thumb" type="button" role="tab" aria-current="${i === 0}" aria-label="${t(O.photo)} ${i + 1}" data-thumb="${i}"><img src="${A(`img/objets/${ph}-${p.sizes[0]}.webp`)}" alt="" width="${p.w}" height="${p.h}" loading="lazy"></button>`;
  }).join('')}</div>` : '';

  const specs = [
    [O.epoque, tbc(tr(ob.epoque, lang))],
    [O.materiaux, esc(tr(ob.materiaux, lang))],
    [O.dimensions, ob.dims ? `<span class="num">${esc(dimsText(ob.dims, lang))}</span>` : `<span class="tbc">${t(T.ui.aCompleter)}</span>`],
    [O.provenance, esc(tr(ob.provenance, lang))],
    [O.dispo, `<i class="dot"></i>${t(T.ui.dispo)}`]
  ].map(([k, v]) => `<dt>${t(k)}</dt><dd>${v}</dd>`).join('');

  const desc = tr(ob.description, lang).map(p => `<p>${tbc(p)}</p>`).join('');
  const crumbs = `<a class="link" href="${L(ROUTES.galerie[lang])}">${t(O.retour)}</a> / ${t(T.galerie.salle)} ${salle.num} — ${t(salle.titre)}`;

  const body = `
<article class="obj" data-obj="${ob.slug}">
  <div class="wrap">
    <p class="mono muted" style="margin-bottom:24px">${crumbs}</p>
    <div class="obj-grid">
      <div class="obj-stage">
        <div class="vitrine socle">
          <div class="obj-main" data-obj-main>${slides}<div class="etch" aria-hidden="true"><i></i><i></i><i></i></div><div class="loupe" aria-hidden="true" data-loupe><svg viewBox="0 0 190 190"><circle cx="95" cy="95" r="94"/><line x1="95" y1="80" x2="95" y2="110"/><line x1="80" y1="95" x2="110" y2="95"/></svg></div></div>
        </div>
        ${thumbs}
        <div class="obj-tools">
          <button class="btn" type="button" data-loupe-toggle aria-pressed="false">${I.loupe} ${t(O.loupe)}</button>
          <button class="btn" type="button" data-wall-open${ob.dims ? '' : ` disabled title="${t(O.murOff)}"`}>${I.wall} ${t(O.mur)}</button>
        </div>
        ${ob.dims ? '' : `<p class="mono muted" style="font-size:.75rem">${t(O.murOff)}</p>`}
      </div>
      <div class="obj-info">
        <span class="eyebrow">${t(T.galerie.salle)} ${salle.num} · ${t(salle.titre)}</span>
        <h1 data-split>${esc(plain(tr(ob.titre, lang)))}</h1>
        ${ob.auteur ? `<p class="obj-author">${esc(tr(ob.auteur, lang))}</p>` : ''}
        <dl class="specs">${specs}</dl>
        <div class="prose">${desc}</div>
        <div class="price"><div style="display:grid;gap:4px"><span class="eyebrow">${lang === 'fr' ? 'Prix' : 'Price'}</span><b>${t(T.ui.prix)}</b></div><button class="btn btn--fill" type="button" data-drawer-open data-magnetic>${t(O.demander)} ${I.arrow}</button></div>
        <p class="mono muted">${t(O.appeler)} <a class="sel" href="tel:+33387636161">03 87 63 61 61</a></p>
        <p class="mono muted" style="font-size:.75rem">${t(O.garanties)}</p>
      </div>
    </div>
    <nav class="obj-nav" aria-label="${lang === 'fr' ? 'Autres pièces' : 'Other pieces'}">
      <a href="${L(objRoute(prev.slug, lang))}"><span>← ${t(O.precedente)}</span><b>${esc(plain(tr(prev.court, lang)))}</b></a>
      <a href="${L(objRoute(next.slug, lang))}"><span>${t(O.suivante)} →</span><b>${esc(plain(tr(next.court, lang)))}</b></a>
    </nav>
    ${related.length ? `<section class="section--tight" style="padding-top:20px"><h2 class="h3" style="margin-bottom:28px">${t(O.memeSalle)}</h2><div class="related">${related.map((o, i) => pieceCard(o, ctx, i, related.length)).join('\n')}</div></section>` : ''}
  </div>
</article>

<div class="overlay" data-wall role="dialog" aria-modal="true" aria-labelledby="wall-title">
  <div class="wall">
    <div class="wall-head"><span id="wall-title">${t(O.murTitle)} — ${esc(plain(tr(ob.court, lang)))}</span><button class="tool" type="button" data-wall-close>${I.close} ${t(T.ui.close)}</button></div>
    <div class="wall-scene" data-wall-scene>${grok('g06-mur-salon', { A, alt: '', cls: 'wall-bg', sizes: '(max-width: 1200px) 100vw, 1200px' })}<div class="wall-layer" data-wall-layer></div></div>
    <div class="wall-foot"><span class="wall-note">${t(O.murNote)}</span><span class="num">${ob.dims ? esc(dimsText(ob.dims, lang)) : ''}</span></div>
  </div>
</div>
<div class="scrim" data-scrim></div>
<aside class="drawer" data-drawer role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  <div class="drawer-head"><h2 class="h3" id="drawer-title">${t(O.formTitle)}</h2><button class="tool" type="button" data-drawer-close>${I.close}<span class="sr-only">${t(T.ui.close)}</span></button></div>
  <div class="drawer-body">
    <div class="cartel"><span class="muted">${t(O.pieceLabel)}</span><span class="cartel-title">${esc(plain(tr(ob.titre, lang)))}</span><span>${esc(plain(tr(ob.epoque, lang)))}</span></div>
    <p class="muted">${t(O.formIntro)}</p>
    ${simpleForm(ctx, 'prix', `${lang === 'fr' ? 'Bonjour, je souhaite connaître le prix de la pièce' : 'Hello, I would like to know the price of'} « ${plain(tr(ob.titre, lang))} ».`)}
  </div>
</aside>`;
  return page(ctx, `${plain(tr(ob.titre, lang))} — Pierre Becq Antiquaire`, `${plain(tr(ob.titre, lang))}. ${plain(tr(ob.epoque, lang))}. ${tr(ob.materiaux, lang)}. ${tr(T.ui.prix, lang)}.`, body);
}

function simpleForm(ctx, id, prefill, withSubject) {
  const { lang } = ctx;
  const F = T.form;
  const t = x => esc(tr(x, lang));
  const subj = withSubject ? `<fieldset class="field"><legend>${t(F.sujet)}</legend><div class="choices">${tr(F.sujets, lang).map((s, i) => `<label class="choice"><input type="radio" name="sujet" id="${id}-sujet-${i}" value="${esc(s)}"${i === 0 ? ' checked' : ''}><span>${esc(s)}</span></label>`).join('')}</div></fieldset>` : '';
  return `<form class="form" data-form novalidate id="form-${id}">
  ${subj}
  <div class="field-row">
    <div class="field"><label for="${id}-nom">${t(F.nom)}</label><input id="${id}-nom" name="nom" autocomplete="name" required><span class="field-error" aria-live="polite"></span></div>
    <div class="field"><label for="${id}-tel">${t(F.tel)}</label><input id="${id}-tel" name="tel" type="tel" autocomplete="tel"><span class="field-error"></span></div>
  </div>
  <div class="field"><label for="${id}-email">${t(F.email)}</label><input id="${id}-email" name="email" type="email" autocomplete="email" required><span class="field-error" aria-live="polite"></span></div>
  <div class="field"><label for="${id}-message">${t(F.message)}</label><textarea data-lenis-prevent id="${id}-message" name="message" required>${esc(prefill || '')}</textarea><span class="field-error" aria-live="polite"></span></div>
  <label class="check" for="${id}-consent"><input type="checkbox" id="${id}-consent" name="consent" required><span>${t(F.consent)}</span></label>
  <span class="field-error" data-consent-error aria-live="polite"></span>
  <div><button class="btn btn--fill" type="submit">${t(F.envoyer)} ${I.arrow}</button></div>
  <p class="demo-note">${t(F.demo)}</p>
  <div class="form-success" data-success hidden tabindex="-1"><h3>${t(F.okTitle)}</h3><p>${t(F.okText)}</p><p class="demo-note">${t(F.demo)}</p></div>
</form>`;
}

/* ======================= EXPERTISES ======================= */
function expertises(ctx) {
  const { lang, A, L } = ctx;
  const E = T.expertises;
  const t = x => esc(tr(x, lang));
  const publics = E.publics.map(pb => `<article class="public" data-tilt>
  ${grokPhoto(pb.img, { A, sizes: '(max-width: 960px) 90vw, 30vw', alt: '' })}
  <div class="public-body"><h3>${t(pb.title)}</h3>${tr(pb.text, lang).map(p => `<p>${esc(p)}</p>`).join('')}</div>
</article>`).join('\n');
  const steps = E.steps.map(s => `<div class="step" data-reveal><h3>${t(s.t)}</h3><p>${t(s.d)}</p></div>`).join('');
  const choices = (name, opts) => `<div class="choices">${tr(opts, lang).map((o, i) => `<label class="choice"><input type="radio" name="${name}" id="x-${name}-${i}" value="${esc(o)}"${i === 0 ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`;
  const F = T.form;
  const wizard = `<form class="wizard" data-wizard novalidate id="form-expertise">
  <ol class="wizard-progress" aria-label="${lang === 'fr' ? 'Étapes' : 'Steps'}">${tr(E.wiz, lang).map((w, i) => `<li data-wiz-mark="${i}"${i === 0 ? ' class="is-current" aria-current="step"' : ''}>${String(i + 1).padStart(2, '0')} · ${esc(w)}</li>`).join('')}</ol>
  <div class="wizard-step" data-wiz-step="0">
    <fieldset class="field"><legend>${t(E.vous)}</legend>${choices('profil', E.vousOpts)}</fieldset>
    <fieldset class="field"><legend>${t(E.motif)}</legend>${choices('motif', E.motifOpts)}</fieldset>
  </div>
  <div class="wizard-step" data-wiz-step="1" hidden>
    <div class="field"><label for="x-objets">${t(E.objets)}</label><textarea data-lenis-prevent id="x-objets" name="objets" required placeholder="${t(E.objetsPh)}"></textarea><span class="field-error" aria-live="polite"></span></div>
    <div class="field" style="max-width:240px"><label for="x-nombre">${t(E.nombre)}</label><input id="x-nombre" name="nombre" type="number" min="1" inputmode="numeric"><span class="field-error"></span></div>
    <div class="field"><span class="field-label" style="font-family:var(--f-mono);font-size:var(--fs-cap);letter-spacing:.12em;text-transform:uppercase;color:var(--graphite-2)">${t(E.photos)}</span>
      <label class="drop" for="x-photos" data-drop><input id="x-photos" type="file" accept="image/*" multiple data-files><b style="font-weight:500">${t(E.drop)}</b><span class="mono muted">${t(E.dropSub)}</span></label>
      <div class="previews" data-previews></div>
    </div>
  </div>
  <div class="wizard-step" data-wiz-step="2" hidden>
    <div class="field-row">
      <div class="field"><label for="x-nom">${t(F.nom)}</label><input id="x-nom" name="nom" autocomplete="name" required><span class="field-error" aria-live="polite"></span></div>
      <div class="field"><label for="x-ville">${t(F.ville)}</label><input id="x-ville" name="ville" autocomplete="address-level2"><span class="field-error"></span></div>
    </div>
    <div class="field-row">
      <div class="field"><label for="x-email">${t(F.email)}</label><input id="x-email" name="email" type="email" autocomplete="email" required><span class="field-error" aria-live="polite"></span></div>
      <div class="field"><label for="x-tel">${t(F.tel)}</label><input id="x-tel" name="tel" type="tel" autocomplete="tel"><span class="field-error"></span></div>
    </div>
    <label class="check" for="x-consent"><input type="checkbox" id="x-consent" name="consent" required><span>${t(F.consent)}</span></label>
    <span class="field-error" data-consent-error aria-live="polite"></span>
  </div>
  <div class="wizard-step" data-wiz-step="3" hidden>
    <h3>${t(E.recap)}</h3>
    <dl class="recap" data-recap></dl>
  </div>
  <div class="wizard-nav">
    <button class="btn" type="button" data-wiz-prev hidden>${I.arrowL} ${t(E.precedent)}</button>
    <button class="btn btn--fill" type="button" data-wiz-next style="margin-left:auto">${t(E.suivant)} ${I.arrow}</button>
    <button class="btn btn--sevres" type="submit" data-wiz-submit hidden style="margin-left:auto">${t(F.envoyer)} ${I.arrow}</button>
  </div>
  <p class="demo-note">${t(F.demo)}</p>
  <div class="form-success" data-success hidden tabindex="-1"><h3>${t(F.okTitle)}</h3><p>${t(F.okText)}</p><p class="demo-note">${t(F.demo)}</p></div>
</form>`;

  const body = `
<section class="phero">
  <div class="wrap phero-grid">
    <div class="phero-copy">
      <span class="eyebrow">Pierre Becq · ${lang === 'fr' ? 'Expert' : 'Expert'}</span>
      <h1 data-split>${t(E.h1)}</h1>
      <p class="lead" data-reveal>${t(E.lead)}</p>
      ${titres(ctx)}
      <div class="btn-row" data-reveal><a class="btn btn--fill" href="#demande" data-magnetic>${t(T.home.cta2)} ${I.arrow}</a><a class="mono sel" style="align-self:center" href="tel:+33387636161">03 87 63 61 61</a></div>
    </div>
    <div class="phero-media"><div class="photo photo--scene" style="--ar:1168/784" data-etch>${grokPicture('g07-expertise-loupe', 'g08-expertise-loupe', { A, eager: true, alt: '', sizes: '(max-width: 860px) 92vw, 48vw' })}</div></div>
  </div>
</section>
<section class="section" style="padding-top:clamp(40px,6vw,90px)">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">${t(E.pourqui)}</span><h2 data-split>${t(E.pourquiTitle)}</h2></div>
    <div class="publics" style="margin-top:0">${publics}</div>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    <div class="grid" style="align-items:end">
      <div style="grid-column:1/-1;max-width:760px" class="stack"><span class="eyebrow">${t(E.rapportEyebrow)}</span><h2 class="h3" data-split style="font-size:clamp(2.2rem,1.4rem + 2.6vw,4rem)">${t(E.rapportTitle)}</h2><p class="lead muted" data-reveal>${t(E.rapportText)}</p></div>
    </div>
    <div class="steps"><div class="steps-line" data-steps-line></div>${steps}</div>
    <div class="grid" style="margin-top:clamp(56px,7vw,100px)">
      <div style="grid-column:span 12" class="stack">
        <span class="eyebrow">${t(E.estimons)}</span>
        <div class="choices" data-reveal>${tr(E.estimonsList, lang).map(x => `<span class="chip" style="cursor:default">${esc(x)}</span>`).join('')}</div>
        <p class="mono" data-reveal>${t(E.tarifs)}${lang === 'fr' ? ' :' : ':'} <span class="tbc">${t(T.ui.aCompleter)}</span></p>
      </div>
    </div>
  </div>
</section>
<section class="section" id="demande" style="background:var(--plaster-2)">
  <div class="wrap">
    <div class="grid">
      <div style="grid-column:1/span 4" class="stack" data-demande-aside>
        <span class="eyebrow">${t(E.formEyebrow)}</span>
        <h2 class="h3" data-split style="font-size:clamp(2.2rem,1.4rem + 2.6vw,3.8rem)">${t(E.formTitle)}</h2>
        <p class="muted" data-reveal>${t(E.lead)}</p>
        <div class="cartel" data-reveal><span class="muted">${t(E.direct)}</span><a class="cartel-title sel" href="tel:+33387636161">03 87 63 61 61</a><span>5 rue Gambetta, 57000 Metz</span><span class="open-now" data-open-now></span></div>
      </div>
      <div style="grid-column:6/span 7" class="wiz-col">${wizard}</div>
    </div>
  </div>
</section>`;
  return page(ctx, tr(E.title, lang), tr(E.desc, lang), body);
}

/* ======================= MAISON ======================= */
function maison(ctx) {
  const { lang, A, L } = ctx;
  const M = T.maison;
  const t = x => esc(tr(x, lang));
  const frise = M.frise.map(f => `<li data-reveal><b>${f.y === 'now' ? `<span data-year>${YEAR_NOW}</span>` : esc(f.y)}</b><span>${t(f.t)}${f.tbc ? ` <span class="tbc">${t(T.ui.aCompleter)}</span>` : ''}</span></li>`).join('');
  const album = M.album.map(a => `<figure>${photo(a.key, { A, alt: tr(a.cap, lang), etch: true, sizes: '(max-width: 860px) 92vw, 50vw' })}<figcaption class="mono muted">${t(a.cap)}</figcaption></figure>`).join('');
  const body = `
<section class="phero phero--full">
  <div class="phero-bg">${photo('maison/boutique-portrait', { A, alt: tr(M.heroAlt, lang), eager: true, sizes: '100vw', extra: ' data-parallax-inner' })}</div>
  <div class="wrap"><div class="phero-copy" style="max-width:860px">
    <span class="eyebrow">${t(M.friseEyebrow)}</span>
    <h1 data-split>${t(M.h1)}</h1>
    <p class="lead" data-reveal>${t(M.lead)}</p>
  </div></div>
</section>
<section class="section">
  <div class="wrap frise">
    <div class="sphere-box"><svg class="sphere" data-sphere data-sphere-big viewBox="-120 -120 240 240" aria-hidden="true"></svg></div>
    <div class="stack" style="gap:30px">
      <span class="eyebrow">${t(M.friseEyebrow)}</span>
      <div class="since-year"><span data-year-roll data-from="1969">1969</span><small><span data-years-count>${YEAR_NOW - 1969}</span> ${t(T.home.sinceYears)}</small></div>
      <h2 class="h3" data-split style="font-size:clamp(2rem,1.4rem + 2.2vw,3.4rem)">${t(M.friseTitle)}</h2>
      <ol class="timeline">${frise}</ol>
    </div>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    <div class="grid" style="align-items:start">
      <div class="stack" style="grid-column:1/span 6;gap:24px">
        <span class="eyebrow">${t(M.specEyebrow)}</span>
        <h2 class="h3" data-split style="font-size:clamp(2.2rem,1.4rem + 2.6vw,4rem)">${t(M.specTitle)}</h2>
        <div class="prose" data-reveal>${tr(M.specText, lang).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      </div>
      <div style="grid-column:8/span 5;align-self:end">${titres(ctx, 'titres cred-col')}</div>
    </div>
    <div class="album" style="margin-top:clamp(56px,7vw,110px)">${album}</div>
  </div>
</section>
<section class="section engage-band">
  <div class="bg" data-parallax="-10">${grok('g19-dorure', { A, alt: '' })}</div>
  <div class="wrap">
    <div class="grid">
      <div class="stack" style="grid-column:1/span 5;gap:22px"><span class="eyebrow">${t(M.engageEyebrow)}</span><h2 class="h3" data-split style="font-size:clamp(2.2rem,1.4rem + 2.6vw,4rem)">${t(M.engageTitle)}</h2></div>
      <ul class="engagements" style="grid-column:7/span 6">${M.engagements.map(e => `<li data-reveal><span>—</span><span>${t(e)}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">${t(M.lieuxEyebrow)}</span><h2 data-split>${t(M.lieuxTitle)}</h2><p class="lead" data-reveal>${t(M.lieuxLead)}</p></div>
    <div class="venir">${addrCards(ctx)}${mapBlock(ctx)}</div>
    <div class="services" style="margin-top:clamp(70px,9vw,140px)">
      ${T.home.services.filter(s => s.img).map(s => `<article class="service">${grokPhoto(s.img, { A, etch: true, alt: '', sizes: '(max-width: 860px) 92vw, 40vw' })}<h3 data-reveal>${t(s.title)}</h3><p data-reveal>${t(s.text)}</p></article>`).join('')}
      <article class="service service--text"><h3 data-split>${t(T.home.services[3].title)}</h3><p data-reveal>${t(T.home.services[3].text)}</p><a class="link-arrow" data-reveal href="${L(ROUTES.contact[lang])}">${t(T.home.services[3].cta)} ${I.arrow}</a></article>
    </div>
  </div>
</section>`;
  return page(ctx, tr(M.title, lang), tr(M.desc, lang), body);
}

/* ======================= CONTACT ======================= */
function contact(ctx) {
  const { lang, A, L } = ctx;
  const K = T.contact;
  const t = x => esc(tr(x, lang));
  const body = `
<section class="phero">
  <div class="wrap phero-grid">
    <div class="phero-copy">
      <span class="eyebrow">Pierre Becq · Metz</span>
      <h1 data-split>${t(K.h1)}</h1>
      <p class="lead" data-reveal>${t(K.lead)}</p>
      <p class="h3" data-reveal style="font-size:clamp(2rem,1.4rem + 2vw,3.2rem)"><a class="sel" href="tel:+33387636161">03 87 63 61 61</a></p>
      <p class="mono" data-reveal>${t(K.horaires)}${lang === 'fr' ? ' :' : ':'} <span class="open-now" data-open-now></span></p>
    </div>
    <div class="phero-media">${photo('maison/facade-rue-gambetta', { A, alt: tr(K.heroAlt, lang), etch: true, eager: true, sizes: '(max-width: 860px) 92vw, 48vw' })}</div>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    <div class="grid">
      <div style="grid-column:1/span 5">${addrCards(ctx, true)}</div>
      <div style="grid-column:7/span 6" class="stack">
        <span class="eyebrow">${t(K.formEyebrow)}</span>
        <h2 class="h3">${t(K.formTitle)}</h2>
        <div class="wizard">${simpleForm(ctx, 'contact', '', true)}</div>
      </div>
    </div>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="band">${grok('g18-pierre-jaumont', { A, alt: '', extra: ' data-parallax-img' })}<p class="band-title">${t(T.home.band)}</p></div>
  <div class="wrap">${mapBlock(ctx)}</div>
</section>`;
  return page(ctx, tr(K.title, lang), tr(K.desc, lang), body);
}

/* ======================= MENTIONS ======================= */
function mentions(ctx) {
  const { lang, A, L } = ctx;
  const fr = lang === 'fr';
  const tb = `<span class="tbc">${fr ? 'à compléter' : 'to be completed'}</span>`;
  const sections = fr ? [
    ['editeur', 'Éditeur du site', `<dl><dt>Raison sociale</dt><dd>Pierre Becq Antiquaire ${tb}</dd><dt>Forme juridique</dt><dd>${tb}</dd><dt>Adresse</dt><dd class="sel">5 rue Gambetta, 57000 Metz</dd><dt>Téléphone</dt><dd><a class="sel" href="tel:+33387636161">03 87 63 61 61</a></dd><dt>E-mail</dt><dd>${tb}</dd><dt>SIRET</dt><dd>${tb}</dd><dt>RCS</dt><dd>${tb}</dd><dt>TVA intracommunautaire</dt><dd>${tb}</dd><dt>Directeur de la publication</dt><dd>${tb}</dd></dl>`],
    ['titres', 'Titres et qualités', `<p>Expert judiciaire honoraire près la cour d'appel ${`<span class="tbc">cour d'appel à préciser</span>`}. Membre de la Compagnie Nationale des Experts en Art.</p>`],
    ['hebergeur', 'Hébergement', `<dl><dt>Hébergeur</dt><dd>Vercel Inc.</dd><dt>Adresse</dt><dd>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</dd><dt>Site</dt><dd><a class="link" href="https://vercel.com" rel="noopener" target="_blank">vercel.com</a></dd></dl>`],
    ['conception', 'Conception', `<p>Site conçu par <a class="link" href="https://www.ptit-kiwi.fr/" rel="noopener" target="_blank">Ptit Kiwi</a>.</p>`],
    ['donnees', 'Données personnelles', `<p>Les formulaires du site (demande de prix, demande d'expertise, contact) recueillent votre nom, vos coordonnées, votre message et, si vous le souhaitez, des photos. Ces données servent uniquement à répondre à votre demande et ne sont jamais cédées.</p><p>Responsable du traitement : Pierre Becq Antiquaire. Durée de conservation : ${tb}.</p><p>Vous pouvez accéder à vos données, les rectifier ou demander leur effacement en écrivant à la boutique. En cas de difficulté, vous pouvez saisir la CNIL (<a class="link" href="https://www.cnil.fr" rel="noopener" target="_blank">cnil.fr</a>).</p>`],
    ['cookies', 'Cookies et stockage', `<p>Le site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Il enregistre seulement dans votre navigateur votre préférence « Réduire les animations ».</p>`],
    ['mediation', 'Médiation de la consommation', `<p>Médiateur de la consommation compétent : ${tb}.</p>`],
    ['propriete', 'Propriété intellectuelle et images', `<p>Les photographies des objets, de la boutique et les textes appartiennent à Pierre Becq Antiquaire. Toute reproduction sans autorisation est interdite.</p><p>Certaines images d'ambiance (salles, matières, scènes d'expertise) sont générées par intelligence artificielle. Les photographies des objets sont réelles et non retouchées.</p>`]
  ] : [
    ['editeur', 'Publisher', `<dl><dt>Company name</dt><dd>Pierre Becq Antiquaire ${tb}</dd><dt>Legal form</dt><dd>${tb}</dd><dt>Address</dt><dd class="sel">5 rue Gambetta, 57000 Metz, France</dd><dt>Phone</dt><dd><a class="sel" href="tel:+33387636161">+33 3 87 63 61 61</a></dd><dt>Email</dt><dd>${tb}</dd><dt>SIRET</dt><dd>${tb}</dd><dt>Trade register (RCS)</dt><dd>${tb}</dd><dt>EU VAT number</dt><dd>${tb}</dd><dt>Publication director</dt><dd>${tb}</dd></dl>`],
    ['titres', 'Titles', `<p>Honorary court-appointed expert at the Court of Appeal <span class="tbc">court to be confirmed</span>. Member of the Compagnie Nationale des Experts en Art.</p>`],
    ['hebergeur', 'Hosting', `<dl><dt>Host</dt><dd>Vercel Inc.</dd><dt>Address</dt><dd>440 N Barranca Ave #4133, Covina, CA 91723, USA</dd><dt>Website</dt><dd><a class="link" href="https://vercel.com" rel="noopener" target="_blank">vercel.com</a></dd></dl>`],
    ['conception', 'Design', `<p>Website designed by <a class="link" href="https://www.ptit-kiwi.fr/" rel="noopener" target="_blank">Ptit Kiwi</a>.</p>`],
    ['donnees', 'Personal data', `<p>The site’s forms (price request, appraisal request, contact) collect your name, contact details, message and, if you wish, photos. This data is used only to answer your request and is never passed on.</p><p>Data controller: Pierre Becq Antiquaire. Retention period: ${tb}.</p><p>You can access, correct or delete your data by writing to the shop. If needed, you can contact the CNIL (<a class="link" href="https://www.cnil.fr" rel="noopener" target="_blank">cnil.fr</a>).</p>`],
    ['cookies', 'Cookies and storage', `<p>The site uses no advertising cookies and no audience measurement. It only stores your “Reduce motion” preference in your browser.</p>`],
    ['mediation', 'Consumer mediation', `<p>Competent consumer mediator: ${tb}.</p>`],
    ['propriete', 'Intellectual property and images', `<p>Photographs of the objects and the shop, and all texts, belong to Pierre Becq Antiquaire. Reproduction without permission is prohibited.</p><p>Some atmosphere images (rooms, materials, appraisal scenes) are generated by artificial intelligence. Photographs of the objects are real and not retouched.</p>`]
  ];
  const body = `
<section class="phero phero--plaster" style="padding-bottom:clamp(40px,6vw,90px)">
  <div class="wrap"><div class="phero-copy"><span class="eyebrow">Pierre Becq Antiquaire</span><h1 data-split style="font-size:clamp(3rem,1.4rem + 6vw,7rem)">${esc(tr(T.mentions.h1, lang))}</h1></div></div>
</section>
<section class="section section--tight">
  <div class="wrap legal">
    <nav class="legal-toc" aria-label="${fr ? 'Sommaire' : 'Contents'}">${sections.map(([id, h]) => `<a class="link" href="#${id}" style="justify-self:start">${h}</a>`).join('')}</nav>
    <div class="legal-body">${sections.map(([id, h, c]) => `<section id="${id}"><h2>${h}</h2>${c}</section>`).join('')}</div>
  </div>
</section>`;
  return page(ctx, tr(T.mentions.title, lang), tr(T.mentions.desc, lang), body);
}

/* ======================= 404 ======================= */
function notFound() {
  const ctx = { lang: 'fr', file: '404.html', page: 'nf', navKey: null, veilTitle: 'Pierre Becq', A: p => '/assets/' + p, L: p => '/' + p.replace(/^index\.html$/, ''), altFile: 'en/index.html' };
  const N = T.nf;
  const body = `
<section class="nf">
  <div class="wrap nf-grid">
    <div class="stack" style="gap:24px">
      <span class="eyebrow">404</span>
      <h1 data-split style="font-size:clamp(3rem,1.4rem + 6vw,7.5rem)">${esc(N.h1.fr)}</h1>
      <p class="lead">${esc(N.text.fr)}</p>
      <p class="lead muted" lang="en">${esc(N.text.en)}</p>
      <div class="btn-row"><a class="btn btn--fill" href="/">${esc(N.back.fr)}</a><a class="btn" href="/galerie">${esc(T.nav.galerie.fr)}</a></div>
    </div>
    ${grokPhoto('g20-socle-vide', { A: ctx.A, alt: '', etch: true, sizes: '(max-width: 760px) 92vw, 44vw' })}
  </div>
</section>`;
  let html = page(ctx, tr(N.title, 'fr'), tr(N.text, 'fr'), body);
  html = html.replace(/<link rel="alternate"[^>]*>\n?/, '');
  return html;
}

/* ======================= data.js ======================= */
function dataJS() {
  const objets = {};
  for (const o of OBJETS) {
    objets[o.slug] = {
      slug: o.slug, salle: o.salle, type: o.type, place: o.place, y: o.y || null, dims: o.dims,
      color: colorOf(o),
      titre: { fr: plain(o.titre.fr), en: plain(o.titre.en) },
      court: o.court,
      epoque: { fr: plain(o.epoque.fr), en: plain(o.epoque.en) },
      materiaux: o.materiaux,
      url: { fr: objRoute(o.slug, 'fr'), en: objRoute(o.slug, 'en') },
      photos: o.photos.map(ph => {
        const p = PHOTOS['objets/' + ph];
        return { key: ph, w: p.w, h: p.h, sizes: p.sizes, bg: p.bg, bbox: p.bbox, frame: p.frame };
      })
    };
  }
  const data = {
    objets,
    hero: HERO.map(s => ({ slug: s, note: T.home.heroNote[s] })),
    maison: {
      /* Horaires d'ouverture : à compléter. Format : { 1: [["10:00","12:00"],["14:00","19:00"]], ... } (1 = lundi, 7 = dimanche) */
      horaires: null,
      fuseau: 'Europe/Paris'
    },
    i18n: {
      fr: { voir: 'Voir', loupe: 'Loupe', glisser: 'Glisser', copie: 'Copié', ouvert: 'Ouvert maintenant', ferme: 'Fermé', horairesTbc: 'Horaires à compléter', motionOn: 'Animations réduites', motionOff: 'Réduire les animations', aucune: 'Aucune', fichiers: 'photo(s)', retirer: 'Retirer', fig: '1,75 m', console: 'console 85 cm', salle: 'Salle', pieces: 'pièces', piece: 'pièce', annees: 'ans', profil: 'Profil', motif: 'Motif', objets: 'Objets', nombre: 'Nombre', photos: 'Photos', nom: 'Nom', ville: 'Ville', email: 'E-mail', tel: 'Téléphone' },
      en: { voir: 'View', loupe: 'Loupe', glisser: 'Drag', copie: 'Copied', ouvert: 'Open now', ferme: 'Closed', horairesTbc: 'Opening hours to be completed', motionOn: 'Motion reduced', motionOff: 'Reduce motion', aucune: 'None', fichiers: 'photo(s)', retirer: 'Remove', fig: '1.75 m', console: '85 cm console', salle: 'Room', pieces: 'pieces', piece: 'piece', annees: 'years', profil: 'Profile', motif: 'Purpose', objets: 'Objects', nombre: 'Number', photos: 'Photos', nom: 'Name', ville: 'Town', email: 'Email', tel: 'Phone' }
    },
    map: {
      pins: [
        { id: 'lux', label: 'Luxembourg', lat: 49.6116, lon: 6.1319 },
        { id: 'metz', label: 'Metz', sub: '5 rue Gambetta', lat: 49.1193, lon: 6.1757, main: true },
        { id: 'senon', label: 'Senon', sub: '3 rue de la Fontaine', lat: 49.2906, lon: 5.6339 },
        { id: 'nancy', label: 'Nancy', lat: 48.6921, lon: 6.1844 }
      ],
      moselle: [[48.5, 6.2], [48.58, 6.13], [48.61, 6.04], [48.64, 5.94], [48.68, 5.89], [48.72, 5.95], [48.75, 6.05], [48.77, 6.12], [48.84, 6.1], [48.905, 6.055], [48.98, 6.04], [49.05, 6.06], [49.12, 6.165], [49.2, 6.19], [49.28, 6.17], [49.36, 6.17], [49.41, 6.24], [49.45, 6.35], [49.53, 6.37], [49.62, 6.42], [49.7, 6.5]]
    }
  };
  return `/* Données de la maquette — générées par _build/build.js depuis _build/content. */\nwindow.PB_DATA = ${JSON.stringify(data)};\n`;
}

/* ======================= build ======================= */
/* Typographie française : espace insécable avant : ; ! ? et à l'intérieur des « », apostrophe typographique.
   Seulement sur les pages françaises, hors script, style, pre, code et textarea. */
function typoFr(html) {
  const NB = '\u00a0';
  const fix = (t, attr) => {
    t = t.replace(/ ([:;!?])(?=[\s<"'»)\]]|$)/g, NB + '$1').replace(/« /g, '«' + NB).replace(/ »/g, NB + '»');
    return t.replace(/([A-Za-zÀ-ÖØ-öø-ÿŒœ])'([A-Za-zÀ-ÖØ-öø-ÿŒœ])/g, '$1’$2');
  };
  let out = ''; let i = 0; let skip = null; let m;
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g;
  while ((m = re.exec(html))) {
    let text = html.slice(i, m.index);
    if (!skip && text) text = fix(text);
    out += text;
    let tag = m[0]; const name = (m[2] || '').toLowerCase();
    if (tag.startsWith('<!--')) { out += tag; i = re.lastIndex; continue; }
    if (skip) { if (m[1] && name === skip) skip = null; out += tag; i = re.lastIndex; continue; }
    if (!m[1] && /^(script|style|pre|code|textarea)$/.test(name)) skip = name;
    const meta = name === 'meta' && /(name|property)="(description|og:title|og:description)"/.test(tag);
    tag = tag.replace(/\s(alt|title|aria-label|placeholder|content)="([^"]*)"/g, (all, a, v) => (a === 'content' && !meta ? all : ` ${a}="${fix(v, true)}"`));
    out += tag; i = re.lastIndex;
  }
  return out + (skip ? html.slice(i) : fix(html.slice(i)));
}
function write(file, html) {
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, /^<!doctype html>\s*<html lang="fr"/i.test(html) ? typoFr(html) : html);
}

function buildAll() {
  const vt = (k, lang) => tr(T.nav[k] || { fr: 'Pierre Becq', en: 'Pierre Becq' }, lang);
  for (const lang of ['fr', 'en']) {
    const other = lang === 'fr' ? 'en' : 'fr';
    const mk = (key, pageId, navKey, veil) => makeCtx(lang, ROUTES[key][lang], pageId, navKey, ROUTES[key][other], veil);
    write(ROUTES.home[lang], home(mk('home', 'home', null, 'Pierre Becq')));
    write(ROUTES.galerie[lang], galerie(mk('galerie', 'galerie', 'galerie', vt('galerie', lang))));
    write(ROUTES.expertises[lang], expertises(mk('expertises', 'expertises', 'expertises', vt('expertises', lang))));
    write(ROUTES.maison[lang], maison(mk('maison', 'maison', 'maison', vt('maison', lang))));
    write(ROUTES.contact[lang], contact(mk('contact', 'contact', 'contact', vt('contact', lang))));
    write(ROUTES.mentions[lang], mentions(mk('mentions', 'mentions', null, tr(T.mentions.h1, lang))));
    for (const ob of OBJETS) {
      const f = objRoute(ob.slug, lang);
      write(f, objet(makeCtx(lang, f, 'objet', 'galerie', objRoute(ob.slug, other), tr(ob.court, lang)), ob));
    }
  }
  write('404.html', notFound());
  write('assets/js/data.js', dataJS());

  /* vercel.json : URLs propres + redirections des anciennes adresses Wix */
  const redirects = [
    ...C.objets.filter(o => !o.masque).map(o => ({ source: `/product-page/${encodeURI(o.ancien)}`, destination: `/objets/${o.slug}`, permanent: true })),
    { source: '/product-page/boque-en-ivoire', destination: '/galerie', permanent: false },
    { source: `/${encodeURI('à-propos')}`, destination: '/maison', permanent: true },
    { source: '/shipping-returns', destination: '/mentions-legales', permanent: true },
    { source: '/faq', destination: '/', permanent: true },
    { source: '/blog', destination: '/', permanent: true }
  ];
  write('vercel.json', JSON.stringify({ cleanUrls: true, trailingSlash: false, redirects }, null, 2) + '\n');
  console.log('pages générées');
}

module.exports = { buildAll };
