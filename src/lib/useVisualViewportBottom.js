"use client";

import { useEffect, useState } from "react";

/**
 * Pins fixed bottom docks to the visible viewport bottom.
 * Mobile URL-bar show/hide shifts visualViewport; plain bottom:12px then bobs
 * and can clip under the fold while the page scrolls.
 */
export function useVisualViewportBottom(basePx = 12) {
  const [bottom, setBottom] = useState(
    `calc(${basePx}px + env(safe-area-inset-bottom, 0px))`
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;

    const update = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setBottom(
        `calc(${basePx + inset}px + env(safe-area-inset-bottom, 0px))`
      );
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [basePx]);

  return bottom;
}
