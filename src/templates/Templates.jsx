import React from "react";

// Helper to escape HTML characters
export function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ── PHOTO OR AVATAR HELPER ──
const ProfilePhoto = ({ photoUrl, initials, size = 90 }) => {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt="Profil"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(168, 85, 247, 0.4)",
          display: "block",
          margin: "0 auto 10px auto"
        }}
      />
    );
  }
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #a855f7, #06b6d4)",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: `${Math.round(size * 0.3)}px`,
      fontWeight: "700",
      margin: "0 auto 10px auto",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      {initials || "CV"}
    </div>
  );
};

// ── EXISTING CV TEMPLATES (MIGRATED & ENHANCED) ──

export const CorporateTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();

  const renderCorporateTags = (str) => {
    if (!str) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
        {str.split(",").map((s, idx) => (
          <span key={idx} style={{
            background: "rgba(30, 41, 59, 0.05)",
            color: "#1e293b",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "9.5px",
            fontWeight: "600",
            border: "1px solid rgba(30, 41, 59, 0.12)"
          }}>
            {s.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: "'Sora', sans-serif",
      color: "#1E293B",
      background: "#FFFFFF",
      minHeight: "297mm",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      textAlign: "left"
    }}>
      {/* Premium Dark Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#FFFFFF",
        padding: "30px 40px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        borderBottom: "4px solid #c2a688"
      }}>
        <ProfilePhoto photoUrl={photoUrl} initials={initials} size={80} />
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
            {infos.prenom} {infos.nom}
          </h1>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#c2a688", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {cv.titre || infos.titre}
          </div>
        </div>
      </div>

      {/* Main Page Columns */}
      <div style={{ display: "flex", flex: "1" }}>
        {/* Left Side: Content */}
        <div style={{ width: "65%", padding: "30px 30px 30px 40px", boxSizing: "border-box" }}>
          {cv.profil && (
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#1e293b",
                borderLeft: "3px solid #c2a688",
                paddingLeft: "8px",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Profil Professionnel
              </h2>
              <p style={{ color: "#475569", fontSize: "11px", textAlign: "justify", lineHeight: "1.6", margin: 0 }}>
                {cv.profil}
              </p>
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <h2 style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#1e293b",
              borderLeft: "3px solid #c2a688",
              paddingLeft: "8px",
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Expériences Professionnelles
            </h2>
            {(cv.experiences || []).map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "16px", position: "relative", paddingLeft: "12px", borderLeft: "1px solid #e2e8f0" }}>
                <div style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#c2a688",
                  position: "absolute",
                  left: "-4px",
                  top: "4px"
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#1e293b", fontSize: "11px" }}>
                  <span>{exp.poste}</span>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>{exp.dates}</span>
                </div>
                <div style={{ display: "inline-block", color: "#1e293b", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontWeight: "600", fontSize: "10px", marginTop: "2px", marginBottom: "6px" }}>
                  🏢 {exp.entreprise} {exp.lieu ? `— ${exp.lieu}` : ""}
                </div>
                {exp.details && <p style={{ color: "#475569", fontSize: "10.5px", margin: "0 0 6px 0", textAlign: "justify", lineHeight: "1.5" }}>{exp.details}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: "14px", margin: "0", color: "#334155", fontSize: "10.5px" }}>
                    {exp.bullets.map((b, bIdx) => <li key={bIdx} style={{ marginBottom: "2px" }}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#1e293b",
              borderLeft: "3px solid #c2a688",
              paddingLeft: "8px",
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Formation & Cursus
            </h2>
            {(cv.formations || []).map((f, idx) => (
              <div key={idx} style={{ marginBottom: "12px", position: "relative", paddingLeft: "12px", borderLeft: "1px solid #e2e8f0" }}>
                <div style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#c2a688",
                  position: "absolute",
                  left: "-4px",
                  top: "4px"
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#1e293b", fontSize: "11px" }}>
                  <span>{f.diplome}</span>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>{f.dates}</span>
                </div>
                <div style={{ color: "#475569", fontWeight: "600", fontSize: "10.5px", marginTop: "2px" }}>
                  🎓 {f.ecole} {f.lieu ? `— ${f.lieu}` : ""}
                </div>
                {f.details && <p style={{ color: "#64748b", fontSize: "10px", marginTop: "2px", margin: 0 }}>{f.details}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div style={{
          width: "35%",
          background: "#F8FAFC",
          borderLeft: "1px solid #E2E8F0",
          padding: "30px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: "800", color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Contact
            </h2>
            <div style={{ fontSize: "10.5px", color: "#334155", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px" }}>✉️</span> <span>{identite.email || infos.email}</span>
              </div>
              {(identite.telephone || infos.tel) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px" }}>📞</span> <span>{identite.telephone || infos.tel}</span>
                </div>
              )}
              {(identite.ville || infos.ville) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px" }}>📍</span> <span>{identite.ville || infos.ville}</span>
                </div>
              )}
              {identite.linkedin && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", wordBreak: "break-all" }}>
                  <span style={{ fontSize: "12px" }}>🔗</span> <span>{identite.linkedin.replace("https://www.", "")}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "11px", fontWeight: "800", color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Compétences
            </h2>
            {cv.competences?.finance && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "700", fontSize: "9px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Expertises</div>
                {renderCorporateTags(cv.competences.finance)}
              </div>
            )}
            {cv.competences?.outils && (
              <div>
                <div style={{ fontWeight: "700", fontSize: "9px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Outils & Systèmes</div>
                {renderCorporateTags(cv.competences.outils)}
              </div>
            )}
          </div>

          {cv.competences?.langues && (
            <div>
              <h2 style={{ fontSize: "11px", fontWeight: "800", color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Langues
              </h2>
              {renderCorporateTags(cv.competences.langues)}
            </div>
          )}

          {cv.competences?.interets && (
            <div>
              <h2 style={{ fontSize: "11px", fontWeight: "800", color: "#1e293b", borderBottom: "2px solid #1e293b", paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Centres d'intérêt
              </h2>
              <div style={{ fontSize: "10.5px", color: "#475569" }}>
                {cv.competences.interets}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MinimalistTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};

  const renderMinimalistTags = (str) => {
    if (!str) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
        {str.split(",").map((s, idx) => (
          <span key={idx} style={{
            background: "#F2EFE9",
            color: "#57534E",
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "9.5px",
            fontWeight: "500",
            border: "1px solid #E7E3D4",
            fontFamily: "'Sora', sans-serif"
          }}>
            {s.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: "'Lora', 'Georgia', serif",
      color: "#1C1917",
      background: "#FCFAF6",
      padding: "40px",
      minHeight: "297mm",
      boxSizing: "border-box",
      textAlign: "center",
      fontSize: "12px",
      lineHeight: "1.6"
    }}>
      {/* Header section */}
      <div style={{ marginBottom: "22px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "400", color: "#1C1917", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>
          {infos.prenom} {infos.nom}
        </h1>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#C5A880", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px", fontFamily: "'Sora', sans-serif" }}>
          {cv.titre || infos.titre}
        </div>
        <div style={{ fontSize: "10px", color: "#78716C", fontFamily: "'Sora', sans-serif", display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <span>✉️ {identite.email || infos.email}</span>
          {(identite.telephone || infos.tel) && <span>• 📞 {identite.telephone || infos.tel}</span>}
          {(identite.ville || infos.ville) && <span>• 📍 {identite.ville || infos.ville}</span>}
          {identite.linkedin && <span>• 🔗 {identite.linkedin.replace("https://www.", "")}</span>}
        </div>
      </div>

      <div style={{ borderTop: "1.5px solid #C5A880", margin: "18px 0" }} />

      <div style={{ textAlign: "left", fontFamily: "'Lora', serif" }}>
        {cv.profil && (
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "10.5px", fontWeight: "700", color: "#1C1917", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", fontFamily: "'Sora', sans-serif" }}>
              Profil
            </h2>
            <p style={{ color: "#44403C", fontSize: "11px", textAlign: "justify", lineHeight: "1.6", margin: 0 }}>{cv.profil}</p>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "10.5px", fontWeight: "700", color: "#1C1917", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "'Sora', sans-serif" }}>
            Parcours Professionnel
          </h2>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#1C1917", fontSize: "11.5px" }}>
                <span>{exp.poste} — <span style={{ fontWeight: "500", color: "#C5A880", fontStyle: "italic" }}>{exp.entreprise}</span></span>
                <span style={{ color: "#78716C", fontWeight: "500", fontSize: "10.5px", fontFamily: "'Sora', sans-serif" }}>{exp.dates}</span>
              </div>
              {exp.lieu && <div style={{ fontSize: "9.5px", color: "#A8A29E", fontStyle: "italic", marginBottom: "4px" }}>{exp.lieu}</div>}
              {exp.details && <p style={{ color: "#44403C", fontSize: "10.5px", margin: "0 0 4px 0", textAlign: "justify", lineHeight: "1.5" }}>{exp.details}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "15px", margin: "0", color: "#57534E", fontSize: "10.5px" }}>
                  {exp.bullets.map((b, bIdx) => <li key={bIdx} style={{ marginBottom: "2px" }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "10.5px", fontWeight: "700", color: "#1C1917", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "'Sora', sans-serif" }}>
            Formation
          </h2>
          {(cv.formations || []).map((f, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#1C1917", fontSize: "11.5px" }}>
                <span>{f.diplome} — <span style={{ fontWeight: "500", color: "#C5A880", fontStyle: "italic" }}>{f.ecole}</span></span>
                <span style={{ color: "#78716C", fontWeight: "500", fontFamily: "'Sora', sans-serif" }}>{f.dates}</span>
              </div>
              {f.details && <p style={{ color: "#78716C", fontSize: "10px", marginTop: "2px", margin: 0 }}>{f.details}</p>}
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: "10.5px", fontWeight: "700", color: "#1C1917", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "'Sora', sans-serif" }}>
            Compétences & Informations
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "11px", color: "#44403C" }}>
            <div>
              {cv.competences?.finance && (
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ display: "block", fontSize: "10px", color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Spécialités :</strong>
                  {renderMinimalistTags(cv.competences.finance)}
                </div>
              )}
              {cv.competences?.outils && (
                <div>
                  <strong style={{ display: "block", fontSize: "10px", color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Outils :</strong>
                  {renderMinimalistTags(cv.competences.outils)}
                </div>
              )}
            </div>
            <div>
              {cv.competences?.langues && (
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ display: "block", fontSize: "10px", color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Langues :</strong>
                  {renderMinimalistTags(cv.competences.langues)}
                </div>
              )}
              {cv.competences?.interets && (
                <div>
                  <strong style={{ display: "block", fontSize: "10px", color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Intérêts :</strong>
                  <div style={{ fontSize: "10.5px", color: "#57534E", marginTop: "4px" }}>{cv.competences.interets}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CreativeTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();

  const renderCreativeTags = (str) => {
    if (!str) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "5px" }}>
        {str.split(",").map((s, idx) => (
          <span key={idx} style={{
            background: "#ffffff",
            color: "#6b5e54",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "9px",
            fontWeight: "600",
            border: "1px solid #e3d5ca"
          }}>
            {s.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: "'Sora', sans-serif",
      color: "#4a443f",
      background: "#FFFFFF",
      minHeight: "297mm",
      display: "flex",
      boxSizing: "border-box",
      textAlign: "left"
    }}>
      {/* Sidebar - Warm Beige */}
      <div style={{
        width: "230px",
        background: "#f5ebe0",
        borderRight: "1px solid #e3d5ca",
        padding: "32px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        flexShrink: "0",
        textAlign: "center"
      }}>
        <div>
          <ProfilePhoto photoUrl={photoUrl} initials={initials} size={90} />
          <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#4a443f", lineHeight: "1.2", marginTop: "12px" }}>
            {infos.prenom} {infos.nom}
          </h1>
          <div style={{ fontSize: "11px", fontWeight: "600", color: "#b58463", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {cv.titre || infos.titre}
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: "10px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", borderBottom: "2px solid #b58463", paddingBottom: "3px" }}>
            Contact
          </h3>
          <div style={{ fontSize: "10px", color: "#6b5e54", display: "flex", flexDirection: "column", gap: "8px", wordBreak: "break-all" }}>
            <div>✉️ {identite.email || infos.email}</div>
            {(identite.telephone || infos.tel) && <div>📞 {identite.telephone || infos.tel}</div>}
            {(identite.ville || infos.ville) && <div>📍 {identite.ville || infos.ville}</div>}
            {identite.linkedin && <div>🔗 {identite.linkedin.replace("https://www.", "")}</div>}
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: "10px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", borderBottom: "2px solid #b58463", paddingBottom: "3px" }}>
            Compétences
          </h3>
          {cv.competences?.finance && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: "700", fontSize: "9px", color: "#b58463", textTransform: "uppercase", marginBottom: "2px" }}>Expertises</div>
              {renderCreativeTags(cv.competences.finance)}
            </div>
          )}
          {cv.competences?.outils && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "9px", color: "#b58463", textTransform: "uppercase", marginBottom: "2px" }}>Outils & Systèmes</div>
              {renderCreativeTags(cv.competences.outils)}
            </div>
          )}
        </div>

        {cv.competences?.langues && (
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "10px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", borderBottom: "2px solid #b58463", paddingBottom: "3px" }}>
              Langues
            </h3>
            {renderCreativeTags(cv.competences.langues)}
          </div>
        )}

        {cv.competences?.interets && (
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "10px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", borderBottom: "2px solid #b58463", paddingBottom: "3px" }}>
              Intérêts
            </h3>
            <div style={{ fontSize: "10px", color: "#6b5e54" }}>{cv.competences.interets}</div>
          </div>
        )}
      </div>

      {/* Main content - White */}
      <div style={{ flex: "1", padding: "32px 36px" }}>
        {cv.profil && (
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", borderLeft: "4px solid #b58463", paddingLeft: "8px" }}>
              À propos de moi
            </h2>
            <p style={{ color: "#6b5e54", fontSize: "11.5px", textAlign: "justify", lineHeight: "1.6", margin: 0 }}>{cv.profil}</p>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", borderLeft: "4px solid #b58463", paddingLeft: "8px" }}>
            Expériences Professionnelles
          </h2>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#4a443f", fontSize: "11.5px" }}>
                <span>{exp.poste}</span>
                <span style={{ color: "#b58463", fontSize: "10.5px", fontWeight: "700" }}>{exp.dates}</span>
              </div>
              <div style={{ color: "#8e857e", fontWeight: "600", fontSize: "10.5px", marginBottom: "4px" }}>
                🏢 {exp.entreprise} {exp.lieu ? `— ${exp.lieu}` : ""}
              </div>
              {exp.details && <p style={{ color: "#6b5e54", fontSize: "10.5px", margin: "0 0 4px 0", lineHeight: "1.5" }}>{exp.details}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "15px", margin: "0", color: "#6b5e54", fontSize: "10.5px" }}>
                  {exp.bullets.map((b, bIdx) => <li key={bIdx} style={{ marginBottom: "2px" }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: "12px", fontWeight: "800", color: "#4a443f", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", borderLeft: "4px solid #b58463", paddingLeft: "8px" }}>
            Formation & Études
          </h2>
          {(cv.formations || []).map((f, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#4a443f", fontSize: "11.5px" }}>
                <span>{f.diplome}</span>
                <span style={{ color: "#b58463", fontSize: "10.5px", fontWeight: "700" }}>{f.dates}</span>
              </div>
              <div style={{ color: "#8e857e", fontWeight: "600", fontSize: "10.5px", marginTop: "2px" }}>
                🎓 {f.ecole} {f.lieu ? `— ${f.lieu}` : ""}
              </div>
              {f.details && <p style={{ color: "#8e857e", fontSize: "10.5px", marginTop: "2px", margin: 0 }}>{f.details}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TechTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};

  const renderTechTags = (str, accentColor = "#34d399", bgColor = "rgba(52, 211, 153, 0.1)") => {
    if (!str) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
        {str.split(",").map((s, idx) => (
          <span key={idx} style={{
            background: bgColor,
            color: accentColor,
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "9px",
            fontWeight: "600",
            border: `1px solid ${accentColor}`,
            fontFamily: "'DM Mono', monospace"
          }}>
            {s.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: "'DM Mono', monospace",
      color: "#f1f5f9",
      background: "#0f172a",
      padding: "36px",
      minHeight: "297mm",
      boxSizing: "border-box",
      textAlign: "left",
      fontSize: "11px",
      lineHeight: "1.6"
    }}>
      {/* macOS Terminal window header */}
      <div style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px 8px 0 0",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #34d399"
      }}>
        {/* Decorative Window Controls */}
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
        </div>
        <div style={{ fontSize: "9.5px", color: "#64748b" }}>bash - profile.sh - {infos.prenom.toLowerCase()}</div>
        <div style={{ width: "38px" }} />
      </div>

      {/* Terminal Content Box */}
      <div style={{
        background: "#0b0f19",
        border: "1px solid #1e293b",
        borderTop: "none",
        borderRadius: "0 0 8px 8px",
        padding: "24px",
        boxSizing: "border-box"
      }}>
        {/* Name and Job Title */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ color: "#34d399", fontSize: "12px" }}>$ whoami</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", margin: "4px 0", fontFamily: "'DM Mono', monospace" }}>
            {infos.prenom} {infos.nom}<span style={{ color: "#34d399", animation: "pulse 1s infinite" }}>_</span>
          </h1>
          <div style={{ fontSize: "12px", color: "#22d3ee" }}>
            &gt; {cv.titre || infos.titre}
          </div>
        </div>

        {/* Contact info grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 24px",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "10px",
          color: "#94a3b8"
        }}>
          <div><span style={{ color: "#22d3ee" }}>email:</span> {identite.email || infos.email}</div>
          {(identite.telephone || infos.tel) && <div><span style={{ color: "#22d3ee" }}>phone:</span> {identite.telephone || infos.tel}</div>}
          {(identite.ville || infos.ville) && <div><span style={{ color: "#22d3ee" }}>location:</span> {identite.ville || infos.ville}</div>}
          {identite.linkedin && <div><span style={{ color: "#22d3ee" }}>linkedin:</span> {identite.linkedin.replace("https://www.", "")}</div>}
        </div>

        {/* Profile Summary */}
        {cv.profil && (
          <div style={{ marginBottom: "22px" }}>
            <div style={{ color: "#34d399", fontSize: "11px", marginBottom: "6px" }}>$ cat profile.md</div>
            <p style={{ color: "#cbd5e1", fontSize: "10.5px", margin: 0, textAlign: "justify", lineHeight: "1.6" }}>
              {cv.profil}
            </p>
          </div>
        )}

        {/* Work Experience */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ color: "#34d399", fontSize: "11px", marginBottom: "10px" }}>$ list-experience --all</div>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "14px", borderLeft: "2px solid #22d3ee", paddingLeft: "14px", marginLeft: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#ffffff", fontSize: "11px" }}>
                <span>{exp.poste} <span style={{ color: "#22d3ee" }}>@ {exp.entreprise}</span></span>
                <span style={{ color: "#34d399", fontSize: "10px" }}>[{exp.dates}]</span>
              </div>
              {exp.lieu && <div style={{ fontSize: "9.5px", color: "#64748b", marginTop: "2px" }}>Loc: {exp.lieu}</div>}
              {exp.details && <p style={{ color: "#cbd5e1", fontSize: "10.5px", margin: "4px 0", textAlign: "justify" }}>{exp.details}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "14px", margin: "4px 0 0 0", color: "#94a3b8", fontSize: "10.5px", listStyleType: "square" }}>
                  {exp.bullets.map((b, bIdx) => <li key={bIdx} style={{ marginBottom: "2px" }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ color: "#34d399", fontSize: "11px", marginBottom: "10px" }}>$ show-education</div>
          {(cv.formations || []).map((f, idx) => (
            <div key={idx} style={{ marginBottom: "10px", borderLeft: "2px solid #22d3ee", paddingLeft: "14px", marginLeft: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#ffffff", fontSize: "11px" }}>
                <span>{f.diplome} <span style={{ color: "#94a3b8" }}>- {f.ecole}</span></span>
                <span style={{ color: "#34d399", fontSize: "10px" }}>[{f.dates}]</span>
              </div>
              {f.details && <p style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px", margin: 0 }}>{f.details}</p>}
            </div>
          ))}
        </div>

        {/* Skills grid */}
        <div>
          <div style={{ color: "#34d399", fontSize: "11px", marginBottom: "8px" }}>$ load-skills.sh</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              {cv.competences?.finance && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ color: "#22d3ee", fontSize: "9.5px", marginBottom: "4px" }}># expertises</div>
                  {renderTechTags(cv.competences.finance, "#34d399", "rgba(52, 211, 153, 0.1)")}
                </div>
              )}
              {cv.competences?.outils && (
                <div>
                  <div style={{ color: "#22d3ee", fontSize: "9.5px", marginBottom: "4px" }}># outils</div>
                  {renderTechTags(cv.competences.outils, "#a855f7", "rgba(168, 85, 247, 0.1)")}
                </div>
              )}
            </div>
            <div>
              {cv.competences?.langues && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ color: "#22d3ee", fontSize: "9.5px", marginBottom: "4px" }}># langues</div>
                  {renderTechTags(cv.competences.langues, "#38bdf8", "rgba(56, 189, 248, 0.1)")}
                </div>
              )}
              {cv.competences?.interets && (
                <div>
                  <div style={{ color: "#22d3ee", fontSize: "9.5px", marginBottom: "4px" }}># interets</div>
                  <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "4px" }}>{cv.competences.interets}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── NEW PREMIER/PHOTO CV TEMPLATES (5 to 15) ──

export const ModernPhotoTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#334155", background: "#FFFFFF", display: "flex", minHeight: "297mm", textAlign: "left" }}>
      {/* Sidebar */}
      <div style={{ width: "230px", background: "#f8fafc", padding: "30px 20px", borderRight: "1px solid #e2e8fb", flexShrink: 0, textAlign: "center" }}>
        <ProfilePhoto photoUrl={photoUrl} initials={initials} size={110} />
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginTop: "12px" }}>{infos.prenom} {infos.nom}</h2>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#8b5cf6", marginTop: "4px", textTransform: "uppercase" }}>{cv.titre || infos.titre}</div>
        
        <div style={{ marginTop: "30px", textAlign: "left" }}>
          <h3 style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", borderBottom: "2px solid #8b5cf6", paddingBottom: "4px", marginBottom: "10px" }}>Contact</h3>
          <div style={{ fontSize: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div>✉️ {identite.email || infos.email}</div>
            {(identite.telephone || infos.tel) && <div>📞 {identite.telephone || infos.tel}</div>}
            {(identite.ville || infos.ville) && <div>📍 {identite.ville || infos.ville}</div>}
            {identite.linkedin && <div style={{ wordBreak: "break-all" }}>🔗 {identite.linkedin.replace("https://www.", "")}</div>}
          </div>
        </div>

        <div style={{ marginTop: "25px", textAlign: "left" }}>
          <h3 style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", borderBottom: "2px solid #8b5cf6", paddingBottom: "4px", marginBottom: "10px" }}>Langues</h3>
          <div style={{ fontSize: "10px" }}>{cv.competences?.langues || "Non spécifié"}</div>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, padding: "35px 30px" }}>
        {cv.profil && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase" }}>Profil</h3>
            <p style={{ fontSize: "11px", lineHeight: "1.6", textAlign: "justify" }}>{cv.profil}</p>
          </div>
        )}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "12px", textTransform: "uppercase" }}>Expériences</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px", color: "#0f172a" }}>
                <span>{exp.poste}</span>
                <span style={{ color: "#8b5cf6", fontWeight: "600", fontSize: "10.5px" }}>{exp.dates}</span>
              </div>
              <div style={{ fontWeight: "600", color: "#64748b", fontSize: "10.5px", marginBottom: "4px" }}>{exp.entreprise} {exp.lieu ? `| ${exp.lieu}` : ""}</div>
              {exp.details && <p style={{ fontSize: "10.5px", color: "#475569" }}>{exp.details}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "15px", margin: "0", fontSize: "10.5px" }}>
                  {exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "12px", textTransform: "uppercase" }}>Formations</h3>
          {(cv.formations || []).map((f, idx) => (
            <div key={idx} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px", color: "#0f172a" }}>
                <span>{f.diplome}</span>
                <span style={{ color: "#64748b", fontSize: "10.5px" }}>{f.dates}</span>
              </div>
              <div style={{ color: "#64748b", fontSize: "10.5px" }}>{f.ecole} {f.lieu ? `| ${f.lieu}` : ""}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ExecutiveTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};
  return (
    <div style={{ fontFamily: "'Lora', serif", color: "#1e293b", background: "#FFFFFF", padding: "35px", minHeight: "297mm", boxSizing: "border-box", textAlign: "center", fontSize: "12px", lineHeight: "1.6" }}>
      <div style={{ border: "1px solid #d97706", padding: "20px", marginBottom: "25px" }}>
        <h1 style={{ fontSize: "25px", fontWeight: "500", color: "#b45309", letterSpacing: "1px", textTransform: "uppercase" }}>{infos.prenom} {infos.nom}</h1>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#475569", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "4px" }}>{cv.titre || infos.titre}</div>
        <div style={{ fontSize: "10px", color: "#64748b", marginTop: "10px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", borderTop: "1px solid #f59e0b", paddingTop: "8px" }}>
          <span>📧 {identite.email || infos.email}</span>
          {(identite.telephone || infos.tel) && <span>📞 {identite.telephone || infos.tel}</span>}
          {(identite.ville || infos.ville) && <span>📍 {identite.ville || infos.ville}</span>}
          {identite.linkedin && <span>🔗 {identite.linkedin.replace("https://www.", "")}</span>}
        </div>
      </div>
      <div style={{ textAlign: "left" }}>
        {cv.profil && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#b45309", textTransform: "uppercase", borderBottom: "1px solid #f59e0b", paddingBottom: "3px", marginBottom: "6px" }}>Résumé Exécutif</h3>
            <p style={{ fontSize: "11px", textAlign: "justify" }}>{cv.profil}</p>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#b45309", textTransform: "uppercase", borderBottom: "1px solid #f59e0b", paddingBottom: "3px", marginBottom: "10px" }}>Parcours Professionnel</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px", color: "#0f172a" }}>
                <span>{exp.poste} — <span style={{ color: "#475569", fontStyle: "italic" }}>{exp.entreprise}</span></span>
                <span style={{ color: "#b45309", fontSize: "10.5px" }}>{exp.dates}</span>
              </div>
              {exp.details && <p style={{ fontSize: "10.5px", color: "#334155" }}>{exp.details}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "15px", margin: "0", fontSize: "10.5px", color: "#334155" }}>
                  {exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#b45309", textTransform: "uppercase", borderBottom: "1px solid #f59e0b", paddingBottom: "3px", marginBottom: "10px" }}>Diplômes & Formations</h3>
          {(cv.formations || []).map((f, idx) => (
            <div key={idx} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px" }}>
                <span>{f.diplome} — <span style={{ fontStyle: "italic", color: "#475569" }}>{f.ecole}</span></span>
                <span style={{ color: "#b45309" }}>{f.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ElegantSerifTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};
  return (
    <div style={{ fontFamily: "'Lora', serif", color: "#2d3748", background: "#FFFFFF", padding: "40px", minHeight: "297mm", boxSizing: "border-box", textAlign: "left", fontSize: "12px", lineHeight: "1.6" }}>
      <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "400", color: "#1a202c", margin: 0 }}>{infos.prenom} {infos.nom}</h1>
        <div style={{ fontSize: "13px", color: "#718096", fontStyle: "italic", marginTop: "4px" }}>{cv.titre || infos.titre}</div>
        <div style={{ fontSize: "10px", color: "#718096", marginTop: "10px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <span>📧 {identite.email || infos.email}</span>
          {(identite.telephone || infos.tel) && <span>📞 {identite.telephone || infos.tel}</span>}
          {(identite.ville || infos.ville) && <span>📍 {identite.ville || infos.ville}</span>}
        </div>
      </div>
      <div>
        {cv.profil && (
          <div style={{ marginBottom: "22px" }}>
            <p style={{ fontStyle: "italic", fontSize: "11.5px", color: "#4a5568", textAlign: "justify" }}>{cv.profil}</p>
          </div>
        )}
        <div style={{ marginBottom: "22px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#1a202c", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>Expériences</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px" }}>
                <span>{exp.poste} · <span style={{ fontWeight: "400", color: "#4a5568" }}>{exp.entreprise}</span></span>
                <span style={{ color: "#718096", fontSize: "10.5px" }}>{exp.dates}</span>
              </div>
              {exp.details && <p style={{ fontSize: "10.5px", color: "#4a5568", margin: "4px 0" }}>{exp.details}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "15px", margin: "0", fontSize: "10.5px", color: "#4a5568" }}>
                  {exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#1a202c", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>Formations</h3>
          {(cv.formations || []).map((f, idx) => (
            <div key={idx} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px" }}>
                <span>{f.diplome} — <span style={{ fontWeight: "400", color: "#4a5568" }}>{f.ecole}</span></span>
                <span style={{ color: "#718096" }}>{f.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StartupBoldTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#1e293b", background: "#FFFFFF", minHeight: "297mm", display: "flex", flexDirection: "column", textAlign: "left" }}>
      {/* Header Banner */}
      <div style={{ background: "#0f172a", color: "#ffffff", padding: "30px", display: "flex", gap: "25px", alignItems: "center" }}>
        <ProfilePhoto photoUrl={photoUrl} initials={initials} size={80} />
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#06b6d4" }}>{infos.prenom} {infos.nom}</h1>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#94a3b8", marginTop: "4px" }}>{cv.titre || infos.titre}</div>
          <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "10px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <span>📧 {identite.email || infos.email}</span>
            {(identite.telephone || infos.tel) && <span>📞 {identite.telephone || infos.tel}</span>}
            {(identite.ville || infos.ville) && <span>📍 {identite.ville || infos.ville}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: "30px", display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          {cv.profil && (
            <div style={{ marginBottom: "22px" }}>
              <h2 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #06b6d4", paddingBottom: "3px", marginBottom: "8px", textTransform: "uppercase" }}>À propos</h2>
              <p style={{ fontSize: "11px", lineHeight: "1.6" }}>{cv.profil}</p>
            </div>
          )}
          <div style={{ marginBottom: "22px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #06b6d4", paddingBottom: "3px", marginBottom: "10px", textTransform: "uppercase" }}>Expériences</h2>
            {(cv.experiences || []).map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11.5px" }}>
                  <span>{exp.poste} <span style={{ color: "#06b6d4" }}>@ {exp.entreprise}</span></span>
                  <span style={{ color: "#64748b", fontSize: "10.5px" }}>{exp.dates}</span>
                </div>
                {exp.details && <p style={{ fontSize: "10.5px", color: "#475569" }}>{exp.details}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: "15px", margin: "0", fontSize: "10.5px" }}>
                    {exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: "200px", flexShrink: 0 }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: "3px", marginBottom: "8px", textTransform: "uppercase" }}>Expertise</h2>
            <div style={{ fontSize: "10.5px", color: "#475569" }}>{cv.competences?.finance}</div>
          </div>
          <div>
            <h2 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: "3px", marginBottom: "8px", textTransform: "uppercase" }}>Formations</h2>
            {(cv.formations || []).map((f, idx) => (
              <div key={idx} style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: "700", fontSize: "11px" }}>{f.diplome}</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>{f.ecole}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AcademicTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};
  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", color: "#000000", background: "#FFFFFF", padding: "45px", minHeight: "297mm", boxSizing: "border-box", textAlign: "left", fontSize: "12px", lineHeight: "1.6" }}>
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{infos.prenom} {infos.nom}</h1>
        <div style={{ fontSize: "11px", color: "#000000", marginTop: "6px" }}>
          {identite.ville || infos.ville} · {identite.email || infos.email} · {identite.telephone || infos.tel}
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #000000", margin: "15px 0" }} />
      {cv.profil && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>Profil / Résumé d'Intérêt</h2>
          <p style={{ textAlign: "justify" }}>{cv.profil}</p>
        </div>
      )}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "10px" }}>Expérience Professionnelle</h2>
        {(cv.experiences || []).map((exp, idx) => (
          <div key={idx} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>{exp.poste}, {exp.entreprise}</span>
              <span>{exp.dates}</span>
            </div>
            {exp.details && <p style={{ fontSize: "11px", margin: "2px 0" }}>{exp.details}</p>}
            {exp.bullets && exp.bullets.length > 0 && (
              <ul style={{ paddingLeft: "18px", margin: "0", fontSize: "11px" }}>
                {exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "10px" }}>Cursus Académique</h2>
        {(cv.formations || []).map((f, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>{f.diplome}, {f.ecole}</span>
              <span>{f.dates}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChicPastelTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#4a5568", background: "#FFFFFF", minHeight: "297mm", display: "flex", textAlign: "left" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#faf5ff", padding: "30px 20px", borderRight: "1px solid #f3e8ff", flexShrink: 0, textAlign: "center" }}>
        <ProfilePhoto photoUrl={photoUrl} initials={initials} size={90} />
        <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#6b21a8", marginTop: "12px" }}>{infos.prenom} {infos.nom}</h2>
        <div style={{ fontSize: "10.5px", fontWeight: "600", color: "#d8b4fe", marginTop: "3px", textTransform: "uppercase" }}>{cv.titre || infos.titre}</div>
        
        <div style={{ marginTop: "25px", textAlign: "left" }}>
          <h3 style={{ fontSize: "10px", fontWeight: "700", color: "#6b21a8", textTransform: "uppercase", borderBottom: "2px solid #e9d5ff", paddingBottom: "3px", marginBottom: "8px" }}>Contact</h3>
          <div style={{ fontSize: "9.5px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div>📧 {identite.email || infos.email}</div>
            {(identite.telephone || infos.tel) && <div>📞 {identite.telephone || infos.tel}</div>}
            {(identite.ville || infos.ville) && <div>📍 {identite.ville || infos.ville}</div>}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {cv.profil && (
          <div style={{ marginBottom: "22px" }}>
            <h3 style={{ fontSize: "11.5px", fontWeight: "700", color: "#6b21a8", borderBottom: "1px solid #f3e8ff", paddingBottom: "4px", marginBottom: "8px", textTransform: "uppercase" }}>Profil</h3>
            <p style={{ fontSize: "11px", lineHeight: "1.6" }}>{cv.profil}</p>
          </div>
        )}
        <div style={{ marginBottom: "22px" }}>
          <h3 style={{ fontSize: "11.5px", fontWeight: "700", color: "#6b21a8", borderBottom: "1px solid #f3e8ff", paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase" }}>Expériences</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11px" }}>
                <span style={{ color: "#581c87" }}>{exp.poste}</span>
                <span style={{ color: "#d8b4fe", fontSize: "10px" }}>{exp.dates}</span>
              </div>
              <div style={{ fontWeight: "600", fontSize: "10px", color: "#6b21a8" }}>{exp.entreprise}</div>
              {exp.details && <p style={{ fontSize: "10px", color: "#4a5568", margin: "2px 0" }}>{exp.details}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BoldSidebarTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#334155", background: "#FFFFFF", display: "flex", minHeight: "297mm", textAlign: "left" }}>
      <div style={{ width: "240px", background: "#1e3a8a", color: "#ffffff", padding: "30px 20px", flexShrink: 0, textAlign: "center" }}>
        <ProfilePhoto photoUrl={photoUrl} initials={initials} size={100} />
        <h2 style={{ fontSize: "19px", fontWeight: "700", marginTop: "12px" }}>{infos.prenom} {infos.nom}</h2>
        <div style={{ fontSize: "11px", color: "#93c5fd", marginTop: "4px", textTransform: "uppercase" }}>{cv.titre || infos.titre}</div>
        <div style={{ marginTop: "30px", textAlign: "left", fontSize: "10px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", borderBottom: "1px solid #93c5fd", paddingBottom: "4px", marginBottom: "10px" }}>CONTACT</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div>✉️ {identite.email || infos.email}</div>
            {(identite.telephone || infos.tel) && <div>📞 {identite.telephone || infos.tel}</div>}
            {(identite.ville || infos.ville) && <div>📍 {identite.ville || infos.ville}</div>}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "35px 30px" }}>
        {cv.profil && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#1e3a8a", borderBottom: "2px solid #1e3a8a", paddingBottom: "4px", marginBottom: "10px" }}>PROFIL</h3>
            <p style={{ fontSize: "11px", lineHeight: "1.6" }}>{cv.profil}</p>
          </div>
        )}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#1e3a8a", borderBottom: "2px solid #1e3a8a", paddingBottom: "4px", marginBottom: "12px" }}>EXPÉRIENCES</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11px" }}>
                <span>{exp.poste} @ <span style={{ color: "#1e3a8a" }}>{exp.entreprise}</span></span>
                <span style={{ color: "#64748b" }}>{exp.dates}</span>
              </div>
              {exp.details && <p style={{ fontSize: "10.5px" }}>{exp.details}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CleanCardsTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#1e293b", background: "#f8fafc", padding: "30px", minHeight: "297mm", boxSizing: "border-box", textAlign: "left", fontSize: "11.5px" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700" }}>{infos.prenom} {infos.nom}</h1>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{cv.titre || infos.titre}</div>
        </div>
        <div style={{ fontSize: "10px", color: "#64748b", textAlign: "right" }}>
          <div>📧 {identite.email || infos.email}</div>
          <div>📍 {identite.ville || infos.ville}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
        {cv.profil && (
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ fontSize: "11.5px", fontWeight: "700", marginBottom: "8px", color: "#6366f1" }}>Profil</h3>
            <p>{cv.profil}</p>
          </div>
        )}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ fontSize: "11.5px", fontWeight: "700", marginBottom: "12px", color: "#6366f1" }}>Parcours Professionnel</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: "700" }}>{exp.poste} — <span style={{ fontWeight: "500", color: "#64748b" }}>{exp.entreprise}</span></div>
              <div style={{ fontSize: "10px", color: "#94a3b8" }}>{exp.dates}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HybridProTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#1e293b", background: "#FFFFFF", padding: "35px", minHeight: "297mm", boxSizing: "border-box", textAlign: "left", fontSize: "12px" }}>
      <div style={{ display: "flex", borderBottom: "2px solid #4f46e5", paddingBottom: "14px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700" }}>{infos.prenom} {infos.nom}</h1>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#4f46e5" }}>{cv.titre || infos.titre}</div>
        </div>
        <div style={{ fontSize: "10.5px", color: "#64748b", textAlign: "right" }}>
          <div>📧 {identite.email || infos.email}</div>
          <div>📍 {identite.ville || infos.ville}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "25px" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#4f46e5", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>Expériences</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                <span>{exp.poste}</span>
                <span style={{ color: "#64748b" }}>{exp.dates}</span>
              </div>
              <div style={{ fontWeight: "600", color: "#64748b" }}>{exp.entreprise}</div>
              <p style={{ fontSize: "10.5px" }}>{exp.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const IndigoGlowTemplate = ({ cv, infos }) => {
  const identite = cv.identite || {};
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#1f2937", background: "#FFFFFF", minHeight: "297mm", boxSizing: "border-box", textAlign: "left", fontSize: "11.5px" }}>
      <div style={{ height: "6px", background: "#4f46e5", width: "100%" }} />
      <div style={{ padding: "30px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}>{infos.prenom} {infos.nom}</h1>
        <div style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "600", marginTop: "4px" }}>{cv.titre || infos.titre}</div>
        <div style={{ borderBottom: "1px solid #e5e7eb", margin: "16px 0" }} />
        {cv.profil && <p style={{ fontSize: "10.5px", color: "#4b5563", marginBottom: "20px" }}>{cv.profil}</p>}
        <div>
          <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#4f46e5", marginBottom: "10px" }}>Parcours</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "700" }}>{exp.poste} @ {exp.entreprise}</div>
              <div style={{ fontSize: "10px", color: "#9ca3af" }}>{exp.dates}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SleekPhotoTemplate = ({ cv, infos, photoUrl }) => {
  const identite = cv.identite || {};
  const initials = `${infos.prenom?.[0] || ""}${infos.nom?.[0] || ""}`.toUpperCase();
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#334155", background: "#FFFFFF", display: "flex", minHeight: "297mm", textAlign: "left" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#0f172a", color: "#f8fafc", padding: "30px 20px", flexShrink: 0, textAlign: "center" }}>
        <ProfilePhoto photoUrl={photoUrl} initials={initials} size={100} />
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginTop: "12px" }}>{infos.prenom} {infos.nom}</h2>
        <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px" }}>{cv.titre || infos.titre}</div>
        <div style={{ marginTop: "30px", textAlign: "left" }}>
          <h3 style={{ fontSize: "10px", fontWeight: "700", borderBottom: "1px solid #38bdf8", paddingBottom: "4px", marginBottom: "10px" }}>CONTACT</h3>
          <div style={{ fontSize: "9.5px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div>✉️ {identite.email || infos.email}</div>
            <div>📍 {identite.ville || infos.ville}</div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "35px 30px" }}>
        {cv.profil && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: "4px", marginBottom: "10px" }}>PROFIL</h3>
            <p style={{ fontSize: "11px", lineHeight: "1.6" }}>{cv.profil}</p>
          </div>
        )}
        <div>
          <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: "4px", marginBottom: "12px" }}>EXPÉRIENCES</h3>
          {(cv.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "11px" }}>
                <span>{exp.poste}</span>
                <span style={{ color: "#38bdf8" }}>{exp.dates}</span>
              </div>
              <div style={{ fontWeight: "600", fontSize: "10px" }}>{exp.entreprise}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ── 10 COVER LETTER TEMPLATES ──

export const ClassicSoraTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{
      fontFamily: "'Sora', sans-serif",
      color: "#1e293b",
      background: "#ffffff",
      padding: "40px",
      minHeight: "297mm",
      boxSizing: "border-box",
      textAlign: "left",
      lineHeight: "1.75",
      fontSize: "11.5px"
    }}>
      {/* Top Banner Accent */}
      <div style={{ height: "4px", background: "#1e3a8a", margin: "-40px -40px 30px -40px" }} />

      {/* Grid Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "35px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "16px", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.5px" }}>{senderName}</div>
          <div style={{ color: "#64748b", marginTop: "4px", fontSize: "10.5px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {senderEmail && <span>✉️ {senderEmail}</span>}
            {senderTel && <span>📞 {senderTel}</span>}
            {senderVille && <span>📍 {senderVille}</span>}
          </div>
        </div>
        <div style={{ textAlign: "right", alignSelf: "flex-end" }}>
          {destEntreprise && <div style={{ fontWeight: 700, color: "#1e3a8a", fontSize: "12px" }}>{destEntreprise}</div>}
          {destPoste && <div style={{ color: "#64748b", fontSize: "10.5px", marginTop: "2px" }}>Poste : {destPoste}</div>}
          {destLieu && <div style={{ color: "#64748b", fontSize: "10.5px" }}>{destLieu}</div>}
        </div>
      </div>

      {/* Date */}
      <div style={{ textAlign: "right", color: "#64748b", marginBottom: "25px", fontWeight: "500" }}>
        {senderVille ? `${senderVille}, le ${dateStr}` : dateStr}
      </div>

      {/* Objet */}
      <div style={{ marginBottom: "25px", background: "#f8fafc", padding: "12px 16px", borderRadius: "6px", borderLeft: "4px solid #1e3a8a" }}>
        <span style={{ fontWeight: 800, color: "#1e3a8a", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", display: "block", marginBottom: "2px" }}>Objet</span>
        <span style={{ fontWeight: 700, color: "#334155" }}>{objet}</span>
      </div>

      {/* Body */}
      <div style={{ textAlign: "justify", color: "#334155", whiteSpace: "pre-line" }}>
        {body}
      </div>
    </div>
  );
};

export const CorporateBlueTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{
      fontFamily: "'Sora', sans-serif",
      color: "#1e293b",
      background: "#ffffff",
      minHeight: "297mm",
      boxSizing: "border-box",
      textAlign: "left",
      lineHeight: "1.7",
      fontSize: "11.5px",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Matching Corporate Premium Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#ffffff",
        padding: "30px 40px",
        borderBottom: "4px solid #c2a688"
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{senderName}</h2>
        <div style={{ fontSize: "10.5px", color: "#c2a688", marginTop: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {senderEmail} {senderTel ? `| ${senderTel}` : ""} {senderVille ? `| ${senderVille}` : ""}
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: "35px 40px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ marginBottom: "20px" }}>
            {destEntreprise && <div style={{ fontWeight: 800, color: "#1e293b", fontSize: "12px" }}>{destEntreprise}</div>}
            {destPoste && <div style={{ color: "#64748b", fontSize: "10.5px", marginTop: "2px" }}>{destPoste}</div>}
            {destLieu && <div style={{ color: "#64748b", fontSize: "10.5px" }}>{destLieu}</div>}
          </div>
          <div style={{ color: "#64748b", fontWeight: "500" }}>{senderVille}, le {dateStr}</div>
        </div>

        <div style={{ marginBottom: "25px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
          <span style={{ fontWeight: 800, color: "#1e293b", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px" }}>Objet : </span>
          <span style={{ fontWeight: 700, color: "#1e293b" }}>{objet}</span>
        </div>

        <div style={{ textAlign: "justify", color: "#334155", whiteSpace: "pre-line" }}>
          {body}
        </div>
      </div>
    </div>
  );
};

export const MinimalistThinTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Lora', serif", color: "#111827", background: "#ffffff", padding: "30px", fontSize: "12px", lineHeight: "1.8", textAlign: "left" }}>
      <div style={{ borderBottom: "1px solid #d1d5db", paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "400" }}>{senderName}</h2>
          <div style={{ fontSize: "10.5px", color: "#6b7280" }}>{senderEmail} · {senderTel}</div>
        </div>
        <div style={{ fontSize: "10.5px", color: "#6b7280" }}>{senderVille}, le {dateStr}</div>
      </div>
      <div style={{ marginBottom: "20px", fontStyle: "italic" }}>
        {destEntreprise && <div><strong>{destEntreprise}</strong></div>}
        {destPoste && <div>{destPoste}</div>}
      </div>
      <div style={{ marginBottom: "20px", fontWeight: "700" }}>
        Objet : {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

export const CreativeStripeTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#334155", background: "#ffffff", display: "flex", minHeight: "100%", textAlign: "left" }}>
      <div style={{ width: "8px", background: "#8b5cf6", flexShrink: 0 }} />
      <div style={{ padding: "25px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#8b5cf6" }}>{senderName}</h2>
            <div style={{ fontSize: "10px", color: "#64748b" }}>{senderEmail} | {senderTel}</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "10px", color: "#64748b" }}>
            <div>{destEntreprise}</div>
            <div>{dateStr}</div>
          </div>
        </div>
        <div style={{ marginBottom: "20px", fontWeight: "700", color: "#8b5cf6" }}>
          Objet : {objet}
        </div>
        <div style={{ textAlign: "justify" }}>
          {body}
        </div>
      </div>
    </div>
  );
};

export const TechMonoTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", color: "#0f172a", background: "#ffffff", padding: "25px", fontSize: "11px", lineHeight: "1.7", textAlign: "left" }}>
      <div style={{ border: "1px solid #0f172a", padding: "15px", marginBottom: "20px" }}>
        <div>&gt; SENDER: {senderName}</div>
        <div>&gt; EMAIL: {senderEmail}</div>
        {senderTel && <div>&gt; PHONE: {senderTel}</div>}
      </div>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <div>[dest] {destEntreprise || "N/A"}</div>
        <div>[date] {dateStr}</div>
      </div>
      <div style={{ marginBottom: "20px", fontWeight: "bold" }}>
        # SUBJECT: {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

export const ExecutiveGoldTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Lora', serif", color: "#1e293b", background: "#ffffff", padding: "30px", fontSize: "12px", lineHeight: "1.8", border: "1px solid #d97706", textAlign: "left" }}>
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2 style={{ fontSize: "20px", color: "#b45309", textTransform: "uppercase", letterSpacing: "1px" }}>{senderName}</h2>
        <div style={{ fontSize: "10.5px", color: "#64748b" }}>{senderEmail} · {senderTel} · {senderVille}</div>
        <div style={{ width: "80px", height: "1px", background: "#d97706", margin: "10px auto 0 auto" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          {destEntreprise && <div><strong>{destEntreprise}</strong></div>}
          {destPoste && <div style={{ color: "#64748b" }}>{destPoste}</div>}
        </div>
        <div style={{ color: "#64748b" }}>{senderVille}, le {dateStr}</div>
      </div>
      <div style={{ marginBottom: "20px", fontWeight: "700", color: "#b45309" }}>
        Objet : {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

export const ElegantSerifTemplateLetter = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Lora', serif", color: "#2d3748", background: "#ffffff", padding: "35px", fontSize: "12px", lineHeight: "1.75", textAlign: "left" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "normal", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "8px" }}>{senderName}</h2>
        <div style={{ fontSize: "10.5px", color: "#718096" }}>{senderEmail} | {senderTel} | {senderVille}</div>
      </div>
      <div style={{ textAlign: "right", marginBottom: "25px" }}>
        <strong>{destEntreprise}</strong>
        <div>{senderVille}, le {dateStr}</div>
      </div>
      <div style={{ marginBottom: "20px", fontWeight: "bold" }}>
        Objet : {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

export const ModernCompactTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#1e293b", background: "#ffffff", padding: "20px", fontSize: "11px", lineHeight: "1.6", textAlign: "left" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>{senderName}</h2>
        <div style={{ fontSize: "10px", color: "#64748b" }}>{senderEmail} · {senderTel} · {senderVille}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "10.5px", color: "#64748b" }}>
        <div>{destEntreprise}</div>
        <div>{dateStr}</div>
      </div>
      <div style={{ marginBottom: "15px", fontWeight: "700" }}>
        Objet : {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

export const StartupCleanTemplate = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#0f172a", background: "#ffffff", padding: "25px", fontSize: "11.5px", lineHeight: "1.7", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #06b6d4", paddingBottom: "12px", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{senderName}</h2>
          <div style={{ fontSize: "10px", color: "#06b6d4" }}>{senderEmail}</div>
        </div>
        <div style={{ fontSize: "10px", color: "#64748b", textAlign: "right" }}>
          <div>{destEntreprise}</div>
          <div>{dateStr}</div>
        </div>
      </div>
      <div style={{ marginBottom: "20px", fontWeight: "700", color: "#06b6d4" }}>
        Objet : {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

export const ChicPastelTemplateLetter = ({ body, senderName, senderEmail, senderTel, senderVille, destEntreprise, destPoste, destLieu, objet, dateStr }) => {
  return (
    <div style={{ fontFamily: "'Sora', sans-serif", color: "#4a5568", background: "#ffffff", padding: "25px", fontSize: "11.5px", lineHeight: "1.75", borderRadius: "8px", border: "1px solid #f3e8ff", textAlign: "left" }}>
      <div style={{ background: "#faf5ff", padding: "15px", borderRadius: "6px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "15px", color: "#6b21a8", fontWeight: "700" }}>{senderName}</h2>
        <div style={{ fontSize: "10px", color: "#b45309", marginTop: "2px" }}>{senderEmail} | {senderTel}</div>
      </div>
      <div style={{ textAlign: "right", marginBottom: "20px", fontSize: "10.5px" }}>
        <div><strong>{destEntreprise}</strong></div>
        <div>{dateStr}</div>
      </div>
      <div style={{ marginBottom: "20px", fontWeight: "700", color: "#6b21a8" }}>
        Objet : {objet}
      </div>
      <div style={{ textAlign: "justify" }}>
        {body}
      </div>
    </div>
  );
};

// ── TEMPLATES LISTS METADATA ──

export const CV_TEMPLATES = [
  { id: "corporate", name: "Corporate Classic", premium: false, photo: false, component: CorporateTemplate },
  { id: "minimalist", name: "Minimalist Serif", premium: false, photo: false, component: MinimalistTemplate },
  { id: "creative", name: "Creative Sidebar", premium: false, photo: false, component: CreativeTemplate },
  { id: "tech", name: "Tech Terminal", premium: false, photo: false, component: TechTemplate },
  { id: "modern_photo", name: "Modern Photo", premium: true, photo: true, component: ModernPhotoTemplate },
  { id: "executive", name: "Executive Gold", premium: true, photo: false, component: ExecutiveTemplate },
  { id: "elegant_serif", name: "Elegant Serif", premium: false, photo: false, component: ElegantSerifTemplate },
  { id: "startup_bold", name: "Startup Bold", premium: true, photo: true, component: StartupBoldTemplate },
  { id: "academic", name: "Academic Classic", premium: false, photo: false, component: AcademicTemplate },
  { id: "chic_pastel", name: "Chic Pastel", premium: true, photo: true, component: ChicPastelTemplate },
  { id: "bold_sidebar", name: "Bold Sidebar Blue", premium: true, photo: true, component: BoldSidebarTemplate },
  { id: "clean_cards", name: "Clean Cards Grid", premium: false, photo: false, component: CleanCardsTemplate },
  { id: "hybrid_pro", name: "Hybrid Pro", premium: true, photo: false, component: HybridProTemplate },
  { id: "indigo_glow", name: "Indigo Glow", premium: false, photo: false, component: IndigoGlowTemplate },
  { id: "sleek_photo", name: "Sleek Dark Photo", premium: true, photo: true, component: SleekPhotoTemplate },
];

export const LETTER_TEMPLATES = [
  { id: "classic_sora", name: "Classic Sora", premium: false, component: ClassicSoraTemplate },
  { id: "corporate_blue", name: "Corporate Blue Banner", premium: false, component: CorporateBlueTemplate },
  { id: "minimalist_thin", name: "Minimalist Serif Divider", premium: false, component: MinimalistThinTemplate },
  { id: "creative_stripe", name: "Creative Stripe Left", premium: false, component: CreativeStripeTemplate },
  { id: "tech_mono", name: "Tech Monospace", premium: false, component: TechMonoTemplate },
  { id: "executive_gold", name: "Executive Gold Frame", premium: true, component: ExecutiveGoldTemplate },
  { id: "elegant_serif", name: "Elegant Serif Traditional", premium: false, component: ElegantSerifTemplateLetter },
  { id: "modern_compact", name: "Modern Compact margins", premium: false, component: ModernCompactTemplate },
  { id: "startup_clean", name: "Startup Clean Cyan", premium: true, component: StartupCleanTemplate },
  { id: "chic_pastel", name: "Chic Pastel Rounded", premium: true, component: ChicPastelTemplateLetter },
];
