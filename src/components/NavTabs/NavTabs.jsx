"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  const indicatorRef = useRef(null);
  const skipTransitionRef = useRef(true);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(true);
  const [pendingPath, setPendingPath] = useState(null);
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [indicatorAnimating, setIndicatorAnimating] = useState(false);

  const activeIndicator = indicatorPath(pendingPath, pathname);

  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const measureFade = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    const maxScroll = scrollWidth - clientWidth;
    setFadeLeft(scrollLeft > 1);
    setFadeRight(maxScroll > 1 && scrollLeft < maxScroll - 1);
  }, []);

  const positionIndicator = useCallback(() => {
    const scroller = scrollerRef.current;
    const indicator = indicatorRef.current;
    if (!scroller || !indicator) return;
    const link = scroller.querySelector(
      `a[data-tab-path="${activeIndicator}"]`
    );
    if (!link) return;

    const instant = skipTransitionRef.current || prefersReducedMotion();
    if (instant) {
      indicator.style.transition = "none";
    }

    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;

    if (instant) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
      skipTransitionRef.current = false;
    }

    setIndicatorReady(true);
  }, [activeIndicator, prefersReducedMotion]);

  const revealActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const link = scroller.querySelector(
      `a[data-tab-path="${activeIndicator}"]`
    );
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

  useLayoutEffect(() => {
    positionIndicator();
    revealActive();
  }, [positionIndicator, revealActive, activeIndicator]);

  useEffect(() => {
    measureFade();
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const onScroll = () => {
      measureFade();
      skipTransitionRef.current = true;
      positionIndicator();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      measureFade();
      skipTransitionRef.current = true;
      positionIndicator();
      revealActive();
    });
    ro.observe(scroller);

    const onResize = () => {
      measureFade();
      skipTransitionRef.current = true;
      positionIndicator();
    };
    window.addEventListener("resize", onResize);

    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        skipTransitionRef.current = true;
        positionIndicator();
        revealActive();
      });
    }

    return () => {
      cancelled = true;
      scroller.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [measureFade, positionIndicator, revealActive]);

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
    if (!prefersReducedMotion()) {
      setIndicatorAnimating(true);
    }
    flushSync(() => setPendingPath(href));
    transitionTo(() => router.push(href));
  };

  const onIndicatorTransitionEnd = (event) => {
    if (event.target !== indicatorRef.current) return;
    if (event.propertyName !== "transform" && event.propertyName !== "width") {
      return;
    }
    setIndicatorAnimating(false);
  };

  const className = [
    "nav-tabs",
    fadeLeft ? "nav-tabs--fade-left" : "",
    fadeRight ? "nav-tabs--fade-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const indicatorClass = [
    "nav-tabs-indicator",
    indicatorReady ? "nav-tabs-indicator--ready" : "",
    indicatorAnimating ? "nav-tabs-indicator--animating" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={className} aria-label="Result types">
      <div className="nav-tabs-scroller" ref={scrollerRef}>
        <span
          ref={indicatorRef}
          className={indicatorClass}
          aria-hidden
          onTransitionEnd={onIndicatorTransitionEnd}
        />
        {PAGES.map((page) => {
          const current = isCurrent(page, pathname);
          const pending = pendingPath === page.path;
          const tabClass = [
            current ? "is-active" : "",
            pending && !current ? "is-pending" : "",
          ]
            .filter(Boolean)
            .join(" ");
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
              <span className="nav-tabs-label">{page.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavTabs;
