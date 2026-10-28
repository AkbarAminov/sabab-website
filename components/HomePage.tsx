import styles from "./HomePage.module.css";
import interactive from "./interactive.module.css";
import Header from "./Header";
import InfoGrid from "./InfoGrid";
import PdfLink from "./PdfLink";
import SababWord from "./SababWord";
import CustomCursor from "./CustomCursor";
import type { Dictionary, Locale } from "@/lib/dictionary";

/**
 * The entire one-page layout: header, four-column text block, giant sabab
 * word. Shared verbatim between the RU route ("/") and the EN route
 * ("/en") — only `dict`/`locale` change.
 *
 * The portfolio button lives in the header at tablet width and up; below the
 * mobile breakpoint it moves here instead and replaces the sabab word
 * entirely, taking over the same bottom-pinned spot (see
 * Header.module.css's .desktopPortfolio for the other half of that swap).
 */
export default function HomePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className={styles.page}>
      <Header dict={dict} locale={locale} delayIndex={0} />
      <InfoGrid dict={dict} locale={locale} startDelayIndex={1} />
      <div className={styles.sababSection}>
        <SababWord dict={dict} delayIndex={4} />
        <div className={styles.mobilePortfolio}>
          <PdfLink
            kind="portfolio"
            locale={locale}
            className={`${interactive.btn} ${styles.mobilePortfolioBtn}`}
          >
            {dict.header.portfolio}
          </PdfLink>
        </div>
      </div>
      <CustomCursor />
    </div>
  );
}
