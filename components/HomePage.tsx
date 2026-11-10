import styles from "./HomePage.module.css";
import Header from "./Header";
import Hero from "./Hero";
import SababWord from "./SababWord";
import MobileBottomBar from "./MobileBottomBar";
import CustomCursor from "./CustomCursor";
import PageLoader from "./PageLoader";
import { LeadPopupProvider } from "./LeadPopup/LeadPopupContext";
import type { Dictionary, Locale } from "@/lib/dictionary";

/**
 * The page layout. Desktop/tablet (≥768px): header → centered manifesto
 * block (Hero) → giant "sabab" word pinned to the bottom. Below 768px the
 * giant word is dropped entirely and a full-width "ОСТАВИТЬ ЗАЯВКУ" button
 * (MobileBottomBar) is pinned to the bottom instead — both are last flex
 * children of `.page`, not position: fixed, so they push down naturally
 * (see HomePage.module.css / MobileBottomBar.module.css's display toggles).
 *
 * LeadPopupProvider wraps everything so the request popup can be opened
 * from the header CTA, the mobile bottom bar, or the sabab word itself,
 * without threading an onClick prop through each of those components.
 */
export default function HomePage({
  dict,
  locale,
  turnstileSiteKey,
}: {
  dict: Dictionary;
  locale: Locale;
  turnstileSiteKey?: string;
}) {
  return (
    <LeadPopupProvider dict={dict} locale={locale} turnstileSiteKey={turnstileSiteKey}>
      <div className={styles.page}>
        <Header dict={dict} locale={locale} delayIndex={0} />

        <Hero dict={dict} locale={locale} startDelayIndex={1} />

        <div className={styles.sababSection}>
          <SababWord dict={dict} delayIndex={6} />
        </div>

        <MobileBottomBar dict={dict} />

        <CustomCursor />
      </div>

      <PageLoader />
    </LeadPopupProvider>
  );
}
