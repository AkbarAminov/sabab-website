"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";
import { useFineHover, useReducedMotion } from "@/lib/useMediaQuery";

const LERP = 0.2;

/**
 * Global, single-instance cursor replacement — a 20px cream circle that
 * tracks the pointer, shrinks + darkens over any link/button, and grows
 * into a plate with an arrow icon only over the sabab word (the one element
 * that sets `data-cursor-arrow`). Position tracking (this component) and
 * visual state (CSS classes below) are deliberately split across two nested
 * elements: the outer one gets its transform written every animation frame,
 * so a CSS transition on the same property for the inner one's hover/press
 * states can't be clobbered by that per-frame write.
 *
 * Only mounts its listeners on hover-capable / fine-pointer devices. Still
 * renders under prefers-reduced-motion (unlike most motion in this app) —
 * it just snaps straight to the pointer instead of trailing behind it.
 */
export default function CustomCursor() {
  const fineHover = useFineHover();
  const reducedMotion = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [appeared, setAppeared] = useState(false);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    if (!fineHover) return;

    function handleMove(e: PointerEvent) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setAppeared(true);

      const el = e.target as Element | null;
      const sababEl = el?.closest("[data-cursor-arrow]") ?? null;

      if (sababEl) {
        setExpanded(true);
        setIsInteractive(false);
      } else {
        setExpanded(false);
        setIsInteractive(Boolean(el?.closest("a, button, [role='button']")));
      }
    }

    function handleLeaveWindow() {
      setAppeared(false);
      setExpanded(false);
      setIsInteractive(false);
      setPressed(false);
    }

    function handlePointerDown() {
      setPressed(true);
    }

    function handlePointerUp() {
      setPressed(false);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeaveWindow);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    function tick() {
      const c = current.current;
      const t = target.current;

      if (reducedMotionRef.current) {
        c.x = t.x;
        c.y = t.y;
      } else {
        c.x += (t.x - c.x) * LERP;
        c.y += (t.y - c.y) * LERP;
      }

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeaveWindow);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [fineHover]);

  if (!fineHover) return null;

  const dotClassName = [
    styles.cursor,
    appeared && styles.visible,
    isInteractive && styles.interactive,
    expanded && styles.expanded,
    pressed && styles.pressed,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      <div className={dotClassName}>
        {expanded ? <img src="/arrow.svg" alt="" className={styles.arrowIcon} /> : null}
      </div>
    </div>
  );
}
