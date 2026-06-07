import { useState } from "react";

const candidates = [
  { initials: "AL", name: "Alice Lambert", role: "M2 Finance — Paris Dauphine", ats: 88, status: "new" },
  { initials: "TM", name: "Thomas Martin", role: "M1 Gestion — HEC Paris", ats: 76, status: "review" },
  { initials: "SB", name: "Sara Benali", role: "M2 Audit — ESSEC", ats: 91, status: "shortlisted" },
  { initials: "KC", name: "Kevin Chen", role: "L3 Finance — Paris 1", ats: 62, status: "new" },
];

const statusConfig = {
  new: { label: "New", color: "#e6f1fb", text: "#185fa5" },
  review: { label: "Review", color: "#faeeda", text: "#854f0b" },
  shortlisted: { label: "Shortlisted", color: "#eaf3de", text: "#3b6d11" },
};

const avatarColors = [
  { bg: "#e6f1fb", color: "#185fa5" },
  { bg: "#eaf3de", color: "#3b6d11" },
  { bg: "#faeeda", color: "#854f0b" },
  { bg: "#f1efe8", color: "#5f5e5a" },
];

export default function RecruiterDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [form, setForm] = useState({
    title: "",
    contract: "Internship",
    location: "",
    description: "",
    salary: "",
    startDate: "",
  });
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    if (form.title.trim()) {
      setPublished(true);
      setTimeout(() => setPublished(false), 3000);
      setForm({ title: "", contract: "Internship", location: "", description: "", salary: "", startDate: "" });
    }
  };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "offers", icon: "💼", label: "My job offers", count: 4 },
    { id: "candidates", icon: "👥", label: "Candidates", count: 23 },
    { id: "messages", icon: "✉️", label: "Messages", count: 5 },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "ai", icon: "🤖", label: "AI matching" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={styles.wrapper}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>💼</div>
          <div>
            <div style={styles.logoText}>MIKA</div>
            <div style={styles.logoSub}>My Intelligent Karriere Assistant</div>
          </div>
          <span style={styles.recruiterBadge}>🏢 Recruiter</span>
        </div>
        <div style={styles.navActions}>
          <button style={styles.iconBtn}>🔔</button>
          <div style={styles.navAvatar}>RC</div>
        </div>
      </nav>

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarLabel}>Main</div>
            {navItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                style={{ ...styles.navItem, ...(activeNav === item.id ? styles.navItemActive : {}) }}
                onClick={() => setActiveNav(item.id)}
              >
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.count && <span style={styles.countBadge}>{item.count}</span>}
              </div>
            ))}
          </div>
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarLabel}>Tools</div>
            {navItems.slice(4).map((item) => (
              <div
                key={item.id}
                style={{ ...styles.navItem, ...(activeNav === item.id ? styles.navItemActive : {}) }}
                onClick={() => setActiveNav(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={styles.sidebarFooter}>
            <div style={styles.sidebarFooterLabel}>Recruiter account</div>
            <div style={styles.sidebarFooterName}>Renaud Corp.</div>
            <div style={styles.sidebarFooterPlan}>Pro plan</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={styles.main}>
          {/* Header */}
          <div style={styles.pageHeader}>
            <div>
              <div style={styles.pageTitle}>Recruiter dashboard</div>
              <div style={styles.pageSub}>Manage your job offers and candidates</div>
            </div>
            <button style={styles.btnPrimary} onClick={handlePublish}>
              + Post a job offer
            </button>
          </div>

          {/* Success toast */}
          {published && (
            <div style={styles.toast}>✅ Offer published successfully!</div>
          )}

          {/* Metrics */}
          <div style={styles.metrics}>
            {[
              { label: "Active offers", value: "4", delta: "↑ 2 this week" },
              { label: "Total candidates", value: "23", delta: "↑ 8 new" },
              { label: "Avg ATS score", value: "74%", delta: "across all offers", neutral: true },
              { label: "Interviews set", value: "6", delta: "↑ 3 this week" },
            ].map((m, i) => (
              <div key={i} style={styles.metricCard}>
                <div style={styles.metricLabel}>{m.label}</div>
                <div style={styles.metricValue}>{m.value}</div>
                <div style={{ ...styles.metricDelta, color: m.neutral ? "#888" : "#3b6d11" }}>{m.delta}</div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={styles.grid2}>
            {/* Post form */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>➕ Post a new offer</div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Job title</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Financial Analyst — M2 internship"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Contract type</label>
                  <select
                    style={styles.input}
                    value={form.contract}
                    onChange={(e) => setForm({ ...form, contract: e.target.value })}
                  >
                    <option>Internship</option>
                    <option>Alternance</option>
                    <option>CDI</option>
                    <option>CDD</option>
                  </select>
                </div>
                <div>
                  <label style={styles.formLabel}>Location</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Paris, Remote..."
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Job description</label>
                <textarea
                  style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
                  placeholder="Missions, required skills, profile sought..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Salary / Stipend</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. 800€/month"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Start date</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. September 2025"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
              </div>

              <button style={styles.publishBtn} onClick={handlePublish}>
                📤 Publish offer
              </button>
            </div>

            {/* Candidates */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>👥 Latest candidates</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {candidates.map((c, i) => {
                  const av = avatarColors[i % avatarColors.length];
                  const st = statusConfig[c.status];
                  return (
                    <div key={i} style={styles.candidateItem}>
                      <div style={{ ...styles.candidateAvatar, background: av.bg, color: av.color }}>
                        {c.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.candidateName}>{c.name}</div>
                        <div style={styles.candidateRole}>{c.role}</div>
                      </div>
                      <div style={styles.atsScore}>
                        <div style={styles.atsBar}>
                          <div style={{ ...styles.atsFill, width: `${c.ats}%` }} />
                        </div>
                        <span style={styles.atsNum}>{c.ats}%</span>
                      </div>
                      <span style={{ ...styles.statusBadge, background: st.color, color: st.text }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { fontFamily: "'Inter', sans-serif", background: "#f5f5f3", minHeight: "100vh" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "0.5px solid #e0e0e0", background: "#fff" },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 32, height: 32, background: "#1a1a2e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  logoText: { fontSize: 18, fontWeight: 600, color: "#1a1a2e", letterSpacing: 2 },
  logoSub: { fontSize: 9, color: "#888", letterSpacing: 3, textTransform: "uppercase" },
  recruiterBadge: { background: "#e6f1fb", color: "#185fa5", fontSize: 11, padding: "3px 10px", borderRadius: 6 },
  navActions: { display: "flex", alignItems: "center", gap: 8 },
  iconBtn: { background: "none", border: "0.5px solid #e0e0e0", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 },
  navAvatar: { width: 32, height: 32, borderRadius: "50%", background: "#e6f1fb", color: "#185fa5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500 },
  layout: { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 57px)" },
  sidebar: { borderRight: "0.5px solid #e0e0e0", padding: "16px 12px", background: "#fff", display: "flex", flexDirection: "column" },
  sidebarSection: { marginBottom: 24 },
  sidebarLabel: { fontSize: 11, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, padding: "0 8px" },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, fontSize: 13, color: "#666", cursor: "pointer", marginBottom: 2 },
  navItemActive: { background: "#f5f5f3", color: "#1a1a2e", fontWeight: 500 },
  countBadge: { marginLeft: "auto", background: "#f5f5f3", color: "#888", fontSize: 11, padding: "1px 7px", borderRadius: 20 },
  sidebarFooter: { marginTop: "auto", padding: "12px 8px", borderTop: "0.5px solid #e0e0e0" },
  sidebarFooterLabel: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  sidebarFooterName: { fontSize: 13, fontWeight: 500, color: "#1a1a2e" },
  sidebarFooterPlan: { fontSize: 11, color: "#aaa" },
  main: { padding: 24, background: "#f5f5f3" },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: 600, color: "#1a1a2e" },
  pageSub: { fontSize: 13, color: "#888", marginTop: 2 },
  btnPrimary: { padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  toast: { background: "#eaf3de", color: "#3b6d11", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 },
  metrics: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 },
  metricCard: { background: "#fff", borderRadius: 8, padding: 16, border: "0.5px solid #e0e0e0" },
  metricLabel: { fontSize: 12, color: "#888", marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 500, color: "#1a1a2e" },
  metricDelta: { fontSize: 11, marginTop: 4 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e0e0e0", padding: 20 },
  cardTitle: { fontSize: 14, fontWeight: 500, color: "#1a1a2e", marginBottom: 16 },
  formRow: { marginBottom: 14 },
  formRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 },
  formLabel: { fontSize: 12, color: "#888", marginBottom: 5, display: "block" },
  input: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "0.5px solid #d0d0d0", background: "#fff", color: "#1a1a2e", fontSize: 13, outline: "none", fontFamily: "inherit" },
  publishBtn: { width: "100%", padding: 10, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", marginTop: 4 },
  candidateItem: { display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, border: "0.5px solid #e0e0e0", background: "#fafafa" },
  candidateAvatar: { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 },
  candidateName: { fontSize: 13, fontWeight: 500, color: "#1a1a2e" },
  candidateRole: { fontSize: 11, color: "#888" },
  atsScore: { display: "flex", alignItems: "center", gap: 6 },
  atsBar: { width: 60, height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" },
  atsFill: { height: "100%", background: "#1a1a2e", borderRadius: 2 },
  atsNum: { fontSize: 12, fontWeight: 500, color: "#1a1a2e" },
  statusBadge: { fontSize: 11, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap" },
};
