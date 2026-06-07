import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthModal({ onAuthSuccess, onCancel }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isSupabaseConfigured =
    supabase &&
    supabase.supabaseUrl &&
    !supabase.supabaseUrl.includes("your-project.supabase.co");

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Inscription réussie ! Vérifie ta boîte de messagerie.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          onAuthSuccess(data.session.user, data.session.access_token);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  // Demo Bypass Mode for local testing if Supabase is not configured yet
  const handleBypass = (role) => {
    const mockUser = {
      id: role === "admin" ? "usr_admin_12345" : "usr_candidate_67890",
      email: role === "admin" ? "renaudmiko90@gmail.com" : "marie.laurent@example.com",
      user_metadata: {
        role: role,
        full_name: role === "admin" ? "Renaud Miko (Admin)" : "Marie Laurent",
      },
    };
    onAuthSuccess(mockUser, role === "admin" ? "mock_token_admin_12345" : "mock_token_candidate_67890");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <div>
            <div style={styles.logoTitle}>MIKA</div>
            <div style={styles.logoSubtitle}>MY INTELLIGENT KAREER ASSISTANT</div>
          </div>
        </div>

        <h2 style={styles.title}>{isSignUp ? "Créer un compte" : "Connexion Portail"}</h2>
        <p style={styles.subtitle}>
          {isSignUp
            ? "Rejoins MIKA pour propulser tes candidatures."
            : "Connecte-toi pour accéder à ton studio et CRM."}
        </p>

        {errorMsg && <div style={styles.errorAlert}>⚠️ {errorMsg}</div>}
        {successMsg && <div style={styles.successAlert}>✅ {successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Adresse Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie.laurent@example.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isSignUp ? "Déjà membre ?" : "Nouveau sur MIKA ?"}{" "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={styles.toggleLink}
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </span>
        </div>

        {onCancel && (
          <div style={{ ...styles.toggleText, marginTop: "14px" }}>
            <span
              onClick={onCancel}
              style={{
                color: "#94A3B8",
                cursor: "pointer",
                fontSize: "12px",
                textDecoration: "underline",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#00F0FF"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}
            >
              Retour à l'accueil
            </span>
          </div>
        )}

        {/* Demo Mode / Bypass Section */}
        {isLocal && (
          <div style={styles.bypassSection}>
            <div style={styles.bypassDivider}>
              <span style={styles.bypassDividerText}>Accès Développeur / Démo</span>
            </div>
            <div style={styles.bypassActions}>
              <button onClick={() => handleBypass("admin")} style={styles.bypassBtnAdmin}>
                ⚡ Connexion Admin (Renaud Miko)
              </button>
              <button onClick={() => handleBypass("candidate")} style={styles.bypassBtnCandidate}>
                👤 Connexion Candidat Standard
              </button>
            </div>
            {!isSupabaseConfigured && (
              <div style={styles.infoText}>
                ℹ️ Supabase n'est pas encore configuré dans `.env`. Utilise le mode Démo pour tester l'application.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(6, 5, 12, 0.82)",
    backdropFilter: "blur(18px)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    background: "rgba(18, 14, 38, 0.85)",
    border: "1px solid rgba(168, 85, 247, 0.22)",
    borderRadius: "18px",
    padding: "36px",
    width: "100%",
    maxWidth: "430px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(112, 38, 232, 0.08)",
    color: "#F8FAFC",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #7026E8, #A855F7)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
  logoTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 800,
    fontSize: "20px",
    letterSpacing: "0.05em",
  },
  logoSubtitle: {
    fontSize: "7.5px",
    color: "#00F0FF",
    letterSpacing: "2.5px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#94A3B8",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#94A3B8",
    fontWeight: "500",
  },
  input: {
    padding: "11px 14px",
    background: "rgba(10, 8, 22, 0.6)",
    border: "1px solid rgba(168, 85, 247, 0.16)",
    borderRadius: "8px",
    color: "#F8FAFC",
    fontSize: "13.5px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    marginTop: "6px",
    padding: "12px",
    background: "linear-gradient(90deg, #7026E8, #A855F7)",
    border: "none",
    borderRadius: "8px",
    color: "#FFF",
    fontWeight: "600",
    fontSize: "13.5px",
    cursor: "pointer",
    transition: "transform 0.1s, opacity 0.2s",
  },
  toggleText: {
    textAlign: "center",
    fontSize: "12.5px",
    color: "#94A3B8",
    marginTop: "16px",
  },
  toggleLink: {
    color: "#00F0FF",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorAlert: {
    background: "rgba(255, 74, 112, 0.12)",
    border: "1px solid rgba(255, 74, 112, 0.25)",
    color: "#FF4A70",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "12.5px",
    marginBottom: "16px",
  },
  successAlert: {
    background: "rgba(0, 230, 153, 0.12)",
    border: "1px solid rgba(0, 230, 153, 0.25)",
    color: "#00E699",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "12.5px",
    marginBottom: "16px",
  },
  bypassSection: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bypassDivider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "rgba(148, 163, 184, 0.4)",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  bypassDividerText: {
    padding: "0 10px",
    margin: "0 auto",
  },
  bypassActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bypassBtnAdmin: {
    padding: "9px",
    background: "rgba(0, 240, 255, 0.1)",
    border: "1px solid rgba(0, 240, 255, 0.3)",
    borderRadius: "8px",
    color: "#00F0FF",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  bypassBtnCandidate: {
    padding: "9px",
    background: "rgba(148, 163, 184, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    color: "#94A3B8",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  infoText: {
    fontSize: "10px",
    color: "rgba(168, 85, 247, 0.5)",
    textAlign: "center",
    marginTop: "4px",
    lineHeight: "1.3",
  },
};
