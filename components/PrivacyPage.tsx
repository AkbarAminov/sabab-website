import styles from "./PrivacyPage.module.css";
import interactive from "./interactive.module.css";
import CustomCursor from "./CustomCursor";
import type { Dictionary, Locale } from "@/lib/dictionary";
import { homeHref } from "@/lib/links";

export default function PrivacyPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>{dict.privacy.title}</h1>
        <p className={styles.body}>{dict.privacy.body}</p>
        <a href={homeHref(locale)} className={interactive.btn}>
          {dict.privacy.backHome}
        </a>
      </div>
      <CustomCursor />
    </main>
  );
}
