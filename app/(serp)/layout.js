"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import NavTabs from "@/components/NavTabs/NavTabs.jsx";
import Header from "@/components/Header/Header.jsx";
import HangoutsChat from "@/components/HangoutsChat/HangoutsChat.jsx";
import "@/components/Layout/Layout.css";

export default function SerpLayout({ children }) {
  const pathname = usePathname();
  const isMaps = pathname === "/maps";

  return (
    <div className={`site-layout${isMaps ? " site-layout--maps" : ""}`}>
      <Header currentPath={pathname} />
      <NavTabs />
      <Box
        className={isMaps ? "site-main site-main--maps" : "site-main"}
        sx={isMaps ? undefined : { margin: "1rem" }}
      >
        {children}
      </Box>
      <HangoutsChat />
    </div>
  );
}
