import interactive from "./interactive.module.css";
import styles from "./ContactLinks.module.css";
import CopyEmailLink from "./CopyEmailLink";
import type { Dictionary } from "@/lib/dictionary";
import {
  PHONE_1,
  PHONE_1_HREF,
  PHONE_2,
  PHONE_2_HREF,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/lib/constants";

export default function ContactLinks({ dict }: { dict: Dictionary }) {
  return (
    <ul className={styles.list}>
      <li>
        <a href={PHONE_1_HREF} className={interactive.link}>
          {PHONE_1}
        </a>
      </li>
      <li>
        <a href={PHONE_2_HREF} className={interactive.link}>
          {PHONE_2}
        </a>
      </li>
      <li>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={interactive.link}
        >
          Instagram {INSTAGRAM_HANDLE}
        </a>
      </li>
      <li>
        <CopyEmailLink copiedLabel={dict.columns.contacts.copiedLabel} />
      </li>
    </ul>
  );
}
