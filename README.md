# Pierre Becq Antiquaire — maquette « Salle blanche »

Site statique (HTML, CSS, JavaScript), sans étape de construction, prêt pour Vercel.

## Structure

- `index.html`, `galerie.html`, `expertises.html`, `maison.html`, `contact.html`, `mentions-legales.html`, `404.html` — pages en français
- `objets/*.html` — une fiche par pièce (14 pièces)
- `en/` — version anglaise (mêmes pages, `en/objects/` pour les fiches)
- `assets/css/site.css` — styles
- `assets/js/site.js` — animations et fonctionnalités (cotes, salles, loupe, vue au mur, formulaires, carte, sphère)
- `assets/js/data.js` — données utilisées par le script (généré)
- `assets/vendor/` — GSAP 3.15, Lenis 1.3.27, OGL 1.0.11, hébergés avec le site
- `assets/fonts/` — Instrument Serif, Inter Tight, IBM Plex Mono (licences OFL incluses)
- `assets/img/objets`, `assets/img/maison` — photos du client en WebP ; `assets/img/grok` — images d'ambiance générées
- `vercel.json` — URLs propres et redirection des anciennes adresses Wix

## Modifier les contenus

Les textes et les pièces sont dans `_build/content/` (`objets.js`, `textes.js`).
Après une modification, régénérer les pages :

```
node _build/build.js
```

Les horaires d'ouverture se renseignent dans `_build/pages.js` (`maison.horaires`), puis régénération.

## À compléter avant la mise en ligne

Horaires, e-mail, mentions légales (forme juridique, SIRET, RCS, TVA, directeur de publication, médiateur), rôle du site de Senon, cour d'appel du titre d'expert, époque du vase Jaget et Pinon, cadre du Christ (absent des photos).
La chope en ivoire n'est pas publiée : certificat intra-UE requis.
