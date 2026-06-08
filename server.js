import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { parseEmailsWithAI } from "./gmail.js";
import * as imapService from "./imapService.js";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import fedapayPkg from "fedapay";

dotenv.config();

const { FedaPay, Transaction, Webhook: FedaPayWebhook } = fedapayPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

// Capture raw body buffer for Stripe and FedaPay Webhook signature verification
app.use(express.json({
  limit: "2mb",
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Initialize payment integrations
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
if (process.env.FEDAPAY_SECRET_KEY) {
  FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
  FedaPay.setEnvironment("sandbox"); // sandbox for test payments
}

// Initialize Supabase Server client safely (uses Service Role Key if available to bypass RLS in webhooks)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServer = (process.env.VITE_SUPABASE_URL && supabaseServiceKey)
  ? createClient(process.env.VITE_SUPABASE_URL, supabaseServiceKey)
  : null;

// JWT Verification Middleware
const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentification requise." });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Jeton d'authentification manquant." });
    }

    // Bypass developer / mock credentials locally
    if (token === "mock_token_admin_12345") {
      req.user = { email: "renaudmiko90@gmail.com", id: "usr_admin_12345" };
      return next();
    }
    if (token === "mock_token_candidate_67890") {
      req.user = { email: "marie.laurent@example.com", id: "usr_candidate_67890" };
      return next();
    }

    if (!supabaseServer) {
      return res.status(500).json({ error: "Client Supabase non configuré sur le serveur." });
    }

    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Session invalide ou expirée." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Erreur de validation de session." });
  }
};

// ── Existing Gemini API Endpoint ──────────────────────────────────────────────
app.post("/api/claude", checkAuth, async (req, res) => {
  try {
    const { system, user } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY manquante dans .env",
      });
    }

    if (!system || !user) {
      return res.status(400).json({
        error: "system et user sont requis",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: user,
      config: {
        systemInstruction: system,
        maxOutputTokens: 6000,
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Erreur serveur Gemini",
    });
  }
});

// ── Gemini Chatbot Endpoint ──────────────────────────────────────────────
app.post("/api/chatbot", checkAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY manquante dans .env",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        error: "Le prompt est requis",
      });
    }

    const systemInstruction = `Tu es MIKA (My Intelligent Kareer Assistant), un assistant virtuel conçu pour guider les utilisateurs dans l'utilisation de cette application.
Ton rôle est d'expliquer comment utiliser le site et ses fonctionnalités.
Voici des détails sur le fonctionnement de l'application :
1. "Optimiseur & Studio" (onglet n°1) : Permet de charger un CV (.pdf, .docx, .txt), de saisir une offre d'emploi, et de configurer des informations personnelles. En cliquant sur "Lancer l'agent", l'IA analyse le profil, calcule un score ATS en temps réel, extrait les mots-clés manquants, et génère un CV optimisé et une lettre de motivation premium prête à envoyer.
2. "Mon CRM" (onglet n°2) : Un tableau de bord Kanban interactif pour suivre le statut de ses candidatures (Brouillon, Envoyée, Entretien, Offre, Refusée). On peut y glisser-déposer des cartes de candidatures.
3. "Sync Gmail" (onglet n°3) : Permet de connecter sa boîte de messagerie en renseignant son e-mail et un Mot de passe d'application Google (à 16 caractères). L'application récupère automatiquement les e-mails de candidatures étiquetés pour les importer en 1 clic dans le CRM.
4. "Barre de recherche" (spotlight) : Accessible en haut à droite (icône loupe) pour filtrer et rechercher des candidatures par poste ou entreprise dans le CRM.

IMPORTANT : Tu ne dois répondre qu'à des questions sur l'utilisation pratique du site (comment postuler, comment importer un mail, comment générer sa lettre, etc.). Ne réponds jamais à des questions techniques sur le code source, la construction du site ou la programmation. Reste courtois, précis, synthétique et professionnel. Parle toujours en français.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Erreur serveur Gemini",
    });
  }
});

// ── IMAP Integration Endpoints ───────────────────────────────────────────────

// Check if IMAP is configured/authenticated
app.get("/api/gmail/status", checkAuth, (req, res) => {
  try {
    const authenticated = imapService.isAuthenticated(req.user.id);
    if (!authenticated) {
      return res.json({ authenticated: false });
    }
    const creds = imapService.loadCredentials(req.user.id);
    res.json({ authenticated: true, email: creds?.email });
  } catch (error) {
    res.json({ authenticated: false, error: error.message });
  }
});

// Save IMAP configuration credentials
app.post("/api/gmail/config", checkAuth, (req, res) => {
  try {
    const { email, appPassword } = req.body;
    if (!email || !appPassword) {
      return res.status(400).json({ error: "Email et mot de passe d'application requis." });
    }

    imapService.saveCredentials(email, appPassword, req.user.id);
    res.json({ success: true, message: "Configuration de messagerie enregistrée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Synchronize emails from IMAP
app.get("/api/gmail/sync", checkAuth, async (req, res) => {
  try {
    const maxResults = parseInt(req.query.max) || 20;

    console.log(`📧 Lancement de la synchronisation via IMAP pour ${req.user.email}...`);

    // Fetch raw emails
    let rawEmails;
    try {
      rawEmails = await imapService.fetchLabelEmails(maxResults, req.user.id);
    } catch (imapError) {
      console.error("Erreur de connexion IMAP:", imapError);
      if (imapError.authenticationFailed || imapError.serverResponseCode === "AUTHENTICATIONFAILED" || imapError.serverResponseCode === "ALERT" || imapError.message?.includes("AUTHENTICATIONFAILED") || imapError.responseText?.includes("Application-specific password required")) {
        try { imapService.disconnect(req.user.id); } catch (unlinkErr) {}
        const isAppPwdRequired = imapError.responseText?.includes("Application-specific password required");
        return res.status(401).json({
          error: isAppPwdRequired
            ? "Google exige un Mot de passe d'application (16 caractères). Votre mot de passe Gmail classique ne fonctionne pas. Rendez-vous sur myaccount.google.com/apppasswords."
            : "Échec de la connexion : votre adresse e-mail ou votre mot de passe d'application (à 16 caractères) est incorrect.",
        });
      }
      return res.status(500).json({
        error: `Erreur de connexion à votre boîte de messagerie : ${imapError.message}`,
      });
    }
    console.log(`📨 ${rawEmails.length} email(s) récupéré(s)`);

    if (rawEmails.length === 0) {
      return res.json({ emails: [], parsed: [], count: 0 });
    }

    // Parse emails with Gemini AI
    console.log("🤖 Analyse IA par Gemini en cours...");
    const parsed = await parseEmailsWithAI(rawEmails, ai);
    console.log(`✅ ${parsed.length} email(s) analysé(s) avec succès`);

    res.json({
      emails: rawEmails.map((e) => ({
        id: e.id,
        from: e.from,
        subject: e.subject,
        date: e.date,
        snippet: e.snippet,
      })),
      parsed,
      count: parsed.length,
    });
  } catch (error) {
    console.error("Erreur sync IMAP:", error);
    res.status(500).json({
      error: error.message || "Erreur lors de la synchronisation des e-mails",
    });
  }
});

// Disconnect IMAP (delete config file)
app.post("/api/gmail/disconnect", checkAuth, (req, res) => {
  try {
    imapService.disconnect(req.user.id);
    res.json({ success: true, message: "Messagerie déconnectée." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Payments Integration Endpoints ───────────────────────────────────────────

// Helper to fetch or create user profiles record in Supabase
const getOrCreateProfile = async (userId) => {
  if (!supabaseServer) return null;
  const { data: profile, error } = await supabaseServer
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  if (profile) return profile;

  // Create new profile record if missing
  const { data: newProfile, error: insertError } = await supabaseServer
    .from("profiles")
    .insert([{ id: userId, subscription_tier: "free" }])
    .select()
    .single();

  if (insertError) {
    console.error("Error creating profile:", insertError);
    return null;
  }
  return newProfile;
};

// 1. Stripe Checkout Session Creator
app.post("/api/payment/stripe/create-session", checkAuth, async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: "priceId est requis." });
    }

    const profile = await getOrCreateProfile(req.user.id);
    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId: req.user.id }
      });
      stripeCustomerId = customer.id;

      // Update Supabase profile
      if (supabaseServer) {
        await supabaseServer
          .from("profiles")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", req.user.id);
      }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card", "link", "sepa_debit"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `http://localhost:5173/?payment=success&provider=stripe`,
      cancel_url: `http://localhost:5173/?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe create-session error:", err);
    res.status(500).json({ error: err.message || "Erreur lors de la création de la session Stripe." });
  }
});

// 2. Stripe Customer Portal Session Creator
app.post("/api/payment/stripe/create-portal", checkAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    const stripeCustomerId = profile?.stripe_customer_id;
    if (!stripeCustomerId) {
      return res.status(400).json({ error: "Aucun profil Stripe trouvé pour cet utilisateur." });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: "http://localhost:5173/",
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe create-portal error:", err);
    res.status(500).json({ error: err.message || "Erreur lors de la création du portail Stripe." });
  }
});

// 3. FedaPay Session Creator (Mobile Money)
app.post("/api/payment/fedapay/create-session", checkAuth, async (req, res) => {
  try {
    const { amount, planId } = req.body;
    if (!amount || !planId) {
      return res.status(400).json({ error: "amount et planId sont requis." });
    }

    const fullName = req.user.user_metadata?.full_name || "Utilisateur MIKA";
    const names = fullName.split(" ");
    const firstname = names[0] || "MIKA";
    const lastname = names.slice(1).join(" ") || "User";

    // Create FedaPay transaction
    const transaction = await Transaction.create({
      description: `Abonnement MIKA Plan: ${planId}`,
      amount: amount,
      currency: { iso: "XOF" }, // West African CFA Franc
      callback_url: `http://localhost:5173/?payment=success&provider=fedapay&plan=${planId}`,
      customer: {
        firstname: firstname,
        lastname: lastname,
        email: req.user.email,
      },
      metadata: {
        userId: req.user.id,
        planId: planId
      }
    });

    const token = await transaction.generateToken();
    res.json({ url: token.url });
  } catch (err) {
    console.error("FedaPay create-session error:", err);
    res.status(500).json({ error: err.message || "Erreur lors de la création de la transaction FedaPay." });
  }
});

// 4. Stripe Webhook Handler
app.post("/api/payment/stripe/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Stripe Webhook Signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`⚡ Stripe Webhook Event: ${event.type}`);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;

      // Fetch subscription details
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const priceId = subscription.items.data[0].price.id;
      
      let tier = "free";
      if (priceId === "price_premium" || priceId.includes("premium")) {
        tier = "premium";
      } else if (priceId === "price_recruiter" || priceId.includes("recruiter")) {
        tier = "recruiter_pro";
      }

      if (supabaseServer) {
        const { data: profile } = await supabaseServer
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (profile) {
          await supabaseServer.from("subscriptions").upsert({
            id: stripeSubscriptionId,
            user_id: profile.id,
            status: subscription.status,
            payment_provider: "stripe",
            price_id: priceId,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

          await supabaseServer
            .from("profiles")
            .update({ subscription_tier: tier })
            .eq("id", profile.id);
        }
      }
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;

      let tier = "free";
      if (subscription.status === "active" || subscription.status === "trialing") {
        const priceId = subscription.items.data[0].price.id;
        if (priceId === "price_premium" || priceId.includes("premium")) {
          tier = "premium";
        } else if (priceId === "price_recruiter" || priceId.includes("recruiter")) {
          tier = "recruiter_pro";
        }
      }

      if (supabaseServer) {
        const { data: profile } = await supabaseServer
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .maybeSingle();

        if (profile) {
          if (subscription.status === "deleted") {
            await supabaseServer.from("subscriptions").delete().eq("id", subscription.id);
            await supabaseServer
              .from("profiles")
              .update({ subscription_tier: "free" })
              .eq("id", profile.id);
          } else {
            await supabaseServer.from("subscriptions").upsert({
              id: subscription.id,
              user_id: profile.id,
              status: subscription.status,
              payment_provider: "stripe",
              price_id: subscription.items.data[0].price.id,
              cancel_at_period_end: subscription.cancel_at_period_end,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            });
            await supabaseServer
              .from("profiles")
              .update({ subscription_tier: tier })
              .eq("id", profile.id);
          }
        }
      }
    }
  } catch (dbErr) {
    console.error("Database update error inside Stripe webhook:", dbErr);
  }

  res.json({ received: true });
});

// 5. FedaPay Webhook Handler
app.post("/api/payment/fedapay/webhook", async (req, res) => {
  const sig = req.headers["x-fedapay-signature"];
  let event;

  try {
    event = FedaPayWebhook.constructEvent(
      req.rawBody,
      sig,
      process.env.FEDAPAY_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("FedaPay Webhook Signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`⚡ FedaPay Webhook Event: ${event.name}`);

  try {
    if (event.name === "transaction.approved") {
      const transaction = event.data;
      const userId = transaction.metadata?.userId;
      const planId = transaction.metadata?.planId;

      if (userId && planId && supabaseServer) {
        let tier = "free";
        if (planId === "premium") {
          tier = "premium";
        } else if (planId === "recruiter_pro") {
          tier = "recruiter_pro";
        }

        // Update profile
        await supabaseServer
          .from("profiles")
          .update({ 
            subscription_tier: tier,
            fedapay_customer_id: String(transaction.customer_id || "")
          })
          .eq("id", userId);

        // Record active subscription
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        await supabaseServer.from("subscriptions").upsert({
          id: `fedapay_${transaction.id}`,
          user_id: userId,
          status: "active",
          payment_provider: "fedapay",
          price_id: planId,
          cancel_at_period_end: false,
          current_period_start: new Date().toISOString(),
          current_period_end: oneMonthLater.toISOString(),
        });
      }
    }
  } catch (dbErr) {
    console.error("Database update error inside FedaPay webhook:", dbErr);
  }

  res.json({ received: true });
});

// Serve frontend static build files in production
app.use(express.static(path.join(__dirname, "dist")));

// Fallback all non-API GET requests to React index.html
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 3001, () => {
  console.log(
    `Backend Gemini lancé sur http://localhost:${process.env.PORT || 3001}`
  );
});