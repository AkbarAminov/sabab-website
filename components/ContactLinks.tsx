import interactive from "./interactive.module.css";
import styles from "./ContactLinks.module.css";
import { PHONE_1, PHONE_1_HREF, INSTAGRAM_URL, INSTAGRAM_HANDLE, EMAIL, EMAIL_HREF } from "@/lib/constants";

export default function ContactLinks() {
  return (
    <ul className={styles.list}>
      <li>
        <a href={PHONE_1_HREF} className={interactive.link}>
          {PHONE_1}
        </a>
      </li>
      <li>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={interactive.link}>
          {INSTAGRAM_HANDLE}
        </a>
      </li>
      <li>
        <a href={EMAIL_HREF} className={interactive.link}>
          {EMAIL}
        </a>
      </li>
    </ul>
  );
}
