import styles from "./HomePage.module.css";
import Header from "./Header";
import InfoGrid from "./InfoGrid";
import SababWord from "./SababWord";
import MobileBottomBar from "./MobileBottomBar";
import CustomCursor from "./CustomCursor";
import type { Dictionary, Locale } from "@/lib/dictionary";

/**
 * The page layout. Desktop/tablet (≥768px, unchanged): navbar, three-column
 * text block, giant sabab word pinned to the bottom. Below 768px the layout
 * is rearranged instead of just scaled: the giant word moves to the top
 * (replacing the navbar — see .mobileSababTop/Header's own 767px rule), the
 * same three-column block stays in the middle, and a bottom bar with the
 * portfolio button + language switcher replaces the desktop word slot (see
 * MobileBottomBar / .sababSection's 767px rule). Both variants of the word
 * and both variants of the portfolio/language controls render in the DOM at
 * all times — CSS `display: none` toggles which set shows, so there's no
 * client-side breakpoint check and therefore no hydration flash.
 */
export default function HomePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className={styles.page}>
      <Header dict={dict} locale={locale} delayIndex={0} />

      <div className={styles.mobileSababTop}>
        <SababWord dict={dict} delayIndex={0} />
      </div>

      <InfoGrid dict={dict} locale={locale} startDelayIndex={1} />

      <div className={styles.sababSection}>
        <SababWord dict={dict} delayIndex={4} />
      </div>

      <MobileBottomBar dict={dict} locale={locale} />

      <CustomCursor />
    </div>
  );
}
