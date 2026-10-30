"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "./wordmark";
import "./GoogleLogo.css";

const WORDMARK_SEEN_KEY = "dd-wordmark-seen";

function GoogleLogo({ style, animateOnLoad = false }) {
  const pathname = usePathname();
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [markSeenOnEnd, setMarkSeenOnEnd] = useState(false);

  useEffect(() => {
    if (!animateOnLoad) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    try {
      if (window.localStorage.getItem(WORDMARK_SEEN_KEY) === "1") {
        return undefined;
      }
    } catch {
      return undefined;
    }
    setMarkSeenOnEnd(true);
    setPlaying(true);
    return undefined;
  }, [animateOnLoad]);

  const replay = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
    setRun((n) => n + 1);
  };

  const onLetterAnimationEnd = (index) => {
    if (!markSeenOnEnd || index !== WORDMARK_LETTERS.length - 1) return;
    setMarkSeenOnEnd(false);
    try {
      window.localStorage.setItem(WORDMARK_SEEN_KEY, "1");
    } catch {
      /* storage unavailable */
    }
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
    playing ? "wordmark--play" : "wordmark--static",
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
          key={playing ? run : "static"}
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
              onAnimationEnd={() => onLetterAnimationEnd(index)}
            />
          ))}
        </svg>
      </Link>
    </div>
  );
}

export default GoogleLogo;
