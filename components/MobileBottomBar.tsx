import styles from "./MobileBottomBar.module.css";
import interactive from "./interactive.module.css";
import PdfLink from "./PdfLink";
import LangSwitcher from "./LangSwitcher";
import type { Dictionary, Locale } from "@/lib/dictionary";

/**
 * Below 768px only: a single-row bar pinned to the bottom of the page by
 * being the last flex child (not position: fixed — see HomePage.module.css),
 * replacing the desktop header's portfolio button + language switcher.
 */
export default function MobileBottomBar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className={styles.bar}>
      <PdfLink kind="portfolio" locale={locale} className={`${interactive.btn} ${styles.portfolioBtn}`}>
        {dict.header.portfolio}
      </PdfLink>
      <LangSwitcher locale={locale} aria={dict.header.langSwitch.aria} variant="bar" />
    </div>
  );
}
