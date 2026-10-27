"use client";

import { useEffect, useRef, useState } from "react";
import interactive from "./interactive.module.css";
import styles from "./LangSwitcher.module.css";
import { ALL_LOCALES, LOCALE_LABELS, homeHref } from "@/lib/links";
import type { Locale } from "@/lib/dictionary";

export default function LangSwitcher({ locale, aria }: { locale: Locale; aria: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={rootRef}>
      <button
        type="button"
        className={`${interactive.btn} ${styles.trigger}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={aria}
        onClick={() => setOpen((v) => !v)}
      >
        {LOCALE_LABELS[locale]}
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {ALL_LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <a
                href={homeHref(code)}
                className={`${styles.option} ${code === locale ? styles.optionActive : ""}`}
                onClick={() => setOpen(false)}
              >
                {LOCALE_LABELS[code]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
