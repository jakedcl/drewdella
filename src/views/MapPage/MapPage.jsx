"use client";

import dynamic from "next/dynamic";
import "./MapPage.css";

const Map = dynamic(() => import("../../components/Map/Map.jsx"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading map…</div>,
});

export default function MapPage({ locations = [], loadError = "" }) {
  return (
    <div className="map-page">
      <Map locations={locations} loadError={loadError} />
    </div>
  );
}
