import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const languages = {
  ru: SITE_URL,
  uz: `${SITE_URL}/uz`,
  en: `${SITE_URL}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(languages).map(([locale, url]) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "ru" ? 1 : 0.9,
    alternates: { languages },
  }));
}
