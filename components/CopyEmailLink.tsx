"use client";

import { useEffect, useRef, useState } from "react";
import interactive from "./interactive.module.css";
import styles from "./CopyEmailLink.module.css";
import { EMAIL, EMAIL_HREF } from "@/lib/constants";

const TOAST_MS = 1500;

export default function CopyEmailLink({ copiedLabel }: { copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    navigator.clipboard?.writeText(EMAIL).catch(() => {
      /* clipboard may be unavailable (insecure context, denied permission) —
         the mailto fallback below still gets the user to the right place. */
    });
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      window.location.href = EMAIL_HREF;
    }, TOAST_MS);
  }

  return (
    <span className={styles.wrap}>
      <a href={EMAIL_HREF} className={interactive.link} onClick={handleClick}>
        {EMAIL}
      </a>
      <span
        className={`${styles.toast} ${copied ? styles.toastVisible : ""}`}
        role="status"
        aria-live="polite"
      >
        {copiedLabel}
      </span>
    </span>
  );
}
