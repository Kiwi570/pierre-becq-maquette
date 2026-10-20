/* Les objets de la galerie — source unique.
   Textes repris des fiches du site actuel (coquilles corrigées, rien ajouté).
   dims en cm. place : "mur" (accroché), "console" (posé), "sol" (siège).
   Pour publier la chope en ivoire : fournir le certificat intra-UE puis passer masque à false. */

module.exports = {
  salles: [
    { id: 'xviii', num: 'I', titre: { fr: 'XVIIe – XVIIIe siècles', en: '17th – 18th centuries' },
      sous: { fr: 'Bois de Sainte-Lucie, sièges estampillés, art sacré.', en: 'Sainte-Lucie wood, stamped seats, sacred art.' } },
    { id: 'xix', num: 'II', titre: { fr: 'Consulat, Empire, XIXe siècle', en: 'Consulate, Empire, 19th century' },
      sous: { fr: 'Bronzes dorés, horlogerie, terre cuite.', en: 'Gilt bronze, clocks, terracotta.' } },
    { id: 'xx', num: 'III', titre: { fr: 'Vers 1900 et XXe siècle', en: 'Around 1900 and the 20th century' },
      sous: { fr: 'Verre, céramique, métal, peinture.', en: 'Glass, ceramics, metal, painting.' } }
  ],

  types: [
    { id: 'mobilier', fr: 'Mobilier', en: 'Furniture' },
    { id: 'objets', fr: "Objets d'art", en: 'Objets d’art' },
    { id: 'sacre', fr: 'Sculpture et art sacré', en: 'Sculpture & sacred art' },
    { id: 'tableaux', fr: 'Tableaux', en: 'Paintings' }
  ],

  objets: [
    {
      slug: 'applique-prouve', ancien: 'applique-de-jean-prouvé', salle: 'xx', type: 'objets', place: 'mur', y: 175,
      photos: ['applique-prouve-1', 'applique-prouve-2', 'applique-prouve-3', 'applique-prouve-4', 'applique-prouve-5'],
      titre: { fr: 'Applique de Jean Prouvé', en: 'Wall light by Jean Prouvé' },
      court: { fr: 'Applique, Jean Prouvé', en: 'Wall light, Jean Prouvé' },
      auteur: { fr: 'Jean Prouvé — signée « J. Prouvé » sur la base, à droite', en: 'Jean Prouvé — signed “J. Prouvé” on the base, right' },
      epoque: { fr: 'Vers 1925', en: 'Circa 1925' },
      materiaux: { fr: "Tôle d'acier martelé, verre dépoli", en: 'Hammered sheet steel, frosted glass' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 14.5, l: 50, p: 11.5 },
      description: {
        fr: ["Rare applique murale en tôle d'acier martelé garnie de cinq plaques de verre dépoli enfilées dans les découpes de la tôle. Signée J. Prouvé sur la base à droite. Vers 1925.",
             "Elle fut prêtée au Centre Pompidou lors de l'exposition Jean Prouvé « Constructeur », du 24 octobre 1990 au 29 janvier 1991."],
        en: ['A rare wall light in hammered sheet steel, fitted with five frosted glass plates slotted into the cut-outs of the metal. Signed J. Prouvé on the base, right. Circa 1925.',
             'It was lent to the Centre Pompidou for the exhibition “Jean Prouvé constructeur”, 24 October 1990 – 29 January 1991.']
      }
    },
    {
      slug: 'vase-daum', ancien: 'vase-daum-de-nancy-2', salle: 'xx', type: 'objets', place: 'console',
      photos: ['vase-daum-1', 'vase-daum-4', 'vase-daum-2', 'vase-daum-3'],
      titre: { fr: 'Vase Daum Nancy', en: 'Daum Nancy vase' },
      court: { fr: 'Vase, Daum Nancy', en: 'Vase, Daum Nancy' },
      auteur: { fr: 'Daum Nancy — signé', en: 'Daum Nancy — signed' },
      epoque: { fr: 'Époque Art nouveau (1900)', en: 'Art Nouveau period (1900)' },
      materiaux: { fr: "Verre multicouche gravé à l'acide, repris à la roue et martelé", en: 'Multi-layered glass, acid-etched, wheel-finished and hammered' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 42 },
      description: {
        fr: ["Vase par Daum Nancy, signé, d'époque Art nouveau. En verre multicouche gravé à l'acide, repris à la roue, et martelé. Beau motif délicat de fleurs de tabac."],
        en: ['Vase by Daum Nancy, signed, Art Nouveau period. Multi-layered glass, acid-etched, wheel-finished and hammered. A fine, delicate tobacco-flower motif.']
      }
    },
    {
      slug: 'christ-sainte-lucie', ancien: 'christ-en-bois-de-sainte-lucie', salle: 'xviii', type: 'sacre', place: 'console',
      photos: ['christ-sainte-lucie-3', 'christ-sainte-lucie-2', 'christ-sainte-lucie-1', 'christ-sainte-lucie-4', 'christ-sainte-lucie-5', 'christ-sainte-lucie-6'],
      titre: { fr: 'Christ en bois de Sainte-Lucie', en: 'Christ in Sainte-Lucie wood' },
      court: { fr: 'Christ, bois de Sainte-Lucie', en: 'Christ, Sainte-Lucie wood' },
      auteur: null,
      epoque: { fr: "Début du XVIIIe siècle, fin de l'époque Louis XIV", en: 'Early 18th century, late Louis XIV period' },
      materiaux: { fr: 'Bois de Sainte-Lucie, dit bois de Bagard', en: 'Sainte-Lucie wood, known as Bagard wood' },
      provenance: { fr: 'Nancy', en: 'Nancy' },
      dims: { h: 66, l: 24.5, p: 12 },
      description: {
        fr: ["Grand Christ en croix en bois de Sainte-Lucie, dit aussi bois de Bagard, du nom de l'artiste lorrain. Nancy, début XVIIIe siècle, fin de l'époque Louis XIV.",
             'Le Christ cloué sur la croix est présenté agonisant, la tête légèrement penchée sur sa droite, les yeux ouverts et tournés vers le ciel. Le périzonium est noué par une corde et la croix est sommée du titulus sur lequel est inscrit INRI.',
             "Il est présenté dans un beau cadre ovale en bois doré d'époque Louis XIV. [[À vérifier : le cadre n'apparaît pas sur les photos]]"],
        en: ['A large Christ on the cross in Sainte-Lucie wood, also called Bagard wood after the Lorraine artist. Nancy, early 18th century, late Louis XIV period.',
             'Nailed to the cross, Christ is shown in agony, head tilted slightly to his right, eyes open and raised to the sky. The perizonium is tied with a cord and the cross is topped by the titulus inscribed INRI.',
             'It is presented in a fine oval giltwood frame of the Louis XIV period. [[To check: the frame does not appear in the photos]]']
      }
    },
    {
      slug: 'pendule-empire', ancien: 'pendule-empire', salle: 'xix', type: 'objets', place: 'console',
      photos: ['pendule-empire-1', 'pendule-empire-2', 'pendule-empire-3'],
      titre: { fr: 'Pendule Empire', en: 'Empire mantel clock' },
      court: { fr: 'Pendule Empire', en: 'Empire clock' },
      auteur: { fr: 'Inscription « Poudra à Paris »', en: 'Inscribed “Poudra à Paris”' },
      epoque: { fr: 'Époque Empire', en: 'Empire period' },
      materiaux: { fr: 'Bronze à deux patines, bronzes dorés', en: 'Bronze with two patinas, gilt bronze mounts' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 39, l: 11.5, p: 13 },
      description: {
        fr: ["Jolie pendule d'époque Empire en bronze à deux patines, en forme d'écusson. Belle ornementation de bronzes dorés finement ciselés, de pommes de pin et sphère armillaire à l'amortissement. Inscription : « Poudra à Paris »."],
        en: ['A fine Empire-period clock in bronze with two patinas, shaped as an escutcheon. Handsome finely chased gilt bronze mounts, with pine cones and an armillary sphere at the finial. Inscribed “Poudra à Paris”.']
      }
    },
    {
      slug: 'coffret-sainte-lucie', ancien: 'coffret-en-bois-de-sainte-lucie', salle: 'xviii', type: 'objets', place: 'console',
      photos: ['coffret-sainte-lucie-1', 'coffret-sainte-lucie-3', 'coffret-sainte-lucie-2', 'coffret-sainte-lucie-6', 'coffret-sainte-lucie-4', 'coffret-sainte-lucie-5'],
      titre: { fr: 'Coffret en bois de Sainte-Lucie', en: 'Casket in Sainte-Lucie wood' },
      court: { fr: 'Coffret, bois de Sainte-Lucie', en: 'Casket, Sainte-Lucie wood' },
      auteur: { fr: 'Attribué à César Bagard (1620-1709)', en: 'Attributed to César Bagard (1620–1709)' },
      epoque: { fr: 'XVIIIe siècle', en: '18th century' },
      materiaux: { fr: 'Bois de Sainte-Lucie (cerisier)', en: 'Sainte-Lucie wood (cherry)' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 8.5, l: 35, L: 21 },
      description: {
        fr: ['Ce charmant coffret rectangulaire en bois de Sainte-Lucie est finement sculpté d\'un décor de rinceaux, fleurettes et motifs végétaux. Le foisonnement et la finesse de ce décor sculpté nous permettent d\'attribuer ce très joli coffret au sculpteur César Bagard (1620-1709).'],
        en: ['This charming rectangular casket in Sainte-Lucie wood is finely carved with scrolling foliage, small flowers and plant motifs. The richness and delicacy of the carving allow us to attribute this very pretty casket to the sculptor César Bagard (1620–1709).']
      }
    },
    {
      slug: 'fauteuil-rene-cresson', ancien: 'fauteuil-louis-cresson', salle: 'xviii', type: 'mobilier', place: 'sol',
      photos: ['fauteuil-rene-cresson-2', 'fauteuil-rene-cresson-1', 'fauteuil-rene-cresson-3'],
      titre: { fr: "Fauteuil à châssis estampillé Cresson l'aîné", en: 'Armchair with removable seat, stamped Cresson l’aîné' },
      court: { fr: "Fauteuil, Cresson l'aîné", en: 'Armchair, Cresson l’aîné' },
      auteur: { fr: "René Cresson l'aîné — estampille « CRESSONLAINE » au N inversé", en: 'René Cresson l’aîné — stamped “CRESSONLAINE” with a reversed N' },
      epoque: { fr: 'XVIIIe siècle', en: '18th century' },
      materiaux: { fr: 'Hêtre', en: 'Beech' },
      provenance: { fr: 'France', en: 'France' },
      dims: null,
      description: {
        fr: ["René Cresson l'aîné, né en 1705, maître en 1738, meurt avant 1749.", 'Fauteuil à châssis estampillé CRESSONLAINE avec N inversé.'],
        en: ['René Cresson l’aîné, born 1705, master in 1738, died before 1749.', 'Armchair with a removable seat frame (à châssis), stamped CRESSONLAINE with a reversed N.']
      }
    },
    {
      slug: 'vase-pinon', ancien: 'vase-en-céramique', salle: 'xx', type: 'objets', place: 'console',
      photos: ['vase-pinon-1', 'vase-pinon-3', 'vase-pinon-2'],
      titre: { fr: 'Vase en céramique, Jaget et Pinon', en: 'Ceramic vase, Jaget et Pinon' },
      court: { fr: 'Vase, Jaget et Pinon', en: 'Vase, Jaget et Pinon' },
      auteur: { fr: 'Maurice Pinon, manufacture Jaget et Pinon, Tours — signé', en: 'Maurice Pinon, Jaget et Pinon manufactory, Tours — signed' },
      epoque: { fr: 'Début du XXe siècle [[à préciser : « 1900 » ou Art déco]]', en: 'Early 20th century [[to confirm: “1900” or Art Deco]]' },
      materiaux: { fr: 'Céramique émaillée bleu de Sèvres', en: 'Ceramic, Sèvres-blue glaze' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 32 },
      description: {
        fr: ['Vase en céramique à col évasé et prises latérales, sur un socle carré double. Émaillé bleu de Sèvres, avec un décor en frise représentant des cerfs évoluant dans la nature : cerfs et arbres bruns sur un sol anthracite argenté craquelé laissant apparaître des nervures bleues, comme sur le socle, les ailes et le col.',
             'Marque sous la base et signature de Maurice Pinon sous la frise. Manufacture de Tours Jaget et Pinon ; style Art déco, début du XXe siècle.'],
        en: ['Ceramic vase with a flared neck and side handles, on a double square base. Sèvres-blue glaze, with a frieze of deer roaming in nature: brown deer and trees on a crackled silvery anthracite ground revealing blue veins, as on the base, the wings and the neck.',
             'Mark under the base and signature of Maurice Pinon beneath the frieze. Jaget et Pinon manufactory, Tours; Art Deco style, early 20th century.']
      }
    },
    {
      slug: 'reliquaire', ancien: 'reliquaire', salle: 'xviii', type: 'sacre', place: 'mur', y: 150,
      photos: ['reliquaire-1', 'reliquaire-2', 'reliquaire-3'],
      titre: { fr: 'Reliquaire à paperolles', en: 'Paperolle reliquary' },
      court: { fr: 'Reliquaire à paperolles', en: 'Paperolle reliquary' },
      auteur: null,
      epoque: { fr: 'XVIIIe siècle', en: '18th century' },
      materiaux: { fr: "Paperolles, cadre d'époque en bois doré", en: 'Paperolles (rolled paper), period giltwood frame' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 40, l: 35 },
      description: {
        fr: ["La paperolle est une technique artisanale qui consiste à enrouler d'étroites bandes de papier pour créer des formes et des motifs ornementaux divers. Technique très ancienne, on l'utilisait au Moyen Âge, dans les églises pauvres, pour imiter les décorations en filigrane d'or ou d'argent. Les réalisations étaient souvent des reliquaires, appelés reliquaires à paperolles.",
             "Cadre d'époque en bois doré (XVIIIe siècle)."],
        en: ['Paperolle is a craft technique in which narrow strips of paper are rolled to create a variety of ornamental shapes and motifs. A very old technique, it was used in the Middle Ages in poorer churches to imitate gold or silver filigree. The works were often reliquaries, known as paperolle reliquaries.',
             'Period giltwood frame (18th century).']
      }
    },
    {
      slug: 'bougeoirs-empire', ancien: 'paire-de-bougeoires-empire', salle: 'xix', type: 'objets', place: 'console',
      photos: ['bougeoirs-empire-1', 'bougeoirs-empire-2'],
      titre: { fr: 'Paire de bougeoirs Empire', en: 'Pair of Empire candlesticks' },
      court: { fr: 'Paire de bougeoirs', en: 'Pair of candlesticks' },
      auteur: null,
      epoque: { fr: "Consulat ou début de l'Empire, vers 1806-1808", en: 'Consulate or early Empire, circa 1806–1808' },
      materiaux: { fr: 'Bronze doré au mercure', en: 'Mercury-gilt bronze' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 23.5 },
      description: {
        fr: ["Paire de bougeoirs en carquois de flèches, le fût godronné reposant sur des bases à palmettes. Bronze doré au mercure, époque Consulat ou début de l'Empire, vers 1806-1808."],
        en: ['A pair of candlesticks in the form of quivers of arrows, the gadrooned shaft resting on palmette bases. Mercury-gilt bronze, Consulate or early Empire period, circa 1806–1808.']
      }
    },
    {
      slug: 'statue-terre-cuite', ancien: 'statue-en-terre-cuite', salle: 'xix', type: 'sacre', place: 'console',
      photos: ['statue-terre-cuite-1', 'statue-terre-cuite-2', 'statue-terre-cuite-3', 'statue-terre-cuite-4'],
      titre: { fr: 'Statue en terre cuite', en: 'Terracotta statue' },
      court: { fr: 'Statue en terre cuite', en: 'Terracotta statue' },
      auteur: { fr: 'Signée PP Lorrain', en: 'Signed PP Lorrain' },
      epoque: { fr: 'XIXe siècle', en: '19th century' },
      materiaux: { fr: 'Terre cuite', en: 'Terracotta' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 31 },
      description: {
        fr: ["Très belle statue en terre cuite, copie d'une statue du XVIe siècle. Signée PP Lorrain."],
        en: ['A very fine terracotta statue, a copy of a 16th-century statue. Signed PP Lorrain.']
      }
    },
    {
      slug: 'coffret-circulaire', ancien: 'coffret-circulaire-en-bois-de-sainte-lucie', salle: 'xviii', type: 'objets', place: 'console',
      photos: ['coffret-circulaire-1', 'coffret-circulaire-2', 'coffret-circulaire-3'],
      titre: { fr: 'Coffret circulaire en bois de Sainte-Lucie', en: 'Round box in Sainte-Lucie wood' },
      court: { fr: 'Coffret circulaire', en: 'Round box' },
      auteur: { fr: "Devise de la famille de Courrèges d'Agnos", en: 'Motto of the de Courrèges d’Agnos family' },
      epoque: { fr: 'Fin du XVIIe siècle', en: 'Late 17th century' },
      materiaux: { fr: 'Bois de Sainte-Lucie', en: 'Sainte-Lucie wood' },
      provenance: { fr: 'France', en: 'France' },
      dims: { h: 7.5, d: 13.5 },
      description: {
        fr: ["Couronne ducale : un cercle d'or monté de huit fleurons.", "Inscription sur la boîte : « Je meurs ou je m'attache », devise de la famille de Courrèges d'Agnos."],
        en: ['Ducal coronet: a gold circlet set with eight fleurons.', 'Inscribed on the box: “Je meurs ou je m’attache” (I die or I cling), motto of the de Courrèges d’Agnos family.']
      }
    },
    {
      slug: 'fauteuil-louis-cresson', ancien: 'fauteuil-louis-cresson-l-aîné-rené', salle: 'xviii', type: 'mobilier', place: 'sol',
      photos: ['fauteuil-louis-cresson-1', 'fauteuil-louis-cresson-2'],
      titre: { fr: 'Fauteuil Louis Cresson', en: 'Armchair, Louis Cresson' },
      court: { fr: 'Fauteuil, Louis Cresson', en: 'Armchair, Louis Cresson' },
      auteur: { fr: 'Louis Cresson (1706-1761)', en: 'Louis Cresson (1706–1761)' },
      epoque: { fr: 'XVIIIe siècle', en: '18th century' },
      materiaux: { fr: "Hêtre, tapisserie d'Aubusson d'époque XVIIIe", en: 'Beech, 18th-century Aubusson tapestry' },
      provenance: { fr: 'France', en: 'France' },
      dims: null,
      description: {
        fr: ['Louis Cresson est né en 1706 ; il obtient la maîtrise en 1738. Fournisseur du duc d\'Orléans et du prince de Condé, il meurt en 1761.', "Tapisserie d'époque XVIIIe, d'Aubusson."],
        en: ['Louis Cresson was born in 1706 and became a master in 1738. Supplier to the Duke of Orléans and the Prince of Condé, he died in 1761.', '18th-century Aubusson tapestry.']
      }
    },
    {
      slug: 'tableau-pogrebinsky', ancien: 'tableau-que-le-soleil-brille-toujours', salle: 'xx', type: 'tableaux', place: 'mur', y: 150,
      photos: ['tableau-pogrebinsky-1'],
      titre: { fr: 'Tableau « Que le soleil brille toujours »', en: 'Painting, “May the Sun Always Shine”' },
      court: { fr: '« Que le soleil brille toujours »', en: '“May the Sun Always Shine”' },
      auteur: { fr: 'Alexander Pogrebinsky — signé', en: 'Alexander Pogrebinsky — signed' },
      epoque: { fr: '1985', en: '1985' },
      materiaux: { fr: 'Huile sur toile', en: 'Oil on canvas' },
      provenance: { fr: 'Ukraine', en: 'Ukraine' },
      dims: { h: 145, l: 135 },
      description: {
        fr: ['Peinture sur toile intitulée « Que le soleil brille toujours », signée d\'Alexander Pogrebinsky. Alexander Pogrebinsky est né en Ukraine (Kiev) en 1951 ; ses parents étaient maîtres de l\'école d\'art du réalisme socialiste.'],
        en: ['Oil on canvas titled “May the Sun Always Shine”, signed by Alexander Pogrebinsky. He was born in Kyiv, Ukraine, in 1951; his parents were masters of the Socialist Realism school of art.']
      }
    },
    {
      slug: 'fauteuil-louis-xv', ancien: 'fauteuil-louis-xv-cabriolet', salle: 'xviii', type: 'mobilier', place: 'sol',
      photos: ['fauteuil-louis-xv-1'],
      titre: { fr: 'Fauteuil Louis XV cabriolet', en: 'Louis XV cabriolet armchair' },
      court: { fr: 'Fauteuil cabriolet', en: 'Cabriolet armchair' },
      auteur: null,
      epoque: { fr: 'XVIIIe siècle', en: '18th century' },
      materiaux: { fr: 'Hêtre', en: 'Beech' },
      provenance: { fr: 'France', en: 'France' },
      dims: null,
      description: {
        fr: ['Fauteuil Louis XV de type cabriolet.'],
        en: ['Louis XV armchair, cabriolet type.']
      }
    },
    {
      slug: 'chope-ivoire', ancien: 'boque-en-ivoire', salle: 'xix', type: 'objets', place: 'console', masque: true,
      raison: "Ivoire : vente et exposition à la vente soumises à un certificat européen depuis le 19 janvier 2022.",
      photos: [],
      titre: { fr: 'Chope en ivoire', en: 'Ivory tankard' },
      court: { fr: 'Chope en ivoire', en: 'Ivory tankard' },
      auteur: null,
      epoque: { fr: 'XIXe siècle, dans le style du XVIIe', en: '19th century, in the 17th-century style' },
      materiaux: { fr: 'Ivoire sculpté', en: 'Carved ivory' },
      provenance: { fr: 'Allemagne du Sud', en: 'Southern Germany' },
      dims: { h: 26.5, d: 12 },
      description: { fr: ['Importante chope en ivoire sculptée. 14 enfants en train de vendanger. Allemagne du Sud, XIXe siècle, dans le style du XVIIe.'], en: ['An important carved ivory tankard: fourteen children harvesting grapes. Southern Germany, 19th century, in the 17th-century style.'] }
    }
  ]
};
