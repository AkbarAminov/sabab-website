"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns `false` on the server and on first
 * client render, then syncs to the real value in an effect — this avoids a
 * hydration mismatch and is fine here because nothing above the fold
 * depends on the first paint already knowing pointer/motion capabilities.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useFineHover(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
