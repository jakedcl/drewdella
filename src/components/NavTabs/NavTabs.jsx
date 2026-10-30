"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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

function indicatorPath(pendingPath, pathname) {
  if (pendingPath) return pendingPath;
  return PAGES.find((page) => isCurrent(page, pathname))?.path || "/";
}

function NavTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollerRef = useRef(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(true);
  const [pendingPath, setPendingPath] = useState(null);

  const activeIndicator = indicatorPath(pendingPath, pathname);

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
    const link = scroller.querySelector(`a[data-tab-path="${activeIndicator}"]`);
    if (!link) return;
    const pad = 64;
    const left = link.offsetLeft;
    const right = left + link.offsetWidth;
    const { scrollLeft, clientWidth } = scroller;
    if (left - pad < scrollLeft) {
      scroller.scrollLeft = Math.max(0, left - pad);
    } else if (right + pad > scrollLeft + clientWidth) {
      scroller.scrollLeft = right + pad - clientWidth;
    }
  }, [activeIndicator]);

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
  }, [measureFade, revealActive, activeIndicator]);

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const warmRoute = useCallback(
    (href) => {
      if (!href || href === pathname) return;
      router.prefetch(href);
    },
    [pathname, router]
  );

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
    transitionTo(() => {
      flushSync(() => setPendingPath(href));
      router.push(href);
    });
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
          const pending = pendingPath === page.path;
          const tabClass = [
            current ? "is-active" : "",
            pending && !current ? "is-pending" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const showIndicator = page.path === activeIndicator;
          return (
            <Link
              key={page.path}
              href={page.path}
              data-tab-path={page.path}
              className={tabClass || undefined}
              aria-current={current ? "page" : undefined}
              onClick={(event) => onTabClick(event, page.path)}
              onPointerEnter={() => warmRoute(page.path)}
              onTouchStart={() => warmRoute(page.path)}
              onFocus={() => warmRoute(page.path)}
            >
              <span className="nav-tabs-label">
                {page.label}
                {showIndicator ? <span className="nav-tabs-indicator" /> : null}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavTabs;
