import type { Dictionary, Locale } from "./dictionary";
import { SITE_URL, EMAIL, PHONE_1_HREF, INSTAGRAM_URL } from "./constants";
import { homeHref } from "./links";

/**
 * schema.org Organization structured data — helps Google understand the
 * business as an entity (name, logo, contact, socials), which can surface a
 * richer search result for brand-name searches. Rendered as a <script
 * type="application/ld+json"> in each locale's page.tsx.
 */
export function organizationJsonLd(dict: Dictionary, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sabab Brand Bureau",
    url: `${SITE_URL}${homeHref(locale)}`,
    logo: `${SITE_URL}/logo-full.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description: dict.meta.description,
    email: EMAIL,
    telephone: PHONE_1_HREF.replace("tel:", ""),
    sameAs: [INSTAGRAM_URL],
  };
}
