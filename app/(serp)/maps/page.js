"use client";

import dynamic from "next/dynamic";

const MapPage = dynamic(() => import("@/views/MapPage/MapPage.jsx"), {
  ssr: false,
});

export default function MapsRoute() {
  return <MapPage />;
}
