"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { transitionTo } from "../../lib/viewTransition";
import "./NavTabs.css";

const PAGES = [
  { label: "All", path: "/" },
  { label: "Music", path: "/music" },
  { label: "Images", path: "/images" },
  { label: "Videos", path: "/videos" },
  { label: "Blog", path: "/blog" },
  { label: "Socials", path: "/connect" },
  { label: "Lyrics", path: "/lyrics" },
  { label: "Store", path: "/shop" },
  { label: "Maps", path: "/maps" },
];

function isCurrent(page, pathname) {
  if (page.path === "/") return pathname === "/" || pathname === "/all";
  return pathname === page.path || pathname.startsWith(`${page.path}/`);
}

function NavTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollerRef = useRef(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(true);

  const measureFade = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    const maxScroll = scrollWidth - clientWidth;
    setFadeLeft(scrollLeft > 1);
    setFadeRight(maxScroll > 1 && scrollLeft < maxScroll - 1);
  }, []);

  const revealActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const active = scroller.querySelector("[aria-current='page']");
    if (!active) return;
    // Layout pixels, same space as offsetLeft/clientWidth. Clears the 3rem edge fade
    // even if this runs before the tab stylesheet is applied.
    const pad = 64;
    const left = active.offsetLeft;
    const right = left + active.offsetWidth;
    const { scrollLeft, clientWidth } = scroller;
    if (left - pad < scrollLeft) {
      scroller.scrollLeft = Math.max(0, left - pad);
    } else if (right + pad > scrollLeft + clientWidth) {
      scroller.scrollLeft = right + pad - clientWidth;
    }
  }, []);

  useEffect(() => {
    measureFade();
    revealActive();
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    scroller.addEventListener("scroll", measureFade, { passive: true });
    const ro = new ResizeObserver(() => {
      measureFade();
      revealActive();
    });
    ro.observe(scroller);
    window.addEventListener("resize", measureFade);
    return () => {
      scroller.removeEventListener("scroll", measureFade);
      ro.disconnect();
      window.removeEventListener("resize", measureFade);
    };
  }, [measureFade, revealActive, pathname]);

  const onTabClick = (event, href) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    transitionTo(() => router.push(href));
  };

  const className = [
    "nav-tabs",
    fadeLeft ? "nav-tabs--fade-left" : "",
    fadeRight ? "nav-tabs--fade-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={className} aria-label="Result types">
      <div className="nav-tabs-scroller" ref={scrollerRef}>
        {PAGES.map((page) => {
          const current = isCurrent(page, pathname);
          return (
            <Link
              key={page.path}
              href={page.path}
              className={current ? "is-active" : undefined}
              aria-current={current ? "page" : undefined}
              prefetch={false}
              onClick={(event) => onTabClick(event, page.path)}
            >
              <span className="nav-tabs-label">
                {page.label}
                {current ? <span className="nav-tabs-indicator" /> : null}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavTabs;
