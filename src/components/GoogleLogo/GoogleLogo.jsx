"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "./wordmark";
import "./GoogleLogo.css";

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function GoogleLogo({ style, animateOnLoad = false }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(animateOnLoad);

  const replay = () => {
    if (reduced) return;
    setPlaying(true);
    setRun((n) => n + 1);
  };

  const onClick = (event) => {
    if (pathname === "/home") {
      event.preventDefault();
      replay();
    }
  };

  const className = [
    "logo",
    "wordmark",
    playing && !reduced ? "wordmark--play" : "wordmark--static",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="logo-container" style={style}>
      <Link
        href="/home"
        aria-label="drew della"
        onClick={onClick}
        onMouseEnter={replay}
      >
        <svg
          key={reduced ? "static" : run}
          className={className}
          viewBox={WORDMARK_VIEWBOX}
          role="img"
          aria-hidden="true"
        >
          {WORDMARK_LETTERS.map((glyph, index) => (
            <path
              key={glyph.id}
              className="wordmark-letter"
              d={glyph.d}
              fill={glyph.fill}
              fillRule="evenodd"
              style={{ animationDelay: `${index * 0.11}s` }}
            />
          ))}
        </svg>
      </Link>
    </div>
  );
}

export default GoogleLogo;
