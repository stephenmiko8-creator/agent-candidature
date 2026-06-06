import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_PATH = path.join(__dirname, "token.json");
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// ── OAuth2 Client Factory ─────────────────────────────────────────────────────
export function createOAuth2Client() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri =
    process.env.GMAIL_REDIRECT_URI || "http://localhost:3001/api/gmail/callback";

  if (!clientId || !clientSecret) {
    console.log("⚠️ Client ID ou Secret Gmail manquant. Mode Sandbox activé.");
    return {
      isSandbox: true,
      generateAuthUrl: () => `${redirectUri}?code=mock_sandbox_code`,
      getToken: async (code) => {
        return { tokens: { access_token: "mock_sandbox_token", refresh_token: "mock_sandbox_refresh" } };
      },
      setCredentials: () => {}
    };
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// ── Token Management ──────────────────────────────────────────────────────────
export function loadToken(oauth2Client) {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
      oauth2Client.setCredentials(token);
      return true;
    }
  } catch (e) {
    console.error("Erreur chargement token Gmail:", e.message);
  }
  return false;
}

export async function saveToken(oauth2Client, code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  return tokens;
}

export function getAuthUrl(oauth2Client) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

export function isAuthenticated() {
  return fs.existsSync(TOKEN_PATH);
}

export async function getUserEmail(oauth2Client) {
  if (oauth2Client.isSandbox || !process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    return "sandbox-demo@example.com";
  }
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const profile = await gmail.users.getProfile({ userId: "me" });
  return profile.data.emailAddress;
}

// ── Fetch Emails from Label ───────────────────────────────────────────────────
export async function fetchLabelEmails(
  oauth2Client,
  labelName = "suivi_candidatures",
  maxResults = 20
) {
  if (oauth2Client.isSandbox || !process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    console.log("ℹ️ Mode Sandbox : renvoi de mails fictifs réalistes.");
    return [
      {
        id: "mock_msg_1",
        from: "recrutement@decathlon.com <recrutement@decathlon.com>",
        to: "candidat@example.com",
        subject: "Invitation entretien - Développeur React",
        date: new Date(Date.now() - 24 * 3600 * 1000).toUTCString(),
        snippet: "Nous aimerions vous inviter à un entretien en visioconférence le mardi 16 juin...",
        body: "Bonjour,\n\nNous avons bien reçu votre candidature et nous sommes impressionnés par votre parcours.\nNous aimerions vous inviter à un entretien en visioconférence le mardi 16 juin à 14h00 pour le poste de Développeur React.\n\nVeuillez nous confirmer votre disponibilité.\n\nCordialement,\nL'équipe Recrutement Decathlon."
      },
      {
        id: "mock_msg_2",
        from: "no-reply@google.com <no-reply@google.com>",
        to: "candidat@example.com",
        subject: "Votre candidature chez Google : Product Manager",
        date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toUTCString(),
        snippet: "Après examen attentif de votre profil, nous regrettons de ne pas pouvoir donner...",
        body: "Bonjour,\n\nNous vous remercions pour votre intérêt pour le poste de Product Manager.\nAprès examen attentif de votre profil, nous regrettons de ne pas pouvoir donner une suite favorable à votre candidature pour le moment.\nNous conservons votre CV dans notre vivier.\n\nBonne continuation dans vos recherches.\n\nL'équipe Recrutement Google."
      },
      {
        id: "mock_msg_3",
        from: "rh@societegenerale.fr <rh@societegenerale.fr>",
        to: "candidat@example.com",
        subject: "Candidature reçue : Data Analyst - Société Générale",
        date: new Date().toUTCString(),
        snippet: "Nous confirmons la bonne réception de votre candidature pour le poste de Data Analyst...",
        body: "Bonjour,\n\nNous confirmons la bonne réception de votre candidature pour le poste de Data Analyst au sein du groupe Société Générale à Paris.\nNos équipes RH étudient votre dossier et reviendront vers vous sous deux semaines.\n\nMerci pour votre confiance,\nSociété Générale RH."
      }
    ];
  }

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // 1. Find the label ID from the label name
  const labelsRes = await gmail.users.labels.list({ userId: "me" });
  const labels = labelsRes.data.labels || [];
  const targetLabel = labels.find(
    (l) => l.name.toLowerCase() === labelName.toLowerCase()
  );

  if (!targetLabel) {
    throw new Error(
      `Libellé "${labelName}" introuvable dans votre boîte Gmail. ` +
      `Libellés disponibles : ${labels.map((l) => l.name).join(", ")}`
    );
  }

  // 2. List messages with this label
  const listRes = await gmail.users.messages.list({
    userId: "me",
    labelIds: [targetLabel.id],
    maxResults,
  });

  const messageIds = (listRes.data.messages || []).map((m) => m.id);
  if (messageIds.length === 0) {
    return [];
  }

  // 3. Fetch full message details
  const emails = [];
  for (const msgId of messageIds) {
    try {
      const msgRes = await gmail.users.messages.get({
        userId: "me",
        id: msgId,
        format: "full",
      });

      const headers = msgRes.data.payload?.headers || [];
      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
          ?.value || "";

      // Extract body text
      let bodyText = "";
      const payload = msgRes.data.payload;

      if (payload?.body?.data) {
        bodyText = Buffer.from(payload.body.data, "base64").toString("utf-8");
      } else if (payload?.parts) {
        // Multipart email — find text/plain or text/html
        const textPart = payload.parts.find(
          (p) => p.mimeType === "text/plain"
        );
        const htmlPart = payload.parts.find(
          (p) => p.mimeType === "text/html"
        );
        const part = textPart || htmlPart;
        if (part?.body?.data) {
          bodyText = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
        // Handle nested multipart
        if (!bodyText && payload.parts) {
          for (const p of payload.parts) {
            if (p.parts) {
              const nestedText = p.parts.find(
                (np) => np.mimeType === "text/plain"
              );
              if (nestedText?.body?.data) {
                bodyText = Buffer.from(nestedText.body.data, "base64").toString(
                  "utf-8"
                );
                break;
              }
            }
          }
        }
      }

      // Strip HTML tags if we got HTML
      if (bodyText.includes("<html") || bodyText.includes("<div")) {
        bodyText = bodyText
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/\s+/g, " ")
          .trim();
      }

      emails.push({
        id: msgId,
        from: getHeader("From"),
        to: getHeader("To"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: msgRes.data.snippet || "",
        body: bodyText.slice(0, 3000), // Limit body length for AI processing
      });
    } catch (err) {
      console.error(`Erreur lecture message ${msgId}:`, err.message);
    }
  }

  return emails;
}

// ── AI Email Parser ───────────────────────────────────────────────────────────
export async function parseEmailsWithAI(emails, geminiClient) {
  const results = [];

  for (const email of emails) {
    try {
      const systemPrompt = `Tu es un assistant RH expert en recrutement français. Tu analyses un email reçu dans le cadre d'un suivi de candidatures (stage, alternance, CDD, CDI, emploi).

OBJECTIF : Extraire les informations structurées de l'email pour alimenter un CRM de suivi de candidatures.

TYPES D'EMAILS POSSIBLES :
- "accusé_reception" : confirmation que la candidature a été reçue
- "entretien" : invitation à un entretien (téléphonique, visio, présentiel)
- "refus" : réponse négative
- "offre" : proposition d'embauche ou promesse d'embauche
- "relance" : email de relance envoyé par le candidat
- "test_technique" : invitation à un test, case study ou assessment
- "demande_info" : demande d'informations complémentaires par le recruteur
- "notification_plateforme" : notification automatique de plateforme (Indeed, LinkedIn, WTTJ, Hellowork, etc.)
- "autre" : tout autre type d'email lié aux candidatures

RÈGLES STRICTES :
- Extrais UNIQUEMENT les informations présentes dans l'email, n'invente rien
- Si une information est absente, mets null
- Le champ "statut_suggere" doit correspondre à un des statuts Kanban : "Draft", "Applied", "Interview", "Rejected", "Offer"
- Le résumé doit être concis (1-2 phrases max)
- Si c'est un email de plateforme (Indeed, LinkedIn, etc.), identifie-le comme "notification_plateforme"

Retourne UNIQUEMENT un JSON strict valide, sans markdown :
{
  "type": "accusé_reception | entretien | refus | offre | relance | test_technique | demande_info | notification_plateforme | autre",
  "entreprise": "Nom de l'entreprise ou null",
  "poste": "Intitulé du poste ou null",
  "lieu": "Ville ou localisation ou null",
  "type_contrat": "Stage | Alternance | CDD | CDI | null",
  "date_email": "YYYY-MM-DD",
  "statut_suggere": "Draft | Applied | Interview | Rejected | Offer",
  "resume": "Résumé court de l'email en 1-2 phrases",
  "action_requise": "Description de l'action à prendre ou null",
  "date_action": "YYYY-MM-DD ou null",
  "expediteur": "nom ou email de l'expéditeur",
  "confiance": "haute | moyenne | basse"
}`;

      const userPrompt = `EMAIL À ANALYSER :

De : ${email.from}
À : ${email.to}
Objet : ${email.subject}
Date : ${email.date}

CONTENU :
${email.body}`;

      const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 1500,
          temperature: 0.05,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "";
      // Parse JSON from response
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");

      if (start !== -1 && end > start) {
        const parsed = JSON.parse(cleaned.slice(start, end + 1));
        results.push({
          emailId: email.id,
          emailSubject: email.subject,
          emailFrom: email.from,
          emailDate: email.date,
          emailSnippet: email.snippet,
          ...parsed,
        });
      } else {
        console.error("Réponse IA non-JSON pour email:", email.subject);
        results.push({
          emailId: email.id,
          emailSubject: email.subject,
          emailFrom: email.from,
          emailDate: email.date,
          emailSnippet: email.snippet,
          type: "autre",
          entreprise: null,
          poste: null,
          resume: email.snippet,
          statut_suggere: "Applied",
          confiance: "basse",
        });
      }
    } catch (err) {
      console.error(
        `Erreur parsing IA email "${email.subject}":`,
        err.message
      );
      results.push({
        emailId: email.id,
        emailSubject: email.subject,
        emailFrom: email.from,
        emailDate: email.date,
        emailSnippet: email.snippet,
        type: "autre",
        entreprise: null,
        poste: null,
        resume: "Erreur de parsing : " + err.message,
        statut_suggere: "Applied",
        confiance: "basse",
      });
    }
  }

  return results;
}
