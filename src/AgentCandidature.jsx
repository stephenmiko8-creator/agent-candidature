import { useState, useRef, useCallback, useEffect } from "react";
import {
  CV_TEMPLATES,
  LETTER_TEMPLATES
} from "./templates/Templates";

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Orbitron:wght@300;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');

  .font-override-Inter * { font-family: 'Inter', sans-serif !important; }
  .font-override-Poppins * { font-family: 'Poppins', sans-serif !important; }
  .font-override-Lora * { font-family: 'Lora', Georgia, serif !important; }
  .font-override-Playfair * { font-family: 'Playfair Display', Georgia, serif !important; }
  .font-override-Outfit * { font-family: 'Outfit', sans-serif !important; }
  .font-override-Roboto * { font-family: 'Roboto', sans-serif !important; }
  .font-override-FiraCode * { font-family: 'Fira Code', 'Share Tech Mono', monospace !important; }

* { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    background: #06050C url('/bg-cosmic.png') no-repeat center center fixed; 
    background-size: cover; 
    color: #F8FAFC; 
    font-family: 'Inter', sans-serif; 
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.35); border-radius: 3px; }
  textarea, input, select { font-family: 'Inter', sans-serif; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes slideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .slide { animation: slideIn 0.35s ease; }
  .pulse { animation: pulse 2s infinite; }

  /* Glassmorphism helpers */
  .glass-panel {
    background: rgba(13, 11, 28, 0.72);
    border: 1px solid rgba(168, 85, 247, 0.18);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .glass-card {
    background: rgba(18, 14, 38, 0.80);
    border: 1px solid rgba(168, 85, 247, 0.14);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  /* Responsive layouts */
  .builder-grid {
    display: grid;
    grid-template-columns: 320px 1fr 340px;
    gap: 18px;
  }
  @media (max-width: 1024px) {
    .builder-grid {
      grid-template-columns: 1fr !important;
    }
  }

  /* Kanban styles */
  .k-board { 
    display: grid; 
    grid-template-columns: repeat(5, minmax(280px, 1fr)); 
    gap: 14px; 
    margin-top: 15px; 
    align-items: start; 
    overflow-x: auto; 
    padding-bottom: 15px; 
  }
  .k-column { 
    background: rgba(10, 8, 22, 0.88); 
    border: 1px solid rgba(168, 85, 247, 0.18); 
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 12px; 
    padding: 12px; 
    min-height: 520px; 
    display: flex; 
    flex-direction: column; 
    gap: 10px; 
  }
  .k-column-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 2px solid rgba(168, 85, 247, 0.15); margin-bottom: 6px; }
  .k-column-title { font-weight: 700; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
  .k-card { 
    background: rgba(18, 14, 38, 0.82); 
    border: 1px solid rgba(168, 85, 247, 0.12); 
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 10px; 
    padding: 12px; 
    cursor: pointer; 
    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1); 
    position: relative; 
    text-align: left; 
  }
  .k-card:hover { 
    border-color: #00F0FF; 
    transform: translateY(-3px); 
    box-shadow: 0 8px 24px rgba(0, 240, 255, 0.18); 
  }
  .k-card-title { font-weight: 700; font-size: 13px; color: #F8FAFC; margin-bottom: 2px; }
  .k-card-subtitle { font-size: 11px; color: #94A3B8; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .k-card-footer { display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #94A3B8; font-family: 'DM Mono', monospace; border-top: 1px solid rgba(168, 85, 247, 0.15); padding-top: 8px; margin-top: 8px; }

  /* Timeline */
  .timeline-container { display: flex; flex-direction: column; gap: 16px; position: relative; padding-left: 20px; text-align: left; }
  .timeline-container::before { content: ""; position: absolute; left: 6px; top: 8px; bottom: 8px; width: 2px; background: rgba(168, 85, 247, 0.2); }
  .timeline-item { position: relative; display: flex; flex-direction: column; gap: 4px; }
  .timeline-dot { position: absolute; left: -19px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: rgba(168, 85, 247, 0.2); border: 2px solid #06050C; transition: all 0.2s; }
  .timeline-dot.active { background: #00F0FF; box-shadow: 0 0 8px #00F0FF; }
  .timeline-dot.done { background: #00E699; box-shadow: 0 0 8px #00E699; }

  /* Modal Overlay */
  .m-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(6, 5, 12, 0.78); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
  .m-content { 
    background: rgba(13, 11, 28, 0.85); 
    border: 1px solid rgba(168, 85, 247, 0.25); 
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 16px; 
    width: 95%; 
    max-width: 900px; 
    height: 85vh; 
    display: flex; 
    flex-direction: column; 
    box-shadow: 0 20px 50px rgba(0,0,0,0.6); 
    animation: slideIn 0.25s ease; 
  }
  `;

const C = {
  bg: "transparent",
  panel: "rgba(10, 8, 22, 0.88)",
  card: "rgba(18, 14, 38, 0.80)",
  border: "rgba(168, 85, 247, 0.16)",
  accent: "#00F0FF",
  red: "#FF4A70",
  gold: "#FFB020",
  green: "#00E699",
  purple: "#A855F7",
  text: "#F8FAFC",
  muted: "#94A3B8",
  dim: "rgba(168, 85, 247, 0.08)",
};

// ── UI Primitives ─────────────────────────────────────────────────────────────
const Tag = ({ label, color = C.accent }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    background: color + "1A", color, fontSize: 11,
    fontFamily: "'DM Mono',monospace", border: `1px solid ${color}33`,
    marginRight: 5, marginBottom: 5,
  }}>{label}</span>
);

const Btn = ({ children, onClick, color = C.accent, disabled, size = "md" }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: size === "sm" ? "6px 14px" : "11px 22px",
    background: disabled ? C.dim + "44" : color + "1A",
    color: disabled ? C.muted : color,
    border: `1px solid ${disabled ? C.dim : color + "55"}`,
    borderRadius: 9, fontSize: size === "sm" ? 12 : 13,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Sora',sans-serif", transition: "all 0.18s",
    opacity: disabled ? 0.5 : 1,
  }}>{children}</button>
);

const Label = ({ children, color = "#E2E8F0" }) => (
  <div style={{
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    color,
    letterSpacing: "0.02em",
    marginBottom: 8,
  }}>{children}</div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 20,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    ...style,
  }}>{children}</div>
);

const Section = ({ title, icon, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 600,
        fontSize: 17,
        color: C.accent,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>{title}</span>
    </div>
    {children}
  </div>
);

const STEPS = [
  { id: 0, label: "Profil & Offre", icon: "👤" },
  { id: 1, label: "Analyse IA", icon: "🔍" },
  { id: 2, label: "Résultats", icon: "✅" },
];

const StepBar = ({ current }) => {
  const progressPercent = current === 0 ? 0 : current === 1 ? 50 : 100;

  return (
    <div style={{ position: "relative", marginBottom: 36, padding: "0 10px" }}>
      {/* Connecting Progress Track */}
      <div style={{
        position: "absolute",
        top: 18,
        left: 30,
        right: 30,
        height: 3,
        background: "rgba(168, 85, 247, 0.15)",
        borderRadius: 2,
        zIndex: 1
      }}>
        <div style={{
          height: "100%",
          width: `${progressPercent}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${current > 1 ? C.green : C.accent})`,
          boxShadow: `0 0 8px ${C.accent}`,
          transition: "width 0.4s ease-in-out",
          borderRadius: 2
        }} />
      </div>

      {/* Stepper Nodes */}
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        {STEPS.map((s, idx) => {
          const isActive = current === s.id;
          const isCompleted = current > s.id;

          let circleBg = "#0D0B1C";
          let circleBorder = `2px solid rgba(168, 85, 247, 0.35)`;
          let circleColor = C.muted;
          let circleShadow = "none";

          if (isActive) {
            circleBorder = `2px solid ${C.accent}`;
            circleColor = C.accent;
            circleShadow = `0 0 12px ${C.accent}66`;
          } else if (isCompleted) {
            circleBorder = `2px solid ${C.green}`;
            circleColor = C.green;
            circleShadow = `0 0 12px ${C.green}66`;
          }

          return (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 100 }}>
              {/* Circular Node */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: circleBg,
                border: circleBorder,
                boxShadow: circleShadow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: circleColor,
                fontFamily: "'Share Tech Mono', monospace",
                transition: "all 0.3s ease-in-out"
              }}>
                {isCompleted ? "✓" : s.id + 1}
              </div>

              {/* Step Label */}
              <div style={{
                marginTop: 8,
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? C.accent : isCompleted ? C.green : C.muted,
                textAlign: "center",
                whiteSpace: "nowrap",
                letterSpacing: "0.03em"
              }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Backend IA API ─────────────────────────────────────────────────────────────
async function callClaude(system, user) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, user }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur API");
  return data.text;
}

function safeJsonParse(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Réponse IA vide.");

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    console.error("Réponse IA non JSON :", raw);
    throw new Error("L'IA n'a pas renvoyé un JSON exploitable.");
  }
  const jsonText = cleaned.slice(start, end + 1);
  return JSON.parse(jsonText);
}

// ── Calcul du score ATS réel ──────────────────────────────────────────────────
function calculateATSScore(analyse, lettre, cvProfile) {
  const atsKeywords = (analyse?.mots_cles_ats || []).map(k => k.toLowerCase().trim()).filter(Boolean);
  if (atsKeywords.length === 0) return 0;

  // Build corpus from CV + letter
  const cvText = [
    cvProfile?.titre || "",
    cvProfile?.profil || "",
    ...(cvProfile?.experiences || []).flatMap(e => [
      e.poste || "", e.details || "", ...(e.bullets || [])
    ]),
    ...(cvProfile?.formations || []).flatMap(f => [
      f.diplome || "", f.details || ""
    ]),
    cvProfile?.competences?.finance || "",
    cvProfile?.competences?.outils || "",
    cvProfile?.competences?.langues || "",
  ].join(" ").toLowerCase();

  const lettreText = (lettre || "").toLowerCase();
  const corpus = cvText + " " + lettreText;

  let matched = 0;
  for (const keyword of atsKeywords) {
    // Check for partial/substring match (handles multi-word keywords)
    if (corpus.includes(keyword)) {
      matched++;
    }
  }

  const rawScore = Math.round((matched / atsKeywords.length) * 100);
  return Math.min(rawScore, 100);
}

async function genererSuggestionsATS({ missingKeywords, cvProfile, offre }) {
  if (!missingKeywords || missingKeywords.length === 0) return { suggestions: [] };
  const system = `Tu es un expert RH et ATS. Le candidat a des mots-clés ATS manquants dans sa candidature (CV + lettre) pour l'offre suivante.

OBJECTIF : Pour chaque mot-clé manquant, tu dois fournir des insertions PRÊTES À INTÉGRER directement dans le CV structuré et la lettre de motivation du candidat. Les insertions doivent être naturelles, professionnelles et ne jamais inventer d'expérience fictive.

Pour chaque mot-clé manquant :
1) "variantes" : 2-3 variantes sémantiques / synonymes pertinents
2) "cible_cv" : l'endroit EXACT dans le CV où insérer le mot-clé. Valeurs possibles :
   - "competences.outils" → ajouter dans les outils/logiciels (ex: Power BI, SAP, Tableau)
   - "competences.finance" → ajouter dans les hard skills métier (ex: consolidation, reporting IFRS)
   - "profil" → enrichir l'accroche professionnelle
   - "experience_bullet" → ajouter comme puce de réalisation dans l'expérience la plus pertinente
3) "texte_cv" : le texte EXACT à ajouter dans le CV, adapté à la cible :
   - Si cible = "competences.outils" ou "competences.finance" → juste le mot-clé ou une courte liste (ex: "Power BI, Tableau")
   - Si cible = "profil" → un bout de phrase à concaténer (ex: ", avec maîtrise de Power BI")
   - Si cible = "experience_bullet" → une puce complète de 10-15 mots (ex: "Conception de dashboards Power BI pour le pilotage de la performance financière")
4) "experience_index" : si cible = "experience_bullet", l'index (0-based) de l'expérience cible. Choisis celle dont les missions sont les plus pertinentes pour ce mot-clé. Sinon, mettre -1.
5) "paragraphe_lettre" : le numéro du paragraphe (1, 2, 3 ou 4) où insérer dans la lettre
6) "texte_lettre" : une phrase de 10-18 mots à insérer dans le paragraphe spécifié, naturelle et intégrée au contexte

RÈGLES STRICTES :
- N'invente AUCUNE expérience, entreprise ou diplôme fictif
- Chaque insertion doit contenir le mot-clé original OU l'une de ses variantes sémantiques
- Le texte doit être naturel et professionnel, pas de jargon artificiel
- Pour "competences.outils", préfère le nom exact de l'outil (Power BI, pas "outil de data viz")

Retourne UNIQUEMENT un JSON strict valide, sans markdown :
{
  "suggestions": [
    {
      "mot": "mot-clé original",
      "variantes": ["variante1", "variante2"],
      "cible_cv": "competences.outils",
      "texte_cv": "Power BI",
      "experience_index": -1,
      "paragraphe_lettre": 2,
      "texte_lettre": "phrase naturelle contenant le mot-clé pour la lettre"
    }
  ]
}`;

  const user = `MOTS-CLÉS MANQUANTS :
${JSON.stringify(missingKeywords)}

CV DU CANDIDAT :
${JSON.stringify(cvProfile)}

OFFRE D'EMPLOI :
${offre}`;

  const r = await callClaude(system, user);
  return safeJsonParse(r);
}

async function genererCandidatureComplete({ cvProfile, cvTexte, offre, infos, hasSavedProfile }) {
  const system = `Tu es un agent expert RH, ATS, spécialisé dans le domaine du poste ciblé et dans la rédaction de candidatures françaises premium.
Tu dois faire tout le traitement en UN SEUL APPEL et retourner uniquement un JSON strict valide, sans markdown.

FORMAT JSON OBLIGATOIRE :
{
  "cv_profile": {
    "identite": {
      "nom": "",
      "email": "",
      "telephone": "",
      "ville": "",
      "linkedin": ""
    },
    "titre": "",
    "profil": "",
    "experiences": [
      {
        "poste": "",
        "entreprise": "",
        "lieu": "",
        "dates": "",
        "details": "",
        "bullets": []
      }
    ],
    "formations": [
      {
        "diplome": "",
        "ecole": "",
        "lieu": "",
        "dates": "",
        "details": ""
      }
    ],
    "competences": {
      "finance": "",
      "outils": "",
      "langues": "",
      "interets": ""
    },
    "resultats_concrets": []
  },
  "analyse": {
    "poste": "",
    "entreprise": "",
    "lieu": "",
    "type_contrat": "",
    "secteur": "",
    "competences_techniques": [],
    "competences_soft": [],
    "mots_cles_ats": [],
    "ton": "",
    "point_diff": "",
    "missions": [],
    "modele_recommande": "corporate | minimalist | creative | tech"
  },
  "optimisation_cv": {
    "titre": "",
    "profil": "",
    "mots_cles": [],
    "justification": ""
  },
  "lettre": "",
  "objet_lettre": ""
}

RÈGLES JSON STRICTES :
- retourne uniquement le JSON, sans commentaire, sans markdown, sans texte avant/après
- toutes les clés doivent être entre guillemets doubles
- aucune virgule finale
- toutes les valeurs texte doivent être des chaînes JSON valides
- si une information manque, utilise "" ou []

RÈGLES CV STRUCTURÉ & OPTIMISATION (PAS D'INVENTION) :
- si un CV structuré est fourni, conserve l'intégralité de sa structure (nombre d'expériences, intitulés de postes, entreprises, lieux, dates, formations, compétences) STRICTEMENT à l'identique dans cv_profile sans rien ajouter ni supprimer.
- si un CV brut est fourni, extrais et structure fidèlement les informations existantes dans cv_profile.
- N'INVENTE ABSOLUMENT AUCUNE expérience, formation, compétence, date, entreprise ou tâche fictive.
- OPTIMISATION SÉCURISÉE DES EXPÉRIENCES : Tu es autorisé et encouragé à reformuler et optimiser les champs 'details' et 'bullets' (puces de réalisations) de chaque expérience déjà existante pour mettre en valeur les compétences et mots-clés ATS pertinents pour l'offre. Mais conserve STRICTEMENT les métadonnées (poste, entreprise, lieu, dates) d'origine de chaque expérience sans les modifier d'un seul iota.
- extrais tous les résultats chiffrés, outils, projets et réalisations mesurables existants dans cv_profile.resultats_concrets
- exemples de resultats_concrets : chiffre d'affaires, volumes traités, réduction d'écarts, migration SAP/WMS, reporting, trésorerie, BFR, audit, automatisation VBA/Python

RÈGLES OPTIMISATION CV & MODÈLE :
- optimise le titre ('optimisation_cv.titre'), l'accroche ('optimisation_cv.profil') et les descriptions des expériences existantes selon l'offre.
- titre optimisé : maximum 8 mots
- profil optimisé : 3 à 4 lignes maximum
- profil fidèle au CV, orienté offre, ATS-friendly
- dans "analyse.modele_recommande", choisis et recommande l'un des 4 modèles suivants selon le profil de l'offre :
  * "corporate" (pour les offres en finance, gestion, audit, banque, commerce)
  * "minimalist" (pour les offres juridiques, de conseil stratégique, de direction générale)
  * "creative" (pour les offres en marketing, communication, design, produit ou startup)
  * "tech" (pour les offres en informatique, développement, devops, data ou ingénierie)

RÈGLES LETTRE DE MOTIVATION PREMIUM (STRICTEMENT APPLIQUÉES) :
- La lettre doit être hautement personnalisée, naturelle, professionnelle et IMMÉDIATEMENT envoyable
- Elle doit commencer exactement par "Madame, Monsieur,"
- Elle doit se terminer exactement par "Je vous adresse mes sincères salutations,"
- Longueur : 280 à 340 mots — 4 paragraphes EXACTEMENT
- Aucune invention, uniquement les informations réelles du CV

STRUCTURE IMPÉRATIVE DES 4 PARAGRAPHES :
§1 — ACCROCHE ENTREPRISE (4-5 lignes) :
Commence DIRECTEMENT par un fait saillant, un enjeu stratégique ou un positionnement distinctif de l'entreprise cible (modèle économique, actualité récente, positionnement marché, culture d'entreprise). Puis rattache ce fait à ta candidature de façon fluide.
INTERDIT : "Je vous écris", "C'est avec un vif intérêt", "Je me permets de", "Votre entreprise représente une opportunité".

§2 — VALEUR AJOUTÉE DIFFÉRENCIANTE (4-5 lignes) :
NE PAS commencer par "Mon parcours académique" ou "Ma formation m'a doté".
Commencer DIRECTEMENT par la compétence la plus différenciante du candidat par rapport à l'offre. Format recommandé : "[Compétence clé] acquise au cours de [contexte concret]..." — puis lier diplôme ("__FORMATION__") + 1 compétence technique pointue qui répond précisément à une mission de l'offre.
INTERDIT : toute formulation générique sur le diplôme en ouverture de paragraphe.

§3 — PREUVES CHIFFRÉES (4-5 lignes) :
Minimum 2 résultats mesurables tirés du CV (%, €, volumes, délais, projets).
Chaque résultat doit être directement relié à une mission ou compétence requise dans l'offre. Format : "Lors de [contexte], j'ai [action] ce qui a permis [résultat chiffré], compétence directement transférable à [mission de l'offre]."
INTERDIT : résultats flottants sans lien avec l'offre.

§4 — SOFT SKILLS DÉMONTRÉS + CONCLUSION (4-5 lignes) :
JAMAIS d'adjectifs auto-proclamés seuls ("curieux, rigoureux, dynamique").
Chaque soft skill DOIT être illustré par un micro-contexte ou une situation concrète.
Format : "Habitué à [situation], j'ai développé [soft skill] que je mets en pratique en [exemple]." Puis transition fluide et directe vers l'entretien, sans formule creuse.
INTERDIT : "Je suis convaincu que", "Je serais ravi de", "n'hésitez pas à me contacter".
Remplacer par : "Je reste disponible pour un entretien à votre convenance."

OBJET DE LA LETTRE (dans "objet_lettre" du JSON) :
Format : "Candidature — [Poste] | [Diplôme court] | [Spécialité clé en lien avec l'offre]"
Exemple : "Candidature — Risk Analyst | M2 Finance INSEEC | Trésorerie & Gestion des Risques"

FILTRE ANTI-CLICHÉS RENFORCÉ — MOTS ET FORMULES ABSOLUMENT INTERDITS :
"Passionné(e)", "Dynamique", "Motivé(e)", "Curieux/se", "Rigoureux/se" (seuls, sans contexte)
"Votre entreprise représente", "une opportunité exceptionnelle"
"Je suis convaincu(e) que mes compétences", "n'hésitez pas à"
"C'est avec enthousiasme", "Je me permets de vous soumettre"
"Mon parcours m'a permis de développer" (en ouverture de §2)
"Lors de mes études j'ai pu" — trop scolaire
Tout placeholder visible comme [Nom], [Entreprise], [résultat]`.replace("__FORMATION__", infos.titre || (cvProfile && cvProfile.titre) || "formation de haut niveau");

  const user = hasSavedProfile
    ? `INFOS UTILISATEUR :
${JSON.stringify(infos)}

CV STRUCTURÉ DÉJÀ SAUVEGARDÉ :
${JSON.stringify(cvProfile)}

OFFRE D'EMPLOI :
${offre}

Fais en un seul appel : analyse de l'offre (y compris recommandation du modèle de CV), optimisation du titre/profil, lettre de motivation premium.`
    : `INFOS UTILISATEUR :
${JSON.stringify(infos)}

CV BRUT À STRUCTURER :
${cvTexte}

OFFRE D'EMPLOI :
${offre}

Fais en un seul appel : structure le CV, analyse l'offre (y compris recommandation du modèle de CV), optimise le titre/profil, lettre de motivation premium.`;

  const r = await callClaude(system, user);
  return safeJsonParse(r);
}

// Les modèles de CV et de lettres de motivation sont importés depuis ./templates/Templates.jsx;

const renderLetterBody = (text) => {
  return (text || "").split(/\n\n+/).map((p, i) => (
    <p key={i} style={{ margin: "0 0 14px 0", textAlign: "justify", textIndent: "0" }}>
      {p.split("\n").map((line, j) => (
        <span key={j}>
          {line}
          {j < p.split("\n").length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
};

// Accordion UI Wrapper Component for CV Builder Editor
const AccordionSection = ({ title, isOpen, onToggle, children, icon }) => (
  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        padding: "12px 16px",
        background: isOpen ? C.border + "44" : C.panel,
        border: "none",
        color: C.text,
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        transition: "background 0.2s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ color: isOpen ? C.accent : C.text }}>{title}</span>
      </div>
      <span style={{ fontSize: 10, color: C.muted }}>{isOpen ? "▼" : "▶"}</span>
    </button>
    {isOpen && (
      <div style={{ padding: "16px 14px", background: C.card + "66", borderTop: `1px solid ${C.border}` }}>
        {children}
      </div>
    )}
  </div>
);

const initialCvProfile = {
  titre: "Ingénieure Full-Stack & Cloud",
  profil: "Développeuse passionnée avec 6 ans d'expérience en conception d'applications web modernes. Expertise React, Node.js et architectures cloud AWS. Certifiée AWS Solutions Architect.",
  experiences: [
    {
      poste: "Lead Développeuse Full-Stack",
      entreprise: "TechVision",
      ville: "Paris",
      periode: "2022 – Présent",
      description: "Pilotage technique d'une équipe de 5 développeurs. Refonte complète de l'architecture front-end React."
    },
    {
      poste: "Développeuse Full-Stack",
      entreprise: "CloudScale",
      ville: "Lyon",
      periode: "2020 – 2022",
      description: "Conception et développement de microservices Node.js/AWS. Amélioration des temps de réponse de 40%."
    }
  ],
  formations: [
    {
      diplome: "Master Informatique",
      ecole: "Sorbonne Université",
      ville: "Paris",
      periode: "2018 – 2020"
    }
  ],
  competences: {
    techniques: "React, Vue, Node.js, AWS, Docker, CI/CD",
    langues: "Anglais (Courant), Espagnol (Scolaire)",
    interets: "Randonnée, Technologie, Photographie"
  }
};

// ── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────────
export default function AgentCandidature({
  initialView = "builder",
  initialShowGmail = false,
  onNavigate,
  onSearch,
  selectedCandidatureId,
  clearSelectedCandidatureId
}) {
  const [step, setStep] = useState(0);
  const [offre, setOffre] = useState("");
  const [cvTexte, setCvTexte] = useState("");
  const [cvNom, setCvNom] = useState("");
  const [infos, setInfos] = useState({
    prenom: "Marie", nom: "Laurent",
    titre: "Ingénieure Full-Stack & Cloud",
    ville: "Paris, France", email: "marie.laurent@example.com", tel: "06 12 34 56 78",
  });

  // Re-grouped state declarations to prevent Temporal Dead Zone (TDZ) ReferenceErrors
  const [cvProfile, setCvProfile] = useState(initialCvProfile);
  const [hasNewUpload, setHasNewUpload] = useState(false);
  const [templateMode, setTemplateMode] = useState("auto"); // "auto" or "manual"
  const [selectedTemplate, setSelectedTemplate] = useState("corporate");
  const [selectedLetterTemplate, setSelectedLetterTemplate] = useState("classic_sora");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [openSection, setOpenSection] = useState("identite");
  const [rewritingProfile, setRewritingProfile] = useState(false);
  const [regenLettre, setRegenLettre] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [activeView, setActiveView] = useState("builder"); // "builder" or "dashboard"
  const [candidatures, setCandidatures] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState("documents"); // "documents", "tracker", "reminders"
  const [newReminderText, setNewReminderText] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [previewingTemplate, setPreviewingTemplate] = useState(null); // null or { type: 'cv' | 'letter', template: tpl }
  const [selectedFont, setSelectedFont] = useState("Inter");

  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Bonjour ! Je suis MIKA, ton assistant virtuel. Pose-moi n'importe quelle question sur l'utilisation du site (ex: comment lier mon Gmail, comment optimiser mon CV) !" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    setChatMessages(prev => [...prev, { sender: "user", text }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setChatMessages(prev => [...prev, { sender: "bot", text: data.text }]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: "bot", text: "Désolé, je rencontre une petite erreur technique temporaire." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const [optimisationCV, setOptimisationCV] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [loadPct, setLoadPct] = useState(0);
  const [analyse, setAnalyse] = useState(null);
  const [lettre, setLettre] = useState("");
  const [objetLettre, setObjetLettre] = useState("");
  const [atsSuggestions, setAtsSuggestions] = useState(null);
  const [loadingAtsSuggestions, setLoadingAtsSuggestions] = useState(false);
  const [cvAdapt, setCvAdapt] = useState("");
  const [activeTab, setActiveTab] = useState("lettre");

  // Gmail states
  const [gmailAuthenticated, setGmailAuthenticated] = useState(false);
  const [gmailEmail, setGmailEmail] = useState("");
  const [gmailSyncing, setGmailSyncing] = useState(false);
  const [gmailEmails, setGmailEmails] = useState([]);
  const [showGmailPanel, setShowGmailPanel] = useState(false);
  const [gmailError, setGmailError] = useState("");
  const [gmailMessage, setGmailMessage] = useState("");

  // Gmail config states
  const [showGmailConfig, setShowGmailConfig] = useState(false);
  const [configEmail, setConfigEmail] = useState("");
  const [configAppPassword, setConfigAppPassword] = useState("");
  const [configMessage, setConfigMessage] = useState("");
  const [configError, setConfigError] = useState("");

  // Synchronize view state from props
  useEffect(() => {
    setActiveView(initialView === "builder" ? "builder" : "dashboard");
    setShowGmailPanel(initialShowGmail);
  }, [initialView, initialShowGmail]);

  // Handle Spotlight search selection
  useEffect(() => {
    if (selectedCandidatureId && candidatures.length > 0) {
      const match = candidatures.find(c => String(c.id) === String(selectedCandidatureId));
      if (match) {
        setSelectedCandidature(match);
        setActiveView("dashboard");
        setShowGmailPanel(false);
        setActiveDashboardTab("tracker"); // Show the tracker/timeline directly!
      }
      if (clearSelectedCandidatureId) {
        clearSelectedCandidatureId();
      }
    }
  }, [selectedCandidatureId, candidatures, clearSelectedCandidatureId]);

  const getUserKey = () => `cvProfile_${infos.email || "default"}`;
  const loadedEmailRef = useRef(infos.email);

  // Load profile from localStorage when email changes or on mount
  useEffect(() => {
    const key = getUserKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCvProfile(parsed);
      } catch (e) {
        console.error("Erreur chargement localStorage:", e);
      }
    } else {
      setCvProfile(initialCvProfile);
    }
    loadedEmailRef.current = infos.email;
  }, [infos.email]);

  // (Moved to top)

  const getCandidaturesKey = () => `candidatures_${infos.email || "default"}`;

  // Load candidatures from localStorage when email changes
  useEffect(() => {
    const key = getCandidaturesKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCandidatures(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur chargement candidatures:", e);
      }
    } else {
      setCandidatures([]);
    }
  }, [infos.email]);

  const saveCandidatures = (newList) => {
    setCandidatures(newList);
    localStorage.setItem(getCandidaturesKey(), JSON.stringify(newList));
  };

  // Sync builder outputs (cover letter, ATS score) back to the matching CRM candidature
  useEffect(() => {
    if (!analyse || !candidatures.length) return;
    const entreprise = (analyse.entreprise || "").toLowerCase().trim();
    const poste = (analyse.poste || "").toLowerCase().trim();
    if (!entreprise) return;

    const idx = candidatures.findIndex(c =>
      (c.entreprise || "").toLowerCase().trim() === entreprise &&
      (!poste || (c.poste || "").toLowerCase().trim() === poste)
    );
    if (idx < 0) return;

    const current = candidatures[idx];
    // Only update if values actually changed to avoid infinite loops
    if (current.scoreATS === atsScore && current.lettreGeneree === lettre && current.objetLettreGeneree === objetLettre) return;

    const updated = [...candidatures];
    updated[idx] = {
      ...current,
      scoreATS: atsScore,
      lettreGeneree: lettre,
      objetLettreGeneree: objetLettre,
    };
    saveCandidatures(updated);
  }, [lettre, atsScore, objetLettre]);

  // Persist cvProfile state edits to localStorage
  useEffect(() => {
    if (cvProfile && infos.email === loadedEmailRef.current) {
      localStorage.setItem(getUserKey(), JSON.stringify(cvProfile));
    }
  }, [cvProfile, infos.email]);
  // (Moved to top)

  const checkGmailAuthStatus = async () => {
    try {
      const res = await fetch("/api/gmail/status");
      const data = await res.json();
      setGmailAuthenticated(!!data.authenticated);
      setGmailEmail(data.email || "");
    } catch (e) {
      console.error("Erreur statut Gmail:", e);
    }
  };

  const saveGmailConfig = async (e) => {
    e.preventDefault();
    setConfigMessage("");
    setConfigError("");
    if (!configEmail || !configAppPassword) {
      setConfigError("Veuillez remplir les deux champs.");
      return;
    }
    try {
      const res = await fetch("/api/gmail/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: configEmail, appPassword: configAppPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfigMessage("Configuration enregistrée avec succès !");
        checkGmailAuthStatus();
        setConfigAppPassword("");
      } else {
        setConfigError(data.error || "Erreur de configuration.");
      }
    } catch (err) {
      setConfigError("Erreur réseau : " + err.message);
    }
  };

  useEffect(() => {
    checkGmailAuthStatus();
  }, []);

  const disconnectGmail = async () => {
    if (!window.confirm("Déconnecter votre compte de messagerie de l'application ?")) return;
    try {
      const res = await fetch("/api/gmail/disconnect", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setGmailAuthenticated(false);
        setGmailEmail("");
        setGmailEmails([]);
        setGmailMessage("Messagerie déconnectée avec succès.");
      }
    } catch (e) {
      setGmailError("Erreur de déconnexion: " + e.message);
    }
  };

  const syncGmail = async () => {
    setGmailSyncing(true);
    setGmailError("");
    setGmailMessage("Synchronisation en cours, analyse IA de vos emails...");
    try {
      const res = await fetch("/api/gmail/sync?max=15");
      if (res.status === 401) {
        setGmailAuthenticated(false);
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Identifiants invalides. Veuillez vous reconnecter.");
      }
      const data = await res.json();
      console.log("Données Gmail reçues du serveur:", data);
      if (!res.ok) throw new Error(data.error || "Erreur de synchronisation");

      setGmailEmails(data.parsed || []);
      if ((data.parsed || []).length === 0) {
        setGmailMessage("Aucun nouvel email trouvé dans le libellé Suivi-Candidatures.");
      } else {
        setGmailMessage(`${(data.parsed || []).length} email(s) récupéré(s) et analysé(s).`);
      }
    } catch (e) {
      setGmailError(e.message);
    } finally {
      setGmailSyncing(false);
    }
  };

  const importGmailCandidature = (emailData) => {
    const normalizedCompany = String(emailData.entreprise || "").toLowerCase().trim();
    const normalizedPoste = String(emailData.poste || "").toLowerCase().trim();

    const existingIndex = candidatures.findIndex(c =>
      String(c.entreprise || "").toLowerCase().trim() === normalizedCompany &&
      (!emailData.poste || String(c.poste || "").toLowerCase().trim() === normalizedPoste || String(c.poste || "").toLowerCase().trim().includes(normalizedPoste) || normalizedPoste.includes(String(c.poste || "").toLowerCase().trim()))
    );

    const dateStr = new Date().toLocaleDateString("fr-FR");
    const parsedDate = emailData.date_email ? new Date(emailData.date_email).toLocaleDateString("fr-FR") : dateStr;

    if (existingIndex >= 0) {
      const updatedList = [...candidatures];
      const target = updatedList[existingIndex];
      const newStatus = emailData.statut_suggere || target.statut;
      const newWorkflow = { ...target.workflow };

      if (newStatus === "Applied" && !newWorkflow.appliedDate) newWorkflow.appliedDate = parsedDate;
      if (newStatus === "Interview" && !newWorkflow.entretienDate) newWorkflow.entretienDate = parsedDate;
      if (newStatus === "Offer" && !newWorkflow.offreDate) newWorkflow.offreDate = parsedDate;

      updatedList[existingIndex] = {
        ...target,
        statut: newStatus,
        workflow: newWorkflow,
        lettreGeneree: target.lettreGeneree || emailData.resume,
        reminders: [
          ...(target.reminders || []),
          ...(emailData.action_requise ? [{
            id: "rem_" + Date.now(),
            titre: `Action Gmail: ${emailData.action_requise}`,
            date: emailData.date_action || new Date().toISOString().split('T')[0],
            completed: false
          }] : [])
        ]
      };

      saveCandidatures(updatedList);
      alert(`Candidature existante mise à jour pour ${emailData.entreprise} (${newStatus}).`);
    } else {
      const newCand = {
        id: "cand_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
        entreprise: emailData.entreprise || "Entreprise inconnue",
        poste: emailData.poste || "Poste non spécifié",
        dateAjout: parsedDate,
        statut: emailData.statut_suggere || "Applied",
        scoreATS: 0,
        lettreGeneree: emailData.resume || "",
        objetLettreGeneree: "",
        cvUtilise: cvProfile || null,
        analyseData: {
          entreprise: emailData.entreprise,
          poste: emailData.poste,
          lieu: emailData.lieu,
          type_contrat: emailData.type_contrat,
          secteur: "Importé de Gmail"
        },
        workflow: {
          appliedDate: emailData.statut_suggere === "Applied" ? parsedDate : "",
          relanceJ7Date: "",
          entretienDate: emailData.statut_suggere === "Interview" ? parsedDate : "",
          testTechniqueDate: "",
          offreDate: emailData.statut_suggere === "Offer" ? parsedDate : ""
        },
        reminders: emailData.action_requise ? [{
          id: "rem_" + Date.now(),
          titre: `Action Gmail: ${emailData.action_requise}`,
          date: emailData.date_action || new Date().toISOString().split('T')[0],
          completed: false
        }] : []
      };

      saveCandidatures([newCand, ...candidatures]);
      alert(`Nouvelle candidature ajoutée pour ${emailData.entreprise}.`);
    }

    setGmailEmails(prev => prev.filter(e => e.emailId !== emailData.emailId));
  };

  const importAllGmailCandidatures = () => {
    if (gmailEmails.length === 0) return;
    if (!window.confirm(`Importer les ${gmailEmails.length} candidatures détectées ?`)) return;

    let newItems = [...candidatures];
    const dateStr = new Date().toLocaleDateString("fr-FR");

    for (const emailData of gmailEmails) {
      const normalizedCompany = String(emailData.entreprise || "").toLowerCase().trim();
      const normalizedPoste = String(emailData.poste || "").toLowerCase().trim();
      const parsedDate = emailData.date_email ? new Date(emailData.date_email).toLocaleDateString("fr-FR") : dateStr;

      const existingIndex = newItems.findIndex(c =>
        String(c.entreprise || "").toLowerCase().trim() === normalizedCompany &&
        (!emailData.poste || String(c.poste || "").toLowerCase().trim() === normalizedPoste || String(c.poste || "").toLowerCase().trim().includes(normalizedPoste) || normalizedPoste.includes(String(c.poste || "").toLowerCase().trim()))
      );

      if (existingIndex >= 0) {
        const target = newItems[existingIndex];
        const newStatus = emailData.statut_suggere || target.statut;
        const newWorkflow = { ...target.workflow };

        if (newStatus === "Applied" && !newWorkflow.appliedDate) newWorkflow.appliedDate = parsedDate;
        if (newStatus === "Interview" && !newWorkflow.entretienDate) newWorkflow.entretienDate = parsedDate;
        if (newStatus === "Offer" && !newWorkflow.offreDate) newWorkflow.offreDate = parsedDate;

        newItems[existingIndex] = {
          ...target,
          statut: newStatus,
          workflow: newWorkflow,
          reminders: [
            ...(target.reminders || []),
            ...(emailData.action_requise ? [{
              id: "rem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
              titre: `Action Gmail: ${emailData.action_requise}`,
              date: emailData.date_action || new Date().toISOString().split('T')[0],
              completed: false
            }] : [])
          ]
        };
      } else {
        const newCand = {
          id: "cand_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
          entreprise: emailData.entreprise || "Entreprise inconnue",
          poste: emailData.poste || "Poste non spécifié",
          dateAjout: parsedDate,
          statut: emailData.statut_suggere || "Applied",
          scoreATS: 0,
          lettreGeneree: emailData.resume || "",
          objetLettreGeneree: "",
          cvUtilise: cvProfile || null,
          analyseData: {
            entreprise: emailData.entreprise,
            poste: emailData.poste,
            lieu: emailData.lieu,
            type_contrat: emailData.type_contrat,
            secteur: "Importé de Gmail"
          },
          workflow: {
            appliedDate: emailData.statut_suggere === "Applied" ? parsedDate : "",
            relanceJ7Date: "",
            entretienDate: emailData.statut_suggere === "Interview" ? parsedDate : "",
            testTechniqueDate: "",
            offreDate: emailData.statut_suggere === "Offer" ? parsedDate : ""
          },
          reminders: emailData.action_requise ? [{
            id: "rem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
            titre: `Action Gmail: ${emailData.action_requise}`,
            date: emailData.date_action || new Date().toISOString().split('T')[0],
            completed: false
          }] : []
        };
        newItems.unshift(newCand);
      }
    }

    saveCandidatures(newItems);
    setGmailEmails([]);
    alert("Toutes les candidatures ont été importées avec succès.");
  };
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef();

  const onFileDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (!file) return;
    setCvNom(file.name);
    setError("");

    const fileType = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    if (fileType === 'pdf') {
      reader.onload = async (ev) => {
        try {
          const arrayBuffer = ev.target.result;
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          if (!pdfjsLib) {
            throw new Error("La bibliothèque PDF n'est pas encore chargée. Veuillez réessayer dans quelques instants.");
          }
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(' ') + '\n';
          }
          if (!text.trim()) {
            throw new Error("Le PDF semble vide ou est un document numérisé (image scannée).");
          }
          setCvTexte(text);
          setHasNewUpload(true);
        } catch (err) {
          console.error("Erreur lecture PDF:", err);
          setError("Impossible de lire automatiquement ce PDF : " + err.message + ". Tu peux aussi copier-coller son texte brut.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'docx') {
      reader.onload = async (ev) => {
        try {
          const arrayBuffer = ev.target.result;
          const mammoth = window.mammoth;
          if (!mammoth) {
            throw new Error("La bibliothèque DOCX n'est pas encore chargée. Veuillez réessayer.");
          }
          const result = await mammoth.extractRawText({ arrayBuffer });
          if (!result.value.trim()) {
            throw new Error("Le fichier Word DOCX est vide.");
          }
          setCvTexte(result.value);
          setHasNewUpload(true);
        } catch (err) {
          console.error("Erreur lecture DOCX:", err);
          setError("Impossible de lire automatiquement ce fichier Word : " + err.message + ". Tu peux aussi copier-coller son texte brut.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // txt ou autre
      reader.onload = ev => {
        setCvTexte(ev.target.result);
        setHasNewUpload(true);
      };
      reader.readAsText(file);
    }
  }, []);

  const lancer = async () => {
    if (!offre.trim()) { setError("Colle le texte de l'offre."); return; }
    if (!cvTexte.trim()) { setError("Charge ton CV d'abord."); return; }
    setError(""); setLoading(true); setStep(1);
    try {
      setLoadMsg("① Traitement complet en un seul appel Gemini...");
      setLoadPct(20);

      const saved = localStorage.getItem(getUserKey());
      const savedProfile = saved ? JSON.parse(saved) : null;

      // If we have a new upload, we perform a fresh import and ignore the old saved profile for experience extraction.
      const useSaved = !hasNewUpload && Boolean(savedProfile || cvProfile);
      const baseProfile = useSaved ? (savedProfile || cvProfile) : null;
      const hasSavedProfile = Boolean(baseProfile);

      const result = await genererCandidatureComplete({
        cvProfile: baseProfile,
        cvTexte,
        offre,
        infos,
        hasSavedProfile,
      });

      const ana = result.analyse || {};
      const opti = result.optimisation_cv || {};
      const lett = result.lettre || "";

      // Fusion intelligente pour éviter les hallucinations et appliquer les optimisations de l'IA :
      let finalProfile = null;
      if (hasSavedProfile) {
        // Profil déjà enregistré : on garde la structure (postes, entreprises, dates, formations, compétences) 100% intacte.
        // On fusionne les optimisations de l'IA (titre, profil et détails/bullets des expériences réelles du CV source).
        const originalExps = baseProfile.experiences || [];
        const aiExps = (result.cv_profile && result.cv_profile.experiences) || [];

        const optimizedExps = originalExps.map((orig, index) => {
          const aiExp = aiExps[index];
          if (aiExp) {
            return {
              ...orig,
              // On conserve strictement les données du CV source
              poste: orig.poste,
              entreprise: orig.entreprise,
              lieu: orig.lieu,
              dates: orig.dates,
              // On fusionne les détails et puces optimisés par l'IA à partir des données sources
              details: aiExp.details || orig.details || "",
              bullets: Array.isArray(aiExp.bullets) && aiExp.bullets.length > 0 ? aiExp.bullets : (orig.bullets || [])
            };
          }
          return orig;
        });

        finalProfile = {
          ...baseProfile,
          titre: opti.titre || baseProfile.titre || "",
          profil: opti.profil || baseProfile.profil || "",
          experiences: optimizedExps
        };
      } else {
        // Premier import du CV brut : on prend le cv_profile de l'IA et on y applique le titre et profil optimisés
        finalProfile = result.cv_profile || baseProfile;
        if (finalProfile) {
          finalProfile = {
            ...finalProfile,
            titre: opti.titre || finalProfile.titre || "",
            profil: opti.profil || finalProfile.profil || "",
          };
        }
      }

      if (finalProfile) {
        localStorage.setItem(getUserKey(), JSON.stringify(finalProfile));
        setCvProfile(finalProfile);
      }

      setAnalyse(ana);
      setOptimisationCV(opti);
      setLettre(lett);
      const objLett = result.objet_lettre || "";
      setObjetLettre(objLett);

      // Calcul du score ATS réel
      const realScore = calculateATSScore(ana, lett, finalProfile || cvProfile);
      setAtsScore(realScore);

      // Enregistrer automatiquement dans le CRM personnel de candidature
      const newCand = {
        id: "cand_" + Date.now(),
        entreprise: ana.entreprise || "Entreprise ciblée",
        poste: ana.poste || "Poste ciblé",
        dateAjout: new Date().toLocaleDateString("fr-FR"),
        statut: "Draft",
        scoreATS: realScore,
        lettreGeneree: lett,
        objetLettreGeneree: objLett,
        cvUtilise: finalProfile || cvProfile,
        analyseData: ana,
        workflow: {
          appliedDate: "",
          relanceJ7Date: "",
          entretienDate: "",
          testTechniqueDate: "",
          offreDate: ""
        },
        reminders: []
      };

      const newCandList = [newCand, ...candidatures];
      saveCandidatures(newCandList);

      // Handle AI Template recommendation if mode is auto
      if (templateMode === "auto") {
        const rec = ana.modele_recommande;
        if (rec && ["corporate", "minimalist", "creative", "tech"].includes(rec)) {
          setSelectedTemplate(rec);
        } else {
          // Automatic fallbacks based on words
          const sect = String(ana.secteur || "").toLowerCase();
          const pst = String(ana.poste || "").toLowerCase();
          if (sect.includes("creative") || sect.includes("design") || sect.includes("marketing") || pst.includes("design") || pst.includes("marketing") || pst.includes("creative")) {
            setSelectedTemplate("creative");
          } else if (sect.includes("tech") || sect.includes("dev") || sect.includes("code") || pst.includes("developer") || pst.includes("engineer") || pst.includes("ingénieur") || pst.includes("informatique") || pst.includes("tech")) {
            setSelectedTemplate("tech");
          } else if (sect.includes("conseil") || sect.includes("direction") || pst.includes("executive") || pst.includes("directeur") || pst.includes("manager") || pst.includes("consultant")) {
            setSelectedTemplate("minimalist");
          } else {
            setSelectedTemplate("corporate");
          }
        }
      }

      setLoadPct(85);
      setLoadMsg("② Préparation des résultats...");

      setCvAdapt(`
TITRE PROFESSIONNEL OPTIMISÉ
${opti.titre || ""}

PROFIL OPTIMISÉ
${opti.profil || ""}

MOTS-CLÉS UTILISÉS
${(opti.mots_cles || []).join(", ")}

JUSTIFICATION
${opti.justification || ""}
`);
      setLoadPct(100);
      setHasNewUpload(false);

      setTimeout(() => { setStep(2); setLoading(false); }, 500);
    } catch (e) {
      setError("Erreur : " + e.message);
      setStep(0); setLoading(false);
    }
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(""), 2000);
  };

  const reset = () => {
    setStep(0); setAnalyse(null); setLettre(""); setCvAdapt(""); setOptimisationCV(null);
    setOffre(""); setError(""); setLoadPct(0); setAtsSuggestions(null);
  };

  // CV Edit handlers
  const handleIdentiteChange = (key, value) => {
    setCvProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        identite: {
          ...(prev.identite || {}),
          [key]: value
        }
      };
    });
  };

  const handleExperienceChange = (idx, key, value) => {
    setCvProfile(prev => {
      if (!prev) return null;
      const exps = [...(prev.experiences || [])];
      exps[idx] = { ...exps[idx], [key]: value };
      return { ...prev, experiences: exps };
    });
  };

  const addExperience = () => {
    setCvProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        experiences: [
          ...(prev.experiences || []),
          { poste: "Nouveau poste", entreprise: "Nouvelle entreprise", dates: "Dates", lieu: "Lieu", details: "", bullets: [] }
        ]
      };
    });
  };

  const deleteExperience = (idx) => {
    setCvProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        experiences: (prev.experiences || []).filter((_, i) => i !== idx)
      };
    });
  };

  const handleBulletChange = (expIdx, bulletIdx, value) => {
    setCvProfile(prev => {
      if (!prev) return null;
      const exps = [...(prev.experiences || [])];
      const bullets = [...(exps[expIdx].bullets || [])];
      bullets[bulletIdx] = value;
      exps[expIdx] = { ...exps[expIdx], bullets };
      return { ...prev, experiences: exps };
    });
  };

  const addBullet = (expIdx) => {
    setCvProfile(prev => {
      if (!prev) return null;
      const exps = [...(prev.experiences || [])];
      const bullets = [...(exps[expIdx].bullets || []), "Nouvelle puce chiffrée ou réalisation"];
      exps[expIdx] = { ...exps[expIdx], bullets };
      return { ...prev, experiences: exps };
    });
  };

  const deleteBullet = (expIdx, bulletIdx) => {
    setCvProfile(prev => {
      if (!prev) return null;
      const exps = [...(prev.experiences || [])];
      const bullets = (exps[expIdx].bullets || []).filter((_, i) => i !== bulletIdx);
      exps[expIdx] = { ...exps[expIdx], bullets };
      return { ...prev, experiences: exps };
    });
  };

  const handleFormationChange = (idx, key, value) => {
    setCvProfile(prev => {
      if (!prev) return null;
      const forms = [...(prev.formations || [])];
      forms[idx] = { ...forms[idx], [key]: value };
      return { ...prev, formations: forms };
    });
  };

  const addFormation = () => {
    setCvProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        formations: [
          ...(prev.formations || []),
          { diplome: "Nouveau diplôme", ecole: "Nouvelle école", dates: "Dates", lieu: "Lieu", details: "" }
        ]
      };
    });
  };

  const deleteFormation = (idx) => {
    setCvProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        formations: (prev.formations || []).filter((_, i) => i !== idx)
      };
    });
  };

  const handleCompetencesChange = (key, value) => {
    setCvProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        competences: {
          ...(prev.competences || {}),
          [key]: value
        }
      };
    });
  };

  // AI-powered profile rewrite helper
  const ameliorerAccrocheIA = async () => {
    if (!cvProfile?.profil) return;
    setRewritingProfile(true);
    try {
      const systemPrompt = `Tu es un rédacteur professionnel expert en recrutement. Réécris et optimise l'accroche de CV (profil) fournie pour qu'elle corresponde parfaitement à l'offre d'emploi ci-dessous. 
L'accroche doit être percutante, faire entre 3 et 4 lignes maximum, et mettre en valeur les compétences clés.
RÈGLE STRICTE : Retourne UNIQUEMENT le texte de l'accroche optimisée. Sans commentaire, sans introduction, sans guillemets, sans markdown.`;
      const userPrompt = `OFFRE D'EMPLOI :\n${offre}\n\nACCROCHE ACTUELLE :\n${cvProfile.profil}`;
      const resultText = await callClaude(systemPrompt, userPrompt);
      if (resultText && resultText.trim()) {
        setCvProfile(prev => ({ ...prev, profil: resultText.trim() }));
      }
    } catch (err) {
      console.error("Erreur de réécriture :", err);
      alert("Erreur lors de l'optimisation : " + err.message);
    } finally {
      setRewritingProfile(false);
    }
  };

  // Regenerate letter only (without full analysis)
  const regenererLettreSeule = async () => {
    if (!analyse || !offre.trim()) return;
    setRegenLettre(true);
    try {
      const systemPrompt = `Tu es un rédacteur expert en lettres de motivation françaises premium.
Tu dois faire la rédaction et retourner uniquement un JSON strict valide, sans markdown, sans texte avant/après.

FORMAT JSON OBLIGATOIRE :
{
  "lettre": "",
  "objet_lettre": ""
}

RÈGLES LETTRE DE MOTIVATION PREMIUM (STRICTEMENT APPLIQUÉES) :
- La lettre doit être hautement personnalisée, naturelle, professionnelle et IMMÉDIATEMENT envoyable
- Elle doit commencer exactement par "Madame, Monsieur,"
- Elle doit se terminer exactement par "Je vous adresse mes sincères salutations,"
- Longueur : 280 à 340 mots — 4 paragraphes EXACTEMENT
- Aucune invention, uniquement les informations réelles du CV

STRUCTURE IMPÉRATIVE DES 4 PARAGRAPHES :
§1 — ACCROCHE ENTREPRISE (4-5 lignes) :
Commence DIRECTEMENT par un fait saillant, un enjeu stratégique ou un positionnement distinctif de l'entreprise cible (modèle économique, actualité récente, positionnement marché, culture d'entreprise). Puis rattache ce fait à ta candidature de façon fluide.
INTERDIT : "Je vous écris", "C'est avec un vif intérêt", "Je me permets de", "Votre entreprise représente une opportunité".

§2 — VALEUR AJOUTÉE DIFFÉRENCIANTE (4-5 lignes) :
NE PAS commencer par "Mon parcours académique" ou "Ma formation m'a doté".
Commencer DIRECTEMENT par la compétence la plus différenciante du candidat par rapport à l'offre. Format recommandé : "[Compétence clé] acquise au cours de [contexte concret]..." — puis lier diplôme + 1 compétence technique pointue qui répond précisément à une mission de l'offre.
INTERDIT : toute formulation générique sur le diplôme en ouverture de paragraphe.

§3 — PREUVES CHIFFRÉES (4-5 lignes) :
Minimum 2 résultats mesurables tirés du CV (%, €, volumes, délais, projets).
Chaque résultat doit être directement relié à une mission ou compétence requise dans l'offre. Format : "Lors de [contexte], j'ai [action] ce qui a permis [résultat chiffré], compétence directement transférable à [mission de l'offre]."
INTERDIT : résultats flottants sans lien avec l'offre.

§4 — SOFT SKILLS DÉMONTRÉS + CONCLUSION (4-5 lignes) :
JAMAIS d'adjectifs auto-proclamés seuls ("curieux, rigoureux, dynamique").
Chaque soft skill DOIT être illustré par un micro-contexte ou une situation concrète.
Format : "Habitué à [situation], j'ai développé [soft skill] que je mets en pratique en [exemple]." Puis transition fluide et directe vers l'entretien, sans formule creuse.
INTERDIT : "Je suis convaincu que", "Je serais ravi de", "n'hésitez pas à me contacter".
Remplacer par : "Je reste disponible pour un entretien à votre convenance."

OBJET DE LA LETTRE (dans "objet_lettre" du JSON) :
Format : "Candidature — [Poste] | [Diplôme court] | [Spécialité clé en lien avec l'offre]"
Exemple : "Candidature — Risk Analyst | M2 Finance INSEEC | Trésorerie & Gestion des Risques"

FILTRE ANTI-CLICHÉS RENFORCÉ — MOTS ET FORMULES ABSOLUMENT INTERDITS :
"Passionné(e)", "Dynamique", "Motivé(e)", "Curieux/se", "Rigoureux/se" (seuls, sans contexte)
"Votre entreprise représente", "une opportunité exceptionnelle"
"Je suis convaincu(e) que mes compétences", "n'hésitez pas à"
"C'est avec enthousiasme", "Je me permets de vous soumettre"
"Mon parcours m'a permis de développer" (en ouverture de §2)
"Lors de mes études j'ai pu" — trop scolaire
Tout placeholder visible comme [Nom], [Entreprise], [résultat]`;

      const userPrompt = `ANALYSE DE L'OFFRE :
${JSON.stringify(analyse)}

CV DU CANDIDAT :
${JSON.stringify(cvProfile)}

INFOS CANDIDAT :
${JSON.stringify(infos)}

OFFRE D'EMPLOI :
${offre}

Génère le JSON avec la nouvelle lettre et l'objet de candidature associés.`;

      const result = await callClaude(systemPrompt, userPrompt);
      const parsed = safeJsonParse(result);
      if (parsed.lettre && parsed.lettre.trim()) {
        setLettre(parsed.lettre.trim());
        setObjetLettre(parsed.objet_lettre || "");
        // Recalculate ATS score with new letter
        const newScore = calculateATSScore(analyse, parsed.lettre.trim(), cvProfile);
        setAtsScore(newScore);
      }
    } catch (err) {
      console.error("Erreur regénération lettre :", err);
      alert("Erreur lors de la regénération : " + err.message);
    } finally {
      setRegenLettre(false);
    }
  };

  const getMissingKeywords = () => {
    if (!analyse || !analyse.mots_cles_ats) return [];
    const atsKeywords = (analyse.mots_cles_ats || []).map(k => k.trim()).filter(Boolean);
    const cvText = [
      cvProfile?.titre || "",
      cvProfile?.profil || "",
      ...(cvProfile?.experiences || []).flatMap(e => [
        e.poste || "", e.details || "", ...(e.bullets || [])
      ]),
      ...(cvProfile?.formations || []).flatMap(f => [
        f.diplome || "", f.details || ""
      ]),
      cvProfile?.competences?.finance || "",
      cvProfile?.competences?.outils || "",
      cvProfile?.competences?.langues || "",
    ].join(" ").toLowerCase();
    const lettreText = (lettre || "").toLowerCase();
    const corpus = cvText + " " + lettreText;

    return atsKeywords.filter(keyword => !corpus.includes(keyword.toLowerCase()));
  };

  const handleGenererSuggestionsATS = async () => {
    const missing = getMissingKeywords();
    if (missing.length === 0) {
      alert("Félicitations ! Votre candidature contient déjà tous les mots-clés ATS.");
      return;
    }
    setLoadingAtsSuggestions(true);
    try {
      const res = await genererSuggestionsATS({
        missingKeywords: missing,
        cvProfile,
        offre
      });
      setAtsSuggestions(res.suggestions || []);
    } catch (err) {
      console.error("Erreur génération suggestions ATS :", err);
      alert("Erreur lors de la génération des suggestions : " + err.message);
    } finally {
      setLoadingAtsSuggestions(false);
    }
  };

  // Apply a single ATS suggestion to CV + letter
  const handleAppliquerUneSuggestion = (sug) => {
    // --- CV INSERTION ---
    setCvProfile(prev => {
      if (!prev) return null;
      const updated = { ...prev };

      if (sug.cible_cv === "competences.outils") {
        const current = updated.competences?.outils || "";
        // Avoid duplicates
        if (!current.toLowerCase().includes(sug.texte_cv.toLowerCase())) {
          updated.competences = {
            ...(updated.competences || {}),
            outils: current ? current + ", " + sug.texte_cv : sug.texte_cv
          };
        }
      } else if (sug.cible_cv === "competences.finance") {
        const current = updated.competences?.finance || "";
        if (!current.toLowerCase().includes(sug.texte_cv.toLowerCase())) {
          updated.competences = {
            ...(updated.competences || {}),
            finance: current ? current + ", " + sug.texte_cv : sug.texte_cv
          };
        }
      } else if (sug.cible_cv === "profil") {
        const current = updated.profil || "";
        if (!current.toLowerCase().includes(sug.texte_cv.toLowerCase())) {
          updated.profil = current + " " + sug.texte_cv;
        }
      } else if (sug.cible_cv === "experience_bullet") {
        const expIdx = sug.experience_index >= 0 ? sug.experience_index : 0;
        const exps = [...(updated.experiences || [])];
        if (exps[expIdx]) {
          const bullets = [...(exps[expIdx].bullets || [])];
          // Avoid duplicate bullets
          if (!bullets.some(b => b.toLowerCase().includes(sug.texte_cv.toLowerCase().substring(0, 20)))) {
            bullets.push(sug.texte_cv);
            exps[expIdx] = { ...exps[expIdx], bullets };
            updated.experiences = exps;
          }
        }
      }
      return updated;
    });

    // --- LETTER INSERTION ---
    if (sug.texte_lettre && sug.paragraphe_lettre) {
      setLettre(prev => {
        if (!prev) return prev;
        // Don't insert if already present
        if (prev.toLowerCase().includes(sug.texte_lettre.toLowerCase().substring(0, 25))) return prev;

        const paragraphs = prev.split("\n\n");
        const targetIdx = Math.max(0, Math.min((sug.paragraphe_lettre || 1) - 1, paragraphs.length - 1));
        // Append the sentence naturally at the end of the target paragraph
        paragraphs[targetIdx] = paragraphs[targetIdx].trimEnd() + " " + sug.texte_lettre;
        return paragraphs.join("\n\n");
      });
    }

    // Remove this suggestion from the list (mark as applied)
    setAtsSuggestions(prev => (prev || []).filter(s => s.mot !== sug.mot));

    // Recalculate ATS score after a tick (state needs to settle)
    setTimeout(() => {
      // We need fresh state, so use functional refs
      setCvProfile(currentCv => {
        setLettre(currentLettre => {
          const newScore = calculateATSScore(analyse, currentLettre, currentCv);
          setAtsScore(newScore);
          return currentLettre;
        });
        return currentCv;
      });
    }, 100);
  };

  // Apply ALL ATS suggestions at once
  const handleAppliquerToutesSuggestions = () => {
    if (!atsSuggestions || atsSuggestions.length === 0) return;

    // --- CV BULK INSERTION ---
    setCvProfile(prev => {
      if (!prev) return null;
      const updated = JSON.parse(JSON.stringify(prev)); // deep clone

      for (const sug of atsSuggestions) {
        if (sug.cible_cv === "competences.outils") {
          const current = updated.competences?.outils || "";
          if (!current.toLowerCase().includes(sug.texte_cv.toLowerCase())) {
            updated.competences = {
              ...(updated.competences || {}),
              outils: current ? current + ", " + sug.texte_cv : sug.texte_cv
            };
          }
        } else if (sug.cible_cv === "competences.finance") {
          const current = updated.competences?.finance || "";
          if (!current.toLowerCase().includes(sug.texte_cv.toLowerCase())) {
            updated.competences = {
              ...(updated.competences || {}),
              finance: current ? current + ", " + sug.texte_cv : sug.texte_cv
            };
          }
        } else if (sug.cible_cv === "profil") {
          const current = updated.profil || "";
          if (!current.toLowerCase().includes(sug.texte_cv.toLowerCase())) {
            updated.profil = current + " " + sug.texte_cv;
          }
        } else if (sug.cible_cv === "experience_bullet") {
          const expIdx = sug.experience_index >= 0 ? sug.experience_index : 0;
          if (updated.experiences?.[expIdx]) {
            const bullets = [...(updated.experiences[expIdx].bullets || [])];
            if (!bullets.some(b => b.toLowerCase().includes(sug.texte_cv.toLowerCase().substring(0, 20)))) {
              bullets.push(sug.texte_cv);
              updated.experiences[expIdx] = { ...updated.experiences[expIdx], bullets };
            }
          }
        }
      }
      return updated;
    });

    // --- LETTER BULK INSERTION ---
    setLettre(prev => {
      if (!prev) return prev;
      let paragraphs = prev.split("\n\n");
      for (const sug of atsSuggestions) {
        if (!sug.texte_lettre || !sug.paragraphe_lettre) continue;
        if (prev.toLowerCase().includes(sug.texte_lettre.toLowerCase().substring(0, 25))) continue;
        const targetIdx = Math.max(0, Math.min((sug.paragraphe_lettre || 1) - 1, paragraphs.length - 1));
        paragraphs[targetIdx] = paragraphs[targetIdx].trimEnd() + " " + sug.texte_lettre;
      }
      return paragraphs.join("\n\n");
    });

    // Clear suggestions list (all applied)
    setAtsSuggestions([]);

    // Recalculate ATS score
    setTimeout(() => {
      setCvProfile(currentCv => {
        setLettre(currentLettre => {
          const newScore = calculateATSScore(analyse, currentLettre, currentCv);
          setAtsScore(newScore);
          return currentLettre;
        });
        return currentCv;
      });
    }, 150);
  };

  const printContent = (type, candCvOverride = null) => {
    // 100ms sync delay to ensure DOM updates are fully rendered before printing
    setTimeout(() => {
      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) {
        alert("Le navigateur a bloqué la fenêtre d'impression. Autorise les popups pour ce site.");
        return;
      }

      const fontsLink = `<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
      const printMeta = `
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          .font-override-Inter * { font-family: 'Inter', sans-serif !important; }
          .font-override-Poppins * { font-family: 'Poppins', sans-serif !important; }
          .font-override-Lora * { font-family: 'Lora', Georgia, serif !important; }
          .font-override-Playfair * { font-family: 'Playfair Display', Georgia, serif !important; }
          .font-override-Outfit * { font-family: 'Outfit', sans-serif !important; }
          .font-override-Roboto * { font-family: 'Roboto', sans-serif !important; }
          .font-override-FiraCode * { font-family: 'Fira Code', 'Share Tech Mono', monospace !important; }
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            @page { margin: 0; size: A4; }
            body { background: #ffffff !important; }
          }
        </style>
      `;

      if (type === "cv") {
        const cvEl = document.getElementById("cv-preview-print");
        if (!cvEl) return;
        const clonedHTML = cvEl.innerHTML;

        printWindow.document.write(`<!DOCTYPE html><html><head>
          <meta charset="utf-8">
          <title>CV — ${infos.prenom} ${infos.nom}</title>
          ${fontsLink}
          ${printMeta}
        </head><body style="background:#fff;">
          ${clonedHTML}
        </body></html>`);
      } else {
        const letterEl = document.getElementById("lettre-preview-print");
        if (!letterEl) return;
        const clonedHTML = letterEl.innerHTML;

        printWindow.document.write(`<!DOCTYPE html><html><head>
          <meta charset="utf-8">
          <title>Lettre de motivation — ${infos.prenom} ${infos.nom}</title>
          ${fontsLink}
          ${printMeta}
        </head><body style="background:#fff;">
          <div style="width:210mm; min-height:297mm; padding:28mm 25mm 25mm 25mm; box-sizing:border-box;">
            ${clonedHTML}
          </div>
        </body></html>`);
      }

      printWindow.document.close();

      let printed = false;
      const triggerPrint = () => {
        if (printed) return;
        printed = true;
        printWindow.focus();
        printWindow.print();
      };
      printWindow.onload = triggerPrint;
      setTimeout(triggerPrint, 1500);
    }, 100);
  };

  // ── CRM Helper Functions ──────────────────────────────────────────────────────

  const STATUTS = ["Draft", "Applied", "Interview", "Rejected", "Offer"];
  const STATUT_COLORS = {
    Draft: C.muted,
    Applied: C.accent,
    Interview: C.gold,
    Rejected: C.red,
    Offer: C.green,
  };
  const STATUT_ICONS = {
    Draft: "📝",
    Applied: "📤",
    Interview: "🎤",
    Rejected: "❌",
    Offer: "🎉",
  };

  const WORKFLOW_STEPS = [
    { key: "appliedDate", label: "Candidature envoyée", icon: "📤" },
    { key: "relanceJ7Date", label: "Relance J+7", icon: "🔄" },
    { key: "entretienDate", label: "Entretien", icon: "🎤" },
    { key: "testTechniqueDate", label: "Test technique", icon: "💻" },
    { key: "offreDate", label: "Offre reçue", icon: "🎉" },
  ];

  const updateCandidatureStatut = (id, newStatut) => {
    const updated = candidatures.map(c => {
      if (c.id !== id) return c;
      const newWorkflow = { ...c.workflow };
      const now = new Date().toLocaleDateString("fr-FR");
      if (newStatut === "Applied" && !newWorkflow.appliedDate) {
        newWorkflow.appliedDate = now;
        // Auto-suggest relance at J+7
        const relanceDate = new Date();
        relanceDate.setDate(relanceDate.getDate() + 7);
        newWorkflow.relanceJ7Date = relanceDate.toLocaleDateString("fr-FR");
      }
      if (newStatut === "Interview" && !newWorkflow.entretienDate) newWorkflow.entretienDate = now;
      if (newStatut === "Offer" && !newWorkflow.offreDate) newWorkflow.offreDate = now;
      return { ...c, statut: newStatut, workflow: newWorkflow };
    });
    saveCandidatures(updated);
    // Also update selectedCandidature if it's the one being changed
    const sel = updated.find(c => c.id === id);
    if (sel && selectedCandidature?.id === id) setSelectedCandidature(sel);
  };

  const deleteCandidature = (id) => {
    if (!window.confirm("Supprimer cette candidature de l'historique ?")) return;
    const updated = candidatures.filter(c => c.id !== id);
    saveCandidatures(updated);
    if (selectedCandidature?.id === id) setSelectedCandidature(null);
  };

  const addReminder = (candId) => {
    if (!newReminderText.trim() || !newReminderDate) return;
    const updated = candidatures.map(c => {
      if (c.id !== candId) return c;
      return {
        ...c,
        reminders: [
          ...(c.reminders || []),
          { id: "rem_" + Date.now(), titre: newReminderText.trim(), date: newReminderDate, completed: false }
        ]
      };
    });
    saveCandidatures(updated);
    const sel = updated.find(c => c.id === candId);
    if (sel) setSelectedCandidature(sel);
    setNewReminderText("");
    setNewReminderDate("");
  };

  const toggleReminder = (candId, remId) => {
    const updated = candidatures.map(c => {
      if (c.id !== candId) return c;
      return {
        ...c,
        reminders: (c.reminders || []).map(r =>
          r.id === remId ? { ...r, completed: !r.completed } : r
        )
      };
    });
    saveCandidatures(updated);
    const sel = updated.find(c => c.id === candId);
    if (sel) setSelectedCandidature(sel);
  };

  const deleteReminder = (candId, remId) => {
    const updated = candidatures.map(c => {
      if (c.id !== candId) return c;
      return { ...c, reminders: (c.reminders || []).filter(r => r.id !== remId) };
    });
    saveCandidatures(updated);
    const sel = updated.find(c => c.id === candId);
    if (sel) setSelectedCandidature(sel);
  };

  const exportICS = (cand, reminder) => {
    const parts = reminder.date.split("-"); // yyyy-mm-dd
    const start = `${parts[0]}${parts[1]}${parts[2]}T100000`;
    const end = `${parts[0]}${parts[1]}${parts[2]}T110000`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Agent Candidatures//FR",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${reminder.titre} — ${cand.entreprise}`,
      `DESCRIPTION:Rappel candidature : ${cand.poste} chez ${cand.entreprise}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rappel_${cand.entreprise.replace(/\s+/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // KPI computation
  const kpiTotal = candidatures.length;
  const kpiApplied = candidatures.filter(c => c.statut !== "Draft").length;
  const kpiInterviews = candidatures.filter(c => c.statut === "Interview").length;
  const kpiOffers = candidatures.filter(c => c.statut === "Offer").length;
  const kpiConversion = kpiTotal > 0 ? Math.round((kpiInterviews / kpiTotal) * 100) : 0;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: C.bg }}>

        {/* HEADER */}
        <div style={{
          background: C.panel, borderBottom: `1px solid ${C.border}`,
          padding: "13px 28px", display: "flex", alignItems: "center", gap: 14,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          {/* Brand/Logo navigation back to Landing Page */}
          <div
            onClick={() => onNavigate && onNavigate("hero")}
            style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginRight: 10
            }}
          >
            <svg style={{ width: 36, height: 36, filter: "drop-shadow(0 4px 8px rgba(112,38,232,0.35))" }} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradDark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="50%" stopColor="#7026E8" />
                  <stop offset="100%" stopColor="#FF4A70" />
                </linearGradient>
              </defs>
              <path d="M10 30L20 10L30 30" stroke="url(#logoGradDark)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 20H25" stroke="url(#logoGradDark)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 10V30" stroke="url(#logoGradDark)" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
              <circle cx="20" cy="10" r="3.5" fill="#00F0FF" />
              <circle cx="10" cy="30" r="3.5" fill="#7026E8" />
              <circle cx="30" cy="30" r="3.5" fill="#FF4A70" />
            </svg>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "0.05em", color: "#FFF", lineHeight: 1.0 }}>MIKA</div>
              <div style={{ fontSize: 8.5, color: C.accent, fontFamily: "'Orbitron', sans-serif", fontWeight: 300, letterSpacing: "3.5px", marginTop: 4 }}>
                MY INTELLIGENT KAREER ASSISTANT
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setActiveView("builder")}
              style={{
                background: activeView === "builder" ? C.accent + "20" : "transparent",
                border: `1px solid ${activeView === "builder" ? C.accent + "66" : C.border}`,
                color: activeView === "builder" ? C.accent : C.muted,
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              👤 Optimiseur & Studio
            </button>
            <button
              onClick={() => { setActiveView("templates"); setActiveTab("cv"); }}
              style={{
                background: activeView === "templates" ? C.accent + "20" : "transparent",
                border: `1px solid ${activeView === "templates" ? C.accent + "66" : C.border}`,
                color: activeView === "templates" ? C.accent : C.muted,
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              🎨 Modèles & Designs
            </button>
            <button
              onClick={() => setActiveView("dashboard")}
              style={{
                background: activeView === "dashboard" && !showGmailPanel ? C.accent + "20" : "transparent",
                border: `1px solid ${activeView === "dashboard" && !showGmailPanel ? C.accent + "66" : C.border}`,
                color: activeView === "dashboard" && !showGmailPanel ? C.accent : C.muted,
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6
              }}
            >
              📊 Mon CRM
              {candidatures.length > 0 && (
                <span style={{
                  background: C.accent, color: "#fff", fontSize: 9.5, padding: "1px 6px",
                  borderRadius: 10, fontWeight: 700
                }}>{candidatures.length}</span>
              )}
            </button>
            <button
              onClick={() => { setShowGmailPanel(true); setActiveView("dashboard"); }}
              style={{
                background: showGmailPanel ? C.purple + "20" : "transparent",
                border: `1px solid ${showGmailPanel ? C.purple + "66" : C.border}`,
                color: showGmailPanel ? C.purple : C.muted,
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6
              }}
            >
              📧 Sync Gmail
              {gmailAuthenticated && (
                <span style={{
                  background: C.green, width: 6, height: 6, borderRadius: "50%"
                }} />
              )}
            </button>
            <div style={{ width: 1, height: 20, background: C.border }} />

            <button
              onClick={() => onNavigate && onNavigate("recruiter")}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.muted,
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6
              }}
            >
              🏢 Recruteur
            </button>

            <div style={{ width: 1, height: 20, background: C.border }} />

            {/* Search Icon Button */}
            <button
              onClick={onSearch}
              style={{
                background: "transparent", border: "none", color: C.muted,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                padding: 6, transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = C.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = C.muted}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: 18, height: 18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
            </button>

            <div style={{ width: 1, height: 20, background: C.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} className="pulse" />
              <span style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>Gemini actif</span>
            </div>
          </div>
        </div>

        {/* ═══ BUILDER VIEW ═══ */}
        {activeView === "builder" && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "26px 20px" }}>
            <StepBar current={step} />

            {/* STEP 0 */}
            {step === 0 && (
              <div className="slide">
                <div className="builder-grid">

                  {/* Gauche */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                      {/* Upload */}
                      <Section title="1. Charge ton CV" icon="📄" accent={C.accent}>
                        <div
                          onClick={() => fileRef.current.click()}
                          onDragOver={e => e.preventDefault()}
                          onDrop={onFileDrop}
                          style={{
                            border: `2px dashed ${cvNom ? C.green + "77" : C.border}`,
                            borderRadius: 10, padding: "18px 14px", textAlign: "center",
                            cursor: "pointer", background: cvNom ? C.green + "08" : C.bg,
                            transition: "all 0.2s", marginBottom: cvTexte ? 10 : 0,
                          }}
                        >
                          <div style={{ fontSize: 26, marginBottom: 6 }}>{cvNom ? "✅" : "📂"}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: cvNom ? C.green : C.text, marginBottom: 3 }}>
                            {cvNom || "Clique ou glisse ton CV ici"}
                          </div>
                          <div style={{ fontSize: 10, color: C.muted }}>
                            {cvNom ? "CV chargé — tu peux en charger un autre" : ".pdf · .docx · .txt"}
                          </div>
                          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" onChange={onFileDrop} style={{ display: "none" }} />
                        </div>
                        {cvTexte && (
                          <div style={{
                            padding: "8px 10px", background: C.bg, borderRadius: 7,
                            fontSize: 9.5, color: C.muted, fontFamily: "'DM Mono',monospace",
                            maxHeight: 72, overflow: "hidden", border: `1px solid ${C.border}`,
                          }}>{cvTexte.slice(0, 250)}...</div>
                        )}
                      </Section>

                      {/* Modèle de CV */}
                      <Section title="2. Modèle de CV" icon="🎨" accent={C.gold}>
                        <div style={{ marginBottom: 10 }}>
                          <select
                            value={selectedTemplate}
                            onChange={e => setSelectedTemplate(e.target.value)}
                            style={{
                              width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                              borderRadius: 7, padding: "7.5px 11px", color: C.text,
                              fontSize: 12, outline: "none",
                            }}
                          >
                            {CV_TEMPLATES.map(tpl => (
                              <option key={tpl.id} value={tpl.id}>
                                {tpl.premium ? "✦ " : ""}{tpl.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Section>

                      {/* Infos */}
                      <Section title="3. Tes informations" icon="👤" accent={C.purple}>
                        {[
                          { k: "prenom", label: "Prénom" },
                          { k: "nom", label: "Nom" },
                          { k: "titre", label: "Titre / Formation" },
                          { k: "ville", label: "Ville" },
                          { k: "email", label: "Email" },
                          { k: "tel", label: "Téléphone (optionnel)" },
                        ].map(f => (
                          <div key={f.k} style={{ marginBottom: 9 }}>
                            <div style={{ fontSize: 9, color: C.muted, marginBottom: 3, fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em" }}>{f.label}</div>
                            <input
                              value={infos[f.k]}
                              onChange={e => setInfos(p => ({ ...p, [f.k]: e.target.value }))}
                              style={{
                                width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                                borderRadius: 7, padding: "7px 11px", color: C.text,
                                fontSize: 12, outline: "none",
                              }}
                            />
                          </div>
                        ))}
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 9, color: C.muted, marginBottom: 3, fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em" }}>PHOTO DE PROFIL</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPhotoUrl(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{
                              width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                              borderRadius: 7, padding: "7px 11px", color: C.text,
                              fontSize: 12, outline: "none",
                            }}
                          />
                        </div>
                      </Section>
                    </Card>
                  </div>

                  {/* Milieu */}
                  <Card>
                    <Section title="Offre d'emploi" icon="💼" accent={C.gold}>
                      <textarea
                        value={offre}
                        onChange={e => setOffre(e.target.value)}
                        placeholder={`Colle ici le texte complet de l'offre (stage, alternance, CDI...)\n\n• Missions du poste\n• Profil recherché\n• Compétences attendues\n• Informations sur l'entreprise`}
                        rows={23}
                        style={{
                          width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                          borderRadius: 9, padding: 16, color: C.text,
                          fontSize: 12.5, lineHeight: 1.7, outline: "none",
                        }}
                      />
                    </Section>

                    {error && (
                      <div style={{
                        background: C.red + "15", border: `1px solid ${C.red}44`,
                        borderRadius: 8, padding: "10px 14px", color: C.red,
                        fontSize: 12, marginBottom: 12,
                      }}>⚠ {error}</div>
                    )}

                    <button onClick={lancer} style={{
                      width: "100%", padding: "13px 0",
                      background: `linear-gradient(135deg,${C.accent}22,${C.purple}22)`,
                      border: `1px solid ${C.accent}55`, borderRadius: 10, color: C.accent,
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Sora',sans-serif", letterSpacing: "0.03em",
                    }}>
                      ⚡ Lancer l'agent — CV final · Lettre premium
                    </button>
                  </Card>

                  {/* Assistant IA Panel */}
                  <Card style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", background: "rgba(22, 18, 46, 0.15)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: "1px solid rgba(168, 85, 247, 0.12)" }}>
                    <Section title="Assistant IA Quantique" icon="🤖" accent={C.accent}>
                      <div style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden", border: `1px solid rgba(0, 240, 255, 0.3)`, boxShadow: `0 0 15px rgba(0, 240, 255, 0.15)`, marginBottom: 12 }}>
                        <img
                          src="/avatar-character.png"
                          alt="Assistant IA Avatar"
                          style={{ width: "100%", display: "block", filter: "brightness(0.95)" }}
                        />
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          background: "linear-gradient(to top, rgba(6, 5, 12, 0.95), transparent)",
                          padding: "16px 12px 10px 12px",
                          display: "flex", justifyContent: "center", gap: 8
                        }}>
                          <span style={{
                            fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
                            background: "rgba(0, 240, 255, 0.15)", color: "#00F0FF",
                            padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(0, 240, 255, 0.4)",
                            fontWeight: "bold", textTransform: "uppercase"
                          }}>SYSTEM: ACTIVE</span>
                          <span style={{
                            fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
                            background: "rgba(255, 176, 0, 0.15)", color: "#FFB020",
                            padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(255, 176, 0, 0.4)",
                            fontWeight: "bold", textTransform: "uppercase"
                          }}>✦ Premium</span>
                        </div>
                      </div>

                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 16 }}>
                        MIKA analyse ton profil en temps réel et génère une candidature sur-mesure, prête à envoyer.
                      </div>

                      {/* Chat messages */}
                      <div style={{
                        height: 220, overflowY: "auto", display: "flex", flexDirection: "column",
                        gap: 10, padding: 10, background: "rgba(10, 8, 22, 0.4)",
                        border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
                        marginBottom: 10, textAlign: "left"
                      }}>
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} style={{
                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                            maxWidth: "85%", padding: "8px 12px", fontSize: 12, lineHeight: 1.5,
                            borderRadius: msg.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                            background: msg.sender === "user" ? `${C.purple}44` : "rgba(255,255,255,0.06)",
                            border: msg.sender === "user" ? `1px solid ${C.purple}66` : "1px solid rgba(255,255,255,0.1)",
                            color: "#F8FAFC"
                          }}>
                            {msg.text}
                          </div>
                        ))}
                        {chatLoading && (
                          <div style={{
                            alignSelf: "flex-start", fontSize: 11.5, color: C.accent,
                            fontStyle: "italic", paddingLeft: 4, display: "flex", alignItems: "center", gap: 6
                          }}>
                            <span className="pulse">●</span> MIKA est en train d'écrire...
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") sendChatMessage(); }}
                          placeholder="Pose une question à MIKA..."
                          style={{
                            flex: 1, background: "rgba(10, 8, 22, 0.8)", border: `1px solid rgba(0, 240, 255, 0.25)`,
                            borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12.5, outline: "none"
                          }}
                        />
                        <button
                          onClick={sendChatMessage}
                          style={{
                            background: C.accent, border: "none", borderRadius: 8, width: 36, height: 36,
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            color: "#fff", fontSize: 14, fontWeight: "bold"
                          }}
                        >
                          ⚡
                        </button>
                      </div>
                    </Section>
                  </Card>

                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="slide" style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", minHeight: "55vh", gap: 28,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`,
                  animation: "spin 0.75s linear infinite",
                }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Agent en cours d'exécution</div>
                  <div style={{ fontSize: 13, color: C.accent, fontFamily: "'DM Mono',monospace" }} className="pulse">{loadMsg}</div>
                </div>
                <div style={{ width: 300 }}>
                  <div style={{ height: 4, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${loadPct}%`,
                      background: `linear-gradient(90deg,${C.accent},${C.purple})`,
                      borderRadius: 2, transition: "width 0.5s ease",
                    }} />
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 6, fontFamily: "'DM Mono',monospace" }}>{loadPct}%</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["① Analyse offre", "② Lettre motivation", "③ CV final"].map((s, i) => (
                    <div key={i} style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 10,
                      fontFamily: "'DM Mono',monospace",
                      background: loadPct > [14, 54, 77][i] ? C.green + "15" : C.dim + "44",
                      color: loadPct > [14, 54, 77][i] ? C.green : C.muted,
                      border: `1px solid ${loadPct > [14, 54, 77][i] ? C.green + "44" : C.border}`,
                    }}>{s}</div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="slide">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      Résultats — <span style={{ color: C.accent }}>{analyse?.poste || "—"}</span>
                      <span style={{ color: C.muted, fontWeight: 400, fontSize: 13 }}> chez {analyse?.entreprise || "—"}</span>
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace", marginTop: 3 }}>
                      {analyse?.type_contrat} · {analyse?.lieu} · {analyse?.secteur}
                    </div>
                  </div>
                  <Btn onClick={reset} color={C.muted} size="sm">← Nouvelle offre</Btn>
                </div>

                {analyse && (
                  <Card style={{ marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      <div>
                        <Label color={C.accent}>Compétences techniques</Label>
                        <div>{(analyse.competences_techniques || []).map((c, i) => <Tag key={i} label={c} color={C.accent} />)}</div>
                      </div>
                      <div>
                        <Label color={C.gold}>Soft skills</Label>
                        <div>{(analyse.competences_soft || []).map((c, i) => <Tag key={i} label={c} color={C.gold} />)}</div>
                      </div>
                      <div>
                        <Label color={C.green}>Mots-clés ATS</Label>
                        <div>{(analyse.mots_cles_ats || []).map((c, i) => <Tag key={i} label={c} color={C.green} />)}</div>
                      </div>
                    </div>
                    {analyse.point_diff && (
                      <div style={{
                        marginTop: 12, padding: "8px 14px", borderRadius: 8,
                        background: C.purple + "12", border: `1px solid ${C.purple}33`,
                        fontSize: 12, color: C.purple,
                      }}>💡 {analyse.point_diff}</div>
                    )}

                    {/* Score ATS réel */}
                    <div style={{
                      marginTop: 16, padding: "14px 18px", borderRadius: 10,
                      background: atsScore >= 80 ? C.green + "0A" : atsScore >= 60 ? C.gold + "0A" : C.red + "0A",
                      border: `1px solid ${atsScore >= 80 ? C.green + "33" : atsScore >= 60 ? C.gold + "33" : C.red + "33"}`,
                      display: "flex", alignItems: "center", gap: 16,
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: C.bg,
                        border: `3px solid ${atsScore >= 80 ? C.green : atsScore >= 60 ? C.gold : C.red}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700,
                        color: atsScore >= 80 ? C.green : atsScore >= 60 ? C.gold : C.red,
                        fontFamily: "'DM Mono', monospace",
                      }}>{atsScore}%</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: atsScore >= 80 ? C.green : atsScore >= 60 ? C.gold : C.red }}>
                          Score ATS — {atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Bon" : "À améliorer"}
                        </div>
                        <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace", marginTop: 3 }}>
                          {(analyse.mots_cles_ats || []).length} mots-clés ATS analysés · Basé sur votre CV + lettre
                        </div>
                      </div>
                    </div>

                    {/* Mots-clés manquants & suggestions */}
                    {(() => {
                      const missing = getMissingKeywords();
                      if (missing.length === 0) return (
                        <div style={{ marginTop: 16, borderTop: `1px dashed ${C.border}`, paddingTop: 16 }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                            background: C.green + "0A", border: `1px solid ${C.green}33`, borderRadius: 10,
                          }}>
                            <span style={{ fontSize: 20 }}>🎯</span>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: C.green }}>Score ATS optimal !</div>
                              <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>
                                Tous les mots-clés ATS sont présents dans votre CV + lettre
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                      return (
                        <div style={{ marginTop: 16, borderTop: `1px dashed ${C.border}`, paddingTop: 16 }}>
                          <Label color={C.gold}>⚠️ {missing.length} mot{missing.length > 1 ? "s" : ""}-clé{missing.length > 1 ? "s" : ""} ATS manquant{missing.length > 1 ? "s" : ""}</Label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                            {missing.map((word, idx) => (
                              <span key={idx} style={{
                                padding: "4px 10px", borderRadius: 6, background: C.red + "15",
                                border: `1px solid ${C.red}33`, color: C.red, fontSize: 11,
                                fontWeight: 500, fontFamily: "'DM Mono',monospace"
                              }}>
                                {word}
                              </span>
                            ))}
                          </div>

                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <Btn onClick={handleGenererSuggestionsATS} color={C.gold} size="sm" disabled={loadingAtsSuggestions}>
                              {loadingAtsSuggestions ? "⚡ Analyse en cours..." : "💡 Générer les insertions automatiques"}
                            </Btn>
                            {atsSuggestions && atsSuggestions.length > 0 && (
                              <Btn onClick={handleAppliquerToutesSuggestions} color={C.green} size="sm">
                                🚀 Appliquer TOUTES les optimisations ({atsSuggestions.length})
                              </Btn>
                            )}
                          </div>

                          {atsSuggestions && atsSuggestions.length > 0 && (
                            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                              <div style={{
                                fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 4,
                                display: "flex", alignItems: "center", gap: 8
                              }}>
                                <span>Insertions prêtes à intégrer :</span>
                                <span style={{
                                  padding: "2px 8px", borderRadius: 10, background: C.green + "15",
                                  border: `1px solid ${C.green}33`, color: C.green, fontSize: 10,
                                  fontFamily: "'DM Mono',monospace"
                                }}>{atsSuggestions.length} restante{atsSuggestions.length > 1 ? "s" : ""}</span>
                              </div>
                              {atsSuggestions.map((sug, idx) => {
                                const cibleLabels = {
                                  "competences.outils": { label: "🛠️ Outils & Logiciels", color: C.accent },
                                  "competences.finance": { label: "📊 Hard Skills Métier", color: C.gold },
                                  "profil": { label: "📝 Accroche Pro", color: C.purple },
                                  "experience_bullet": { label: `💼 Exp. #${(sug.experience_index || 0) + 1}`, color: C.accent },
                                };
                                const cible = cibleLabels[sug.cible_cv] || { label: "CV", color: C.muted };

                                return (
                                  <div key={idx} style={{
                                    background: C.bg + "88", border: `1px solid ${C.border}`,
                                    borderRadius: 10, padding: 14, fontSize: 12,
                                    position: "relative",
                                  }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>
                                          Mot-clé : <span style={{ color: C.red }}>{sug.mot}</span>
                                        </span>
                                        {sug.variantes && sug.variantes.length > 0 && (
                                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                            {sug.variantes.map((v, vIdx) => (
                                              <span key={vIdx} style={{
                                                padding: "2px 6px", borderRadius: 4, background: C.green + "12",
                                                border: `1px solid ${C.green}33`, color: C.green, fontSize: 10,
                                                fontFamily: "'DM Mono',monospace"
                                              }}>{v}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleAppliquerUneSuggestion(sug)}
                                        style={{
                                          padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.green}66`,
                                          background: C.green + "15", color: C.green,
                                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                                          fontFamily: "'Sora',sans-serif",
                                          transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={e => { e.target.style.background = C.green + "30"; e.target.style.transform = "scale(1.03)"; }}
                                        onMouseLeave={e => { e.target.style.background = C.green + "15"; e.target.style.transform = "scale(1)"; }}
                                      >
                                        ✚ Intégrer
                                      </button>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                      <div style={{ background: C.card, padding: 10, borderRadius: 8, borderLeft: `3px solid ${cible.color}` }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                                          <span style={{ color: cible.color }}>{cible.label}</span>
                                        </div>
                                        <div style={{ color: C.text, fontStyle: "italic", lineHeight: 1.5 }}>"{sug.texte_cv}"</div>
                                        <div style={{
                                          marginTop: 6, fontSize: 9, color: C.muted, fontFamily: "'DM Mono',monospace",
                                          padding: "2px 6px", background: cible.color + "08", borderRadius: 4, display: "inline-block"
                                        }}>→ sera ajouté dans : {sug.cible_cv}</div>
                                      </div>
                                      <div style={{ background: C.card, padding: 10, borderRadius: 8, borderLeft: `3px solid ${C.purple}` }}>
                                        <div style={{ fontSize: 10, color: C.purple, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                                          ✉️ Lettre — §{sug.paragraphe_lettre || "?"}
                                        </div>
                                        <div style={{ color: C.text, fontStyle: "italic", lineHeight: 1.5 }}>"{sug.texte_lettre}"</div>
                                        <div style={{
                                          marginTop: 6, fontSize: 9, color: C.muted, fontFamily: "'DM Mono',monospace",
                                          padding: "2px 6px", background: C.purple + "08", borderRadius: 4, display: "inline-block"
                                        }}>→ paragraphe {sug.paragraphe_lettre}</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </Card>
                )}

                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[
                    { id: "lettre", icon: "✉️", label: "Lettre de motivation" },
                    { id: "cv", icon: "📄", label: "CV final optimisé" },
                  ].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                      padding: "9px 18px", border: "none", borderRadius: "8px 8px 0 0",
                      background: activeTab === t.id ? C.card : C.bg,
                      color: activeTab === t.id ? C.accent : C.muted,
                      borderBottom: `2px solid ${activeTab === t.id ? C.accent : "transparent"}`,
                      borderTop: `1px solid ${activeTab === t.id ? C.border : "transparent"}`,
                      borderLeft: `1px solid ${activeTab === t.id ? C.border : "transparent"}`,
                      borderRight: `1px solid ${activeTab === t.id ? C.border : "transparent"}`,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Sora',sans-serif",
                    }}>{t.icon} {t.label}</button>
                  ))}
                </div>

                {activeTab === "lettre" && lettre && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "start" }} className="slide">
                    {/* Gauche : Éditeur de Lettre */}
                    <Card style={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <Label>Lettre générée (Éditable)</Label>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn onClick={regenererLettreSeule} color={C.purple} size="sm" disabled={regenLettre}>
                            {regenLettre ? "⚡ Regénération..." : "🔄 Regénérer"}
                          </Btn>
                          <Btn onClick={() => copy(lettre, "lettre")} color={copied === "lettre" ? C.green : C.accent} size="sm">
                            {copied === "lettre" ? "✓ Copié" : "Copier"}
                          </Btn>
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <Label>Objet de la lettre</Label>
                        <input
                          value={objetLettre}
                          onChange={e => setObjetLettre(e.target.value)}
                          style={{
                            width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                            borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none",
                            fontWeight: "bold", fontFamily: "'Sora',sans-serif"
                          }}
                        />
                      </div>

                      <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, background: "#FFF", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
                        <textarea
                          id="lettre-print"
                          value={lettre}
                          onChange={e => {
                            setLettre(e.target.value);
                            const newScore = calculateATSScore(analyse, e.target.value, cvProfile);
                            setAtsScore(newScore);
                          }}
                          rows={18}
                          style={{
                            width: "100%", background: "#FFF", border: "none",
                            color: "#1A1A2E", fontSize: 12.5, lineHeight: 1.7, outline: "none",
                            fontFamily: "'Sora',sans-serif", resize: "none"
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>
                        ✎ Modifie directement ci-dessus pour recalculer le score ATS
                      </div>
                    </Card>

                    {/* Droite : Rendu Réactif de la Lettre */}
                    <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: C.panel, padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${C.border}`
                      }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Modèle :</span>
                            <select
                              value={selectedLetterTemplate}
                              onChange={(e) => setSelectedLetterTemplate(e.target.value)}
                              style={{
                                background: "#120e26", color: "#FFF", border: `1px solid ${C.border}`,
                                borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none",
                                fontWeight: 600, cursor: "pointer"
                              }}
                            >
                              {LETTER_TEMPLATES.map(tpl => (
                                <option key={tpl.id} value={tpl.id} style={{ background: "#120e26", color: "#FFF" }}>
                                  {tpl.premium ? "✦ " : ""}{tpl.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Police :</span>
                            <select
                              value={selectedFont}
                              onChange={(e) => setSelectedFont(e.target.value)}
                              style={{
                                background: "#120e26", color: "#FFF", border: `1px solid ${C.border}`,
                                borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none",
                                fontWeight: 600, cursor: "pointer"
                              }}
                            >
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Inter">Inter (Sans)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Poppins">Poppins (Rond)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Lora">Lora (Serif)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Playfair">Playfair (Classique)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Outfit">Outfit (Moderne)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Roboto">Roboto (Pro)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="FiraCode">Fira Code (Tech)</option>
                            </select>
                          </div>
                        </div>
                        <Btn onClick={() => printContent("lettre")} color={C.gold} size="sm">
                          🖨️ Imprimer / PDF
                        </Btn>
                      </div>

                      <div style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        background: "#FFFFFF",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                      }}>
                        <div id="lettre-preview-print" style={{ background: "#ffffff" }}>
                          <div className={`font-override-${selectedFont}`} style={{ minHeight: "100%" }}>
                            {(() => {
                              const tpl = LETTER_TEMPLATES.find(t => t.id === selectedLetterTemplate) || LETTER_TEMPLATES[0];
                              const Comp = tpl.component;
                            const activeCv = cvProfile || {};
                            const identite = activeCv.identite || {};
                            const ana = analyse || {};
                            const dateStr = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
                            const senderName = `${infos.prenom || ""} ${infos.nom || ""}`.trim();
                            const senderEmail = identite.email || infos.email || "";
                            const senderTel = identite.telephone || infos.tel || "";
                            const senderVille = identite.ville || infos.ville || "";
                            const destEntreprise = ana.entreprise || "";
                            const destPoste = ana.poste || "";
                            const destLieu = ana.lieu || "";
                            const objet = objetLettre || `Candidature au poste de ${destPoste}${destEntreprise ? " — " + destEntreprise : ""}`;

                            return (
                              <Comp
                                body={renderLetterBody(lettre)}
                                senderName={senderName}
                                senderEmail={senderEmail}
                                senderTel={senderTel}
                                senderVille={senderVille}
                                destEntreprise={destEntreprise}
                                destPoste={destPoste}
                                destLieu={destLieu}
                                objet={objet}
                                dateStr={dateStr}
                              />
                            );
                          })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "cv" && cvProfile && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "start" }} className="slide">

                    {/* Panneau de Gauche : Éditeur Interactif de CV */}
                    <Card style={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto", padding: "16px 12px" }}>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 4 }}>Studio de CV Interactif</div>
                        <div style={{ fontSize: 11, color: C.muted }}>Personnalise chaque détail de ton CV. Vos changements réagissent instantanément à droite.</div>
                      </div>

                      {/* Section 1 : Identité & Contacts */}
                      <AccordionSection
                        title="Identité & Contacts"
                        icon="👤"
                        isOpen={openSection === "identite"}
                        onToggle={() => setOpenSection(openSection === "identite" ? "" : "identite")}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <Label>Prénom</Label>
                            <input
                              value={infos.prenom}
                              onChange={e => {
                                const val = e.target.value;
                                setInfos(p => ({ ...p, prenom: val }));
                                setCvProfile(p => p ? { ...p, identite: { ...(p.identite || {}), prenom: val } } : null);
                              }}
                              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                            />
                          </div>
                          <div>
                            <Label>Nom</Label>
                            <input
                              value={infos.nom}
                              onChange={e => {
                                const val = e.target.value;
                                setInfos(p => ({ ...p, nom: val }));
                                setCvProfile(p => p ? { ...p, identite: { ...(p.identite || {}), nom: val } } : null);
                              }}
                              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <Label>Titre Professionnel</Label>
                          <input
                            value={cvProfile.titre || ""}
                            onChange={e => setCvProfile(p => ({ ...p, titre: e.target.value }))}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                          <div>
                            <Label>Email</Label>
                            <input
                              value={cvProfile.identite?.email || ""}
                              onChange={e => handleIdentiteChange("email", e.target.value)}
                              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                            />
                          </div>
                          <div>
                            <Label>Téléphone</Label>
                            <input
                              value={cvProfile.identite?.telephone || ""}
                              onChange={e => handleIdentiteChange("telephone", e.target.value)}
                              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                            />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                          <div>
                            <Label>Ville</Label>
                            <input
                              value={cvProfile.identite?.ville || ""}
                              onChange={e => handleIdentiteChange("ville", e.target.value)}
                              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                            />
                          </div>
                          <div>
                            <Label>LinkedIn</Label>
                            <input
                              value={cvProfile.identite?.linkedin || ""}
                              onChange={e => handleIdentiteChange("linkedin", e.target.value)}
                              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12, outline: "none" }}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <Label>Photo de Profil (pour les modèles compatibles)</Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPhotoUrl(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                          />
                        </div>
                      </AccordionSection>

                      {/* Section 2 : Accroche */}
                      <AccordionSection
                        title="Accroche / Profil"
                        icon="📝"
                        isOpen={openSection === "profil"}
                        onToggle={() => setOpenSection(openSection === "profil" ? "" : "profil")}
                      >
                        <div>
                          <Label>Accroche Professionnelle</Label>
                          <textarea
                            value={cvProfile.profil || ""}
                            onChange={e => setCvProfile(p => ({ ...p, profil: e.target.value }))}
                            rows={6}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px", color: C.text, fontSize: 12, lineHeight: 1.5, outline: "none", resize: "vertical" }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                            <Btn onClick={ameliorerAccrocheIA} color={C.purple} size="sm" disabled={rewritingProfile}>
                              {rewritingProfile ? "⚡ Réécriture IA en cours..." : "✨ Améliorer par l'IA (Aligner offre)"}
                            </Btn>
                          </div>
                        </div>
                      </AccordionSection>

                      {/* Section 3 : Expériences */}
                      <AccordionSection
                        title="Expériences Professionnelles"
                        icon="💼"
                        isOpen={openSection === "experiences"}
                        onToggle={() => setOpenSection(openSection === "experiences" ? "" : "experiences")}
                      >
                        {(cvProfile.experiences || []).map((exp, idx) => (
                          <div key={idx} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 12, background: C.bg + "44" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                              <span style={{ fontWeight: "700", fontSize: 12, color: C.accent }}>Expérience #{idx + 1}</span>
                              <button
                                onClick={() => deleteExperience(idx)}
                                style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", fontWeight: "600" }}
                              >
                                ❌ Supprimer
                              </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              <div>
                                <Label>Intitulé du poste</Label>
                                <input
                                  value={exp.poste || ""}
                                  onChange={e => handleExperienceChange(idx, "poste", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                              <div>
                                <Label>Entreprise</Label>
                                <input
                                  value={exp.entreprise || ""}
                                  onChange={e => handleExperienceChange(idx, "entreprise", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                              <div>
                                <Label>Dates (ex: 2023 - Présent)</Label>
                                <input
                                  value={exp.dates || ""}
                                  onChange={e => handleExperienceChange(idx, "dates", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                              <div>
                                <Label>Lieu (ex: Paris, France)</Label>
                                <input
                                  value={exp.lieu || ""}
                                  onChange={e => handleExperienceChange(idx, "lieu", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <Label>Description / Détails</Label>
                              <textarea
                                value={exp.details || ""}
                                onChange={e => handleExperienceChange(idx, "details", e.target.value)}
                                rows={2}
                                style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                              />
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <Label>Puces de Réalisation (ATS)</Label>
                                <button
                                  onClick={() => addBullet(idx)}
                                  style={{ background: "none", border: "none", color: C.green, fontSize: 10, cursor: "pointer", fontWeight: "600" }}
                                >
                                  ➕ Ajouter une ligne
                                </button>
                              </div>
                              {(exp.bullets || []).map((bullet, bIdx) => (
                                <div key={bIdx} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                                  <input
                                    value={bullet}
                                    onChange={e => handleBulletChange(idx, bIdx, e.target.value)}
                                    style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 11, outline: "none" }}
                                  />
                                  <button
                                    onClick={() => deleteBullet(idx, bIdx)}
                                    style={{ background: "none", border: "none", color: C.red, fontSize: 10, cursor: "pointer" }}
                                  >
                                    ❌
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 10 }}>
                          <Btn onClick={addExperience} color={C.accent} size="sm">➕ Ajouter une expérience</Btn>
                        </div>
                      </AccordionSection>

                      {/* Section 4 : Formations */}
                      <AccordionSection
                        title="Formations & Diplômes"
                        icon="🎓"
                        isOpen={openSection === "formations"}
                        onToggle={() => setOpenSection(openSection === "formations" ? "" : "formations")}
                      >
                        {(cvProfile.formations || []).map((f, idx) => (
                          <div key={idx} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 12, background: C.bg + "44" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                              <span style={{ fontWeight: "700", fontSize: 12, color: C.purple }}>Formation #{idx + 1}</span>
                              <button
                                onClick={() => deleteFormation(idx)}
                                style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", fontWeight: "600" }}
                              >
                                ❌ Supprimer
                              </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              <div>
                                <Label>Diplôme / Spécialisation</Label>
                                <input
                                  value={f.diplome || ""}
                                  onChange={e => handleFormationChange(idx, "diplome", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                              <div>
                                <Label>École / Université</Label>
                                <input
                                  value={f.ecole || ""}
                                  onChange={e => handleFormationChange(idx, "ecole", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                              <div>
                                <Label>Dates</Label>
                                <input
                                  value={f.dates || ""}
                                  onChange={e => handleFormationChange(idx, "dates", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                              <div>
                                <Label>Lieu</Label>
                                <input
                                  value={f.lieu || ""}
                                  onChange={e => handleFormationChange(idx, "lieu", e.target.value)}
                                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                                />
                              </div>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <Label>Détails / Majeure</Label>
                              <input
                                value={f.details || ""}
                                onChange={e => handleFormationChange(idx, "details", e.target.value)}
                                style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                              />
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 10 }}>
                          <Btn onClick={addFormation} color={C.purple} size="sm">➕ Ajouter une formation</Btn>
                        </div>
                      </AccordionSection>

                      {/* Section 5 : Competences */}
                      <AccordionSection
                        title="Compétences & Langues"
                        icon="🛠️"
                        isOpen={openSection === "competences"}
                        onToggle={() => setOpenSection(openSection === "competences" ? "" : "competences")}
                      >
                        <div>
                          <Label>Expertises Métiers (Hard Skills)</Label>
                          <textarea
                            value={cvProfile.competences?.finance || ""}
                            onChange={e => handleCompetencesChange("finance", e.target.value)}
                            rows={2}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 11.5, outline: "none", marginBottom: 10, resize: "vertical" }}
                          />

                          <Label>Logiciels, Outils & Technologies</Label>
                          <textarea
                            value={cvProfile.competences?.outils || ""}
                            onChange={e => handleCompetencesChange("outils", e.target.value)}
                            rows={2}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 11.5, outline: "none", marginBottom: 10, resize: "vertical" }}
                          />

                          <Label>Langues Étrangères</Label>
                          <input
                            value={cvProfile.competences?.langues || ""}
                            onChange={e => handleCompetencesChange("langues", e.target.value)}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 11.5, outline: "none", marginBottom: 10 }}
                          />

                          <Label>Centres d'intérêt / Hobbies</Label>
                          <input
                            value={cvProfile.competences?.interets || ""}
                            onChange={e => handleCompetencesChange("interets", e.target.value)}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 11.5, outline: "none" }}
                          />
                        </div>
                      </AccordionSection>
                    </Card>

                    {/* Panneau de Droite : Prévisualisation réactive en direct & Impression */}
                    <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 12 }}>

                      {/* Contrôles d'en-tête de l'aperçu */}
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: C.panel, padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${C.border}`
                      }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Modèle :</span>
                            <select
                              value={selectedTemplate}
                              onChange={(e) => setSelectedTemplate(e.target.value)}
                              style={{
                                background: "#120e26", color: "#FFF", border: `1px solid ${C.border}`,
                                borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none",
                                fontWeight: 600, cursor: "pointer"
                              }}
                            >
                              {CV_TEMPLATES.map(tpl => (
                                <option key={tpl.id} value={tpl.id} style={{ background: "#120e26", color: "#FFF" }}>
                                  {tpl.premium ? "✦ " : ""}{tpl.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Police :</span>
                            <select
                              value={selectedFont}
                              onChange={(e) => setSelectedFont(e.target.value)}
                              style={{
                                background: "#120e26", color: "#FFF", border: `1px solid ${C.border}`,
                                borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none",
                                fontWeight: 600, cursor: "pointer"
                              }}
                            >
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Inter">Inter (Sans)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Poppins">Poppins (Rond)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Lora">Lora (Serif)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Playfair">Playfair (Classique)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Outfit">Outfit (Moderne)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="Roboto">Roboto (Pro)</option>
                              <option style={{ background: "#120e26", color: "#FFF" }} value="FiraCode">Fira Code (Tech)</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn onClick={() => printContent("cv")} color={C.green} size="sm">
                            🖨️ Imprimer / PDF
                          </Btn>
                        </div>
                      </div>

                      {/* Conteneur de rendu A4 Réactif */}
                      <div style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        background: "#FFFFFF",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                      }}>
                        <div id="cv-preview-print" style={{ background: "#ffffff" }}>
                          <div className={`font-override-${selectedFont}`} style={{ minHeight: "100%" }}>
                            {(() => {
                              const tpl = CV_TEMPLATES.find(t => t.id === selectedTemplate) || CV_TEMPLATES[0];
                              const Comp = tpl.component;
                              return <Comp cv={cvProfile} infos={infos} photoUrl={photoUrl} />;
                            })()}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>
                        <span>💡 Conseil : Active "Mises en page d'arrière-plan" dans le dialogue d'impression.</span>
                        <span>Modèle : {selectedTemplate}</span>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ TEMPLATES GALLERY VIEW ═══ */}
        {activeView === "templates" && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "26px 20px" }} className="slide">
            <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: C.accent, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  🎨 Galerie des Modèles & Templates
                </h1>
                <p style={{ fontSize: 13, color: C.muted }}>
                  Choisis parmi nos 15 modèles de CV et 10 modèles de lettres de motivation de qualité supérieure.
                </p>
              </div>

              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", background: C.panel, padding: "4px 8px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>POLICE :</span>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    style={{
                      background: "#120e26", color: "#FFF", border: `1px solid ${C.border}`,
                      borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none",
                      fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    <option style={{ background: "#120e26", color: "#FFF" }} value="Inter">Inter (Sans)</option>
                    <option style={{ background: "#120e26", color: "#FFF" }} value="Poppins">Poppins (Rond)</option>
                    <option style={{ background: "#120e26", color: "#FFF" }} value="Lora">Lora (Serif)</option>
                    <option style={{ background: "#120e26", color: "#FFF" }} value="Playfair">Playfair (Classique)</option>
                    <option style={{ background: "#120e26", color: "#FFF" }} value="Outfit">Outfit (Moderne)</option>
                    <option style={{ background: "#120e26", color: "#FFF" }} value="Roboto">Roboto (Pro)</option>
                    <option style={{ background: "#120e26", color: "#FFF" }} value="FiraCode">Fira Code (Tech)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setActiveTab("cv"); }}
                    style={{
                      background: activeTab === "cv" ? C.accent : C.bg,
                      border: `1px solid ${activeTab === "cv" ? "transparent" : C.border}`,
                      color: activeTab === "cv" ? "#000" : C.text,
                      padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    📄 CVs (15)
                  </button>
                  <button
                    onClick={() => { setActiveTab("lettre"); }}
                    style={{
                      background: activeTab === "lettre" ? C.accent : C.bg,
                      border: `1px solid ${activeTab === "lettre" ? "transparent" : C.border}`,
                      color: activeTab === "lettre" ? "#000" : C.text,
                      padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    ✉️ Lettres (10)
                  </button>
                </div>
              </div>
            </div>

            {activeTab === "cv" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                {CV_TEMPLATES.map(tpl => {
                  const Comp = tpl.component;
                  const isSelected = selectedTemplate === tpl.id;

                  const fallbackInfos = {
                    prenom: infos.prenom || "Marie",
                    nom: infos.nom || "Laurent",
                    titre: infos.titre || "Ingénieure Full-Stack",
                    ville: infos.ville || "Paris",
                    email: infos.email || "marie.laurent@email.com",
                    tel: infos.tel || "06 12 34 56 78",
                  };

                  // fallback dummy data matching actual template prop expectations
                  const dummyCv = cvProfile || {
                    titre: "Ingénieure Full-Stack & Cloud",
                    profil: "Développeuse passionnée avec 6 ans d'expérience en conception d'applications web modernes. Expertise React, Node.js et architectures cloud AWS. Certifiée AWS Solutions Architect.",
                    identite: {
                      email: fallbackInfos.email,
                      telephone: fallbackInfos.tel,
                      ville: fallbackInfos.ville,
                      linkedin: "linkedin.com/in/marie-laurent",
                    },
                    experiences: [
                      { poste: "Lead Développeuse Full-Stack", entreprise: "TechVision", dates: "2022 – Présent", lieu: "Paris", details: "Pilotage technique d'une équipe de 5 développeurs. Refonte complète de l'architecture front-end React.", bullets: ["Migration vers Next.js 14 — amélioration des performances de 40%", "Mise en place CI/CD GitHub Actions + déploiement AWS ECS"] },
                      { poste: "Développeuse Full-Stack", entreprise: "DataSphere", dates: "2019 – 2022", lieu: "Lyon", details: "Développement d'applications SaaS B2B en React & Node.js.", bullets: ["Conception d'une API RESTful servant 50k requêtes/jour", "Intégration de systèmes de paiement Stripe & PayPal"] },
                    ],
                    formations: [
                      { diplome: "Master Informatique", ecole: "EPITA Paris", dates: "2017 – 2019", lieu: "Paris" },
                      { diplome: "AWS Solutions Architect", ecole: "Amazon Web Services", dates: "2023" },
                    ],
                    competences: {
                      finance: "React, Next.js, Node.js, TypeScript, Python",
                      outils: "AWS, Docker, Kubernetes, Git, PostgreSQL",
                      langues: "Français (Natif), Anglais (C1)",
                      interets: "Open Source, Randonnée, Photographie",
                    },
                  };

                  return (
                    <Card
                      key={tpl.id}
                      style={{
                        padding: 12,
                        position: "relative",
                        border: isSelected ? `2.5px solid ${C.accent}` : `1px solid ${C.border}`,
                        borderRadius: 14,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        background: C.card,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}
                    >
                      {/* Premium / Selected Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                          {tpl.name}
                        </span>
                        {tpl.premium && (
                          <span style={{
                            background: "linear-gradient(135deg, #FFD700, #FFA500)",
                            color: "#000",
                            fontSize: 9,
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: 6,
                            letterSpacing: "0.05em"
                          }}>
                            ✦ PREMIUM
                          </span>
                        )}
                      </div>

                      {/* Scaled preview frame */}
                      <div style={{
                        width: "100%",
                        height: 340,
                        overflow: "hidden",
                        borderRadius: 8,
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.1)",
                        position: "relative",
                        cursor: "pointer"
                      }}
                        onClick={() => {
                          setPreviewingTemplate({ type: "cv", template: tpl });
                        }}
                      >
                        <div style={{
                          transform: "scale(0.31)",
                          transformOrigin: "top left",
                          width: "794px",
                          minHeight: "1123px",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          pointerEvents: "none"
                        }}>
                          <Comp cv={dummyCv} infos={fallbackInfos} photoUrl={photoUrl} />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setPreviewingTemplate({ type: "cv", template: tpl });
                          }}
                          style={{
                            flex: 1,
                            background: "rgba(168, 85, 247, 0.12)",
                            color: C.purple,
                            border: `1px solid ${C.purple}44`,
                            fontWeight: 700,
                            fontSize: 11.5,
                            padding: "8px 0",
                            borderRadius: 8,
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.18s"
                          }}
                        >
                          👁️ Aperçu
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTemplate(tpl.id);
                            setActiveView("builder");
                          }}
                          style={{
                            flex: 1.2,
                            background: isSelected ? C.green + "20" : C.accent,
                            color: isSelected ? C.green : "#000",
                            border: isSelected ? `1px solid ${C.green}` : "none",
                            fontWeight: 700,
                            fontSize: 11.5,
                            padding: "8px 0",
                            borderRadius: 8,
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          {isSelected ? "✓ Actif" : "⚡ Choisir"}
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                {LETTER_TEMPLATES.map(tpl => {
                  const Comp = tpl.component;
                  const isSelected = selectedLetterTemplate === tpl.id;
                  const dateStr = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
                  const dummyText = lettre || "Madame, Monsieur,\n\nC'est avec un vif intérêt que je vous adresse ma candidature. Ayant suivi avec attention le développement de vos projets innovants, je suis convaincue que mes compétences sauront s'intégrer parfaitement.\n\nMon parcours m'a permis de développer une expertise solide et de mener à bien des projets d'envergure. Motivée et rigoureuse, je souhaite aujourd'hui mettre mon enthousiasme à votre service.\n\nJe reste à votre entière disposition pour convenir d'un entretien.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.";
                  const dummyLetterBody = renderLetterBody(dummyText);
                  return (
                    <Card
                      key={tpl.id}
                      style={{
                        padding: 12,
                        border: isSelected ? `2.5px solid ${C.accent}` : `1px solid ${C.border}`,
                        borderRadius: 14, overflow: "hidden",
                        display: "flex", flexDirection: "column", gap: 10,
                        background: C.card,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{tpl.name}</span>
                        {tpl.premium && (
                          <span style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6 }}>✦ PREMIUM</span>
                        )}
                      </div>
                      <div
                        style={{ width: "100%", height: 340, overflow: "hidden", borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", position: "relative", cursor: "pointer" }}
                        onClick={() => {
                          setPreviewingTemplate({ type: "letter", template: tpl });
                        }}
                      >
                        <div style={{ transform: "scale(0.31)", transformOrigin: "top left", width: "794px", minHeight: "1123px", position: "absolute", top: 0, left: 0, pointerEvents: "none", background: "#fff", padding: "60px 50px", boxSizing: "border-box" }}>
                          <Comp
                            body={dummyLetterBody}
                            senderName={`${infos.prenom || "Marie"} ${infos.nom || "Laurent"}`}
                            senderEmail={infos.email || "marie.laurent@email.com"}
                            senderTel={infos.tel || "06 12 34 56 78"}
                            senderVille={infos.ville || "Paris"}
                            destEntreprise={analyse?.entreprise || "TechCorp Innovations"}
                            destPoste={analyse?.poste || "Ingénieure Full-Stack"}
                            destLieu={analyse?.lieu || "Paris"}
                            objet={objetLettre || "Candidature au poste d'Ingénieure Solutions"}
                            dateStr={dateStr}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setPreviewingTemplate({ type: "letter", template: tpl });
                          }}
                          style={{
                            flex: 1,
                            background: "rgba(168, 85, 247, 0.12)",
                            color: C.purple,
                            border: `1px solid ${C.purple}44`,
                            fontWeight: 700,
                            fontSize: 11.5,
                            padding: "8px 0",
                            borderRadius: 8,
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.18s"
                          }}
                        >
                          👁️ Aperçu
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLetterTemplate(tpl.id);
                            setActiveView("builder");
                          }}
                          style={{
                            flex: 1.2,
                            background: isSelected ? C.green + "20" : C.accent,
                            color: isSelected ? C.green : "#000",
                            border: isSelected ? `1px solid ${C.green}` : "none",
                            fontWeight: 700,
                            fontSize: 11.5,
                            padding: "8px 0",
                            borderRadius: 8,
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          {isSelected ? "✓ Actif" : "⚡ Choisir"}
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ DASHBOARD / CRM VIEW ═══ */}
        {activeView === "dashboard" && (
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "26px 20px" }} className="slide">

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Total Candidatures", value: kpiTotal, icon: "📋", color: C.accent },
                { label: "Envoyées", value: kpiApplied, icon: "📤", color: C.purple },
                { label: "Entretiens", value: kpiInterviews, icon: "🎤", color: C.gold },
                { label: "Taux de conversion", value: `${kpiConversion}%`, icon: "📈", color: C.green },
              ].map((kpi, i) => (
                <div key={i} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${kpi.color}, transparent)`,
                  }} />
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, background: kpi.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    border: `1px solid ${kpi.color}33`,
                  }}>{kpi.icon}</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{kpi.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>📊 Tableau Kanban</span>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono',monospace" }}>
                  Déplace tes candidatures à travers les étapes
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={() => setShowGmailPanel(true)} color={C.purple} size="sm">📧 Synchroniser Gmail</Btn>
                <Btn onClick={() => setActiveView("builder")} color={C.accent} size="sm">⚡ Nouvelle candidature</Btn>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="k-board">
              {STATUTS.map(statut => {
                const cards = candidatures.filter(c => c.statut === statut);
                const col = STATUT_COLORS[statut];
                return (
                  <div key={statut} className="k-column" style={{ borderTopColor: col, borderTopWidth: 2 }}>
                    <div className="k-column-header">
                      <div className="k-column-title">
                        <span>{STATUT_ICONS[statut]}</span>
                        <span style={{ color: col }}>{statut}</span>
                      </div>
                      <span style={{
                        background: col + "22", color: col, fontSize: 10, padding: "2px 7px",
                        borderRadius: 10, fontWeight: 700, fontFamily: "'DM Mono',monospace"
                      }}>{cards.length}</span>
                    </div>
                    {cards.length === 0 && (
                      <div style={{ textAlign: "center", padding: "30px 10px", color: C.dim, fontSize: 11 }}>
                        Aucune candidature
                      </div>
                    )}
                    {cards.map(cand => (
                      <div
                        key={cand.id}
                        className="k-card"
                        onClick={() => { setSelectedCandidature(cand); setActiveDashboardTab("documents"); }}
                        style={{ width: "100%", font: "inherit" }}
                      >
                        <div className="k-card-title">{cand.entreprise}</div>
                        <div className="k-card-subtitle">{cand.poste}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                          <Tag label={`ATS ${cand.scoreATS}%`} color={cand.scoreATS >= 85 ? C.green : C.gold} />
                          {(cand.reminders || []).filter(r => !r.completed).length > 0 && (
                            <Tag label={`${cand.reminders.filter(r => !r.completed).length} rappel(s)`} color={C.red} />
                          )}
                        </div>
                        <div className="k-card-footer">
                          <span>📅 {cand.dateAjout}</span>
                          <div style={{ display: "flex", gap: 4 }}>
                            {STATUTS.filter(s => s !== cand.statut).slice(0, 2).map(s => (
                              <button
                                key={s}
                                onClick={e => { e.stopPropagation(); updateCandidatureStatut(cand.id, s); }}
                                title={`Passer à ${s}`}
                                style={{
                                  background: STATUT_COLORS[s] + "20", border: `1px solid ${STATUT_COLORS[s]}44`,
                                  color: STATUT_COLORS[s], fontSize: 9, padding: "2px 6px", borderRadius: 6,
                                  cursor: "pointer", fontFamily: "'DM Mono',monospace",
                                }}
                              >{STATUT_ICONS[s]}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ DETAIL MODAL ═══ */}
        {selectedCandidature && (
          <div className="m-overlay" onClick={() => setSelectedCandidature(null)}>
            <div className="m-content" onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div style={{
                padding: "18px 24px", borderBottom: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    {STATUT_ICONS[selectedCandidature.statut]} {selectedCandidature.entreprise}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>{selectedCandidature.poste} · {selectedCandidature.dateAjout}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <select
                    value={selectedCandidature.statut}
                    onChange={e => updateCandidatureStatut(selectedCandidature.id, e.target.value)}
                    style={{
                      background: STATUT_COLORS[selectedCandidature.statut] + "20",
                      border: `1px solid ${STATUT_COLORS[selectedCandidature.statut]}66`,
                      color: STATUT_COLORS[selectedCandidature.statut],
                      padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", outline: "none",
                    }}
                  >
                    {STATUTS.map(s => <option key={s} value={s}>{STATUT_ICONS[s]} {s}</option>)}
                  </select>
                  <Tag label={`ATS ${selectedCandidature.scoreATS}%`} color={selectedCandidature.scoreATS >= 85 ? C.green : C.gold} />
                  <button
                    onClick={() => deleteCandidature(selectedCandidature.id)}
                    title="Supprimer cette candidature"
                    style={{ background: C.red + "15", border: `1px solid ${C.red}44`, color: C.red, padding: "5px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
                  >🗑️</button>
                  <button
                    onClick={() => setSelectedCandidature(null)}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "5px 10px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                  >✕</button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
                {[
                  { id: "documents", label: "📄 Documents", },
                  { id: "tracker", label: "📈 Pipeline" },
                  { id: "reminders", label: "🔔 Rappels" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDashboardTab(tab.id)}
                    style={{
                      padding: "10px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: activeDashboardTab === tab.id ? C.accent + "15" : "transparent",
                      color: activeDashboardTab === tab.id ? C.accent : C.muted,
                      border: "none", borderBottom: activeDashboardTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >{tab.label}</button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

                {/* Documents Tab */}
                {activeDashboardTab === "documents" && (
                  <div className="slide">
                    <Section title="Lettre de motivation générée" icon="✉️" accent={C.accent}>
                      {selectedCandidature.objetLettreGeneree && (
                        <div style={{ marginBottom: 10, fontSize: 12.5, fontWeight: "700", color: C.accent }}>
                          Objet : {selectedCandidature.objetLettreGeneree}
                        </div>
                      )}
                      <div style={{
                        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                        padding: 18, fontSize: 12.5, color: C.text, lineHeight: 1.8,
                        whiteSpace: "pre-wrap", maxHeight: 350, overflowY: "auto",
                      }}>
                        {selectedCandidature.lettreGeneree || "Aucune lettre générée pour cette candidature."}
                      </div>
                      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                        <Btn
                          size="sm" color={C.green}
                          onClick={() => {
                            navigator.clipboard.writeText(selectedCandidature.lettreGeneree || "");
                            alert("Lettre copiée !");
                          }}
                        >📋 Copier la lettre</Btn>
                        <Btn
                          size="sm" color={C.gold}
                          onClick={() => {
                            setLettre(selectedCandidature.lettreGeneree || "");
                            setObjetLettre(selectedCandidature.objetLettreGeneree || "");
                            setAnalyse(selectedCandidature.analyseData || {});
                            printContent("lettre", selectedCandidature.cvUtilise);
                          }}
                        >⬇ Imprimer / Exporter PDF</Btn>
                      </div>
                    </Section>
                    <Section title="CV utilisé" icon="📝" accent={C.purple}>
                      <div style={{ fontSize: 12, color: C.muted }}>
                        {selectedCandidature.cvUtilise ? (
                          <div>
                            <div style={{ marginBottom: 6 }}>
                              <strong style={{ color: C.text }}>{selectedCandidature.cvUtilise.titre || "Titre non défini"}</strong>
                            </div>
                            <div style={{ marginBottom: 4 }}>{selectedCandidature.cvUtilise.profil?.slice(0, 200) || ""}...</div>
                            <div style={{ fontSize: 10, color: C.dim }}>
                              {(selectedCandidature.cvUtilise.experiences || []).length} expérience(s) · {(selectedCandidature.cvUtilise.formations || []).length} formation(s)
                            </div>
                          </div>
                        ) : "Aucun CV enregistré pour cette candidature."}
                      </div>
                    </Section>
                  </div>
                )}

                {/* Pipeline/Tracker Tab */}
                {activeDashboardTab === "tracker" && (
                  <div className="slide">
                    <Section title="Pipeline de candidature" icon="📈" accent={C.gold}>
                      <div className="timeline-container">
                        {WORKFLOW_STEPS.map((ws, i) => {
                          const dateValue = selectedCandidature.workflow?.[ws.key] || "";
                          const isDone = !!dateValue;
                          const isActive = !isDone && i === WORKFLOW_STEPS.findIndex(w => !selectedCandidature.workflow?.[w.key]);
                          return (
                            <div key={ws.key} className="timeline-item">
                              <div className={`timeline-dot ${isDone ? "done" : isActive ? "active" : ""}`} />
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: isDone ? C.green : isActive ? C.accent : C.muted }}>
                                    {ws.icon} {ws.label}
                                  </span>
                                </div>
                                <span style={{ fontSize: 10, color: isDone ? C.green : C.dim, fontFamily: "'DM Mono',monospace" }}>
                                  {dateValue || "—"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Section>

                    <Section title="Changer d'étape" icon="🔄" accent={C.purple}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {STATUTS.map(s => (
                          <button
                            key={s}
                            onClick={() => updateCandidatureStatut(selectedCandidature.id, s)}
                            style={{
                              padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                              background: selectedCandidature.statut === s ? STATUT_COLORS[s] + "30" : C.bg,
                              border: `1px solid ${selectedCandidature.statut === s ? STATUT_COLORS[s] : C.border}`,
                              color: selectedCandidature.statut === s ? STATUT_COLORS[s] : C.muted,
                              transition: "all 0.2s",
                            }}
                          >{STATUT_ICONS[s]} {s}</button>
                        ))}
                      </div>
                    </Section>
                  </div>
                )}

                {/* Reminders Tab */}
                {activeDashboardTab === "reminders" && (
                  <div className="slide">
                    <Section title="Ajouter un rappel" icon="➕" accent={C.accent}>
                      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <Label>Description du rappel</Label>
                          <input
                            value={newReminderText}
                            onChange={e => setNewReminderText(e.target.value)}
                            placeholder="Ex: Relancer le recruteur de Amazon"
                            style={{
                              width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                              borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none",
                            }}
                          />
                        </div>
                        <div style={{ width: 160 }}>
                          <Label>Date</Label>
                          <input
                            type="date"
                            value={newReminderDate}
                            onChange={e => setNewReminderDate(e.target.value)}
                            style={{
                              width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                              borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none",
                            }}
                          />
                        </div>
                        <Btn onClick={() => addReminder(selectedCandidature.id)} color={C.green} size="sm">✅ Ajouter</Btn>
                      </div>
                    </Section>

                    <Section title="Mes rappels" icon="🔔" accent={C.gold}>
                      {(!selectedCandidature.reminders || selectedCandidature.reminders.length === 0) ? (
                        <div style={{ textAlign: "center", padding: "20px 0", color: C.dim, fontSize: 12 }}>
                          Aucun rappel pour cette candidature. Ajoute-en un ci-dessus !
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {selectedCandidature.reminders.map(rem => (
                            <div key={rem.id} style={{
                              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                              background: rem.completed ? C.dim + "22" : C.bg, borderRadius: 10,
                              border: `1px solid ${rem.completed ? C.dim : C.border}`,
                            }}>
                              <button
                                onClick={() => toggleReminder(selectedCandidature.id, rem.id)}
                                style={{
                                  width: 22, height: 22, borderRadius: 6, cursor: "pointer",
                                  background: rem.completed ? C.green + "30" : C.bg,
                                  border: `2px solid ${rem.completed ? C.green : C.border}`,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: C.green, fontSize: 12, flexShrink: 0,
                                }}
                              >{rem.completed ? "✓" : ""}</button>
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: 12.5, fontWeight: 600,
                                  color: rem.completed ? C.dim : C.text,
                                  textDecoration: rem.completed ? "line-through" : "none",
                                }}>{rem.titre}</div>
                                <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>📅 {rem.date}</div>
                              </div>
                              <button
                                onClick={() => exportICS(selectedCandidature, rem)}
                                title="Exporter vers calendrier (.ics)"
                                style={{
                                  background: C.accent + "15", border: `1px solid ${C.accent}44`,
                                  color: C.accent, fontSize: 10, padding: "4px 10px", borderRadius: 6,
                                  cursor: "pointer", fontWeight: 600,
                                }}
                              >📆 .ics</button>
                              <button
                                onClick={() => deleteReminder(selectedCandidature.id, rem.id)}
                                title="Supprimer ce rappel"
                                style={{
                                  background: C.red + "15", border: `1px solid ${C.red}44`,
                                  color: C.red, fontSize: 10, padding: "4px 8px", borderRadius: 6,
                                  cursor: "pointer",
                                }}
                              >🗑️</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Section>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TEMPLATE PREVIEW MODAL ═══ */}
        {previewingTemplate && (() => {
          const { type, template } = previewingTemplate;
          const Comp = template.component;
          const isSelected = type === "cv" ? selectedTemplate === template.id : selectedLetterTemplate === template.id;

          // Dummy Data / Previews
          const fallbackInfos = {
            prenom: infos.prenom || "Marie",
            nom: infos.nom || "Laurent",
            titre: infos.titre || "Ingénieure Full-Stack",
            ville: infos.ville || "Paris",
            email: infos.email || "marie.laurent@email.com",
            tel: infos.tel || "06 12 34 56 78",
          };

          const dummyCv = cvProfile || {
            titre: "Ingénieure Full-Stack & Cloud",
            profil: "Développeuse passionnée avec 6 ans d'expérience en conception d'applications web modernes. Expertise React, Node.js et architectures cloud AWS. Certifiée AWS Solutions Architect.",
            identite: {
              email: fallbackInfos.email,
              telephone: fallbackInfos.tel,
              ville: fallbackInfos.ville,
              linkedin: "linkedin.com/in/marie-laurent",
            },
            experiences: [
              { poste: "Lead Développeuse Full-Stack", entreprise: "TechVision", dates: "2022 – Présent", lieu: "Paris", details: "Pilotage technique d'une équipe de 5 développeurs. Refonte complète de l'architecture front-end React.", bullets: ["Migration vers Next.js 14 — amélioration des performances de 40%", "Mise en place CI/CD GitHub Actions + déploiement AWS ECS"] },
              { poste: "Développeuse Full-Stack", entreprise: "DataSphere", dates: "2019 – 2022", lieu: "Lyon", details: "Développement d'applications SaaS B2B en React & Node.js.", bullets: ["Conception d'une API RESTful servant 50k requêtes/jour", "Intégration de systèmes de paiement Stripe & PayPal"] },
            ],
            formations: [
              { diplome: "Master Informatique", ecole: "EPITA Paris", dates: "2017 – 2019", lieu: "Paris" },
              { diplome: "AWS Solutions Architect", ecole: "Amazon Web Services", dates: "2023" },
            ],
            competences: {
              finance: "React, Next.js, Node.js, TypeScript, Python",
              outils: "AWS, Docker, Kubernetes, Git, PostgreSQL",
              langues: "Français (Natif), Anglais (C1)",
              interets: "Open Source, Randonnée, Photographie",
            },
          };

          const dateStr = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
          const dummyText = lettre || "Madame, Monsieur,\n\nC'est avec un vif intérêt que je vous adresse ma candidature. Ayant suivi avec attention le développement de vos projets innovants, je suis convaincue que mes compétences sauront s'intégrer parfaitement.\n\nMon parcours m'a permis de développer une expertise solide et de mener à bien des projets d'envergure. Motivée et rigoureuse, je souhaite aujourd'hui mettre mon enthousiasme à votre service.\n\nJe reste à votre entière disposition pour convenir d'un entretien.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.";
          const dummyLetterBody = renderLetterBody(dummyText);

          return (
            <div className="m-overlay" onClick={() => setPreviewingTemplate(null)} style={{ zIndex: 1200 }}>
              <div 
                className="m-content" 
                onClick={e => e.stopPropagation()} 
                style={{ 
                  maxWidth: 950, 
                  height: "90vh",
                  background: "rgba(10, 8, 22, 0.95)",
                  border: `1px solid ${C.accent}40`,
                  boxShadow: `0 24px 64px rgba(0, 240, 255, 0.15)`
                }}
              >
                {/* Modal Header */}
                <div style={{
                  padding: "16px 24px", 
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>🎨 Aperçu du modèle :</span>
                      <span style={{ color: C.accent }}>{template.name}</span>
                      {template.premium && (
                        <span style={{
                          background: "linear-gradient(135deg, #FFD700, #FFA500)",
                          color: "#000",
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 6,
                          letterSpacing: "0.05em"
                        }}>
                          ✦ PREMIUM
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                      {type === "cv" ? "Modèle de Curriculum Vitae (A4)" : "Modèle de Lettre de Motivation (A4)"}
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewingTemplate(null)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      color: C.muted,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body: Scaled rendering area */}
                <div style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px",
                  display: "flex",
                  justifyContent: "center",
                  background: "#080612",
                }}>
                  {/* Container that acts as the sheet of paper */}
                  <div style={{
                    width: "794px",
                    minHeight: "1123px",
                    background: "#FFFFFF",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.5)",
                    transformOrigin: "top center",
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    <div className={`font-override-${selectedFont}`} style={{ minHeight: "100%" }}>
                      {type === "cv" ? (
                        <Comp cv={dummyCv} infos={fallbackInfos} photoUrl={photoUrl} />
                      ) : (
                        <div style={{ background: "#fff", padding: "60px 50px", minHeight: "1123px", boxSizing: "border-box" }}>
                          <Comp
                            body={dummyLetterBody}
                            senderName={`${infos.prenom || "Marie"} ${infos.nom || "Laurent"}`}
                            senderEmail={infos.email || "marie.laurent@email.com"}
                            senderTel={infos.tel || "06 12 34 56 78"}
                            senderVille={infos.ville || "Paris"}
                            destEntreprise={analyse?.entreprise || "TechCorp Innovations"}
                            destPoste={analyse?.poste || "Ingénieure Full-Stack"}
                            destLieu={analyse?.lieu || "Paris"}
                            objet={objetLettre || "Candidature au poste d'Ingénieure Solutions"}
                            dateStr={dateStr}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{
                  padding: "16px 24px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  background: "rgba(13, 11, 28, 0.9)"
                }}>
                  <Btn onClick={() => setPreviewingTemplate(null)} color={C.muted}>
                    Fermer
                  </Btn>
                  <button
                    onClick={() => {
                      if (type === "cv") {
                        setSelectedTemplate(template.id);
                      } else {
                        setSelectedLetterTemplate(template.id);
                      }
                      setPreviewingTemplate(null);
                      setActiveView("builder");
                    }}
                    style={{
                      background: isSelected ? C.green + "20" : `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                      color: isSelected ? C.green : "#fff",
                      border: isSelected ? `1px solid ${C.green}` : "none",
                      borderRadius: 9,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: isSelected ? "none" : `0 4px 15px ${C.accent}40`,
                      transition: "all 0.2s"
                    }}
                  >
                    {isSelected ? "✓ Modèle Actuel" : "Utiliser ce modèle"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Sliding Gmail Sync Panel */}
        {showGmailPanel && (
          <div style={{
            position: "fixed", top: 0, right: 0, width: 550, height: "100vh",
            background: "rgba(18, 22, 40, 0.96)", backdropFilter: "blur(20px)",
            borderLeft: `1px solid ${C.border}`, zIndex: 1100, display: "flex",
            flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,0.6)",
            animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            {/* Header */}
            <div style={{
              padding: "20px 28px", borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📧</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Importation de Candidatures</div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono',monospace" }}>
                    dossier / libellé : Suivi-Candidatures
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGmailPanel(false)}
                style={{
                  background: "transparent", border: "none", color: C.muted,
                  fontSize: 20, cursor: "pointer", transition: "color 0.2s"
                }}
                onMouseEnter={e => e.target.style.color = C.red}
                onMouseLeave={e => e.target.style.color = C.muted}
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: 28, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Auth Status Banner */}
              <div style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: 16, display: "flex", flexDirection: "column", gap: 12
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: gmailAuthenticated ? C.green : C.red,
                      boxShadow: `0 0 8px ${gmailAuthenticated ? C.green : C.red}`
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {gmailAuthenticated ? `Compte connecté : ${gmailEmail}` : "Messagerie non connectée"}
                    </span>
                  </div>
                  {gmailAuthenticated && (
                    <button
                      onClick={disconnectGmail}
                      style={{
                        background: "transparent", border: "none", color: C.red,
                        fontSize: 11, cursor: "pointer", textDecoration: "underline"
                      }}
                    >Déconnecter</button>
                  )}
                </div>

                {gmailAuthenticated ? (
                  /* Sync button for authenticated users */
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn
                      onClick={syncGmail}
                      color={C.purple}
                      disabled={gmailSyncing}
                      style={{ flex: 1 }}
                    >
                      {gmailSyncing ? "🔄 Synchronisation..." : "🔄 Synchroniser maintenant"}
                    </Btn>
                  </div>
                ) : (
                  /* Connection form for unauthenticated users */
                  <form onSubmit={saveGmailConfig} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px 0", lineHeight: 1.4 }}>
                      Pour importer automatiquement vos e-mails de candidature, configurez votre connexion Gmail sécurisée ci-dessous.
                    </p>
                    <div>
                      <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Adresse Gmail</label>
                      <input
                        type="email"
                        value={configEmail}
                        onChange={(e) => setConfigEmail(e.target.value)}
                        placeholder="votre.email@gmail.com"
                        style={{
                          width: "100%", background: "#0C0F1A", border: `1px solid ${C.border}`,
                          borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 12,
                          outline: "none"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>Mot de passe d'application</label>
                      <input
                        type="password"
                        value={configAppPassword}
                        onChange={(e) => setConfigAppPassword(e.target.value)}
                        placeholder="Mot de passe à 16 caractères"
                        style={{
                          width: "100%", background: "#0C0F1A", border: `1px solid ${C.border}`,
                          borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 12,
                          outline: "none"
                        }}
                      />
                    </div>

                    {configError && <div style={{ fontSize: 11, color: C.red }}>{configError}</div>}
                    {configMessage && <div style={{ fontSize: 11, color: C.green }}>{configMessage}</div>}

                    <button
                      type="submit"
                      style={{
                        background: C.accent, border: "none", color: "#000",
                        fontWeight: 600, borderRadius: 6, padding: "8px 12px",
                        cursor: "pointer", fontSize: 11, marginTop: 4, width: "100%"
                      }}
                    >
                      🔌 Connexion Messagerie
                    </button>
                  </form>
                )}

                {/* Helper guide always visible or togglable when not connected */}
                {!gmailAuthenticated && (
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setShowGmailConfig(!showGmailConfig)}
                      style={{
                        background: "transparent", border: "none", color: C.accent,
                        fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center",
                        gap: 4, padding: 0, fontWeight: 500
                      }}
                    >
                      {showGmailConfig ? "▼ Masquer l'aide" : "▶ Besoin d'aide pour le mot de passe d'application ?"}
                    </button>

                    {showGmailConfig && (
                      <div style={{ marginTop: 8, fontSize: 10, color: C.muted, lineHeight: 1.4, background: "#0C0F1A", padding: 10, borderRadius: 6, border: `1px dashed ${C.border}` }}>
                        1. Activez la <strong>Validation en 2 étapes</strong> dans la sécurité de votre compte Google.<br />
                        2. Ouvrez <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>Mon Compte Google &gt; Sécurité</a>.<br />
                        3. Recherchez <strong>Mots de passe d'application</strong>.<br />
                        4. Générez un code (ex: "CRM Candidatures") et copiez les 16 lettres.<br />
                        5. Saisissez-les dans le champ ci-dessus.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message & Errors */}
              {gmailError && (
                <div style={{
                  background: C.red + "15", border: `1px solid ${C.red}44`,
                  borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 12
                }}>
                  ⚠️ {gmailError}
                </div>
              )}
              {gmailMessage && !gmailError && (
                <div style={{
                  background: C.accent + "15", border: `1px solid ${C.accent}44`,
                  borderRadius: 8, padding: "10px 14px", color: C.accent, fontSize: 11,
                  fontFamily: "'DM Mono',monospace"
                }}>
                  ℹ️ {gmailMessage}
                </div>
              )}

              {/* Sync results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    📩 Candidatures détectées ({gmailEmails.length})
                  </span>
                  {gmailEmails.length > 0 && (
                    <button
                      onClick={importAllGmailCandidatures}
                      style={{
                        background: C.green + "20", border: `1px solid ${C.green}44`,
                        color: C.green, fontSize: 11, padding: "4px 10px",
                        borderRadius: 6, cursor: "pointer", fontWeight: 600
                      }}
                    >🚀 Tout importer</button>
                  )}
                </div>

                {gmailEmails.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px", color: C.dim,
                    border: `1px dashed ${C.border}`, borderRadius: 12, fontSize: 12
                  }}>
                    {gmailSyncing ? "Analyse IA des emails du libellé..." : "Aucune candidature en attente d'import. Cliquez sur Synchroniser pour interroger Gmail."}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {gmailEmails.map(email => {
                      const statCol = STATUT_COLORS[email.statut_suggere] || C.accent;
                      return (
                        <div key={email.emailId} style={{
                          background: C.card, border: `1px solid ${C.border}`,
                          borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10,
                          position: "relative"
                        }}>
                          {/* Top row */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                                {email.entreprise || "Entreprise inconnue"}
                              </div>
                              <div style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>
                                {email.poste || "Poste non spécifié"}
                              </div>
                            </div>
                            <span style={{
                              background: statCol + "20", color: statCol,
                              fontSize: 10, padding: "2px 8px", borderRadius: 10,
                              fontWeight: 700, textTransform: "uppercase"
                            }}>{email.statut_suggere}</span>
                          </div>

                          {/* Details */}
                          <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
                            {email.type_contrat && <span>📄 {email.type_contrat}</span>}
                            {email.lieu && <span>📍 {email.lieu}</span>}
                            <span>📅 {new Date(email.emailDate || email.date_email || Date.now()).toLocaleDateString("fr-FR")}</span>
                          </div>

                          {/* Summary / Snippet */}
                          <div style={{
                            background: C.bg, padding: "10px 12px", borderRadius: 8,
                            fontSize: 11.5, color: C.muted, border: `1px solid ${C.border}`,
                            lineHeight: 1.4
                          }}>
                            <strong>Résumé IA:</strong> {email.resume}
                          </div>

                          {/* Action required */}
                          {email.action_requise && (
                            <div style={{
                              background: C.gold + "15", border: `1px solid ${C.gold}44`,
                              borderRadius: 8, padding: "8px 12px", color: C.gold, fontSize: 11,
                              display: "flex", flexDirection: "column", gap: 2
                            }}>
                              <strong>⚠️ Action requise:</strong> {email.action_requise}
                              {email.date_action && (
                                <span style={{ fontSize: 9.5, opacity: 0.8 }}>
                                  📅 Échéance suggérée : {new Date(email.date_action).toLocaleDateString("fr-FR")}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Import Actions */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <span style={{ fontSize: 9.5, color: C.dim, fontFamily: "'DM Mono',monospace" }}>
                              De: {email.emailFrom?.split('<')[0]}
                            </span>
                            <button
                              onClick={() => importGmailCandidature(email)}
                              style={{
                                background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                                color: "#fff", border: "none", borderRadius: 6,
                                padding: "6px 12px", fontSize: 11.5, fontWeight: 600,
                                cursor: "pointer", boxShadow: `0 4px 12px ${C.accent}30`
                              }}
                            >✅ Importer dans le CRM</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{
          borderTop: `1px solid ${C.border}`, padding: "11px 28px",
          textAlign: "center", fontSize: 10, color: C.dim,
          fontFamily: "'DM Mono',monospace",
        }}>
          Studio de CV & Agent IA Candidatures · Propulsé par Gemini · Pour PDF : cliquer sur Imprimer → Destination : Enregistrer au format PDF
        </div>
      </div>
    </>
  );
}