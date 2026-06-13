import React from "react";

export default function AboutPage({ onBack }) {
  return (
    <div style={styles.container}>
      {/* Background Glows */}
      <div style={styles.glowBlue}></div>
      <div style={styles.glowPurple}></div>

      {/* Header */}
      <header style={styles.header}>
        <div 
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <svg style={{ width: 36, height: 36, filter: "drop-shadow(0 4px 8px rgba(112,38,232,0.35))" }} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradAbout" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#7026E8" />
                <stop offset="100%" stopColor="#FF4A70" />
              </linearGradient>
            </defs>
            <path d="M10 30L20 10L30 30" stroke="url(#logoGradAbout)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 20H25" stroke="url(#logoGradAbout)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 10V30" stroke="url(#logoGradAbout)" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            <circle cx="20" cy="10" r="3.5" fill="#00F0FF" />
            <circle cx="10" cy="30" r="3.5" fill="#7026E8" />
            <circle cx="30" cy="30" r="3.5" fill="#FF4A70" />
          </svg>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: "0.05em", color: "#FFF", lineHeight: 1.0 }}>StaJob</span>
              <span style={styles.aboutBadge}>ABOUT</span>
            </div>
            <div style={{ fontSize: 8, color: "#7026E8", fontFamily: "'Orbitron', sans-serif", fontWeight: 300, letterSpacing: "2.5px", marginTop: 4 }}>
              VOTRE AGENT DE CARRIÈRE INTELLIGENT
            </div>
          </div>
        </div>
        <button style={styles.backBtn} onClick={onBack}>
          ↩ Retour Accueil
        </button>
      </header>
 
      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <h1 style={styles.title}>À propos de StaJob</h1>
          <p style={styles.subtitle}>
            Révolutionner la recherche d'emploi et la candidature grâce à l'intelligence artificielle.
          </p>
        </section>
 
        {/* Story / Journey Section */}
        <div style={styles.storySection}>
          <div style={styles.storyIconWrapper}>
            <span style={styles.storyIcon}>🔥</span>
          </div>
          <h2 style={{...styles.sectionTitle, color: "#FF4A70"}}>Mon Histoire & Ma Résilience</h2>
          <div style={styles.storyContent}>
            <p style={styles.storyText}>
              Le chemin pour décrocher un emploi n'a pas été de tout repos. J'ai traversé le désert des candidatures sans réponse, envoyé des centaines de CV qui semblaient disparaître dans un trou noir, et passé des heures à rédiger des lettres de motivation pour n'obtenir que des refus automatisés ou un silence glacial. C'était épuisant, frustrant, et profondément décourageant. La sensation de ne pas être vu à sa juste valeur est la pire qui soit.
            </p>
            <p style={styles.storyText}>
              Mais au lieu de baisser les bras, j'ai fait preuve de résilience. J'ai refusé de laisser un système automatisé définir ma valeur. J'ai décidé de comprendre <em>pourquoi</em> le système fonctionnait ainsi. J'ai étudié les algorithmes de tri des recruteurs (ATS), décodé ce qu'ils cherchaient vraiment, et commencé à bâtir des solutions pour contourner ces barrières. Chaque échec, chaque porte fermée m'a appris une leçon de plus sur la réalité brutale du monde du recrutement.
            </p>
            <p style={styles.storyText}>
              <strong>StaJob</strong> est le fruit direct de ce parcours du combattant. J'ai créé cette plateforme en y mettant toute ma rage de vaincre, pour que vous n'ayez plus jamais à vous sentir seul ou désarmé face au marché de l'emploi. C'est la revanche du candidat : votre arme secrète, forgée dans la difficulté et conçue pour vous mener à la victoire.
            </p>
          </div>
        </div>

        {/* Mission Card */}
        <div style={styles.missionCard}>
          <h2 style={styles.sectionTitle}>Notre Mission</h2>
          <p style={styles.missionText}>
            StaJob a été conçu pour redonner le contrôle aux candidats. Dans un marché du travail de plus en plus compétitif et robotisé, nous développons des outils intelligents qui permettent aux candidats d'optimiser leurs documents professionnels, de suivre leur pipeline de candidatures, de décrypter les exigences des recruteurs et de maximiser leur score ATS.
          </p>
        </div>

        {/* Features / Value Pillars Grid */}
        <div style={styles.grid}>
          {/* Pillar 1 */}
          <div style={styles.card}>
            <div style={{ ...styles.iconBox, background: "rgba(0, 240, 255, 0.1)", border: "1px solid rgba(0, 240, 255, 0.3)" }}>
              <span style={styles.emoji}>🔍</span>
            </div>
            <h3 style={styles.cardTitle}>Optimisation ATS & IA</h3>
            <p style={styles.cardText}>
              Analyse automatique de l'offre de poste, suggestions de mots-clés manquants prêtes à intégrer et recalcul du score ATS en temps réel.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={styles.card}>
            <div style={{ ...styles.iconBox, background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
              <span style={styles.emoji}>📅</span>
            </div>
            <h3 style={styles.cardTitle}>CRM & Suivi de Candidatures</h3>
            <p style={styles.cardText}>
              Un tableau Kanban interactif pour gérer vos candidatures de l'état d'ébauche jusqu'à l'obtention de l'offre, avec des rappels automatiques.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={styles.card}>
            <div style={{ ...styles.iconBox, background: "rgba(0, 230, 153, 0.1)", border: "1px solid rgba(0, 230, 153, 0.3)" }}>
              <span style={styles.emoji}>🎨</span>
            </div>
            <h3 style={styles.cardTitle}>Modèles Premium Canva-style</h3>
            <p style={styles.cardText}>
              Des designs modernes, structurés et optimisés pour le rendu machine et humain, vous permettant de faire forte impression auprès des recruteurs.
            </p>
          </div>
        </div>

        {/* Tech Stack section */}
        <div style={styles.techSection}>
          <h2 style={styles.sectionTitle}>Moteurs technologiques</h2>
          <div style={styles.techList}>
            <span style={styles.techBadge}>Gemini 2.5 Flash</span>
            <span style={styles.techBadge}>Vite & React</span>
            <span style={styles.techBadge}>Glassmorphic UI</span>
            <span style={styles.techBadge}>Gmail API integration</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    background: "#06050C",
    color: "#F8FAFC",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    paddingBottom: 60,
  },
  glowBlue: {
    position: "absolute",
    top: "-5%",
    right: "-10%",
    width: 450,
    height: 450,
    background: "rgba(0, 240, 255, 0.10)",
    borderRadius: "50%",
    filter: "blur(110px)",
    pointerEvents: "none",
  },
  glowPurple: {
    position: "absolute",
    bottom: "-5%",
    left: "-5%",
    width: 450,
    height: 450,
    background: "rgba(168, 85, 247, 0.12)",
    borderRadius: "50%",
    filter: "blur(100px)",
    pointerEvents: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(13, 11, 28, 0.5)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    fontSize: 22,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "1px",
    fontFamily: "'Orbitron', sans-serif",
  },
  aboutBadge: {
    background: "linear-gradient(135deg, #FF4A70, #FFB020)",
    color: "#fff",
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 6,
    marginLeft: 6,
    verticalAlign: "middle",
  },
  backBtn: {
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  main: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 20px",
    position: "relative",
    zIndex: 10,
  },
  hero: {
    textAlign: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    marginBottom: 16,
    background: "linear-gradient(90deg, #F8FAFC, #94A3B8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    maxWidth: 650,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  storySection: {
    background: "linear-gradient(145deg, rgba(18, 14, 38, 0.8), rgba(13, 11, 28, 0.9))",
    borderLeft: "4px solid #FF4A70",
    borderTop: "1px solid rgba(255, 74, 112, 0.15)",
    borderRight: "1px solid rgba(255, 74, 112, 0.15)",
    borderBottom: "1px solid rgba(255, 74, 112, 0.15)",
    borderRadius: 16,
    padding: "32px 40px",
    marginBottom: 40,
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255, 74, 112, 0.05)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  },
  storyIconWrapper: {
    position: "absolute",
    top: -20,
    left: 30,
    width: 40,
    height: 40,
    background: "#06050C",
    border: "1px solid rgba(255, 74, 112, 0.5)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 15px rgba(255, 74, 112, 0.3)",
  },
  storyIcon: {
    fontSize: 20,
  },
  storyContent: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  storyText: {
    fontSize: 15,
    color: "#E2E8F0",
    lineHeight: 1.8,
    letterSpacing: "0.2px",
  },
  missionCard: {
    background: "rgba(18, 14, 38, 0.8)",
    border: "1px solid rgba(168, 85, 247, 0.18)",
    borderRadius: 16,
    padding: 30,
    marginBottom: 40,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#FFF",
    marginBottom: 16,
    fontFamily: "'Orbitron', sans-serif",
  },
  missionText: {
    fontSize: 15,
    color: "#E2E8F0",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    marginBottom: 40,
  },
  card: {
    background: "rgba(13, 11, 28, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: 14,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    transition: "transform 0.2s, border-color 0.2s",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#FFF",
  },
  cardText: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 1.5,
  },
  techSection: {
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: 30,
  },
  techList: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 15,
  },
  techBadge: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "'Share Tech Mono', monospace",
  },
};
