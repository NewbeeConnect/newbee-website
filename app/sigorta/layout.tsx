import type { Metadata } from "next";

// Turkish-language partner campaign (Allianz Generalvertretung Solz und
// Zimmermann, Frankfurt). The owner asked not to name an individual advisor. This is
// the one deliberate exception to the site's English-only copy rule: the offer,
// the partner and the audience are Turkish-speaking. It lives on newbeeapp.com
// rather than app.newbeeapp.com because the installed Android app claims every
// app.newbeeapp.com link and its store build has no such page.
const TITLE = "Newbee'ye özel sigorta kampanyası: Kaskoda %20'ye varan indirim";
const DESCRIPTION =
  "Diğer sigortalarda %10'a varan indirim. Formu doldurun, Allianz sigorta uzmanlarımız sizi arasın.";
const IMAGE = {
  url: "https://www.newbeeapp.com/og/sigorta-kampanya-v3.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Newbee sigorta kampanyası: kaskoda %20'ye, diğer sigortalarda %10'a varan indirim",
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://www.newbeeapp.com/sigorta" },
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.newbeeapp.com/sigorta",
    siteName: "Newbee",
    locale: "tr_TR",
    type: "website",
    images: [IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE.url],
  },
};

export default function SigortaLayout({ children }: { children: React.ReactNode }) {
  return <div lang="tr">{children}</div>;
}
