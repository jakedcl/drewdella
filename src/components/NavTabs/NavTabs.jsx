"use client";

import React from "react";
import { Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./NavTabs.css";

function NavTabs() {
  const pathname = usePathname();

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

  return (
    <div className="nav-tabs">
      <Tabs
        value={currentTab === -1 ? false : currentTab}
        scrollButtons="auto"
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
