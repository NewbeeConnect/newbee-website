"use client";

import { useState } from "react";
import Link from "next/link";
import { HandDrawnUnderline } from "@/components/Marks";
import {
  buildContactMailtoUrl,
  getInquiryRecipientEmail,
  SITE,
  type InquiryType,
} from "@/lib/marketing";

export default function ContactPage() {
  const [topic, setTopic] = useState<InquiryType>("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildContactMailtoUrl({
      topic,
      name,
      email,
      city,
      message,
    });
    setSubmitted(true);
  };

  return (
    <section className="nk-section" style={{ paddingTop: 96 }}>
      <div className="nk-section-header">
        <div className="nk-eyebrow">
          <span className="nk-eyebrow-dot" />
          <span>Support · City Leads · Experts · Privacy Center</span>
        </div>
        <h1 className="nk-h1">
          Let&apos;s <HandDrawnUnderline>connect</HandDrawnUnderline> with the{" "}
          Newbee team.
        </h1>
        <p className="nk-lead">
          Reach out for member support, City Lead applications, Verified Expert
          onboarding, event collaborations, or data deletion requests.
        </p>
      </div>

      <div className="nk-contact-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="nk-editorial-col">
            <div>
              <span className="nk-editorial-tag">01 · Direct Channels</span>
              <h2 className="nk-editorial-title">Official Contact Details</h2>
              <p className="nk-editorial-body">
                <strong>General, Partnerships &amp; Support:</strong>
                <br />
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "#ffb72a",
                    fontWeight: 600,
                  }}
                >
                  {SITE.supportEmail}
                </a>
              </p>
              <p className="nk-editorial-body">
                <strong>Privacy &amp; Data Protection:</strong>
                <br />
                <a
                  href={`mailto:${SITE.privacyEmail}`}
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "#ffb72a",
                    fontWeight: 600,
                  }}
                >
                  {SITE.privacyEmail}
                </a>
              </p>
            </div>
            <div className="nk-editorial-foot">
              Response time: typically within 1–2 business days
            </div>
          </div>

          <div className="nk-editorial-col">
            <div>
              <span className="nk-editorial-tag">02 · Account Deletion</span>
              <h2 className="nk-editorial-title">
                In-App &amp; Web Account Deletion
              </h2>
              <p className="nk-editorial-body">
                You can permanently delete your Newbee account and associated
                profile data at any time directly inside the Newbee iOS,
                Android, or Web app under{" "}
                <strong>Profile → Settings → Delete Account</strong>. You may
                also submit a formal erasure request using this form or by
                emailing{" "}
                <a
                  href={`mailto:${SITE.privacyEmail}`}
                  style={{ textDecoration: "underline", fontWeight: 600 }}
                >
                  {SITE.privacyEmail}
                </a>
                .
              </p>
            </div>
            <div className="nk-editorial-foot">
              <Link href="/privacy" style={{ fontWeight: 700, color: "#111111" }}>
                Read Full Privacy Policy →
              </Link>
            </div>
          </div>

          <div className="nk-editorial-col">
            <div>
              <span className="nk-editorial-tag">03 · Operating Entity</span>
              <h2 className="nk-editorial-title">Beeyondapps Technology Ltd.</h2>
              <p className="nk-editorial-body">
                Community &amp; Product Hub: Frankfurt am Main, Germany
                <br />
                Registered Office: Istanbul
              </p>
            </div>
            <div className="nk-editorial-foot">
              Instagram:{" "}
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 700, color: "#111111" }}
              >
                @newbeeappsocials ↗
              </a>
            </div>
          </div>
        </div>

        <div className="nk-form-card">
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Send a Message
          </h2>
          <p style={{ margin: "0 0 22px", fontSize: 14, color: "#57534a" }}>
            Select a topic below so we can route your inquiry to the right team.
          </p>

          <form className="nk-form" onSubmit={handleSubmit}>
            <label className="nk-label">
              <span>INQUIRY TOPIC</span>
              <select
                className="nk-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value as InquiryType)}
              >
                <option value="general">
                  Platform Support / General Question
                </option>
                <option value="city-lead">
                  Apply for the Newbee City Lead Program
                </option>
                <option value="expert">
                  Apply as a Verified Expert (expert.newbeeapp.com)
                </option>
                <option value="event">
                  Event Listing / Brand Partnership
                </option>
                <option value="deletion">
                  Account &amp; Data Deletion Request
                </option>
              </select>
            </label>

            <div className="nk-form-row-2">
              <label className="nk-label">
                <span>YOUR NAME *</span>
                <input
                  type="text"
                  required
                  className="nk-input"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="nk-label">
                <span>EMAIL ADDRESS *</span>
                <input
                  type="email"
                  required
                  className="nk-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <label className="nk-label">
              <span>CITY / REGION (OPTIONAL)</span>
              <input
                type="text"
                className="nk-input"
                placeholder="e.g. Frankfurt, Berlin, Munich, London"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>

            <label className="nk-label">
              <span>MESSAGE / DETAILS *</span>
              <textarea
                required
                className="nk-textarea"
                placeholder={
                  topic === "city-lead"
                    ? "Tell us about your city, your background, and the kinds of local gatherings or topics you'd love to lead..."
                    : topic === "expert"
                    ? "Share your professional field (e.g. Immigration Law, Tax, Real Estate), spoken languages, and website/LinkedIn..."
                    : topic === "deletion"
                    ? "Please provide the email address or phone number associated with your Newbee account so we can process your erasure request..."
                    : "How can our team help you?"
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            {topic === "deletion" && (
              <div className="nk-notice-coral">
                <strong>Privacy Routing:</strong> Account and personal data
                deletion requests are routed directly to our Data Protection
                team at <strong>{SITE.privacyEmail}</strong>.
              </div>
            )}

            <button type="submit" className="nk-submit-btn">
              <span>
                Compose {topic === "deletion" ? "Request" : "Message"} to{" "}
                {getInquiryRecipientEmail(topic)} →
              </span>
            </button>

            {submitted && (
              <div className="nk-notice">
                Your email client has been opened with your pre-filled message.
                You can also write directly to{" "}
                <strong>{getInquiryRecipientEmail(topic)}</strong>.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
