import { useState, useEffect, useCallback } from "react";
import HeroSection from "./HeroSection";
import AgentCandidature from "./AgentCandidature";
import RecruiterDashboard from "./RecruiterDashboard";
import AdminDashboard from "./AdminDashboard";
import BlogPage from "./BlogPage";
import AboutPage from "./AboutPage";
import { supabase } from "./supabaseClient";
import AuthModal from "./AuthModal";
import PricingSection from "./PricingSection";

const IS_MAINTENANCE = true; // ⚠️ METTRE A FALSE POUR REACTIVER LE SITE


function App() {
  const [view, setView] = useState("hero"); // "hero", "builder", "crm", "gmail"
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidatureId, setSelectedCandidatureId] = useState(null);

  // Supabase Auth State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingView, setPendingView] = useState(null);

  // Handle successful payments from Stripe or FedaPay
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const provider = params.get("provider");
    const plan = params.get("plan");

    if (paymentStatus === "success") {
      setPaymentDetails({ provider, plan });
      setShowPaymentSuccessModal(true);

      // Upgrade tier locally
      let newTier = "free";
      if (plan === "premium" || plan?.includes("premium")) {
        newTier = "premium";
      } else if (plan === "recruiter_pro" || plan?.includes("recruiter")) {
        newTier = "recruiter_pro";
      }

      // If user is logged in, update Supabase profiles
      if (user && supabase) {
        supabase
          .from("profiles")
          .update({ subscription_tier: newTier })
          .eq("id", user.id)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating profile subscription:", error);
            }
          });
      }

      // Clean the URL query parameters
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [user]);

  // Monitor Supabase auth session
  useEffect(() => {
    if (supabase && supabase.auth) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          setToken(session.access_token);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          setToken(session.access_token);
        } else {
          setUser(null);
          setToken(null);
        }
      });

      return () => {
        if (subscription) subscription.unsubscribe();
      };
    }
  }, []);

  const handleAuthSuccess = (authUser, authToken) => {
    setUser(authUser);
    setToken(authToken);
  };

  // Keyboard shortcut Ctrl+K or Cmd+K to open search, and Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Retrieve candidatures from all localStorage keys matching "candidatures_*"
  const getCandidatures = useCallback(() => {
    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("candidatures_")) {
          const items = JSON.parse(localStorage.getItem(key) || "[]");
          if (Array.isArray(items)) {
            list.push(...items);
          }
        }
      }
    } catch (e) {
      console.error("Error reading localStorage candidatures:", e);
    }
    // Deduplicate by ID
    const seen = new Set();
    return list.filter((item) => {
      if (!item || !item.id) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, []);

  // Filter candidatures based on query
  const filteredCandidatures = searchQuery.trim()
    ? getCandidatures().filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          (c.poste || "").toLowerCase().includes(q) ||
          (c.entreprise || "").toLowerCase().includes(q) ||
          (c.statut || "").toLowerCase().includes(q) ||
          (c.lieu || "").toLowerCase().includes(q)
        );
      })
    : getCandidatures();

  const handleSelectCandidature = (cand) => {
    // Determine target view based on candidature type/status or default to crm
    setView("crm");
    setSelectedCandidatureId(cand.id);
    setShowSearch(false);
    setSearchQuery("");
  };

  const getStatusStyle = (statut) => {
    switch (statut) {
      case "Draft":
        return { bg: "rgba(148, 163, 184, 0.15)", text: "#94A3B8" };
      case "Applied":
        return { bg: "rgba(0, 240, 255, 0.15)", text: "#00F0FF" };
      case "Interview":
        return { bg: "rgba(255, 176, 32, 0.15)", text: "#FFB020" };
      case "Rejected":
        return { bg: "rgba(255, 74, 112, 0.15)", text: "#FF4A70" };
      case "Offer":
        return { bg: "rgba(0, 230, 153, 0.15)", text: "#00E699" };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", text: "#94A3B8" };
    }
  };

  // Views requiring active user session
  const authRequiredViews = ["builder", "crm", "gmail", "recruiter", "admin"];
  const isAdmin = user?.email === "renaudmiko90@gmail.com";

  const handleNavigate = (target) => {
    if (authRequiredViews.includes(target) && !user) {
      setPendingView(target);
      setShowAuthModal(true);
    } else {
      setView(target);
    }
  };

  if (IS_MAINTENANCE) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#06050C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#FFF",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Blobs */}
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 450, height: 450, backgroundColor: "rgba(255, 74, 112, 0.15)", borderRadius: "50%", filter: "blur(110px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: 550, height: 550, backgroundColor: "rgba(0, 240, 255, 0.15)", borderRadius: "50%", filter: "blur(130px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "25%", width: 400, height: 400, backgroundColor: "rgba(112, 38, 232, 0.15)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, zIndex: 10 }}>
          <svg style={{ width: 54, height: 54, filter: "drop-shadow(0 4px 8px rgba(112,38,232,0.35))" }} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#7026E8" />
                <stop offset="100%" stopColor="#FF4A70" />
              </linearGradient>
            </defs>
            <path d="M10 30L20 10L30 30" stroke="url(#logoGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 20H25" stroke="url(#logoGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 10V30" stroke="url(#logoGrad)" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            <circle cx="20" cy="10" r="3.5" fill="#00F0FF" />
            <circle cx="10" cy="30" r="3.5" fill="#7026E8" />
            <circle cx="30" cy="30" r="3.5" fill="#FF4A70" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 800, fontSize: 38, letterSpacing: "0.05em", color: "#F8FAFC", lineHeight: 1, fontFamily: "'Orbitron', sans-serif" }}>StaJob</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ textAlign: "center", zIndex: 10, maxWidth: 600, padding: "0 24px" }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, background: "linear-gradient(to right, #00F0FF, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Lancement Imminent
          </h1>
          <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.6, marginBottom: 40 }}>
            Notre plateforme propulsée par l'IA est en cours de déploiement. Nous peaufinons les derniers détails pour vous offrir la meilleure expérience possible.
          </p>
          <div style={{ display: "inline-block", padding: "14px 28px", background: "rgba(112, 38, 232, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: 50, color: "#A855F7", fontWeight: 600, fontSize: 15, boxShadow: "0 10px 30px rgba(112, 38, 232, 0.2)" }}>
            🚀 Revenez d'ici quelques minutes !
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* ── Auth Modal Overlay ── */}
      {showAuthModal && (
        <AuthModal
          theme={view === "hero" ? "dark" : "light"}
          onAuthSuccess={(authUser, authToken) => {
            handleAuthSuccess(authUser, authToken);
            setShowAuthModal(false);
            if (pendingView) {
              setView(pendingView);
              setPendingView(null);
            }
          }}
          onCancel={() => {
            setShowAuthModal(false);
            setPendingView(null);
          }}
        />
      )}

      {/* ── Main View Container ── */}
      {view === "hero" ? (
        <HeroSection 
          onNavigate={handleNavigate} 
          onSearch={() => setShowSearch(true)} 
          currentView={view} 
          isAdmin={isAdmin}
        />
      ) : view === "pricing" ? (
        <PricingSection
          onBack={() => setView("hero")}
          user={user}
          token={token}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      ) : view === "blog" ? (
        <BlogPage onBack={() => setView("hero")} />
      ) : view === "about" ? (
        <AboutPage onBack={() => setView("hero")} />
      ) : view === "admin" ? (
        !isAdmin ? (
          <div style={{ padding: "80px 20px", textAlign: "center", color: "#FFF", fontFamily: "'Inter', sans-serif" }}>
            <h2 style={{ marginBottom: "16px" }}>🔒 Accès réservé aux administrateurs.</h2>
            <p style={{ color: "#94A3B8", marginBottom: "24px" }}>Veuillez vous connecter avec vos identifiants administrateur.</p>
            <button 
              onClick={() => setView("hero")} 
              style={{
                padding: "10px 20px", 
                background: "rgba(168, 85, 247, 0.2)", 
                border: "1px solid rgba(168, 85, 247, 0.5)", 
                borderRadius: "8px", 
                color: "#A855F7", 
                cursor: "pointer"
              }}
            >
              Retour Accueil
            </button>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              top: "12px",
              right: "120px",
              zIndex: 9999,
            }}>
              <button
                onClick={() => setView("hero")}
                style={{
                  padding: "8px 14px",
                  background: "rgba(26, 26, 46, 0.9)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                ↩ Retour Accueil
              </button>
            </div>
            <AdminDashboard />
          </div>
        )
      ) : view === "recruiter" ? (
        <div style={{ position: "relative" }}>
          {/* Top header navigation to let recruiter go back */}
          <div style={{
            position: "absolute",
            top: "12px",
            right: "120px",
            zIndex: 9999,
          }}>
            <button
              onClick={() => setView("hero")}
              style={{
                padding: "8px 14px",
                background: "rgba(26, 26, 46, 0.9)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              ↩ Retour Accueil
            </button>
          </div>
          <RecruiterDashboard user={user} token={token} />
        </div>
      ) : (
        <AgentCandidature
          initialView={view === "builder" ? "builder" : "dashboard"}
          initialShowGmail={view === "gmail"}
          onNavigate={handleNavigate}
          onSearch={() => setShowSearch(true)}
          selectedCandidatureId={selectedCandidatureId}
          clearSelectedCandidatureId={() => setSelectedCandidatureId(null)}
          user={user}
          token={token}
          onLogout={async () => {
            if (supabase && supabase.auth) {
              await supabase.auth.signOut();
            }
            setUser(null);
            setToken(null);
            setView("hero");
          }}
        />
      )}

      {/* ── Spotlight Search Modal Overlay ── */}
      {showSearch && (
        <div
          onClick={() => setShowSearch(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(6, 5, 12, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "12vh",
          }}
        >
          {/* Search Box Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "600px",
              background: "rgba(22, 18, 46, 0.95)",
              border: "1px solid rgba(168, 85, 247, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(112, 38, 232, 0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(168, 85, 247, 0.18)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="rgba(168, 85, 247, 0.7)"
                style={{ width: "20px", height: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Rechercher une candidature, entreprise, statut..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#F8FAFC",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: "rgba(168, 85, 247, 0.6)",
                  fontFamily: "'DM Mono', monospace",
                  background: "rgba(168, 85, 247, 0.1)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}
              >
                ESC
              </span>
            </div>

            {/* Results Area */}
            <div
              style={{
                maxHeight: "350px",
                overflowY: "auto",
                padding: "8px 12px",
                backgroundColor: "rgba(13, 11, 28, 0.4)",
              }}
            >
              {filteredCandidatures.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(148, 163, 184, 0.6)",
                      fontFamily: "'DM Mono', monospace",
                      textTransform: "uppercase",
                      padding: "8px 8px 4px 8px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Candidatures enregistrées ({filteredCandidatures.length})
                  </div>
                  {filteredCandidatures.map((c) => {
                    const status = getStatusStyle(c.statut);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCandidature(c)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background: "rgba(22, 18, 46, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.02)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(112, 38, 232, 0.12)";
                          e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(22, 18, 46, 0.3)";
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.02)";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {/* Company icon letter */}
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #7026E8, #A855F7)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: "700",
                            }}
                          >
                            {(c.entreprise || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#F8FAFC" }}>
                              {c.poste}
                            </div>
                            <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                              {c.entreprise} {c.lieu ? `• ${c.lieu}` : ""}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            fontFamily: "'DM Mono', monospace",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            background: status.bg,
                            color: status.text,
                            border: `1px solid ${status.text}25`,
                          }}
                        >
                          {c.statut}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: "13px",
                  }}
                >
                  Aucune candidature trouvée pour "<strong>{searchQuery}</strong>".<br />
                  <span style={{ fontSize: "11px", color: "rgba(148, 163, 184, 0.6)", marginTop: "6px", display: "inline-block" }}>
                    Essayez un autre mot-clé ou importez de nouvelles offres dans le CRM.
                  </span>
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid rgba(168, 85, 247, 0.12)",
                fontSize: "10.5px",
                color: "rgba(148, 163, 184, 0.5)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(13, 11, 28, 0.2)",
              }}
            >
              <span>Astuce : Appuyez sur <strong>Ctrl + K</strong> de n'importe où pour ouvrir la recherche.</span>
              <span>Raccourcis : <strong>↑↓</strong> Naviguer</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Success Modal ── */}
      {showPaymentSuccessModal && (
        <div
          onClick={() => setShowPaymentSuccessModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(6, 5, 12, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "480px",
              background: "rgba(22, 18, 46, 0.95)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(16, 185, 129, 0.15)",
              padding: "40px 30px",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "200px",
              background: "rgba(16, 185, 129, 0.2)",
              borderRadius: "50%",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 0,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.1)",
                border: "2px solid #10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto",
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#10B981" style={{ width: "36px", height: "36px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>

              <h2 style={{
                fontSize: "26px",
                fontWeight: "800",
                color: "#FFF",
                marginBottom: "12px",
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.5px",
              }}>
                Paiement Réussi !
              </h2>
              
              <p style={{
                fontSize: "15px",
                color: "#94A3B8",
                lineHeight: "1.6",
                marginBottom: "32px",
              }}>
                Félicitations ! Votre abonnement au plan{" "}
                <strong style={{ color: "#10B981" }}>
                  {paymentDetails?.plan === "recruiter_pro" ? "Recruteur Pro" : "Candidat Premium"}
                </strong>{" "}
                a été activé avec succès via {paymentDetails?.provider === "fedapay" ? "Mobile Money" : "Stripe"}.
              </p>

              <button
                onClick={() => {
                  setShowPaymentSuccessModal(false);
                  setView("hero");
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#FFF",
                  fontWeight: "700",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                  transition: "all 0.2s",
                }}
              >
                Commencer à explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;