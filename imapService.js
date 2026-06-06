import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

const __fn = fileURLToPath(import.meta.url);
const __dn = path.dirname(__fn);
const CREDENTIALS_PATH = path.join(__dn, "imap_credentials.json");

export function isAuthenticated() {
  return fs.existsSync(CREDENTIALS_PATH);
}

export function saveCredentials(email, appPassword) {
  // Strip spaces from Gmail app passwords if user pasted them formatted like "abcd efgh ijkl mnop"
  const cleanPassword = appPassword.replace(/\s+/g, "");
  const data = { email, appPassword: cleanPassword };
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(data, null, 2));
  return data;
}

export function loadCredentials() {
  if (fs.existsSync(CREDENTIALS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
    } catch (e) {
      console.error("Erreur chargement credentials IMAP:", e);
    }
  }
  return null;
}

export function disconnect() {
  if (fs.existsSync(CREDENTIALS_PATH)) {
    fs.unlinkSync(CREDENTIALS_PATH);
  }
}

export async function fetchLabelEmails(maxResults = 20) {
  const creds = loadCredentials();
  if (!creds || !creds.email || !creds.appPassword) {
    throw new Error("Boîte de messagerie non configurée. Veuillez renseigner votre adresse e-mail et votre mot de passe d'application.");
  }

  console.log(`📧 Connexion IMAP pour ${creds.email}...`);

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: creds.email,
      pass: creds.appPassword
    },
    logger: false
  });

  // Handle client errors to prevent process crashes on socket timeouts or disconnects
  client.on("error", (err) => {
    console.error("ImapFlow Client Error:", err.message || err);
  });

  await client.connect();
  const emails = [];

  try {
    let lock;
    try {
      lock = await client.getMailboxLock("Suivi-Candidatures");
      console.log("📂 Dossier 'Suivi-Candidatures' ouvert avec succès.");
    } catch (folderError) {
      console.log("⚠️ Dossier 'Suivi-Candidatures' introuvable. Lecture depuis 'INBOX'.");
      lock = await client.getMailboxLock("INBOX");
    }

    try {
      const status = client.mailbox;
      const totalMessages = status.exists;
      if (totalMessages > 0) {
        const start = Math.max(1, totalMessages - maxResults + 1);
        const range = `${start}:${totalMessages}`;

        for await (let message of client.fetch(range, { envelope: true, source: true })) {
          const parsed = await simpleParser(message.source);
          emails.push({
            id: message.uid.toString(),
            from: parsed.from?.text || message.envelope.from?.map(f => `${f.name} <${f.address}>`).join(", ") || "Inconnu",
            to: parsed.to?.text || "Moi",
            subject: parsed.subject || "Sans objet",
            date: parsed.date ? parsed.date.toUTCString() : message.envelope.date ? message.envelope.date.toUTCString() : new Date().toUTCString(),
            snippet: parsed.text ? parsed.text.substring(0, 150).replace(/\r?\n/g, " ") + "..." : "Pas d'aperçu",
            body: parsed.text || parsed.html || "Aucun contenu"
          });
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  return emails.reverse();
}
