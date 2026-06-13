import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthModal({ onAuthSuccess, onCancel, theme = "dark" }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpRole, setSignUpRole] = useState("candidate"); // "candidate" | "recruiter"
  const [companyName, setCompanyName] = useState("");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const isRecruiterSignUp = isSignUp && signUpRole === "recruiter";

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
        if (signUpRole === "recruiter" && (!companyName || !companyRegNumber)) {
          setErrorMsg("Veuillez renseigner le nom de l'entreprise et son numéro d'immatriculation.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg("Les mots de passe ne correspondent pas.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: signUpRole,
              company_name: signUpRole === "recruiter" ? companyName : null,
              company_registration_number: signUpRole === "recruiter" ? companyRegNumber : null,
            }
          }
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

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setLoading(true);

    if (!isSupabaseConfigured) {
      setErrorMsg("Supabase n'est pas configuré. Impossible d'utiliser l'authentification Google.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Erreur lors de la connexion avec Google.");
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

  if (theme === "light") {
    return (
      <div className="fixed inset-0 bg-white z-[10000] flex font-sans overflow-hidden">
        
        {/* Left Side: Avatar Image */}
        <div className="hidden md:block md:w-1/2 lg:w-[45%] relative bg-[#F8FAFC] overflow-hidden border-r border-slate-200 shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-10">
          <img
            src="/login-avatar.jpeg"
            alt="Login Avatar"
            className="w-full h-full object-cover"
            style={{
              transform: 'scale(1.6)',
              transformOrigin: 'center center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC]/80 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Right Side: Premium Light Theme Form */}
        <div className="w-full md:w-1/2 lg:w-[55%] h-full min-h-screen relative bg-[#F8FAFC] flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
          
          {/* Ambient Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0A66C2]/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7026E8]/10 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Close Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer z-50"
              title="Retour à l'accueil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="w-full max-w-[420px] mx-auto flex flex-col relative z-10">
            
            {/* Logo & Header */}
            <div className="flex items-center gap-3 shrink-0 mb-8">
              <div className="w-10 h-10 bg-[#0A66C2] rounded-lg flex items-center justify-center text-xl text-white shadow-md">
                ⚡
              </div>
              <div>
                <div className="font-['Orbitron'] font-bold text-xl tracking-wide text-slate-900">StaJob</div>
                <div className="text-[8px] text-slate-500 tracking-[0.15em] font-semibold mt-0.5 uppercase">Agent de carrière intelligent</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">{isSignUp ? "Créer un compte" : "Bon retour"}</h2>
              <p className="text-sm text-slate-500">
                {isSignUp
                  ? "Rejoignez StaJob pour propulser vos candidatures."
                  : "Entrez vos identifiants pour accéder à votre espace."}
              </p>
            </div>

            {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2"><span className="text-lg">⚠️</span> {errorMsg}</div>}
            {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2"><span className="text-lg">✅</span> {successMsg}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Role Selection */}
              {isSignUp && (
                <div className="flex flex-col gap-2 mb-2">
                  <label className="text-sm font-semibold text-slate-700">Vous êtes :</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border rounded-lg cursor-pointer transition-all ${signUpRole === "candidate" ? "border-[#0A66C2] bg-[#F0F7FF] text-[#0A66C2] font-medium shadow-sm" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                      <input
                        type="radio"
                        name="signUpRole"
                        value="candidate"
                        checked={signUpRole === "candidate"}
                        onChange={() => setSignUpRole("candidate")}
                        className="hidden"
                      />
                      👤 Candidat
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border rounded-lg cursor-pointer transition-all ${signUpRole === "recruiter" ? "border-[#0A66C2] bg-[#F0F7FF] text-[#0A66C2] font-medium shadow-sm" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                      <input
                        type="radio"
                        name="signUpRole"
                        value="recruiter"
                        checked={signUpRole === "recruiter"}
                        onChange={() => setSignUpRole("recruiter")}
                        className="hidden"
                      />
                      🏢 Recruteur
                    </label>
                  </div>
                </div>
              )}

              {/* Recruiter Fields */}
              {isSignUp && signUpRole === "recruiter" && (
                <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Nom de l'entreprise</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: StaJob Corp"
                      className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 px-4 py-2.5 text-sm outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">SIRET</label>
                    <input
                      type="text"
                      value={companyRegNumber}
                      onChange={(e) => setCompanyRegNumber(e.target.value)}
                      placeholder="123 456 789 00012"
                      className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 px-4 py-2.5 text-sm outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Common Fields */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Adresse Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 px-4 py-2.5 text-sm outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                  {!isSignUp && <span className="text-xs text-[#0A66C2] font-medium cursor-pointer hover:underline transition-colors">Mot de passe oublié ?</span>}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 px-4 py-2.5 text-sm outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {isSignUp && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 px-4 py-2.5 text-sm outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#0A66C2] focus:ring-[#0A66C2]" />
                  <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Se souvenir de moi</label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A66C2] hover:bg-[#085299] text-white rounded-lg font-semibold py-3 transition-all disabled:opacity-50 text-sm shadow-md"
              >
                {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Sign in"}
              </button>

              {/* Simulated OAuth Buttons */}
              {!isSignUp && (
                <>
                  <div className="relative flex items-center justify-center mt-3 mb-3">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative bg-white px-4 text-xs text-slate-400 uppercase tracking-wider">Ou continuer avec</div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium py-2.5 transition-all text-sm flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign in with Google
                  </button>
                </>
              )}
            </form>

            <div className="text-center text-sm text-slate-600 mt-6">
              {isSignUp ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}{" "}
              <span
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#0A66C2] font-semibold cursor-pointer hover:underline"
              >
                {isSignUp ? "Connectez-vous" : "Inscrivez-vous"}
              </span>
            </div>

            {/* Dev/Demo Section */}
            {isLocal && !isSignUp && (
              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest text-center mb-1 font-semibold">Accès Rapide (Démo)</div>
                <div className="flex gap-3">
                  <button onClick={() => handleBypass("admin")} className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm">
                    ⚡ Admin
                  </button>
                  <button onClick={() => handleBypass("candidate")} className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm">
                    👤 Candidat
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

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

      <div className="w-full h-full text-slate-50 flex overflow-hidden">
        {/* Left Side: Image (Full Bleed to Left, Top, and Bottom) */}
        <div className="hidden md:block md:w-1/2 lg:w-[45%] relative bg-white overflow-hidden">
          <img
            src="/login-avatar.jpeg"
            alt="Login Avatar"
            className="w-full h-full object-cover"
            style={{
              transform: 'scale(1.6)',
              transformOrigin: 'center center'
            }}
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 lg:w-[55%] h-full min-h-screen bg-[#111a3a] flex flex-col justify-center px-6 md:px-[75px] py-12 border-l border-purple-500/20 overflow-y-auto">
          <div className="w-full h-full min-h-[80vh] flex flex-col justify-between">
            {/* Top: Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-10 h-10 bg-gradient-to-br from-[#7026E8] to-[#A855F7] rounded-xl flex items-center justify-center text-xl font-bold">⚡</span>
              <div>
                <div className="font-['Orbitron'] font-extrabold text-2xl tracking-wider">StaJob</div>
                <div className="text-[8px] text-[#00F0FF] tracking-[3px]">VOTRE AGENT DE CARRIÈRE INTELLIGENT</div>
              </div>
            </div>

            {/* Middle: Form Content */}
            <div className="flex flex-col my-auto py-10">
              <div className="shrink-0">
                <h2 className="text-3xl font-bold mb-3">{isSignUp ? "Créer un compte" : "Connexion Portail"}</h2>
                <p className="text-base text-slate-400 mb-8">
                  {isSignUp
                    ? "Rejoins StaJob pour propulser tes candidatures."
                    : "Connecte-toi pour accéder à ton studio et CRM."}
                </p>
              </div>

              {errorMsg && <div className="bg-rose-500/10 border border-rose-500/25 text-[#FF4A70] px-4 py-3 rounded-lg text-sm mb-4 shrink-0">⚠️ {errorMsg}</div>}
              {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/25 text-[#00E699] px-4 py-3 rounded-lg text-sm mb-4 shrink-0">✅ {successMsg}</div>}

              <form onSubmit={handleSubmit} className="flex flex-col shrink-0 gap-5">
                {isSignUp && (
                  <div className="flex flex-col gap-4 p-4 mb-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                    <label className="text-sm text-slate-300 font-semibold">Je m'inscris en tant que :</label>
                    <div className="flex gap-5">
                      <label className="flex items-center gap-2 text-base text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="signUpRole"
                          value="candidate"
                          checked={signUpRole === "candidate"}
                          onChange={() => setSignUpRole("candidate")}
                          className="accent-purple-500"
                        />
                        Candidat
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="signUpRole"
                          value="recruiter"
                          checked={signUpRole === "recruiter"}
                          onChange={() => setSignUpRole("recruiter")}
                          className="accent-purple-500"
                        />
                        Recruteur
                      </label>
                    </div>
                  </div>
                )}

                {isSignUp && signUpRole === "recruiter" && (
                  <div className="flex flex-col gap-4 p-4 mb-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-slate-400 font-medium">Nom de l'entreprise</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: StaJob Corp"
                        className="px-4 py-3 bg-[#0A0816]/60 border border-cyan-500/20 rounded-lg text-slate-50 text-base outline-none focus:border-cyan-500/50 transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-400 font-medium">Numéro d'immatriculation / SIRET</label>
                      <input
                        type="text"
                        value={companyRegNumber}
                        onChange={(e) => setCompanyRegNumber(e.target.value)}
                        placeholder="Ex: 123 456 789 00012"
                        className="px-3.5 py-2.5 bg-[#0A0816]/60 border border-cyan-500/20 rounded-lg text-slate-50 text-sm outline-none focus:border-cyan-500/50 transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Adresse Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie.laurent@example.com"
                    className="bg-[#0A0816]/60 border border-purple-500/20 rounded-lg text-slate-50 outline-none focus:border-purple-500/50 transition-colors px-3.5 py-2.5 text-sm"
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
                    className="bg-[#0A0816]/60 border border-purple-500/20 rounded-lg text-slate-50 outline-none focus:border-purple-500/50 transition-colors px-3.5 py-2.5 text-sm"
                    required
                  />
                </div>

                {isSignUp && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-medium">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-[#0A0816]/60 border border-purple-500/20 rounded-lg text-slate-50 outline-none focus:border-purple-500/50 transition-colors px-3.5 py-2.5 text-sm"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#7026E8] to-[#A855F7] rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer mt-2 p-3 text-sm"
                >
                  {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
                </button>

                {!isSignUp && (
                  <>
                    <div className="relative flex items-center justify-center mt-2 mb-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
                      <div className="relative bg-[#111a3a] px-3 text-[10px] text-slate-500 uppercase tracking-wider">Ou continuer avec</div>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full bg-[#0A0816]/60 border border-slate-700/50 hover:bg-[#0A0816] text-white rounded-lg font-medium py-2.5 transition-all text-sm flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </button>
                  </>
                )}
              </form>

              <div className="text-center text-xs text-slate-400 shrink-0 mt-4">
                {isSignUp ? "Déjà membre ?" : "Nouveau sur StaJob ?"}{" "}
                <span
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#00F0FF] font-semibold cursor-pointer hover:underline"
                >
                  {isSignUp ? "Se connecter" : "Créer un compte"}
                </span>
              </div>

              {onCancel && (
                <div className="text-center text-xs shrink-0 mt-5">
                  <span
                    onClick={onCancel}
                    className="text-slate-400 cursor-pointer underline hover:text-[#00F0FF] transition-colors"
                  >
                    Retour à l'accueil
                  </span>
                </div>
              )}
            </div>

            {/* Bottom: Demo Mode / Bypass Section */}
            {isLocal && !isSignUp && (
              <div className="mt-auto flex flex-col gap-2.5 shrink-0">
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
