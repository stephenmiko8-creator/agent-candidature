import { useState } from "react";

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("overview");

  // Platform support tickets & claims
  const [messages, setMessages] = useState([
    {
      id: "msg_1",
      user: "Marie Laurent",
      email: "marie.l@gmail.com",
      type: "Bug Report",
      subject: "Problème d'importation de CV PDF complexe",
      content: "Bonjour StaJob team, j'ai tenté d'importer mon CV au format PDF généré par Canva, mais le parser a ignoré mes expériences de 2021. Est-il possible d'ajuster l'analyse ?",
      status: "Open",
      date: "07 Juin 2026, 14:32",
      replies: [
        { sender: "user", text: "Bonjour StaJob team, j'ai tenté d'importer mon CV au format PDF généré par Canva, mais le parser a ignoré mes expériences de 2021. Est-il possible d'ajuster l'analyse ?" }
      ]
    },
    {
      id: "msg_2",
      user: "Pierre Dubois",
      email: "pierre.dubois@gmail.com",
      type: "Claim",
      subject: "Limite de jetons d'IA de StaJob atteinte",
      content: "Bonjour, je suis très satisfait de StaJob, mais j'ai épuisé mon crédit d'optimisation IA aujourd'hui. Est-il possible d'avoir un bonus pour finaliser ma candidature de cet après-midi ?",
      status: "Open",
      date: "07 Juin 2026, 11:15",
      replies: [
        { sender: "user", text: "Bonjour, je suis très satisfait de StaJob, mais j'ai épuisé mon crédit d'optimisation IA aujourd'hui. Est-il possible d'avoir un bonus pour finaliser ma candidature de cet après-midi ?" }
      ]
    },
    {
      id: "msg_3",
      user: "Lucas Morel",
      email: "lucas.m@yahoo.fr",
      type: "Suggestion",
      subject: "Ajout de modèles de designs sombres",
      content: "L'application est super fluide. Ce serait génial d'avoir plus de modèles de CV modernes en mode sombre pour les métiers créatifs !",
      status: "Resolved",
      date: "06 Juin 2026, 18:22",
      replies: [
        { sender: "user", text: "L'application est super fluide. Ce serait génial d'avoir plus de modèles de CV modernes en mode sombre pour les métiers créatifs !" },
        { sender: "admin", text: "Bonjour Lucas, merci pour votre retour précieux ! Nous prévoyons d'ajouter 5 nouveaux modèles sombres d'ici la semaine prochaine." }
      ]
    },
    {
      id: "msg_4",
      user: "Clara Martinez",
      email: "clara.martinez@outlook.com",
      type: "Report",
      subject: "Erreur de synchronisation IMAP Gmail",
      content: "Bonjour, j'obtiens une erreur d'authentification lors de la connexion IMAP Gmail. Mes identifiants sont pourtant corrects.",
      status: "Investigating",
      date: "05 Juin 2026, 09:40",
      replies: [
        { sender: "user", text: "Bonjour, j'obtiens une erreur d'authentification lors de la connexion IMAP Gmail. Mes identifiants sont pourtant corrects." }
      ]
    }
  ]);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (msgId) => {
    if (!replyText.trim()) return;
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      return {
        ...m,
        replies: [...m.replies, { sender: "admin", text: replyText.trim() }]
      };
    }));
    setReplyText("");
  };

  const handleChangeStatus = (msgId, newStatus) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      return { ...m, status: newStatus };
    }));
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Vue d'ensemble" },
    { id: "claims", icon: "✉️", label: "Support & Réclamations", count: messages.filter(m => m.status !== "Resolved").length },
    { id: "users", icon: "👥", label: "Comptes Utilisateurs" },
    { id: "settings", icon: "⚙️", label: "Configuration StaJob" },
  ];

  return (
    <div style={styles.wrapper}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>⚙️</div>
          <div>
            <div style={styles.logoText}>StaJob ADMIN</div>
            <div style={styles.logoSub}>VOTRE AGENT DE CARRIÈRE INTELLIGENT</div>
          </div>
          <span style={styles.adminBadge}>👑 Admin</span>
        </div>
      </nav>

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarLabel}>Console Administration</div>
            {navItems.map((item) => (
              <div
                key={item.id}
                style={{ ...styles.navItem, ...(activeNav === item.id ? styles.navItemActive : {}) }}
                onClick={() => setActiveNav(item.id)}
              >
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.count ? <span style={styles.countBadge}>{item.count}</span> : null}
              </div>
            ))}
          </div>
          <div style={styles.sidebarFooter}>
            <div style={styles.sidebarFooterLabel}>Admin session</div>
            <div style={styles.sidebarFooterName}>Renaud Miko</div>
            <div style={styles.sidebarFooterPlan}>Platform Owner</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={styles.main}>
          {activeNav === "overview" ? (
            <>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Tableau de bord de l'administrateur</div>
                  <div style={styles.pageSub}>Statistiques globales et santé de la plateforme StaJob</div>
                </div>
              </div>

              {/* Metrics */}
              <div style={styles.metrics}>
                {[
                  { label: "Candidats actifs", value: "154", delta: "+12 aujourd'hui" },
                  { label: "Réclamations en attente", value: `${messages.filter(m => m.status !== "Resolved").length}`, delta: "Besoin de réponse", warning: true },
                  { label: "Taux de satisfaction global", value: "98.4%", delta: "Basé sur les avis", success: true },
                  { label: "Statut API Supabase", value: "En ligne", delta: "Normal", success: true },
                ].map((m, i) => (
                  <div key={i} style={styles.metricCard}>
                    <div style={styles.metricLabel}>{m.label}</div>
                    <div style={styles.metricValue}>{m.value}</div>
                    <div style={{
                      ...styles.metricDelta,
                      color: m.success ? "#3b6d11" : m.warning ? "#991b1b" : "#888"
                    }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* Recent activity grid */}
              <div style={styles.grid2}>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>📈 Activité Récente de la Plateforme</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
                      🟢 **Marie L.** a mis à jour son CV avec un score ATS de 88% • *Il y a 10 min*
                    </div>
                    <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
                      ✉️ **Pierre D.** a envoyé une réclamation pour limite de jetons IA • *Il y a 30 min*
                    </div>
                    <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
                      🚀 **Thomas M.** a exporté sa lettre de motivation en format PDF • *Il y a 1 heure*
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                      👥 **5 nouveaux utilisateurs** se sont inscrits aujourd'hui • *Il y a 3 heures*
                    </div>
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardTitle}>⚙️ État du Système & Services</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { service: "Auth Supabase Engine", status: "Fonctionnel", latency: "14ms" },
                      { service: "Base de données cv_profiles", status: "Fonctionnel", latency: "22ms" },
                      { service: "AI Optimiseur (Gemini 2.5)", status: "Fonctionnel", latency: "350ms" },
                      { service: "Générateur PDF", status: "Fonctionnel", latency: "110ms" },
                    ].map((s, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #f0f0f0", paddingBottom: 6 }}>
                        <span style={{ fontWeight: 500, color: "#1a1a2e" }}>{s.service}</span>
                        <span style={{ color: "#3b6d11", fontWeight: 600 }}>{s.status} ({s.latency})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : activeNav === "claims" ? (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>✉️ Support Desk & Claims Inbox</div>
                  <div style={styles.pageSub}>Manage user questions, bug reports, and service claims</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, alignItems: "start" }}>
                {/* Tickets list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {messages.map((m) => {
                    const isSelected = selectedMessageId === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMessageId(m.id);
                          setReplyText("");
                        }}
                        style={{
                          background: isSelected ? "#e6f1fb" : "#fff",
                          border: isSelected ? "1px solid #185fa5" : "0.5px solid #e0e0e0",
                          borderRadius: 8,
                          padding: 12,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: m.type === "Bug Report" ? "#fee2e2" : m.type === "Claim" ? "#fef3c7" : "#e0f2fe",
                            color: m.type === "Bug Report" ? "#991b1b" : m.type === "Claim" ? "#92400e" : "#075985"
                          }}>
                            {m.type}
                          </span>
                          <span style={{
                            fontSize: 10,
                            color: m.status === "Resolved" ? "#3b6d11" : m.status === "Investigating" ? "#854f0b" : "#991b1b",
                            fontWeight: 600
                          }}>
                            ● {m.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>
                          {m.subject}
                        </div>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                          De: {m.user} ({m.email})
                        </div>
                        <div style={{ fontSize: 10, color: "#aaa", textAlign: "right" }}>
                          {m.date}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ticket conversation thread */}
                <div style={{ ...styles.card, minHeight: 400, display: "flex", flexDirection: "column" }}>
                  {selectedMessageId ? (() => {
                    const ticket = messages.find(m => m.id === selectedMessageId);
                    if (!ticket) return null;
                    return (
                      <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
                        {/* Header details */}
                        <div style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <div>
                              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{ticket.subject}</h3>
                              <span style={{ fontSize: 12, color: "#888" }}>Utilisateur : {ticket.user} ({ticket.email})</span>
                            </div>
                            {/* Status selector */}
                            <select
                              value={ticket.status}
                              onChange={(e) => handleChangeStatus(ticket.id, e.target.value)}
                              style={{
                                padding: "4px 8px",
                                fontSize: 11,
                                fontWeight: 600,
                                borderRadius: 6,
                                border: "1px solid #ccc",
                                outline: "none",
                                background: "#fff"
                              }}
                            >
                              <option value="Open">Open</option>
                              <option value="Investigating">Investigating</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>
                        </div>

                        {/* Message list */}
                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: 4, marginBottom: 16 }}>
                          {ticket.replies.map((r, rIdx) => {
                            const isAdmin = r.sender === "admin";
                            return (
                              <div
                                key={rIdx}
                                style={{
                                  alignSelf: isAdmin ? "flex-end" : "flex-start",
                                  maxWidth: "85%",
                                  background: isAdmin ? "#7026E8" : "#f1f1f4",
                                  color: isAdmin ? "#fff" : "#1a1a2e",
                                  padding: "10px 14px",
                                  borderRadius: 12,
                                  borderBottomRightRadius: isAdmin ? 2 : 12,
                                  borderBottomLeftRadius: isAdmin ? 12 : 2,
                                  fontSize: 12,
                                  lineHeight: 1.4
                                }}
                              >
                                <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 4, fontWeight: 700 }}>
                                  {isAdmin ? "StaJob Support Desk" : ticket.user}
                                </div>
                                {r.text}
                              </div>
                            );
                          })}
                        </div>

                        {/* Response input */}
                        <div style={{ marginTop: "auto" }}>
                          <textarea
                            style={{
                              width: "100%",
                              minHeight: 60,
                              padding: 10,
                              fontSize: 12,
                              borderRadius: 8,
                              border: "1px solid #ccc",
                              outline: "none",
                              fontFamily: "inherit",
                              resize: "none",
                              marginBottom: 8
                            }}
                            placeholder="Saisissez votre réponse ici..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button
                            onClick={() => handleSendReply(ticket.id)}
                            style={{
                              ...styles.btnPrimary,
                              width: "100%",
                              background: "#7026E8",
                              borderRadius: 8,
                              padding: "10px"
                            }}
                          >
                            Répondre au ticket ✉️
                          </button>
                        </div>
                      </div>
                    );
                  })() : (
                    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#aaa", textAlign: "center", height: "100%" }}>
                      <span style={{ fontSize: 48, marginBottom: 16 }}>✉️</span>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>Sélectionnez un ticket de support pour afficher la conversation</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeNav === "users" ? (
            <div style={styles.card}>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>👥 Comptes Utilisateurs</div>
                  <div style={styles.pageSub}>Liste des candidats inscrits sur la plateforme StaJob</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { name: "Marie Laurent", email: "marie.l@gmail.com", role: "Candidat", status: "Actif" },
                  { name: "Pierre Dubois", email: "pierre.dubois@gmail.com", role: "Candidat", status: "Actif" },
                  { name: "Lucas Morel", email: "lucas.m@yahoo.fr", role: "Candidat", status: "Actif" },
                  { name: "Clara Martinez", email: "clara.martinez@outlook.com", role: "Candidat", status: "Inactif" }
                ].map((u, i) => (
                  <div key={i} style={{
                    background: "#fafafa",
                    border: "0.5px solid #e0e0e0",
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{u.email} • Role: {u.role}</div>
                    </div>
                    <div>
                      <span style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 12,
                        background: u.status === "Actif" ? "#eaf3de" : "#fee2e2",
                        color: u.status === "Actif" ? "#3b6d11" : "#991b1b",
                        fontWeight: 600
                      }}>
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ ...styles.card, textAlign: "center", padding: "40px 20px" }}>
              <span style={{ fontSize: 32 }}>🚧</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", marginTop: 12 }}>Sous Construction</h3>
              <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Cette section de configuration sera disponible prochainement.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { fontFamily: "'Inter', sans-serif", background: "#f5f5f3", minHeight: "100vh" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "0.5px solid #e0e0e0", background: "#fff" },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 32, height: 32, background: "#7026E8", color: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  logoText: { fontSize: 18, fontWeight: 600, color: "#1a1a2e", letterSpacing: 2 },
  logoSub: { fontSize: 9, color: "#888", letterSpacing: 3, textTransform: "uppercase" },
  adminBadge: { background: "#fee2e2", color: "#991b1b", fontSize: 11, padding: "3px 10px", borderRadius: 6, fontWeight: 600 },
  layout: { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 57px)" },
  sidebar: { borderRight: "0.5px solid #e0e0e0", padding: "16px 12px", background: "#fff", display: "flex", flexDirection: "column" },
  sidebarSection: { marginBottom: 24 },
  sidebarLabel: { fontSize: 11, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, padding: "0 8px" },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, fontSize: 13, color: "#666", cursor: "pointer", marginBottom: 2 },
  navItemActive: { background: "#f5f5f3", color: "#1a1a2e", fontWeight: 500 },
  countBadge: { marginLeft: "auto", background: "#fee2e2", color: "#991b1b", fontSize: 11, padding: "1px 7px", borderRadius: 20, fontWeight: 600 },
  sidebarFooter: { marginTop: "auto", padding: "12px 8px", borderTop: "0.5px solid #e0e0e0" },
  sidebarFooterLabel: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  sidebarFooterName: { fontSize: 13, fontWeight: 500, color: "#1a1a2e" },
  sidebarFooterPlan: { fontSize: 11, color: "#aaa" },
  main: { padding: 24, background: "#f5f5f3" },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: 600, color: "#1a1a2e" },
  pageSub: { fontSize: 13, color: "#888", marginTop: 2 },
  btnPrimary: { padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  metrics: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 },
  metricCard: { background: "#fff", borderRadius: 8, padding: 16, border: "0.5px solid #e0e0e0" },
  metricLabel: { fontSize: 12, color: "#888", marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 500, color: "#1a1a2e" },
  metricDelta: { fontSize: 11, marginTop: 4 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e0e0e0", padding: 20 },
  cardTitle: { fontSize: 14, fontWeight: 500, color: "#1a1a2e", marginBottom: 16 },
  candidateItem: { display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, border: "0.5px solid #e0e0e0", background: "#fafafa" },
};
