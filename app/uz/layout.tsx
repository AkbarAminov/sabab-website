import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { getDictionary } from "@/lib/dictionary";
import { SITE_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const dict = getDictionary("uz");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: {
    languages: { ru: "/", uz: "/uz", en: "/en" },
  },
  openGraph: {
    title: dict.meta.title,
    description: dict.meta.description,
    url: `${SITE_URL}/uz`,
    siteName: dict.meta.title,
    locale: "uz_UZ",
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

export default function UzRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
