const pptxgen = require('pptxgenjs');

let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Define master slides/themes
pptx.defineSlideMaster({
  title: 'MASTER_TITLE',
  background: { color: '0A192F' }, // Dark premium blue
  objects: [
    { rect: { x: 0, y: '85%', w: '100%', h: '15%', fill: { color: '00B4D8' } } }
  ]
});

pptx.defineSlideMaster({
  title: 'MASTER_SLIDE',
  background: { color: 'F4F7F6' },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: '15%', fill: { color: '0A192F' } } },
    { text: { text: "Créer un SaaS d'IA", options: { x: '2%', y: '2.5%', w: '50%', h: '10%', color: 'FFFFFF', fontSize: 20, bold: true } } },
    { text: { text: "© 2026 - Formation SaaS", options: { x: '75%', y: '95%', w: '25%', h: '5%', color: '888888', fontSize: 10, align: 'right' } } }
  ]
});

// SLIDE 1: Title
let slide1 = pptx.addSlide({ masterName: 'MASTER_TITLE' });
slide1.addText('Créer un SaaS d\'Intelligence Artificielle', { x: '10%', y: '30%', w: '80%', h: '20%', color: 'FFFFFF', fontSize: 44, bold: true, align: 'center' });
slide1.addText('De l\'Idée au Lancement Public : Étude de Cas Pratique', { x: '10%', y: '50%', w: '80%', h: '10%', color: '00B4D8', fontSize: 24, align: 'center' });

// Function to add a content slide
function addContentSlide(title, points, isDark = false) {
  let slide = pptx.addSlide({ masterName: isDark ? 'MASTER_TITLE' : 'MASTER_SLIDE' });
  let titleColor = isDark ? '00B4D8' : '0A192F';
  let textColor = isDark ? 'FFFFFF' : '333333';

  if (!isDark) {
    slide.addText(title, { x: '5%', y: '4%', w: '90%', h: '8%', color: 'FFFFFF', fontSize: 28, bold: true });
  } else {
    slide.addText(title, { x: '5%', y: '10%', w: '90%', h: '10%', color: titleColor, fontSize: 36, bold: true });
  }

  points.forEach((point, idx) => {
    slide.addText(point, { x: '8%', y: 1.5 + (idx * 0.7), w: '85%', h: 0.5, color: textColor, fontSize: 18, bullet: true });
  });
}

// SLIDE 2: Agenda
addContentSlide('Programme de la Formation', [
  '1. Fondations & Architecture (React / Git)',
  '2. Intégration de l\'IA (Prompt Engineering)',
  '3. Génération de Documents & PDF',
  '4. UX/UI & Modales Complexes',
  '5. Base de Données & Temps Réel (Supabase)',
  '6. Authentification & Monétisation',
  '7. Déploiement & Storytelling',
  '8. Idées de SaaS à Lancer'
], false);

// SLIDE 3: Module 1
addContentSlide('Module 1 : Fondations & Versioning', [
  'Initialisation avec ViteJS (React) pour des performances optimales.',
  'Mise en place d\'un Design System "Glassmorphism" avec CSS Vanilla.',
  'Défi Technique : Avoir un rendu premium sans alourdir l\'application.',
  'Outils : Git & GitHub (importance des commits sémantiques réguliers).'
]);

// SLIDE 4: Module 2
addContentSlide('Module 2 : Intégration de l\'Intelligence Artificielle', [
  'Prompt Engineering : Comment dicter des règles strictes à l\'IA.',
  'Défi Majeur : Les hallucinations de l\'IA et la casse du code JSON.',
  'Solution : Formatage JSON déterministe et interdictions explicites.',
  'Gestion d\'État : Lier la donnée asynchrone à React (useState massif).'
]);

// SLIDE 5: Module 3
addContentSlide('Module 3 : Génération de PDF et Documents', [
  'Moteur de Templates : HTML/CSS dynamique en fonction des thèmes choisis.',
  'Défi Majeur : La résolution des PDF exportés côté client.',
  'Solution : html2pdf.js avec un "scale" à 2 ou 3.',
  'Gestion stricte du CSS (page-break-inside: avoid) pour les sauts de page.'
]);

// SLIDE 6: Module 4 & 5
addContentSlide('Modules 4 & 5 : UX Multi-faces & Base de Données', [
  'Séparation B2C (Candidat) et B2B (Recruteur) via des menus dédiés.',
  'Défi Layout : Sortir les Modales du flux naturel (z-index 99999).',
  'Hybridation CRM : LocalStorage d\'abord, Cloud PostgreSQL ensuite.',
  'Messagerie : Utilisation des Subscriptions WebSockets de Supabase (Temps Réel).'
]);

// SLIDE 7: Module 6 & 7
addContentSlide('Modules 6 & 7 : Monétisation & Déploiement', [
  'Authentification OAuth Hybride (thème dynamique).',
  'Défi Monétisation : Atteindre les marchés émergents.',
  'Solution : Stripe (International) + FedaPay (Mobile Money Afrique).',
  'Interception de webhook/URL et mise à jour des rôles.',
  'Le Storytelling comme levier de conversion sur la Landing Page.'
]);

// SLIDE 8: Idées de SaaS
addContentSlide('Projets d\'Application : Que lancer avec cette stack ?', [
  'Générateur de Contenu Auto-Poster (IA Marketing).',
  'Assistant Juridique PME pour lire des contrats PDF (LegalTech).',
  'Créateur de Quiz et Fiches de Révision Automatique (EdTech).',
  'CRM Immobilier pour générer des brochures et annonces (PropTech).',
  'Générateur de Devis "Vocal" pour Artisans.'
]);

// SLIDE 9: Vision 2030
addContentSlide('Horizon 2030 : Les SaaS du Futur', [
  'Assistant de Réunion Autonome (il assiste et prend des notes).',
  'Optimiseur d\'Empreinte Carbone pour PME (génération PDF ESG).',
  'Coach IA de Santé Prédictive croisé avec les montres connectées.',
  'Générateur d\'Espaces 3D Métavers depuis un texte (Three.js).',
  'Détecteur de Fake News B2B (Scores de Vérité).'
], true);

// Save PPTX
pptx.writeFile({ fileName: "Formation_SaaS_IA.pptx" }).then(() => {
    console.log("PPTX successfully generated.");
}).catch(err => {
    console.error(err);
});
