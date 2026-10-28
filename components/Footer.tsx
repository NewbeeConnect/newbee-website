import Link from "next/link";
import { NewbeeLogoMark, NewbeeFooterWordmark } from "./Marks";
import { SITE } from "./site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="nk-footer" data-snap="">
      <div className="nk-footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <NewbeeLogoMark size={26} />
            <span
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: "#111111",
                letterSpacing: "-0.03em",
              }}
            >
              newbee<span style={{ color: "#ffb72a" }}>.</span>
            </span>
          </div>
          <p
            style={{
              margin: "12px 0 0",
              maxWidth: 340,
              lineHeight: 1.6,
              color: "#262521",
            }}
          >
            One-stop app to navigate all challenges of moving and living abroad.
            Ask questions, organize events, and meet new people in your city.
          </p>
        </div>

        <div>
          <div className="nk-footer-col-title">Get Newbee</div>
          <div className="nk-footer-links">
            <a
              href={SITE.webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue on Web (app.newbeeapp.com) ↗
            </a>
            <a
              href={SITE.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download on the App Store ↗
            </a>
            <a
              href={SITE.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it on Google Play ↗
            </a>
            <Link href="/download">Smart Download Link (/download)</Link>
          </div>
        </div>

        <div>
          <div className="nk-footer-col-title">Explore</div>
          <div className="nk-footer-links">
            <Link href="/#ask">01 · Ask Questions</Link>
            <Link href="/#events">02 · Organize Events</Link>
            <Link href="/#meet">03 · Meet New People</Link>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram (@newbeeappsocials) ↗
            </a>
          </div>
        </div>

        <div>
          <div className="nk-footer-col-title">Legal &amp; Support</div>
          <div className="nk-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/termsandconditions">Terms &amp; Conditions</Link>
            <Link href="/contact">Contact &amp; Account Deletion</Link>
            <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
          </div>
        </div>
      </div>

      <NewbeeFooterWordmark />

      <div className="nk-footer-bottom">
        <span>© {year} Newbee · Beeyondapps Technology Ltd. All rights reserved.</span>
        <span>You&apos;re home, wherever you are.</span>
      </div>
    </footer>
  );
}
