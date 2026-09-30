"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./NavTabs.css";

function NavTabs() {
  const pathname = usePathname();
  const wrapRef = useRef(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const pages = [
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

  const currentTab = pages.findIndex((page) => {
    if (page.path === "/") {
      return pathname === "/" || pathname === "/all";
    }
    if (page.path === "/lyrics" && pathname.startsWith("/lyrics")) {
      return true;
    }
    if (page.path === "/blog" && pathname.startsWith("/blog")) {
      return true;
    }
    return page.path === pathname;
  });

  const updateFades = useCallback(() => {
    const scroller = wrapRef.current?.querySelector(".MuiTabs-scroller");
    if (!scroller) return;

    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    const maxScroll = scrollWidth - clientWidth;

    setFadeLeft(scrollLeft > 1);
    setFadeRight(maxScroll > 1 && scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const scroller = root.querySelector(".MuiTabs-scroller");
    if (!scroller) return;

    updateFades();
    scroller.addEventListener("scroll", updateFades, { passive: true });

    const ro = new ResizeObserver(updateFades);
    ro.observe(scroller);
    const list = scroller.querySelector(".MuiTabs-flexContainer");
    if (list) ro.observe(list);

    return () => {
      scroller.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, [updateFades, currentTab]);

  const className = [
    "nav-tabs",
    fadeLeft ? "nav-tabs--fade-left" : "",
    fadeRight ? "nav-tabs--fade-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapRef} className={className}>
      <Tabs
        value={currentTab === -1 ? false : currentTab}
        scrollButtons={false}
        variant="scrollable"
        sx={{
          minHeight: 40,
          "& .MuiTabs-indicator": {
            height: 3,
            backgroundColor: "#1a73e8",
            display: currentTab === -1 ? "none" : undefined,
          },
          "& .MuiTab-root": {
            textTransform: "none",
            minHeight: 40,
            minWidth: "auto",
            padding: "0 12px",
            fontSize: 13,
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#5f6368",
            fontWeight: 400,
            "&.Mui-selected": {
              color: "#1a73e8",
              fontWeight: 500,
            },
          },
        }}
      >
        {pages.map((page) => (
          <Tab
            key={page.label}
            component={Link}
            href={page.path}
            label={page.label}
          />
        ))}
      </Tabs>
    </div>
  );
}

export default NavTabs;
