import type { CSSProperties } from "react";
import styles from "./Header.module.css";
import interactive from "./interactive.module.css";
import OpenLeadPopupButton from "./LeadPopup/OpenLeadPopupButton";
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
        <OpenLeadPopupButton className={`${interactive.btnSolidCream} ${styles.cta}`}>
          {dict.header.cta}
        </OpenLeadPopupButton>

        <LangSwitcher locale={locale} aria={dict.header.langSwitch.aria} />
      </div>
    </header>
  );
}
