"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NavTabs from "@/components/NavTabs/NavTabs.jsx";
import Header from "@/components/Header/Header.jsx";
import PageHeading from "@/components/PageHeading.jsx";
import { navigationFinished } from "@/lib/viewTransition";
import "@/components/Layout/Layout.css";

const HangoutsChat = dynamic(
  () => import("@/components/HangoutsChat/HangoutsChat.jsx"),
  { ssr: false }
);

export default function SerpShell({ children }) {
  const pathname = usePathname();
  const isMaps = pathname === "/maps";

  useEffect(() => {
    navigationFinished();
  }, [pathname]);

  return (
    <div className={`site-layout${isMaps ? " site-layout--maps" : ""}`}>
      <Header currentPath={pathname} />
      <NavTabs />
      <main className={isMaps ? "site-main site-main--maps" : "site-main"}>
        <PageHeading pathname={pathname} />
        {children}
      </main>
      <HangoutsChat />
    </div>
  );
}
