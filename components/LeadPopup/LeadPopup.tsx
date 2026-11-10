"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";
import styles from "./LeadPopup.module.css";
import interactive from "../interactive.module.css";
import { privacyHref } from "@/lib/links";
import { TELEGRAM_CONTACT_URL } from "@/lib/constants";
import type { Dictionary, Locale } from "@/lib/dictionary";

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      execute: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type Status = "idle" | "sending" | "success" | "error";

export default function LeadPopup({
  onClose,
  closing,
  dict,
  locale,
  turnstileSiteKey,
}: {
  onClose: () => void;
  closing: boolean;
  dict: Dictionary;
  locale: Locale;
  turnstileSiteKey?: string;
}) {
  const { popup } = dict;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const turnstileElRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const resolveTokenRef = useRef<((token: string | null) => void) | null>(null);

  // Focus the first field, lock body scroll, trap Tab, close on Esc — all
  // for the lifetime of this component (it only mounts while open, see
  // LeadPopupContext).
  useEffect(() => {
    firstFieldRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Load the Turnstile script (once per page) and render an invisible,
  // manually-executed widget. No site key configured (e.g. local dev
  // without secrets) → skip entirely, submit just sends a null token and
  // the API route fails open on verification (see app/api/lead/route.ts).
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileElRef.current) return;
    let cancelled = false;

    function render() {
      if (cancelled || !window.turnstile || !turnstileElRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileElRef.current, {
        sitekey: turnstileSiteKey,
        size: "invisible",
        execution: "execute",
        callback: (token: string) => resolveTokenRef.current?.(token),
        "error-callback": () => resolveTokenRef.current?.(null),
        "expired-callback": () => resolveTokenRef.current?.(null),
      });
    }

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-turnstile-loader="true"]',
      );
      const script = existing ?? document.createElement("script");
      if (!existing) {
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.dataset.turnstileLoader = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", render, { once: true });
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [turnstileSiteKey]);

  function getTurnstileToken(): Promise<string | null> {
    if (!turnstileSiteKey || !widgetIdRef.current || !window.turnstile) {
      return Promise.resolve(null);
    }
    const widgetId = widgetIdRef.current;
    const turnstile = window.turnstile;
    return new Promise((resolve) => {
      resolveTokenRef.current = resolve;
      turnstile.execute(widgetId);
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const turnstileToken = await getTurnstileToken();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          contact: contact.trim(),
          locale,
          consent,
          honeypot,
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleOverlayMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.closing : ""}`}
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
        data-cursor-light-bg
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label={popup.close} />

        {status === "success" ? (
          <div className={styles.result}>
            <h2 id="lead-popup-title" className={styles.title}>
              {popup.success.title}
            </h2>
            <p className={styles.resultBody}>{popup.success.body}</p>
            <button type="button" className={interactive.btnSolidDark} onClick={onClose} data-cursor-invert>
              {popup.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="lead-popup-title" className={styles.title}>
              {popup.title}
            </h2>
            <p className={styles.subtitle}>{popup.subtitle}</p>

            <div className={styles.field}>
              <input
                ref={firstFieldRef}
                type="text"
                placeholder={popup.fields.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={200}
                autoComplete="name"
              />
            </div>

            <div className={styles.field}>
              <input
                type="text"
                placeholder={popup.fields.company}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={200}
                autoComplete="organization"
              />
            </div>

            <div className={styles.field}>
              <input
                type="text"
                placeholder={popup.fields.contact}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                maxLength={200}
                autoComplete="tel"
              />
            </div>

            {/* Honeypot: invisible to real visitors; a filled value marks the
                submission as spam server-side (app/api/lead/route.ts). */}
            <div className={styles.honeypot} aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <label className={styles.consent}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
              <span>
                {popup.consentPrefix}
                <a href={privacyHref(locale)} target="_blank" rel="noopener noreferrer" className={interactive.link}>
                  {popup.consentLinkText}
                </a>
                {popup.consentSuffix}
              </span>
            </label>

            {status === "error" && (
              <p className={styles.error}>
                {popup.error.bodyPrefix}
                <a
                  href={TELEGRAM_CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={interactive.link}
                >
                  {popup.error.telegramLinkText}
                </a>
              </p>
            )}

            <div ref={turnstileElRef} />

            <button
              type="submit"
              className={interactive.btnSolidDark}
              disabled={status === "sending"}
              data-cursor-invert
            >
              {status === "sending" ? popup.sending : popup.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
