import type { Locale } from "./dictionary";
import type { PdfKind } from "./pdf";

export const ALL_LOCALES: Locale[] = ["ru", "uz", "en"];

// Short, native-script label for each language, shown in the lang switcher
// regardless of the current locale (so it stays recognizable to speakers of
// that language rather than being translated).
export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "РУ",
  uz: "UZ",
  en: "EN",
};

export function pdfHref(kind: PdfKind, locale: Locale): string {
  return locale === "ru" ? `/${kind}` : `/${locale}/${kind}`;
}

export function homeHref(locale: Locale): string {
  return locale === "ru" ? "/" : `/${locale}`;
}
