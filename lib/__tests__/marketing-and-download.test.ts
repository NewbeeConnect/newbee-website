import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  SITE,
  SLIDES,
  INQUIRY_SUBJECT_LABELS,
  detectPlatformFromUserAgent,
  getDownloadRedirectUrl,
  normalizeHostname,
  isDownloadRedirectHost,
  validateSlideDefinitions,
  getInquiryRecipientEmail,
  buildContactMailtoUrl,
  isValidHttpsUrl,
} from "../marketing.ts";
import { SITE as SITE_FROM_CONFIG } from "../../components/site-config.ts";
import robots from "../../app/robots.ts";
import sitemap from "../../app/sitemap.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");

function walkSourceFiles(
  dir: string,
  extensions: readonly string[] = [".ts", ".tsx"]
): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "__tests__" &&
        entry.name !== "node_modules" &&
        entry.name !== ".next" &&
        entry.name !== ".git"
      ) {
        files.push(...walkSourceFiles(fullPath, extensions));
      }
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("detectPlatformFromUserAgent & getDownloadRedirectUrl", () => {
  it("detects iPhone, iPad, iPod, and iPadOS desktop-class Safari as ios", () => {
    const iosUserAgents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.88 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (iPad; CPU OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
      // iPadOS 13+ desktop-mode Safari UA (reports Macintosh + Mobile/)
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    ];

    for (const ua of iosUserAgents) {
      assert.equal(
        detectPlatformFromUserAgent(ua),
        "ios",
        `Expected iOS detection for UA: ${ua}`
      );
      assert.equal(getDownloadRedirectUrl(ua), SITE.appStoreUrl);
    }
  });

  it("detects Android phones, tablets, and in-app WebViews as android", () => {
    const androidUserAgents = [
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 14; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/AP1A.240405.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.113 Mobile Safari/537.36 Instagram 329.0.0.41.93",
    ];

    for (const ua of androidUserAgents) {
      assert.equal(
        detectPlatformFromUserAgent(ua),
        "android",
        `Expected Android detection for UA: ${ua}`
      );
      assert.equal(getDownloadRedirectUrl(ua), SITE.playStoreUrl);
    }
  });

  it("falls back to web for desktop browsers, crawlers, and missing user agents", () => {
    const desktopAndFallbackUAs: Array<string | null | undefined> = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "WhatsApp/2.24.10.79 A",
      "",
      "   ",
      null,
      undefined,
    ];

    for (const ua of desktopAndFallbackUAs) {
      assert.equal(
        detectPlatformFromUserAgent(ua),
        "web",
        `Expected web fallback for UA: ${String(ua)}`
      );
      assert.equal(getDownloadRedirectUrl(ua), SITE.webAppUrl);
    }
  });
});

describe("normalizeHostname & isDownloadRedirectHost (proxy subdomain routing)", () => {
  it("normalizes ports, casing, and comma-separated forwarded hosts", () => {
    assert.equal(
      normalizeHostname("Download.NewbeeApp.com:443"),
      "download.newbeeapp.com"
    );
    assert.equal(
      normalizeHostname("marketing.newbeeapp.com, 10.0.0.1"),
      "marketing.newbeeapp.com"
    );
    assert.equal(normalizeHostname(null), "");
    assert.equal(normalizeHostname(undefined), "");
    assert.equal(normalizeHostname(""), "");
  });

  it("identifies download.* and marketing.* subdomains for /download rewrite", () => {
    assert.equal(isDownloadRedirectHost("download.newbeeapp.com"), true);
    assert.equal(isDownloadRedirectHost("DOWNLOAD.NEWBEEAPP.COM:443"), true);
    assert.equal(isDownloadRedirectHost("marketing.newbeeapp.com"), true);
    assert.equal(
      isDownloadRedirectHost("download.newbeeapp.com, proxy.internal"),
      true
    );

    assert.equal(isDownloadRedirectHost("www.newbeeapp.com"), false);
    assert.equal(isDownloadRedirectHost("newbeeapp.com"), false);
    assert.equal(isDownloadRedirectHost("app.newbeeapp.com"), false);
    assert.equal(isDownloadRedirectHost("localhost:3000"), false);
    assert.equal(isDownloadRedirectHost(null), false);
    assert.equal(isDownloadRedirectHost(undefined), false);
  });
});

describe("SLIDES & validateSlideDefinitions", () => {
  it("validates the canonical homepage SLIDES configuration", () => {
    const result = validateSlideDefinitions(SLIDES);
    assert.deepEqual(result, { valid: true });
    assert.equal(SLIDES.length, 5);
    assert.deepEqual(
      SLIDES.map((s) => s.id),
      ["start", "ask", "events", "meet", "get-started"]
    );
    assert.equal(SLIDES[SLIDES.length - 1]?.nextLabel, null);
  });

  it("rejects malformed slide definitions", () => {
    assert.equal(validateSlideDefinitions([]).valid, false);
    assert.equal(
      validateSlideDefinitions([
        { id: "Invalid ID", index: "00", label: "Overview", nextLabel: null },
      ]).valid,
      false
    );
    assert.equal(
      validateSlideDefinitions([
        { id: "start", index: "00", label: "Overview", nextLabel: "Next" },
        { id: "start", index: "01", label: "Duplicate", nextLabel: null },
      ]).valid,
      false
    );
    assert.equal(
      validateSlideDefinitions([
        { id: "start", index: "01", label: "Wrong Index", nextLabel: null },
      ]).valid,
      false
    );
    assert.equal(
      validateSlideDefinitions([
        { id: "start", index: "00", label: "Overview", nextLabel: "Not null" },
      ]).valid,
      false
    );
  });
});

describe("Contact inquiry routing & buildContactMailtoUrl", () => {
  it("routes GDPR/KVKK deletion inquiries to privacy@beeyondapps.com and others to info@beeyondapps.com", () => {
    assert.equal(getInquiryRecipientEmail("deletion"), "privacy@beeyondapps.com");
    assert.equal(getInquiryRecipientEmail("general"), "info@beeyondapps.com");
    assert.equal(getInquiryRecipientEmail("city-lead"), "info@beeyondapps.com");
    assert.equal(getInquiryRecipientEmail("expert"), "info@beeyondapps.com");
    assert.equal(getInquiryRecipientEmail("event"), "info@beeyondapps.com");
  });

  it("builds properly encoded mailto URLs with optional city handling", () => {
    const deletionMailto = buildContactMailtoUrl({
      topic: "deletion",
      name: "Ada Lovelace",
      email: "ada@example.com",
      city: "Frankfurt",
      message: "Please delete my account and personal data.",
    });

    assert.ok(deletionMailto.startsWith("mailto:privacy@beeyondapps.com?"));
    const deletionParams = new URLSearchParams(deletionMailto.split("?")[1]);
    assert.equal(
      deletionParams.get("subject"),
      `[${INQUIRY_SUBJECT_LABELS.deletion}] Ada Lovelace (Frankfurt)`
    );
    assert.match(deletionParams.get("body") ?? "", /City \/ Region: Frankfurt/);
    assert.match(
      deletionParams.get("body") ?? "",
      /Please delete my account and personal data\./
    );

    const generalMailto = buildContactMailtoUrl({
      topic: "general",
      name: "Max Mustermann",
      email: "max@example.com",
      message: "Hello Newbee team!",
    });

    assert.ok(generalMailto.startsWith("mailto:info@beeyondapps.com?"));
    const generalParams = new URLSearchParams(generalMailto.split("?")[1]);
    assert.equal(
      generalParams.get("subject"),
      `[${INQUIRY_SUBJECT_LABELS.general}] Max Mustermann`
    );
    assert.match(generalParams.get("body") ?? "", /City \/ Region: N\/A/);
  });
});

describe("Store URLs & site-wide link consistency contracts", () => {
  it("verifies SITE store and web URLs are valid HTTPS URLs with canonical identifiers", () => {
    assert.deepEqual(SITE, SITE_FROM_CONFIG);

    assert.equal(isValidHttpsUrl(SITE.appStoreUrl, "apps.apple.com"), true);
    assert.match(SITE.appStoreUrl, /id6474511885/);

    assert.equal(isValidHttpsUrl(SITE.playStoreUrl, "play.google.com"), true);
    assert.match(SITE.playStoreUrl, /id=com\.beeyondapps\.newbee/);

    assert.equal(isValidHttpsUrl(SITE.webAppUrl, "app.newbeeapp.com"), true);
    assert.equal(isValidHttpsUrl(SITE.canonicalUrl, "www.newbeeapp.com"), true);
    assert.equal(isValidHttpsUrl(SITE.instagramUrl, "www.instagram.com"), true);
    assert.equal(isValidHttpsUrl("http://apps.apple.com/insecure"), false);
    assert.equal(isValidHttpsUrl("not-a-url"), false);
  });

  it("ensures all store URLs across the codebase match SITE.appStoreUrl and SITE.playStoreUrl", () => {
    const files = [
      ...walkSourceFiles(path.join(ROOT_DIR, "app")),
      ...walkSourceFiles(path.join(ROOT_DIR, "components")),
      ...walkSourceFiles(path.join(ROOT_DIR, "lib")),
    ];

    const appleUrlRegex = /https?:\/\/apps\.apple\.com[^\s"'`)]+/g;
    const playUrlRegex = /https?:\/\/play\.google\.com[^\s"'`)]+/g;

    let appleMatches = 0;
    let playMatches = 0;

    for (const file of files) {
      const source = fs.readFileSync(file, "utf8");
      const rel = path.relative(ROOT_DIR, file);

      for (const match of source.matchAll(appleUrlRegex)) {
        appleMatches++;
        assert.equal(
          match[0],
          SITE.appStoreUrl,
          `App Store URL in ${rel} must match SITE.appStoreUrl`
        );
      }

      for (const match of source.matchAll(playUrlRegex)) {
        playMatches++;
        assert.equal(
          match[0],
          SITE.playStoreUrl,
          `Play Store URL in ${rel} must match SITE.playStoreUrl`
        );
      }
    }

    assert.ok(appleMatches >= 1, "Expected canonical App Store URL in source");
    assert.ok(playMatches >= 1, "Expected canonical Play Store URL in source");

    // Verify Header, Footer, HomePage, and /download route use SITE / canonical helpers
    const headerSource = fs.readFileSync(
      path.join(ROOT_DIR, "components/Header.tsx"),
      "utf8"
    );
    const footerSource = fs.readFileSync(
      path.join(ROOT_DIR, "components/Footer.tsx"),
      "utf8"
    );
    const homeSource = fs.readFileSync(
      path.join(ROOT_DIR, "app/page.tsx"),
      "utf8"
    );
    const downloadRouteSource = fs.readFileSync(
      path.join(ROOT_DIR, "app/download/route.ts"),
      "utf8"
    );

    for (const [name, src] of [
      ["Header.tsx", headerSource],
      ["Footer.tsx", footerSource],
      ["app/page.tsx", homeSource],
    ] as const) {
      assert.match(
        src,
        /SITE\.appStoreUrl/,
        `${name} must reference SITE.appStoreUrl`
      );
      assert.match(
        src,
        /SITE\.playStoreUrl/,
        `${name} must reference SITE.playStoreUrl`
      );
      assert.match(
        src,
        /SITE\.webAppUrl/,
        `${name} must reference SITE.webAppUrl`
      );
    }

    assert.match(
      downloadRouteSource,
      /getDownloadRedirectUrl/,
      "app/download/route.ts must delegate to getDownloadRedirectUrl"
    );
  });
});

describe("Routes, SEO (robots & sitemap), and metadata contracts", () => {
  it("robots() returns valid crawl rules and canonical sitemap URL", () => {
    const robotsConfig = robots();
    assert.equal(robotsConfig.sitemap, "https://www.newbeeapp.com/sitemap.xml");
    assert.deepEqual(robotsConfig.rules, {
      userAgent: "*",
      allow: "/",
    });
  });

  it("sitemap() returns well-formed HTTPS entries for all public pages", () => {
    const entries = sitemap();
    assert.ok(entries.length >= 4);

    const urls = entries.map((entry) => entry.url);
    assert.deepEqual(urls, [
      "https://www.newbeeapp.com/",
      "https://www.newbeeapp.com/contact",
      "https://www.newbeeapp.com/privacy",
      "https://www.newbeeapp.com/termsandconditions",
    ]);

    for (const entry of entries) {
      assert.equal(isValidHttpsUrl(entry.url, "www.newbeeapp.com"), true);
      assert.ok(entry.lastModified instanceof Date);
      assert.ok(
        typeof entry.priority === "number" &&
          entry.priority > 0 &&
          entry.priority <= 1
      );
    }
  });

  it("verifies all pages, layouts, redirects, and legal data exist and are well-formed", () => {
    const requiredRoutes = [
      "app/layout.tsx",
      "app/page.tsx",
      "app/download/route.ts",
      "app/contact/layout.tsx",
      "app/contact/page.tsx",
      "app/privacy/layout.tsx",
      "app/privacy/page.tsx",
      "app/termsandconditions/layout.tsx",
      "app/termsandconditions/page.tsx",
      "app/about/page.tsx",
      "app/businesses/page.tsx",
      "app/communities/page.tsx",
    ];

    for (const relPath of requiredRoutes) {
      const fullPath = path.join(ROOT_DIR, relPath);
      assert.ok(
        fs.existsSync(fullPath),
        `Required route file must exist: ${relPath}`
      );
    }

    const metadataFiles = [
      "app/layout.tsx",
      "app/contact/layout.tsx",
      "app/privacy/layout.tsx",
      "app/termsandconditions/layout.tsx",
    ];

    for (const relPath of metadataFiles) {
      const content = fs.readFileSync(path.join(ROOT_DIR, relPath), "utf8");
      assert.match(
        content,
        /export const metadata:\s*Metadata\s*=/,
        `${relPath} must export typed Next.js Metadata`
      );
      assert.match(content, /title:/, `${relPath} metadata must include title`);
      assert.match(
        content,
        /description:/,
        `${relPath} metadata must include description`
      );
    }

    // Verify every slide in SLIDES has a matching section id in app/page.tsx
    const homeSource = fs.readFileSync(
      path.join(ROOT_DIR, "app/page.tsx"),
      "utf8"
    );
    for (const slide of SLIDES) {
      assert.match(
        homeSource,
        new RegExp(`id="${slide.id}"`),
        `app/page.tsx must contain section with id="${slide.id}"`
      );
    }

    // Verify legal-pages.json has required English documents
    const legalData = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, "data/legal-pages.json"), "utf8")
    ) as Record<
      string,
      { title?: string; sections?: Array<{ title?: string; body?: string }> }
    >;

    for (const key of ["privacy/en", "kvkk/en", "terms/en"]) {
      const doc = legalData[key];
      assert.ok(doc, `data/legal-pages.json must include "${key}"`);
      assert.ok(
        typeof doc.title === "string" && doc.title.length > 0,
        `Legal doc "${key}" must have a non-empty title`
      );
      assert.ok(
        Array.isArray(doc.sections) && doc.sections.length > 0,
        `Legal doc "${key}" must have non-empty sections`
      );
    }
  });
});

describe("Marketing site static security contracts", () => {
  it("never references SUPABASE_SERVICE_ROLE_KEY or private keys/tokens in source files", () => {
    const files = [
      ...walkSourceFiles(path.join(ROOT_DIR, "app")),
      ...walkSourceFiles(path.join(ROOT_DIR, "components")),
      ...walkSourceFiles(path.join(ROOT_DIR, "lib")),
      ...walkSourceFiles(path.join(ROOT_DIR, "data"), [".json"]),
      path.join(ROOT_DIR, "proxy.ts"),
      path.join(ROOT_DIR, "next.config.ts"),
    ];

    const forbiddenPatterns = [
      { pattern: /SUPABASE_SERVICE_ROLE_KEY/, label: "SUPABASE_SERVICE_ROLE_KEY" },
      {
        pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
        label: "PEM private key",
      },
      { pattern: /\bsbp_[a-zA-Z0-9]{20,}\b/, label: "Supabase personal token" },
      { pattern: /\bsk_live_[a-zA-Z0-9]{16,}\b/, label: "Live secret key" },
    ];

    for (const file of files) {
      const source = fs.readFileSync(file, "utf8");
      const rel = path.relative(ROOT_DIR, file);
      for (const { pattern, label } of forbiddenPatterns) {
        assert.doesNotMatch(
          source,
          pattern,
          `Source file ${rel} must not contain ${label}`
        );
      }
    }
  });

  it('enforces rel="noopener noreferrer" on all external target="_blank" links', () => {
    const tsxFiles = [
      ...walkSourceFiles(path.join(ROOT_DIR, "app"), [".tsx"]),
      ...walkSourceFiles(path.join(ROOT_DIR, "components"), [".tsx"]),
    ];

    const anchorTagRegex = /<a\b[\s\S]*?>/g;
    let externalBlankLinksCount = 0;

    for (const file of tsxFiles) {
      const source = fs.readFileSync(file, "utf8");
      const rel = path.relative(ROOT_DIR, file);

      for (const match of source.matchAll(anchorTagRegex)) {
        const tag = match[0];
        if (tag.includes('target="_blank"')) {
          externalBlankLinksCount++;
          assert.match(
            tag,
            /rel="noopener noreferrer"/,
            `<a target="_blank"> in ${rel} must include rel="noopener noreferrer": ${tag}`
          );
        }
      }
    }

    assert.ok(
      externalBlankLinksCount >= 10,
      `Expected at least 10 external target="_blank" links across TSX files (found ${externalBlankLinksCount})`
    );
  });

  it("enforces strict HTTP security headers and disables X-Powered-By in next.config.ts", () => {
    const nextConfigSource = fs.readFileSync(
      path.join(ROOT_DIR, "next.config.ts"),
      "utf8"
    );

    assert.match(nextConfigSource, /poweredByHeader:\s*false/);
    for (const headerName of [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
    ]) {
      assert.ok(
        nextConfigSource.includes(headerName),
        `next.config.ts must configure ${headerName}`
      );
    }
  });
});
