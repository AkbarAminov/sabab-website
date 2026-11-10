import styles from "./MobileBottomBar.module.css";
import interactive from "./interactive.module.css";
import OpenLeadPopupButton from "./LeadPopup/OpenLeadPopupButton";
import type { Dictionary } from "@/lib/dictionary";

/**
 * Below 768px only: a single full-width "ОСТАВИТЬ ЗАЯВКУ" button pinned to
 * the bottom of the page by being the last flex child (not position: fixed
 * — see HomePage.module.css).
 */
export default function MobileBottomBar({ dict }: { dict: Dictionary }) {
  return (
    <div className={styles.bar}>
      <OpenLeadPopupButton className={`${interactive.btnSolidCream} ${styles.cta}`}>
        {dict.header.cta}
      </OpenLeadPopupButton>
    </div>
  );
}
