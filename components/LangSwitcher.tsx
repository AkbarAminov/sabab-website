"use client";

import { useEffect, useRef, useState } from "react";
import interactive from "./interactive.module.css";
import styles from "./LangSwitcher.module.css";
import { ALL_LOCALES, LOCALE_LABELS, homeHref } from "@/lib/links";
import type { Locale } from "@/lib/dictionary";

export default function LangSwitcher({
  locale,
  aria,
  variant = "header",
}: {
  locale: Locale;
  aria: string;
  /** "header": desktop/tablet nav, opens down. "bar": mobile bottom bar,
   *  square trigger, opens up. */
  variant?: "header" | "bar";
}) {
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

  const triggerClassName = [interactive.btn, styles.trigger, variant === "bar" && styles.triggerBar]
    .filter(Boolean)
    .join(" ");
  const menuClassName = [styles.menu, variant === "bar" && styles.menuUp].filter(Boolean).join(" ");

  return (
    <div className={styles.wrap} ref={rootRef}>
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={aria}
        onClick={() => setOpen((v) => !v)}
      >
        {LOCALE_LABELS[locale]}
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {open && (
        <ul className={menuClassName} role="listbox">
          {ALL_LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              {/* No onClick to close the menu here on purpose — picking a
                  locale navigates to a different root layout (a full
                  navigation), which already discards this component's state.
                  Synchronously unmounting the link from its own click
                  handler raced with that navigation on mobile browsers and
                  could cancel it before the href was followed. */}
              <a
                href={homeHref(code)}
                className={`${styles.option} ${code === locale ? styles.optionActive : ""}`}
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
