"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./SababWord.module.css";
import { SABAB_PATHS, SABAB_VIEWBOX } from "@/lib/sababPaths";
import { INSTAGRAM_URL } from "@/lib/constants";
import { useFineHover, useReducedMotion } from "@/lib/useMediaQuery";
import type { Dictionary } from "@/lib/dictionary";

const MAX_DEPTH = 11; // px, within the 8–12px the brief asks for

export default function SababWord({
  dict,
  delayIndex,
}: {
  dict: Dictionary;
  delayIndex: number;
}) {
  const delayStyle = { "--reveal-delay": `${delayIndex * 80}ms` } as CSSProperties;
  const fineHover = useFineHover();
  const reducedMotion = useReducedMotion();
  const wellActive = fineHover && !reducedMotion;

  const containerRef = useRef<HTMLAnchorElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const rafPending = useRef(false);
  const lastEvent = useRef<{ x: number } | null>(null);

  useEffect(() => {
    if (!wellActive) return;
    const el = containerRef.current;
    if (!el) return;

    function applyWell(x: number) {
      const rects = pathRefs.current.map((p) => p?.getBoundingClientRect() ?? null);
      const widths = rects.filter(Boolean).map((r) => r!.width);
      const avgWidth = widths.reduce((s, w) => s + w, 0) / (widths.length || 1);
      const radius = avgWidth * 1.35;

      rects.forEach((r, i) => {
        const path = pathRefs.current[i];
        if (!path || !r) return;
        const cx = r.left + r.width / 2;
        const dx = Math.abs(x - cx);
        const influence = Math.max(0, 1 - dx / radius);
        const eased = influence * influence;
        const depth = MAX_DEPTH * eased;
        path.style.transform = depth > 0.05 ? `translateY(${depth}px)` : "";
      });
    }

    function scheduleApply() {
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        if (lastEvent.current) applyWell(lastEvent.current.x);
      });
    }

    function handleMove(e: PointerEvent) {
      lastEvent.current = { x: e.clientX };
      scheduleApply();
    }

    function handleLeave() {
      lastEvent.current = null;
      pathRefs.current.forEach((p) => {
        if (p) p.style.transform = "";
      });
    }

    el.addEventListener("pointermove", handleMove, { passive: true });
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [wellActive]);

  return (
    <>
      <a
        ref={containerRef}
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        style={delayStyle}
        aria-label={dict.sababWord.ariaLabel}
        data-cursor-arrow
      >
        <svg
          className={styles.svg}
          viewBox={SABAB_VIEWBOX}
          role="img"
          aria-hidden="true"
        >
          {SABAB_PATHS.map((d, i) => (
            <path
              key={i}
              ref={(node) => {
                pathRefs.current[i] = node;
              }}
              d={d}
            />
          ))}
        </svg>
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.mobileCta} reveal`}
        style={delayStyle}
      >
        {dict.sababWord.mobileCta}
      </a>
    </>
  );
}
