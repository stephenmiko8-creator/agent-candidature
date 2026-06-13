import React, { useState } from "react";

const BLOG_POSTS = [
  {
    id: 1,
    category: "IA & Recrutement",
    title: "Comment l'Intelligence Artificielle transforme le tri de CV en 2026",
    excerpt: "Comprendre le fonctionnement des algorithmes ATS de nouvelle génération et comment adapter sa candidature pour franchir le premier filtre robotisé.",
    date: "05 Juin 2026",
    readTime: "5 min",
    image: "🤖",
    color: "#00F0FF",
  },
  {
    id: 2,
    category: "CV Design",
    title: "Le guide ultime du CV Canva-style : Esthétique vs ATS",
    excerpt: "Trouver le parfait équilibre entre un design visuel premium et la lisibilité machine pour ne plus jamais être rejeté par les robots de recrutement.",
    date: "28 Mai 2026",
    readTime: "7 min",
    image: "🎨",
    color: "#FF4A70",
  },
  {
    id: 3,
    category: "Productivité",
    title: "Automatiser ses candidatures avec Gmail et Gemini",
    excerpt: "Découvrez comment configurer un pipeline intelligent pour recevoir, analyser et suivre le statut de toutes vos candidatures directement depuis vos e-mails.",
    date: "15 Mai 2026",
    readTime: "4 min",
    image: "📧",
    color: "#A855F7",
  },
  {
    id: 4,
    category: "Conseils Carrière",
    title: "Contrôle de Gestion : Les compétences les plus recherchées",
    excerpt: "Analyse détaillée des expertises financières, des outils de BI et des compétences relationnelles indispensables pour décrocher un stage ou alternance.",
    date: "02 Mai 2026",
    readTime: "6 min",
    image: "📊",
    color: "#00E699",
  },
];

export default function BlogPage({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "IA & Recrutement", "CV Design", "Productivité", "Conseils Carrière"];

  const filteredPosts = selectedCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div style={styles.container}>
      {/* Glow effects */}
      <div style={styles.glowPink}></div>
      <div style={styles.glowBlue}></div>

      {/* Header */}
      <header style={styles.header}>
        <div 
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <svg style={{ width: 36, height: 36, filter: "drop-shadow(0 4px 8px rgba(112,38,232,0.35))" }} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradBlog" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#7026E8" />
                <stop offset="100%" stopColor="#FF4A70" />
              </linearGradient>
            </defs>
            <path d="M10 30L20 10L30 30" stroke="url(#logoGradBlog)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 20H25" stroke="url(#logoGradBlog)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 10V30" stroke="url(#logoGradBlog)" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            <circle cx="20" cy="10" r="3.5" fill="#00F0FF" />
            <circle cx="10" cy="30" r="3.5" fill="#7026E8" />
            <circle cx="30" cy="30" r="3.5" fill="#FF4A70" />
          </svg>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: "0.05em", color: "#FFF", lineHeight: 1.0 }}>StaJob</span>
              <span style={styles.blogBadge}>BLOG</span>
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
        <div style={styles.heroSection}>
          <h1 style={styles.title}>Blog & Ressources Carrière</h1>
          <p style={styles.subtitle}>
            Optimisez vos outils de recherche d'emploi et restez au fait des technologies de recrutement grâce aux analyses de l'IA StaJob.
          </p>
        </div>

        {/* Categories Bar */}
        <div style={styles.categoriesBar}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.categoryTab,
                ...(selectedCategory === cat ? styles.categoryTabActive : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div style={styles.grid}>
          {filteredPosts.map(post => (
            <div key={post.id} style={styles.card}>
              <div style={{ ...styles.cardIconBox, background: post.color + "15", border: `1px solid ${post.color}35` }}>
                <span style={styles.cardEmoji}>{post.image}</span>
              </div>
              <div style={styles.cardContent}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ ...styles.postCategory, color: post.color }}>{post.category}</span>
                  <span style={styles.dot}>•</span>
                  <span style={styles.postMeta}>{post.readTime}</span>
                </div>
                <h3 style={styles.postTitle}>{post.title}</h3>
                <p style={styles.postExcerpt}>{post.excerpt}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.postDate}>{post.date}</span>
                  <button style={{ ...styles.readMoreBtn, color: post.color }}>
                    Lire l'article →
                  </button>
                </div>
              </div>
            </div>
          ))}
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
  glowPink: {
    position: "absolute",
    top: "-10%",
    left: "-5%",
    width: 400,
    height: 400,
    background: "rgba(255, 74, 112, 0.12)",
    borderRadius: "50%",
    filter: "blur(100px)",
    pointerEvents: "none",
  },
  glowBlue: {
    position: "absolute",
    bottom: "10%",
    right: "-10%",
    width: 500,
    height: 500,
    background: "rgba(0, 240, 255, 0.10)",
    borderRadius: "50%",
    filter: "blur(120px)",
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
  blogBadge: {
    background: "linear-gradient(135deg, #00F0FF, #A855F7)",
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
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 20px",
    position: "relative",
    zIndex: 10,
  },
  heroSection: {
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
    maxWidth: 700,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  categoriesBar: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 40,
    flexWrap: "wrap",
  },
  categoryTab: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "8px 18px",
    borderRadius: 20,
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  categoryTabActive: {
    background: "rgba(168, 85, 247, 0.2)",
    border: "1px solid #A855F7",
    color: "#fff",
    boxShadow: "0 0 10px rgba(168, 85, 247, 0.3)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
  },
  card: {
    background: "rgba(18, 14, 38, 0.65)",
    border: "1px solid rgba(168, 85, 247, 0.12)",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  postCategory: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  dot: {
    color: "rgba(255, 255, 255, 0.2)",
    fontSize: 12,
  },
  postMeta: {
    fontSize: 11,
    color: "#94A3B8",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.4,
    color: "#FFF",
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 1.5,
    marginBottom: 16,
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    paddingTop: 14,
    marginTop: "auto",
  },
  postDate: {
    fontSize: 11,
    color: "rgba(148, 163, 184, 0.6)",
  },
  readMoreBtn: {
    background: "none",
    border: "none",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};
