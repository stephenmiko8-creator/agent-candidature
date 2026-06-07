import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { parseEmailsWithAI } from "./gmail.js";
import * as imapService from "./imapService.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ── Existing Gemini API Endpoint ──────────────────────────────────────────────
app.post("/api/claude", async (req, res) => {
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
app.post("/api/chatbot", async (req, res) => {
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
app.get("/api/gmail/status", (req, res) => {
  try {
    const authenticated = imapService.isAuthenticated();
    if (!authenticated) {
      return res.json({ authenticated: false });
    }
    const creds = imapService.loadCredentials();
    res.json({ authenticated: true, email: creds?.email });
  } catch (error) {
    res.json({ authenticated: false, error: error.message });
  }
});

// Save IMAP configuration credentials
app.post("/api/gmail/config", (req, res) => {
  try {
    const { email, appPassword } = req.body;
    if (!email || !appPassword) {
      return res.status(400).json({ error: "Email et mot de passe d'application requis." });
    }

    imapService.saveCredentials(email, appPassword);
    res.json({ success: true, message: "Configuration de messagerie enregistrée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Synchronize emails from IMAP
app.get("/api/gmail/sync", async (req, res) => {
  try {
    const maxResults = parseInt(req.query.max) || 20;

    console.log(`📧 Lancement de la synchronisation via IMAP...`);

    // Fetch raw emails
    let rawEmails;
    try {
      rawEmails = await imapService.fetchLabelEmails(maxResults);
    } catch (imapError) {
      console.error("Erreur de connexion IMAP:", imapError);
      if (imapError.authenticationFailed || imapError.serverResponseCode === "AUTHENTICATIONFAILED" || imapError.serverResponseCode === "ALERT" || imapError.message?.includes("AUTHENTICATIONFAILED") || imapError.responseText?.includes("Application-specific password required")) {
        try { imapService.disconnect(); } catch (unlinkErr) {}
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
app.post("/api/gmail/disconnect", (req, res) => {
  try {
    imapService.disconnect();
    res.json({ success: true, message: "Messagerie déconnectée." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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