import type { CSSProperties } from "react";
import styles from "./InfoGrid.module.css";
import interactive from "./interactive.module.css";
import PdfLink from "./PdfLink";
import ContactLinks from "./ContactLinks";
import type { Dictionary, Locale } from "@/lib/dictionary";

function delayStyle(index: number): CSSProperties {
  return { "--reveal-delay": `${index * 80}ms` } as CSSProperties;
}

export default function InfoGrid({
  dict,
  locale,
  startDelayIndex,
}: {
  dict: Dictionary;
  locale: Locale;
  startDelayIndex: number;
}) {
  const { whoWeAre, services, contacts } = dict.columns;

  return (
    <section className={styles.grid} aria-label={dict.header.logoAlt}>
      <div className="reveal" style={delayStyle(startDelayIndex)}>
        <h2 className={styles.heading}>{whoWeAre.heading}</h2>
        <p className={styles.lead}>{whoWeAre.lead}</p>
        <p className={styles.body}>{whoWeAre.body}</p>
      </div>

      <div className="reveal" style={delayStyle(startDelayIndex + 1)}>
        <h2 className={styles.heading}>{services.heading}</h2>
        <div className={styles.servicesCol}>
          <p className={styles.body}>{services.body}</p>
          <PdfLink kind="services" locale={locale} className={interactive.arrowLink}>
            <span className={interactive.text}>{services.linkLabelText}</span>
            <span className={interactive.arrow} aria-hidden="true">
              →
            </span>
          </PdfLink>
        </div>
      </div>

      <div className="reveal" style={delayStyle(startDelayIndex + 2)}>
        <h2 className={styles.heading}>{contacts.heading}</h2>
        <ContactLinks dict={dict} />
      </div>
    </section>
  );
}
