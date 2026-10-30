"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "./wordmark";
import "./GoogleLogo.css";

function GoogleLogo({ style, animateOnLoad = false }) {
  const pathname = usePathname();
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!animateOnLoad) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    setPlaying(true);
    return undefined;
  }, [animateOnLoad]);

  const replay = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
            />
          ))}
        </svg>
      </Link>
    </div>
  );
}

export default GoogleLogo;
