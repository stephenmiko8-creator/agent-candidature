import React, { useState } from "react";

export default function PricingSection({ onBack, user, token, onOpenAuth }) {
  const [loadingPlan, setLoadingPlan] = useState(null); // 'premium' | 'recruiter_pro'
  const [selectedGateway, setSelectedGateway] = useState(null); // 'stripe' | 'fedapay'
  const [errorMsg, setErrorMsg] = useState("");

  const plans = [
    {
      id: "free",
      name: "Candidat Standard",
      price: "0 €",
      period: "À vie",
      description: "L'essentiel pour commencer vos recherches.",
      features: [
        "ATS Optimizer standard",
        "Modèles de CV de base",
        "Limité à 3 candidatures actives",
        "Accès standard à l'IA MIKA",
      ],
      cta: "Plan Actuel",
      popular: false,
      stripePriceId: null,
      fedapayAmount: 0,
    },
    {
      id: "premium",
      name: "Candidat Premium",
      price: "10 €",
      originalPrice: "19 €",
      altPrice: "6 500 FCFA",
      originalAltPrice: "12 500 FCFA",
      period: "/ mois",
      badge: "Get it now for 10 euros !",
      description: "Maximisez vos chances de décrocher des entretiens avec l'agent d'IA.",
      features: [
        "ATS Optimizer illimité",
        "Sync automatique Gmail & CRM",
        "Accès aux 15 modèles de CV Premium",
        "Lettres de motivation sur-mesure",
        "Analyses et corrections IA en temps réel",
      ],
      cta: "Passer au Premium",
      popular: true,
      stripePriceId: "price_premium",
      fedapayAmount: 6500,
    },
    {
      id: "recruiter_pro",
      name: "Recruteur Pro",
      price: "15 €",
      originalPrice: "29 €",
      altPrice: "10 000 FCFA",
      originalAltPrice: "19 000 FCFA",
      period: "/ mois",
      badge: "Get it now for 15 euros !",
      description: "Le portail ultime pour gérer, contacter et recruter vos talents.",
      features: [
        "Messagerie en temps réel avec les candidats",
        "Tableau de bord Recruteur complet",
        "Filtres de matching IA multicritères",
        "Exportation de rapports candidats en 1 clic",
        "Support client prioritaire 24/7",
      ],
      cta: "Découvrir Recruteur Pro",
      popular: false,
      stripePriceId: "price_recruiter",
      fedapayAmount: 10000,
    },
  ];

  const handleCheckout = async (plan, gateway) => {
    if (!user) {
      if (onOpenAuth) {
        onOpenAuth();
      }
      return;
    }

    setLoadingPlan(plan.id);
    setSelectedGateway(gateway);
    setErrorMsg("");

    try {
      let endpoint = "";
      let body = {};

      if (gateway === "stripe") {
        endpoint = "http://localhost:3001/api/payment/stripe/create-session";
        body = { priceId: plan.stripePriceId || "price_premium" };
      } else {
        endpoint = "http://localhost:3001/api/payment/fedapay/create-session";
        body = { amount: plan.fedapayAmount, planId: plan.id };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la redirection.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Erreur de connexion avec la passerelle.");
    } finally {
      setLoadingPlan(null);
      setSelectedGateway(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-brand-bg)] overflow-hidden font-sans select-none flex flex-col pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-brand-pink-blob)] rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-brand-blue-blob)] rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[var(--color-brand-purple)] transition-all font-semibold cursor-pointer text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Retour à l'accueil
        </button>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-brand-dark)] tracking-tight mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Des offres adaptées à votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">carrière</span>
          </h1>
          <p className="text-lg text-slate-500">
            Choisissez la formule idéale pour optimiser vos candidatures, synchroniser vos opportunités ou recruter vos futurs collaborateurs.
          </p>
          {errorMsg && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between ${
                plan.popular
                  ? "bg-white border-2 border-purple-500 shadow-2xl scale-105 z-10"
                  : "bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-md hover:border-purple-500/50 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                  Recommandé
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{plan.description}</p>
                
                <div className="flex flex-col gap-1 mb-6">
                  {plan.badge && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md self-start border border-emerald-200/50 mb-2">
                      ⚡ {plan.badge}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-800">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-slate-400 line-through font-semibold">{plan.originalPrice}</span>
                    )}
                    <span className="text-slate-400 text-sm">{plan.period}</span>
                  </div>
                  {plan.altPrice && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <span>ou {plan.altPrice}</span>
                      {plan.originalAltPrice && (
                        <span className="line-through text-xs">{plan.originalAltPrice}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 my-6"></div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-purple-600 shrink-0 mt-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {plan.id === "free" ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl font-bold text-center bg-slate-100 text-slate-400 text-sm cursor-not-allowed"
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleCheckout(plan, "stripe")}
                      disabled={loadingPlan !== null}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-center bg-purple-600 hover:bg-purple-700 text-white text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loadingPlan === plan.id && selectedGateway === "stripe" ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Carte / Apple Pay / Crypto"
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleCheckout(plan, "fedapay")}
                      disabled={loadingPlan !== null}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-center bg-teal-500 hover:bg-teal-600 text-white text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loadingPlan === plan.id && selectedGateway === "fedapay" ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Mobile Money (FedaPay)"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Security badges */}
        <div className="mt-20 text-center flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            Paiements chiffrés SSL sécurisés
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Annulation en 1 clic
          </div>
        </div>
      </div>
    </div>
  );
}
