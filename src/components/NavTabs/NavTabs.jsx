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
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });

  const update = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    const maxScroll = scrollWidth - clientWidth;
    setFadeLeft(scrollLeft > 1);
    setFadeRight(maxScroll > 1 && scrollLeft < maxScroll - 1);

    const active = scroller.querySelector("[aria-current='page']");
    if (!active) {
      setIndicator({ x: 0, width: 0 });
      return;
    }
    setIndicator({ x: active.offsetLeft, width: active.offsetWidth });
  }, []);

  useEffect(() => {
    update();
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    scroller.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(scroller);
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update, pathname]);

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
              {page.label}
            </Link>
          );
        })}
        <span
          className="nav-tabs-indicator"
          style={{
            transform: `translateX(${indicator.x}px)`,
            width: indicator.width,
            opacity: indicator.width ? 1 : 0,
          }}
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}

export default NavTabs;
