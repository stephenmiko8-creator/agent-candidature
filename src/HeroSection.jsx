import React, { useState } from "react";

export default function HeroSection({ onNavigate, onSearch, currentView = "hero", isAdmin }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Accueil", view: "hero", hasDropdown: false },
    { name: "Optimiseur & Studio", view: "builder", hasDropdown: false },
    { name: "Modèles & Designs", view: "templates", hasDropdown: false },
    { name: "Tarifs", view: "pricing", hasDropdown: false },
    { name: "Blog", view: "blog", hasDropdown: false },
    { name: "About", view: "about", hasDropdown: false },
    { name: "Espace Recruteur", view: "recruiter", hasDropdown: false },
  ];
  if (isAdmin) {
    navItems.push({ name: "Admin Panel ⚙️", view: "admin", hasDropdown: false });
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-brand-bg)] overflow-hidden font-sans select-none flex flex-col">
      
      {/* ── Background Blurred Blobs ── */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-[var(--color-brand-pink-blob)] rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] bg-[var(--color-brand-blue-blob)] rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[25%] w-[400px] h-[400px] bg-[var(--color-brand-purple-blob)] rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* ── Navigation Header (Full Width Glassmorphic) ── */}
      <header className="relative z-20 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate && onNavigate("hero")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <svg className="w-10 h-10 filter drop-shadow-[0_4px_8px_rgba(112,38,232,0.35)]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="flex flex-col">
              <span className="font-bold text-[28px] tracking-wider text-[var(--color-brand-dark)] leading-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                StaJob
              </span>
              <span className="text-[8.5px] font-light text-[var(--color-brand-purple)] tracking-[3.5px] mt-1 uppercase leading-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                VOTRE AGENT DE CARRIÈRE INTELLIGENT
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate && onNavigate(item.view)}
                  className={`relative font-semibold text-[15px] transition-all hover:text-[var(--color-brand-purple)] flex items-center gap-0.5 cursor-pointer ${
                    isActive ? "text-[var(--color-brand-dark)]" : "text-gray-500/90"
                  }`}
                >
                  {item.name}
                  {item.hasDropdown && <span className="text-[11px] font-bold text-inherit opacity-60 ml-0.5">+</span>}
                  {isActive && (
                    <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-teal)] shadow-[0_0_6px_var(--color-brand-teal)]"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-5">
            {/* Search Button */}
            <button 
              onClick={() => onSearch && onSearch()}
              className="p-2 text-gray-700 hover:text-[var(--color-brand-purple)] transition-all cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.4}
                stroke="currentColor"
                className="w-[20px] h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                />
              </svg>
            </button>

            {/* Burger Menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10.5 h-10.5 bg-[var(--color-brand-dark)] hover:bg-[var(--color-brand-purple)] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_12px_rgba(26,11,54,0.18)] cursor-pointer z-50 relative"
            >
              {isMobileMenuOpen ? (
                // Close/Cross icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                // Burger icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex-1 flex flex-col justify-between">

        {/* ── Backdrop Overlay ── */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ── Sliding Control Center Drawer (Mobile & Desktop) ── */}
        <div className={`fixed top-0 right-0 h-full w-[320px] sm:w-[380px] bg-[rgba(20,12,38,0.96)] border-l border-white/10 backdrop-blur-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 p-8 flex flex-col gap-6 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex flex-col">
              <span className="font-bold text-[22px] text-white tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                StaJob
              </span>
              <span className="text-[8px] text-[var(--color-brand-teal)] tracking-[2px] mt-0.5 font-light" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                KAREER CONTROL
              </span>
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Navigation links inside drawer */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Navigation</span>
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate(item.view);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-left transition-all flex items-center justify-between ${
                    isActive 
                      ? "bg-gradient-to-r from-[#00b4d8] to-[#0077B6] text-white shadow-[0_4px_12px_rgba(0,180,216,0.25)]" 
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>

          {/* CRM Quick Stats inside drawer */}
          <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
            <span className="text-[10px] text-[var(--color-brand-teal)] font-bold uppercase tracking-wider">Mon CRM - Aperçu</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">3</span>
                <span className="text-[11px] text-gray-400 font-medium">Candidatures</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[var(--color-brand-teal)]">85%</span>
                <span className="text-[11px] text-gray-400 font-medium">Score ATS moyen</span>
              </div>
            </div>
          </div>

          {/* System status inside drawer */}
          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[12px] font-medium">
              <span className="text-gray-400">Quantum AI Agent</span>
              <span className="text-[var(--color-brand-teal)] font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-[12px] font-medium">
              <span className="text-gray-400">Model Engine</span>
              <span className="text-white font-mono text-[10px]">Gemini 2.5 Flash</span>
            </div>
            <div className="flex items-center justify-between text-[12px] font-medium">
              <span className="text-gray-400">Sync status</span>
              <span className="text-green-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                Connecté
              </span>
            </div>
          </div>
        </div>

        {/* ── Hero Content ── */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-16">
          
          {/* Left Column: Typography & CTAs */}
          <div className="flex flex-col gap-6 lg:gap-8 text-left max-w-xl">
            <h1 className="text-[42px] md:text-[54px] lg:text-[62px] font-extrabold text-[var(--color-brand-dark)] leading-[1.08] tracking-tight">
              Apply smarter. <br />
              <span className="bg-gradient-to-r from-[#00b4d8] to-[#0077B6] bg-clip-text text-transparent">Get hired faster.</span>
            </h1>
            
            <p className="text-[16px] md:text-[17px] text-[var(--color-brand-gray)] leading-relaxed font-medium max-w-lg">
              StaJob helps you optimize CVs, analyze job offers, and land your dream job with AI power.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {/* Primary CTA */}
              <button 
                onClick={() => onNavigate && onNavigate("builder")}
                className="px-8 py-4 bg-gradient-to-r from-[#00b4d8] to-[#0077B6] hover:from-[#0077B6] hover:to-[#005682] text-white font-bold text-sm rounded-full shadow-[0_6px_20px_rgba(0,180,216,0.25)] hover:shadow-none transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started
              </button>

              {/* Play Button CTA */}
              <button className="flex items-center gap-3.5 pl-3 pr-6 py-3 border border-gray-200/80 hover:border-[var(--color-brand-purple)] rounded-full bg-white/70 hover:bg-white transition-all duration-300 cursor-pointer group">
                <span className="w-10 h-10 rounded-full bg-[var(--color-brand-purple-light)] group-hover:bg-[var(--color-brand-purple)] flex items-center justify-center transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4.5 h-4.5 text-[var(--color-brand-purple)] group-hover:text-white transition-all duration-300 translate-x-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-sm font-bold text-[var(--color-brand-dark)]">
                  Play Intro
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero 3D-styled Illustration */}
          <div className="relative flex justify-center lg:justify-end items-center">
            
            {/* Soft backdrop glow panel */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-purple-blob)] to-[var(--color-brand-blue-blob)] opacity-40 blur-2xl rounded-[40px] z-0"></div>

            {/* Illustration Image (without frame/container) */}
            <img
              src="/swipy-hero.png"
              alt="StaJob AI Career Assistant Illustration"
              className="relative z-10 w-full max-w-[480px] h-auto rounded-[32px] shadow-[0_20px_50px_rgba(112,38,232,0.2)] hover:scale-[1.02] transition-transform duration-700 ease-out object-cover"
            />
          </div>

        </main>

        {/* ── Testimonials & Reviews Section ── */}
        <section className="py-12 border-t border-gray-100/50 mt-6 z-10 relative">
          {/* Section title & Stats */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-brand-dark)] mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Rejoignez des milliers de candidats qui ont propulsé leur carrière avec StaJob.
            </p>
            
            {/* Global Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                <div className="text-xl md:text-2xl font-black text-[#00b4d8]" style={{ fontFamily: "'Orbitron', sans-serif" }}>98.4%</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Avis Positifs</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                <div className="text-xl md:text-2xl font-black text-[#7026E8]" style={{ fontFamily: "'Orbitron', sans-serif" }}>1,500+</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Candidats Recrutés</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-sm">
                <div className="text-xl md:text-2xl font-black text-[#FF4A70]" style={{ fontFamily: "'Orbitron', sans-serif" }}>4.9 / 5</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Note Générale</div>
              </div>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/50 border border-white/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-md flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  "Grâce à l'analyse ATS ultra-précise de StaJob, j'ai pu identifier les mots-clés manquants sur mon profil et décrocher mon entretien chez TechVision en 48 heures !"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100/80 pt-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#185fa5] font-black text-sm flex items-center justify-center">
                  ML
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-brand-dark)]">Marie Laurent</h4>
                  <span className="text-[10px] text-gray-400 font-medium">Développeuse Full-Stack</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/50 border border-white/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-md flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  "Le générateur de lettre de motivation est tout simplement magique. Il s'adapte parfaitement au ton de l'annonce et fait ressortir mes points forts sans effort."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100/80 pt-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7026E8] font-black text-sm flex items-center justify-center">
                  TM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-brand-dark)]">Thomas Martin</h4>
                  <span className="text-[10px] text-gray-400 font-medium">Product Manager</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/50 border border-white/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-md flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                  "Le CRM de suivi des candidatures change tout. Plus d'oubli de relance à J+7 grâce aux notifications et aux rappels automatisés. C'est mon assistant idéal."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100/80 pt-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-[#FF4A70] font-black text-sm flex items-center justify-center">
                  SB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-brand-dark)]">Sara Benali</h4>
                  <span className="text-[10px] text-gray-400 font-medium">Consultante RH</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Footer / Copyright ── */}
        <footer className="py-6 border-t border-gray-100/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <div>© {new Date().getFullYear()} StaJob Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--color-brand-purple)] transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--color-brand-purple)] transition-all">Terms of Service</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
