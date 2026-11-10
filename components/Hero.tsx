import type { CSSProperties } from "react";
import styles from "./Hero.module.css";
import interactive from "./interactive.module.css";
import PdfLink from "./PdfLink";
import ContactLinks from "./ContactLinks";
import type { Dictionary, Locale } from "@/lib/dictionary";

function delayStyle(index: number): CSSProperties {
  return { "--reveal-delay": `${index * 80}ms` } as CSSProperties;
}

export default function Hero({
  dict,
  locale,
  startDelayIndex,
}: {
  dict: Dictionary;
  locale: Locale;
  startDelayIndex: number;
}) {
  const { title, lead, ctaServices, ctaPortfolio, mobileInvite } = dict.hero;

  return (
    <section className={styles.hero}>
      <h1 className={`${styles.title} reveal`} style={delayStyle(startDelayIndex)}>
        {title.prefix}{" "}
        <span className={styles.morph}>
          <em className={styles.morphWord}>{title.emphasis}</em>
          <em className={`${styles.morphWord} ${styles.morphAlt}`} aria-hidden="true">
            sabab
          </em>
        </span>
        {title.suffix}
      </h1>

      <p className={`${styles.lead} reveal`} style={delayStyle(startDelayIndex + 1)}>
        {lead}
      </p>

      <div className={`${styles.actions} reveal`} style={delayStyle(startDelayIndex + 2)}>
        <PdfLink kind="services" locale={locale} className={interactive.btn}>
          {ctaServices}
        </PdfLink>
        <PdfLink kind="portfolio" locale={locale} className={interactive.btn}>
          {ctaPortfolio}
        </PdfLink>
      </div>

      <p className={`${styles.mobileInvite} reveal`} style={delayStyle(startDelayIndex + 3)}>
        {mobileInvite}
      </p>

      <div className={`${styles.contacts} reveal`} style={delayStyle(startDelayIndex + 4)}>
        <ContactLinks />
      </div>
    </section>
  );
}
