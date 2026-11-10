import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { getDictionary } from "@/lib/dictionary";
import { SITE_URL } from "@/lib/constants";
import { ceraPro } from "@/lib/fonts";

const dict = getDictionary("en");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: [
    "brand bureau",
    "branding agency",
    "brand identity",
    "logo design",
    "brand strategy",
    "Tashkent branding agency",
    "Uzbekistan branding",
    "Sabab Brand Bureau",
  ],
  manifest: "/site.webmanifest",
  alternates: {
    languages: { ru: "/", uz: "/uz", en: "/en" },
  },
  openGraph: {
    title: dict.meta.title,
    description: dict.meta.description,
    url: `${SITE_URL}/en`,
    siteName: dict.meta.title,
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: dict.meta.title,
    description: dict.meta.description,
    images: ["/opengraph-image"],
  },
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ceraPro.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
