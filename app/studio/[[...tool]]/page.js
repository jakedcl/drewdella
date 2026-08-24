"use client";

import dynamic from "next/dynamic";
import "@/views/StudioPage/StudioPage.css";

const StudioApp = dynamic(
  () => import("@/views/StudioPage/StudioPage.jsx"),
  { ssr: false, loading: () => <div className="studio-root" /> }
);

export default function StudioRoute() {
  return <StudioApp />;
}
