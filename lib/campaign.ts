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

export const INSURANCE_INTERESTS = [
  { value: "kasko", label: "Kasko / araç" },
  { value: "health", label: "Sağlık" },
  { value: "home", label: "Konut / ev eşyası" },
  { value: "liability", label: "Sorumluluk (Haftpflicht)" },
  { value: "life", label: "Hayat / emeklilik" },
  { value: "other", label: "Diğer" },
] as const;

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
