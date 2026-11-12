// Partner campaign lead forms. The form posts straight to the Newbee
// `submit-campaign-lead` edge function (gateway-open, no key needed), which
// stores the lead and emails the partner. No secret lives in this repository.
export const CAMPAIGN_LEAD_ENDPOINT =
  "https://ccuiumdacqwsfhfxsjdm.supabase.co/functions/v1/submit-campaign-lead";

export const INSURANCE_CAMPAIGN_ID = "insurance-2026-11";

/** The partner's agency, named on the page and in the consent text. */
export const AGENCY = {
  name: "Allianz Generalvertretung Solz und Zimmermann",
  street: "Brückenstr. 43",
  city: "60594 Frankfurt am Main",
} as const;

// Most-requested insurance types in Germany. Keys must match `CAMPAIGNS` in the
// Newbee repo (supabase/functions/_shared/campaign-lead.ts). "other" is not in
// this list: the form shows it as its own tick box with a free-text field.
export const INSURANCE_INTERESTS = [
  { value: "kasko", label: "Araç / kasko (Kfz)" },
  { value: "private_health", label: "Özel sağlık sigortası (PKV)" },
  { value: "health_extra", label: "Tamamlayıcı sağlık / diş (Zusatz)" },
  { value: "liability", label: "Özel sorumluluk (Privathaftpflicht)" },
  { value: "household", label: "Ev eşyası (Hausrat)" },
  { value: "building", label: "Bina / konut (Wohngebäude)" },
  { value: "legal", label: "Hukuki koruma (Rechtsschutz)" },
  { value: "disability", label: "İş göremezlik (Berufsunfähigkeit)" },
  { value: "life", label: "Hayat sigortası (Risikoleben)" },
  { value: "pension", label: "Emeklilik / birikim (Rente)" },
  { value: "accident", label: "Ferdi kaza (Unfall)" },
  { value: "travel", label: "Seyahat sağlık (Auslandsreise)" },
  { value: "pet", label: "Evcil hayvan (Tier)" },
] as const;

export const INTEREST_OTHER_MAX = 200;

export type LeadField = "name" | "email" | "phone" | "consent";

export const LEAD_ERRORS: Record<LeadField | "generic" | "rate", string> = {
  name: "Lütfen adınızı ve soyadınızı yazın.",
  email: "Lütfen geçerli bir e-posta adresi yazın.",
  phone: "Lütfen geçerli bir telefon numarası yazın.",
  consent: "Devam etmek için onay kutusunu işaretleyin.",
  rate: "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.",
  generic: "Bir sorun oluştu. Lütfen birkaç dakika sonra tekrar deneyin.",
};

/** Map the edge function's `field` to a form field we show an error on. */
export function toLeadField(field: unknown): LeadField | null {
  return field === "name" || field === "email" || field === "phone" || field === "consent"
    ? field
    : null;
}
