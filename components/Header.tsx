import type { CSSProperties } from "react";
import styles from "./Header.module.css";
import interactive from "./interactive.module.css";
import PdfLink from "./PdfLink";
import LangSwitcher from "./LangSwitcher";
import type { Dictionary, Locale } from "@/lib/dictionary";
import { INSTAGRAM_URL } from "@/lib/constants";

export default function Header({
  dict,
  locale,
  delayIndex,
}: {
  dict: Dictionary;
  locale: Locale;
  delayIndex: number;
}) {
  const style = { "--reveal-delay": `${delayIndex * 80}ms` } as CSSProperties;

  return (
    <header className={`${styles.header} reveal`} style={style}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logoLink}
        aria-label={dict.header.logoCtaAria}
      >
        <img className={styles.logo} src="/logo-full.svg" alt="" />
      </a>

      <div className={styles.actions}>
        <PdfLink kind="portfolio" locale={locale} className={interactive.btn}>
          <span className={styles.full}>{dict.header.portfolio.full}</span>
          <span className={styles.short}>{dict.header.portfolio.short}</span>
        </PdfLink>

        <LangSwitcher locale={locale} aria={dict.header.langSwitch.aria} />
      </div>
    </header>
  );
}
