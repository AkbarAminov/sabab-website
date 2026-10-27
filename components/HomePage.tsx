import styles from "./HomePage.module.css";
import Header from "./Header";
import InfoGrid from "./InfoGrid";
import SababWord from "./SababWord";
import CustomCursor from "./CustomCursor";
import type { Dictionary, Locale } from "@/lib/dictionary";

/**
 * The entire one-page layout: header, four-column text block, giant sabab
 * word. Shared verbatim between the RU route ("/") and the EN route
 * ("/en") — only `dict`/`locale` change.
 */
export default function HomePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className={styles.page}>
      <Header dict={dict} locale={locale} delayIndex={0} />
      <InfoGrid dict={dict} locale={locale} startDelayIndex={1} />
      <div className={styles.sababSection}>
        <SababWord dict={dict} delayIndex={4} />
      </div>
      <CustomCursor />
    </div>
  );
}
