"use client";

import { useState } from "react";
import {
  CAMPAIGN_LEAD_ENDPOINT,
  INSURANCE_CAMPAIGN_ID,
  INSURANCE_INTERESTS,
  AGENCY,
  LEAD_ERRORS,
  toLeadField,
  type LeadField,
} from "@/lib/campaign";

type Status = "idle" | "sending" | "done" | "error" | "rate";

const BLUE = "#133fb8";
const CREAM = "#fbf3e4";
const YELLOW = "#fbb62d";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  marginTop: 6,
  padding: "0 14px",
  fontSize: 16,
  borderRadius: 12,
  border: "1px solid var(--nk-border)",
  background: "#fff",
  color: "var(--nk-ink)",
};

const labelStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "var(--nk-ink)" };

export default function SigortaCampaignPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState<LeadField | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvalid(null);
    if (!consent) {
      setInvalid("consent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(CAMPAIGN_LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign: INSURANCE_CAMPAIGN_ID,
          fullName,
          email,
          phone,
          interest: interest || undefined,
          consent,
          website,
        }),
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      if (res.status === 429) {
        setStatus("rate");
        return;
      }
      const body: unknown = await res.json().catch(() => null);
      const field = toLeadField((body as { field?: unknown } | null)?.field);
      if (field) {
        setInvalid(field);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const fieldError = (field: LeadField) =>
    invalid === field ? (
      <p role="alert" style={{ color: "#c0262d", fontSize: 14, marginTop: 6 }}>
        {LEAD_ERRORS[field]}
      </p>
    ) : null;

  return (
    <section style={{ background: BLUE, color: CREAM, padding: "96px 16px 56px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static 1200x630 poster, same file as the link preview */}
        <img
          src="/og/sigorta-kampanya-v2.jpg"
          alt="Newbee sigorta kampanyası: kaskoda %20'ye, diğer sigortalarda %10'a varan indirim"
          width={1200}
          height={630}
          style={{ width: "100%", height: "auto", borderRadius: 18, display: "block" }}
        />

        <h1 style={{ marginTop: 28, fontSize: 32, lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Newbee üyelerine özel sigorta kampanyası
        </h1>
        <p style={{ marginTop: 10, fontSize: 18, opacity: 0.92, lineHeight: 1.45 }}>
          Kaskoda %20&apos;ye, diğer sigortalarda %10&apos;a varan indirim. Formu doldurun, Allianz
          sigorta uzmanı Uğur Tahmaz sizi arasın.
        </p>

        <div
          style={{
            marginTop: 24,
            background: "var(--nk-bg)",
            color: "var(--nk-ink)",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          }}
        >
          {status === "done" ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 44 }} aria-hidden="true">✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>Teşekkürler!</h2>
              <p style={{ marginTop: 8, color: "var(--nk-muted)" }}>
                Bilgileriniz alındı. Uğur Tahmaz en kısa sürede sizinle iletişime geçecek.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Sizi arayalım</h2>

              <div>
                <label htmlFor="sg-name" style={labelStyle}>İsim soyisim</label>
                <input id="sg-name" autoComplete="name" required value={fullName}
                  onChange={(e) => setFullName(e.target.value)} aria-invalid={invalid === "name"} style={inputStyle} />
                {fieldError("name")}
              </div>

              <div>
                <label htmlFor="sg-phone" style={labelStyle}>Telefon</label>
                <input id="sg-phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+49 …"
                  value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={invalid === "phone"} style={inputStyle} />
                {fieldError("phone")}
              </div>

              <div>
                <label htmlFor="sg-email" style={labelStyle}>E-posta</label>
                <input id="sg-email" type="email" inputMode="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid === "email"} style={inputStyle} />
                {fieldError("email")}
              </div>

              <div>
                <label htmlFor="sg-interest" style={labelStyle}>Hangi sigortayla ilgileniyorsunuz? (isteğe bağlı)</label>
                <select id="sg-interest" value={interest} onChange={(e) => setInterest(e.target.value)} style={inputStyle}>
                  <option value="">Seçin</option>
                  {INSURANCE_INTERESTS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Honeypot: hidden from people, filled by naive bots. */}
              <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="sg-website">Website</label>
                <input id="sg-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <label htmlFor="sg-consent" style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5 }}>
                <input id="sg-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={invalid === "consent"} style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }} />
                <span>
                  Bilgilerimin bana teklif sunulması için sigorta uzmanı Uğur Tahmaz ({AGENCY.name}, {AGENCY.street},{" "}
                  {AGENCY.city}) ile paylaşılmasına ve benimle
                  telefon veya e-posta ile iletişime geçilmesine izin veriyorum. Bu iznimi istediğim zaman
                  info@beeyondapps.com adresine yazarak geri alabilirim.{" "}
                  <a href="/privacy" style={{ textDecoration: "underline" }}>Gizlilik politikası</a>
                </span>
              </label>
              {fieldError("consent")}

              {(status === "error" || status === "rate") && (
                <p role="alert" style={{ color: "#c0262d", fontSize: 14 }}>
                  {status === "rate" ? LEAD_ERRORS.rate : LEAD_ERRORS.generic}
                </p>
              )}

              <button type="submit" disabled={status === "sending"}
                style={{ height: 52, borderRadius: 999, border: 0, background: YELLOW, color: "#13235e",
                  fontSize: 17, fontWeight: 800, cursor: "pointer", opacity: status === "sending" ? 0.7 : 1 }}>
                {status === "sending" ? "Gönderiliyor…" : "Gönder"}
              </button>
              <p style={{ fontSize: 12, color: "var(--nk-muted)", textAlign: "center", lineHeight: 1.5 }}>
                Bilgileriniz yalnız bu kampanya için kullanılır. İndirim oranları üst sınırdır; size özel teklif
                uzmanla görüşmede netleşir.
              </p>
            </form>
          )}
        </div>

        <div
          style={{
            marginTop: 16,
            background: "rgba(251,243,228,0.08)",
            border: "1px solid rgba(251,243,228,0.25)",
            borderRadius: 18,
            padding: "18px 20px",
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: "0.12em", color: YELLOW, fontWeight: 700 }}>SİGORTA UZMANI</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>Uğur Tahmaz</div>
          <div style={{ marginTop: 6, fontSize: 15, opacity: 0.92 }}>
            {AGENCY.name}
            <br />
            {AGENCY.street}, {AGENCY.city}
          </div>
        </div>
      </div>
    </section>
  );
}
