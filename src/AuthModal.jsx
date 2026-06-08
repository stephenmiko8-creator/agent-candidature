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

    if (!isSupabaseConfigured) {
      setErrorMsg("Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env pour activer la création de compte par email. En attendant, vous pouvez utiliser les boutons de Connexion Démo ci-dessous.");
      setLoading(false);
      return;
    }

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
    <div className="fixed inset-0 bg-[#06050C] z-[10000] flex font-sans overflow-hidden">
      {/* Close/Back Button */}
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 w-10.5 h-10.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer z-50"
          title="Retour à l'accueil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="w-full min-h-screen text-slate-50 flex overflow-hidden">

        {/* Left Side: Image (Full Bleed to Left, Top, and Bottom) */}
        <div className="hidden md:block md:w-1/2 relative bg-white">
          <img
            src="/login-avatar.jpeg"
            alt="Login Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#120E26]/85 border-l border-purple-500/20 overflow-y-auto">
          <div className="max-w-md mx-auto w-full flex flex-col my-auto">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-9 h-9 bg-gradient-to-br from-[#7026E8] to-[#A855F7] rounded-lg flex items-center justify-center text-lg font-bold">⚡</span>
              <div>
                <div className="font-['Orbitron'] font-extrabold text-xl tracking-wider">MIKA</div>
                <div className="text-[7.5px] text-[#00F0FF] tracking-[2.5px]">MY INTELLIGENT KAREER ASSISTANT</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">{isSignUp ? "Créer un compte" : "Connexion Portail"}</h2>
            <p className="text-sm text-slate-400 mb-6">
              {isSignUp
                ? "Rejoins MIKA pour propulser tes candidatures."
                : "Connecte-toi pour accéder à ton studio et CRM."}
            </p>

            {errorMsg && <div className="bg-rose-500/10 border border-rose-500/25 text-[#FF4A70] px-4 py-3 rounded-lg text-sm mb-4">⚠️ {errorMsg}</div>}
            {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/25 text-[#00E699] px-4 py-3 rounded-lg text-sm mb-4">✅ {successMsg}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Adresse Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie.laurent@example.com"
                  className="px-3.5 py-2.5 bg-[#0A0816]/60 border border-purple-500/20 rounded-lg text-slate-50 text-sm outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3.5 py-2.5 bg-[#0A0816]/60 border border-purple-500/20 rounded-lg text-slate-50 text-sm outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="mt-2 p-3 bg-gradient-to-r from-[#7026E8] to-[#A855F7] rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 mt-4">
              {isSignUp ? "Déjà membre ?" : "Nouveau sur MIKA ?"}{" "}
              <span
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#00F0FF] font-semibold cursor-pointer hover:underline"
              >
                {isSignUp ? "Se connecter" : "Créer un compte"}
              </span>
            </div>

            {onCancel && (
              <div className="text-center text-xs mt-3">
                <span
                  onClick={onCancel}
                  className="text-slate-400 cursor-pointer underline hover:text-[#00F0FF] transition-colors"
                >
                  Retour à l'accueil
                </span>
              </div>
            )}

            {/* Demo Mode / Bypass Section */}
            {isLocal && (
              <div className="mt-6 flex flex-col gap-2.5">
                <div className="flex items-center text-center text-[10px] text-slate-400/40 uppercase tracking-widest mb-1">
                  <span className="flex-1 h-px bg-slate-400/10"></span>
                  <span className="px-3">Accès Développeur / Démo</span>
                  <span className="flex-1 h-px bg-slate-400/10"></span>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleBypass("admin")} className="p-2.5 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-[#00F0FF] text-xs font-semibold hover:bg-cyan-400/20 transition-colors">
                    ⚡ Connexion Admin (Renaud Miko)
                  </button>
                  <button onClick={() => handleBypass("candidate")} className="p-2.5 bg-slate-400/10 border border-slate-400/20 rounded-lg text-slate-400 text-xs font-semibold hover:bg-slate-400/20 transition-colors">
                    👤 Connexion Candidat Standard
                  </button>
                </div>
                {!isSupabaseConfigured && (
                  <div className="text-[10px] text-purple-500/50 text-center mt-1 leading-tight">
                    ℹ️ Supabase n'est pas encore configuré dans `.env`. Utilise le mode Démo pour tester l'application.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
