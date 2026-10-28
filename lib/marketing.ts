export const SITE = {
  name: "Newbee",
  slogan:
    "One-stop app to navigate all challenges of moving and living abroad.",
  canonicalUrl: "https://www.newbeeapp.com",
  webAppUrl: "https://app.newbeeapp.com",
  appStoreUrl:
    "https://apps.apple.com/de/app/newbee-connect/id6474511885?l=en-GB",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.beeyondapps.newbee",
  instagramUrl: "https://www.instagram.com/newbeeappsocials/",
  supportEmail: "info@beeyondapps.com",
  privacyEmail: "privacy@beeyondapps.com",
} as const;

export type PlatformTarget = "ios" | "android" | "web";

/**
 * Detects target platform from a User-Agent header string.
 * Supports iPhone, iPad, iPod, iPadOS 13+ desktop-class Safari (Macintosh + Mobile/),
 * and Android devices, falling back to "web" for desktop/unknown user agents.
 */
export function detectPlatformFromUserAgent(
  userAgent: string | null | undefined
): PlatformTarget {
  if (!userAgent) {
    return "web";
  }

  const lower = userAgent.toLowerCase();

  if (
    /iphone|ipad|ipod/.test(lower) ||
    (lower.includes("macintosh") && /mobile\//.test(lower))
  ) {
    return "ios";
  }

  if (/android/.test(lower)) {
    return "android";
  }

  return "web";
}

/**
 * Resolves the 302 redirect target URL for GET /download based on User-Agent.
 */
export function getDownloadRedirectUrl(
  userAgent: string | null | undefined
): string {
  const platform = detectPlatformFromUserAgent(userAgent);
  switch (platform) {
    case "ios":
      return SITE.appStoreUrl;
    case "android":
      return SITE.playStoreUrl;
    case "web":
      return SITE.webAppUrl;
  }
}

/**
 * Normalizes a Host or X-Forwarded-Host header value to a lowercase hostname without port.
 */
export function normalizeHostname(rawHost: string | null | undefined): string {
  if (!rawHost) {
    return "";
  }
  const firstHost = rawHost.split(",")[0]?.trim().toLowerCase() ?? "";
  return firstHost.split(":")[0] ?? "";
}

/**
 * Returns true if the request hostname is a dedicated download redirect host
 * (download.newbeeapp.com or legacy marketing.newbeeapp.com).
 */
export function isDownloadRedirectHost(
  rawHost: string | null | undefined
): boolean {
  const host = normalizeHostname(rawHost);
  return host.startsWith("download.") || host.startsWith("marketing.");
}

export interface SlideDefinition {
  readonly id: string;
  readonly index: string;
  readonly label: string;
  readonly nextLabel: string | null;
}

export const SLIDES: readonly SlideDefinition[] = [
  { id: "start", index: "00", label: "Overview", nextLabel: "01 · Ask Questions" },
  { id: "ask", index: "01", label: "Ask Questions", nextLabel: "02 · Organize Events" },
  {
    id: "events",
    index: "02",
    label: "Organize Events",
    nextLabel: "03 · Meet New People",
  },
  { id: "meet", index: "03", label: "Meet New People", nextLabel: "Get Newbee" },
  { id: "get-started", index: "04", label: "Get Newbee", nextLabel: null },
] as const;

export function validateSlideDefinitions(
  slides: readonly SlideDefinition[]
): { valid: true } | { valid: false; error: string } {
  if (slides.length === 0) {
    return { valid: false, error: "Slides array must not be empty" };
  }

  const seenIds = new Set<string>();

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    if (!slide.id || !/^[a-z0-9-]+$/.test(slide.id)) {
      return {
        valid: false,
        error: `Slide at index ${i} has an invalid id: "${slide.id}"`,
      };
    }
    if (seenIds.has(slide.id)) {
      return {
        valid: false,
        error: `Duplicate slide id detected: "${slide.id}"`,
      };
    }
    seenIds.add(slide.id);

    const expectedIndex = String(i).padStart(2, "0");
    if (slide.index !== expectedIndex) {
      return {
        valid: false,
        error: `Slide "${slide.id}" has index "${slide.index}", expected "${expectedIndex}"`,
      };
    }

    if (!slide.label.trim()) {
      return {
        valid: false,
        error: `Slide "${slide.id}" must have a non-empty label`,
      };
    }

    const isLast = i === slides.length - 1;
    if (isLast && slide.nextLabel !== null) {
      return {
        valid: false,
        error: `Final slide "${slide.id}" must have nextLabel: null`,
      };
    }
    if (!isLast && (!slide.nextLabel || !slide.nextLabel.trim())) {
      return {
        valid: false,
        error: `Non-final slide "${slide.id}" must have a non-empty nextLabel`,
      };
    }
  }

  return { valid: true };
}

export type InquiryType =
  | "general"
  | "city-lead"
  | "expert"
  | "event"
  | "deletion";

export const INQUIRY_SUBJECT_LABELS: Readonly<Record<InquiryType, string>> = {
  general: "Newbee Platform Support / General Inquiry",
  "city-lead": "Newbee City Lead Application",
  expert: "Newbee Verified Expert Onboarding",
  event: "Newbee Event / Brand Partnership",
  deletion: "Newbee GDPR Account & Data Deletion Request",
};

export function getInquiryRecipientEmail(topic: InquiryType): string {
  return topic === "deletion" ? SITE.privacyEmail : SITE.supportEmail;
}

export interface ContactInquiryInput {
  topic: InquiryType;
  name: string;
  email: string;
  city?: string;
  message: string;
}

export function buildContactMailtoUrl(input: ContactInquiryInput): string {
  const targetEmail = getInquiryRecipientEmail(input.topic);
  const label = INQUIRY_SUBJECT_LABELS[input.topic];
  const trimmedName = input.name.trim();
  const trimmedCity = input.city?.trim() ?? "";

  const subject = encodeURIComponent(
    `[${label}] ${trimmedName}${trimmedCity ? ` (${trimmedCity})` : ""}`
  );
  const body = encodeURIComponent(
    `Name: ${trimmedName}\nEmail: ${input.email.trim()}\nCity / Region: ${
      trimmedCity || "N/A"
    }\nTopic: ${label}\n\nMessage:\n${input.message}`
  );

  return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
}

export function isValidHttpsUrl(
  rawUrl: string,
  expectedHostname?: string
): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") {
      return false;
    }
    if (expectedHostname && parsed.hostname !== expectedHostname) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
