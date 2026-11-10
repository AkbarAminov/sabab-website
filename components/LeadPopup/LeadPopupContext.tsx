"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import LeadPopup from "./LeadPopup";
import type { Dictionary, Locale } from "@/lib/dictionary";

interface LeadPopupContextValue {
  open: () => void;
}

const LeadPopupContext = createContext<LeadPopupContextValue | null>(null);

export function useLeadPopup(): LeadPopupContextValue {
  const ctx = useContext(LeadPopupContext);
  if (!ctx) throw new Error("useLeadPopup must be used within LeadPopupProvider");
  return ctx;
}

// Matches --dur in globals.css (the exit animation's duration) — closing
// unmounts the popup only once that animation has actually finished, so it
// fades out instead of vanishing instantly.
const CLOSE_ANIMATION_MS = 350;

/**
 * Wraps the page, owns whether the request popup is open, and renders it.
 * Any descendant can open it via useLeadPopup() without threading a prop
 * down through Header / Hero / MobileBottomBar / SababWord — only the
 * actual trigger elements (OpenLeadPopupButton, SababWord) need to be
 * client components.
 */
export function LeadPopupProvider({
  dict,
  locale,
  turnstileSiteKey,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  turnstileSiteKey?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  // Remembers what had focus before opening, so closing (via X, Esc, or
  // overlay click) returns focus there instead of dropping it to <body>.
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setClosing(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    triggerRef.current?.focus?.();
    triggerRef.current = null;
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
  }, []);

  return (
    <LeadPopupContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <LeadPopup
          onClose={close}
          closing={closing}
          dict={dict}
          locale={locale}
          turnstileSiteKey={turnstileSiteKey}
        />
      )}
    </LeadPopupContext.Provider>
  );
}
