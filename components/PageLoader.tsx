"use client";

import { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";
import { SABAB_PATHS, SABAB_VIEWBOX } from "@/lib/sababPaths";
import { useReducedMotion } from "@/lib/useMediaQuery";

// Long enough to read as a deliberate brand moment (~2 pulse cycles) — most
// of this is already spent waiting on document.fonts.ready (Cera Pro)
// anyway, this just adds a floor under fast connections too.
const MIN_VISIBLE_MS = 2000;
// Matches the CSS fade-out transition below.
const FADE_OUT_MS = 400;

/**
 * Brief branded splash (the sabab wordmark, pulsing) shown over the page on
 * first mount — covers the moment before Cera Pro has finished loading
 * (avoiding a flash of the fallback font on a page whose whole point is its
 * typography) and gives the entrance reveal animations underneath a clean
 * start instead of racing them. Fades out smoothly rather than popping away;
 * skipped near-instantly under prefers-reduced-motion.
 */
export default function PageLoader() {
  const reducedMotion = useReducedMotion();
  const [hiding, setHiding] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();

    fontsReady.then(() => {
      if (cancelled) return;
      const remaining = reducedMotion ? 0 : Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      window.setTimeout(() => {
        if (cancelled) return;
        setHiding(true);
        window.setTimeout(() => {
          if (!cancelled) setHidden(true);
        }, reducedMotion ? 0 : FADE_OUT_MS);
      }, remaining);
    });

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  if (hidden) return null;

  return (
    <div className={`${styles.loader} ${hiding ? styles.hiding : ""}`} aria-hidden="true">
      <svg className={styles.mark} viewBox={SABAB_VIEWBOX} role="img">
        {SABAB_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  );
}
