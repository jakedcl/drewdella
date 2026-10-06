"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Map.css";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const pinSVG = `<svg width="27" height="36" viewBox="0 0 27 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M13.5 1.2C7.1 1.2 2 6.3 2 12.7 2 21.2 13.5 34.2 13.5 34.2S25 21.2 25 12.7C25 6.3 19.9 1.2 13.5 1.2z" fill="#EA4335" stroke="#fff" stroke-width="1.4"/>
  <circle cx="13.5" cy="12.6" r="4.2" fill="#fff"/>
</svg>`;

async function geocode(query, token) {
  if (!query || !token) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?limit=1&access_token=${token}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.features?.[0]?.center || null;
  } catch {
    return null;
  }
}

async function resolvePlaces(raw, token) {
  const places = [];
  for (const location of raw || []) {
    let lngLat = null;
    if (location.coordinates?.lng != null && location.coordinates?.lat != null) {
      lngLat = [location.coordinates.lng, location.coordinates.lat];
    } else if (location.address) {
      lngLat = await geocode(location.address, token);
    } else if (location.venueName) {
      lngLat = await geocode(location.venueName, token);
    }
    if (!lngLat) continue;
    places.push({
      id: location._id,
      venueName: location.venueName || "Venue",
      address: location.address || "",
      lngLat,
    });
  }
  return places;
}

export default function Map({ locations = [], loadError = "" }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(!loadError);
  const [error, setError] = useState(loadError);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState("");
  const [webgl, setWebgl] = useState(true);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  useEffect(() => {
    if (loadError) {
      setPlaces([]);
      setError(loadError);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const next = await resolvePlaces(locations, token);
        if (!cancelled) setPlaces(next);
      } catch (err) {
        console.error("Error resolving locations:", err);
        if (!cancelled) setError("Couldn’t load venues right now. Try again in a bit.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locations, token, loadError]);

  const canDraw = Boolean(token) && webgl && !mapFailed;

  useEffect(() => {
    if (!canDraw || !places.length || !mapNode.current || mapRef.current) return undefined;

    let map;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !mapNode.current) return;

      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: mapNode.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: places[0].lngLat,
        zoom: 11,
        attributionControl: true,
        pitch: 0,
        bearing: 0,
      });
      mapRef.current = map;

      map.on("error", (event) => {
        const status = event?.error?.status;
        if (status === 401 || status === 403) {
          setMapFailed("The map token was rejected.");
        }
      });

      map.on("load", () => {
        if (cancelled) return;
        map.resize();
        markersRef.current = places.map((place) => {
          const el = document.createElement("button");
          el.type = "button";
          el.className = "gpin";
          el.innerHTML = pinSVG;
          el.setAttribute("aria-label", place.venueName);
          el.addEventListener("click", (event) => {
            event.stopPropagation();
            setActiveId(place.id);
          });
          return {
            id: place.id,
            marker: new mapboxgl.Marker({ element: el, anchor: "bottom" })
              .setLngLat(place.lngLat)
              .addTo(map),
          };
        });
        const bounds = new mapboxgl.LngLatBounds(places[0].lngLat, places[0].lngLat);
        places.forEach((place) => bounds.extend(place.lngLat));
        map.fitBounds(bounds, { padding: 64, maxZoom: 14, duration: 0 });
        setMapReady(true);
      });
    })().catch((err) => {
      console.error("Map init error:", err);
      setMapFailed("The map couldn’t start in this browser.");
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((item) => item.marker.remove());
      markersRef.current = [];
      map?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [canDraw, places, token]);

  useEffect(() => {
    markersRef.current.forEach((item) => {
      item.marker.getElement()?.classList.toggle("is-active", item.id === activeId);
    });
    if (!activeId || !mapRef.current) return;
    const place = places.find((item) => item.id === activeId);
    if (!place) return;
    mapRef.current.easeTo({
      center: place.lngLat,
      zoom: Math.max(mapRef.current.getZoom(), 14),
      duration: prefersReducedMotion() ? 0 : 600,
      essential: true,
    });
  }, [activeId, places]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter((place) =>
      `${place.venueName} ${place.address}`.toLowerCase().includes(q)
    );
  }, [places, query]);

  const active = places.find((place) => place.id === activeId) || null;

  const zoom = (delta) => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomTo(map.getZoom() + delta, {
      duration: prefersReducedMotion() ? 0 : 200,
    });
  };

  const resetNorth = () => {
    mapRef.current?.easeTo({
      bearing: 0,
      pitch: 0,
      duration: prefersReducedMotion() ? 0 : 300,
    });
  };

  const fallback = !token
    ? "Mapbox isn’t set up yet. The venues are listed here."
    : !webgl
      ? "This browser can’t draw the map. The venues are listed here."
      : mapFailed;

  return (
    <div className="gmaps">
      <aside className="gmaps-panel">
        <form
          className="gmaps-search"
          onSubmit={(event) => {
            event.preventDefault();
            if (filtered[0]) setActiveId(filtered[0].id);
          }}
        >
          <label className="sr-only" htmlFor="venue-search">
            Search venues
          </label>
          <input
            id="venue-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search venues"
            autoComplete="off"
          />
        </form>
        <p className="gmaps-note">Shoutout to the venues that have hosted me</p>
        {loading ? <p className="gmaps-status">Loading venues…</p> : null}
        {error ? <p className="gmaps-status">{error}</p> : null}
        {!loading && !error && !filtered.length ? (
          <p className="gmaps-status">
            {places.length ? "No venues match that search." : "No venues pinned yet."}
          </p>
        ) : null}
        <ul className="gmaps-results">
          {filtered.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                className={place.id === activeId ? "is-active" : ""}
                onClick={() => setActiveId(place.id)}
              >
                <span className="gmaps-pin-dot" aria-hidden="true" />
                <span>
                  <strong>{place.venueName}</strong>
                  <em>{place.address || "Live show venue"}</em>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="gmaps-stage">
        {canDraw ? (
          <>
            <div ref={mapNode} className="gmaps-canvas" />
            {!mapReady ? <div className="gmaps-veil">Loading map…</div> : null}
            <div className="gmaps-controls">
              <button type="button" onClick={() => zoom(1)} aria-label="Zoom in">
                +
              </button>
              <button type="button" onClick={() => zoom(-1)} aria-label="Zoom out">
                −
              </button>
              <button type="button" onClick={resetNorth} aria-label="Reset north">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 5.5 14.2 12 12 10.6 9.8 12Z" fill="#EA4335" />
                  <path d="M12 18.5 9.8 12 12 13.4 14.2 12Z" fill="#9aa0a6" />
                </svg>
              </button>
            </div>
            {active ? (
              <div className="gmaps-card" role="dialog" aria-label={active.venueName}>
                <button
                  type="button"
                  className="gmaps-card-x"
                  onClick={() => setActiveId(null)}
                  aria-label={`Close ${active.venueName}`}
                >
                  ×
                </button>
                <p className="gmaps-card-kicker">Maps · Drew Della</p>
                <h2>{active.venueName}</h2>
                <p>{active.address || "Live show venue"}</p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="gmaps-fallback" role="status">
            {fallback}
          </div>
        )}
      </div>
    </div>
  );
}
