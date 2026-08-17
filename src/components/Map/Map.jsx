import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { client } from "../../lib/sanity";
import "./Map.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const pinSVG = `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gePin" x1="14" y1="1" x2="14" y2="28" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7ec8ff"/>
      <stop offset="1" stop-color="#1a6dff"/>
    </linearGradient>
  </defs>
  <path d="M14 1.5C7.65 1.5 2.5 6.65 2.5 13c0 8.6 11.5 21 11.5 21S25.5 21.6 25.5 13C25.5 6.65 20.35 1.5 14 1.5z" fill="url(#gePin)" stroke="#c8ecff" stroke-width="1.4"/>
  <circle cx="14" cy="13" r="4.2" fill="#e8f6ff" stroke="#0b3d91" stroke-width="1"/>
</svg>`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

/** Smooth cinematic ease — slow finish, no bounce (cheap math). */
function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

const getCoordinates = async (query) => {
  if (!query) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features?.length > 0) return data.features[0].center;
  } catch {
    /* ignore */
  }
  return null;
};

async function resolvePlaces(raw) {
  const places = [];
  for (const location of raw || []) {
    let lngLat = null;
    if (location.coordinates?.lng && location.coordinates?.lat) {
      lngLat = [location.coordinates.lng, location.coordinates.lat];
    } else if (location.address) {
      lngLat = await getCoordinates(location.address);
    } else if (location.venueName) {
      lngLat = await getCoordinates(location.venueName);
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

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const deckRef = useRef(null);
  const openCardRef = useRef(() => {});
  const activeIndexRef = useRef(0);
  const navSourceRef = useRef("pin");
  const scrollTimer = useRef(null);
  const cardModeRef = useRef(false);
  const prevCardModeRef = useRef(false);
  const cameraTimer = useRef(null);
  const closeCardsRef = useRef(() => {});
  const suppressDragUntilUpRef = useRef(false);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardMode, setCardMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  cardModeRef.current = cardMode;

  openCardRef.current = (index) => {
    navSourceRef.current = "pin";
    setActiveIndex(index);
    setCardMode(true);
  };

  const closeCards = useCallback(() => {
    setCardMode(false);
  }, []);

  closeCardsRef.current = closeCards;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!mapboxgl.accessToken) {
          setError("Mapbox token is not configured");
          return;
        }
        const data = await client.fetch(`*[_type == "mapLocation"] {
          _id, venueName, address, coordinates
        }`);
        const next = await resolvePlaces(data);
        if (!cancelled) setPlaces(next);
      } catch (err) {
        console.error("Error fetching locations:", err);
        if (!cancelled) setError("Failed to load locations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!places.length || !mapContainer.current || map.current) return;

    let resizeHandler = null;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: places[0].lngLat,
      zoom: 12,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
      // Cheaper rendering on phones
      antialias: !isMobileViewport(),
    });

    map.current.on("load", () => {
      map.current.resize();

      markersRef.current = places.map((place, index) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.innerHTML = pinSVG;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", place.venueName);
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          openCardRef.current(index);
        });

        return new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(place.lngLat)
          .addTo(map.current);
      });

      const bounds = places.reduce(
        (b, place) => b.extend(place.lngLat),
        new mapboxgl.LngLatBounds(places[0].lngLat, places[0].lngLat)
      );
      map.current.fitBounds(bounds, {
        padding: isMobileViewport() ? 36 : 56,
        maxZoom: 15.5,
        duration: 0,
      });
      map.current.setPitch(0);
      map.current.setBearing(0);
      requestAnimationFrame(() => map.current?.resize());
    });

    // In focus mode: any press on the map dismisses — don't start a pan
    const dismissFocusFromMap = () => {
      if (!cardModeRef.current) return;
      suppressDragUntilUpRef.current = true;
      map.current?.dragPan.disable();
      closeCardsRef.current();
    };
    const releaseDragSuppress = () => {
      if (!suppressDragUntilUpRef.current) return;
      suppressDragUntilUpRef.current = false;
      if (!cardModeRef.current) {
        map.current?.dragPan.enable();
      }
    };
    map.current.on("mousedown", dismissFocusFromMap);
    map.current.on("touchstart", dismissFocusFromMap);
    map.current.on("mouseup", releaseDragSuppress);
    map.current.on("touchend", releaseDragSuppress);

    resizeHandler = () => map.current?.resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [places]);

  // Lock map panning while a venue is focused
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (cardMode || suppressDragUntilUpRef.current) {
      m.dragPan.disable();
      m.dragRotate.disable();
      m.touchPitch.disable();
    } else {
      m.dragPan.enable();
      m.dragRotate.enable();
      m.touchPitch.enable();
    }
  }, [cardMode]);

  // Highlight active pin + cinematic camera (choreographed with the sheet)
  useEffect(() => {
    activeIndexRef.current = activeIndex;

    markersRef.current.forEach((marker, index) => {
      marker
        .getElement()
        ?.classList.toggle("marker--active", cardMode && index === activeIndex);
    });

    if (!map.current || !places.length) return;

    const mobile = isMobileViewport();
    const reduced = prefersReducedMotion();
    const opening = cardMode && !prevCardModeRef.current;
    const closing = !cardMode && prevCardModeRef.current;
    prevCardModeRef.current = cardMode;

    clearTimeout(cameraTimer.current);

    // Flat overview only when leaving card mode (not on first paint)
    if (!cardMode) {
      if (!closing) return;
      const bounds = places.reduce(
        (b, place) => b.extend(place.lngLat),
        new mapboxgl.LngLatBounds(places[0].lngLat, places[0].lngLat)
      );
      map.current.fitBounds(bounds, {
        padding: mobile ? 36 : 56,
        maxZoom: 15.5,
        pitch: 0,
        bearing: 0,
        duration: reduced ? 0 : mobile ? 620 : 900,
        easing: easeOutQuint,
        essential: true,
      });
      return;
    }

    const place = places[activeIndex];
    if (!place) return;

    const fly = () => {
      if (!map.current) return;
      map.current.easeTo({
        center: place.lngLat,
        zoom: mobile ? 15 : 16,
        pitch: mobile ? 38 : 52,
        bearing: opening ? -20 : -17,
        duration: reduced
          ? 0
          : opening
            ? mobile
              ? 780
              : 1100
            : mobile
              ? 520
              : 720,
        easing: easeOutQuint,
        essential: true,
        padding: mobile
          ? { top: 40, bottom: 230, left: 24, right: 24 }
          : { top: 60, bottom: 270, left: 60, right: 60 },
      });
    };

    // Sheet leads; camera follows a beat later on first open
    cameraTimer.current = setTimeout(fly, reduced ? 0 : opening ? 120 : 0);

    return () => clearTimeout(cameraTimer.current);
  }, [cardMode, activeIndex, places]);

  // Snap deck only for pin / keyboard — never fight a finger swipe
  useEffect(() => {
    if (!cardMode || !deckRef.current) return;
    if (navSourceRef.current === "scroll") {
      navSourceRef.current = null;
      return;
    }
    const card = deckRef.current.querySelector(
      `[data-venue-index="${activeIndex}"]`
    );
    if (!card) return;
    card.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [cardMode, activeIndex]);

  useEffect(() => {
    if (!cardMode) return;
    const onKey = (event) => {
      if (event.key === "Escape") closeCards();
      if (event.key === "ArrowRight") {
        navSourceRef.current = "key";
        setActiveIndex((i) => Math.min(i + 1, places.length - 1));
      }
      if (event.key === "ArrowLeft") {
        navSourceRef.current = "key";
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cardMode, closeCards, places.length]);

  const syncIndexFromScroll = useCallback(() => {
    const track = deckRef.current;
    if (!track) return;
    const cards = [...track.querySelectorAll("[data-venue-index]")];
    if (!cards.length) return;

    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = Number(card.dataset.venueIndex);
      }
    });

    if (best !== activeIndexRef.current) {
      navSourceRef.current = "scroll";
      setActiveIndex(best);
    }
  }, []);

  const onDeckScroll = () => {
    // Debounced — never setState every frame
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(syncIndexFromScroll, 80);
  };

  useEffect(() => {
    const track = deckRef.current;
    if (!track || !cardMode) return;
    const onScrollEnd = () => syncIndexFromScroll();
    track.addEventListener("scrollend", onScrollEnd);
    return () => track.removeEventListener("scrollend", onScrollEnd);
  }, [cardMode, syncIndexFromScroll]);

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  if (loading) {
    return <div className="map-loading">Loading map...</div>;
  }

  if (!places.length) {
    return <div className="map-error">No venues on the map yet.</div>;
  }

  return (
    <div className={`map-wrapper${cardMode ? " map-wrapper--cards" : ""}`}>
      <div ref={mapContainer} className="map-container" />

      <p className={`map-shoutout${cardMode ? " is-hidden" : ""}`}>
        Shoutout to the venues that have hosted me
      </p>

      <div
        className={`venue-deck${cardMode ? " is-open" : ""}`}
        aria-hidden={!cardMode}
      >
        <div className="venue-deck-chrome">
          <span className="venue-deck-count">
            {activeIndex + 1} / {places.length}
          </span>
          <button
            type="button"
            className="venue-deck-close"
            onClick={closeCards}
            aria-label="Close venue cards"
          >
            ×
          </button>
        </div>

        <div
          className="venue-deck-track"
          ref={deckRef}
          onScroll={onDeckScroll}
        >
          {places.map((place, index) => (
            <article
              key={place.id}
              className={`venue-card${index === activeIndex ? " is-active" : ""}`}
              data-venue-index={index}
            >
              <p className="venue-card-kicker">Maps · Drew Della</p>
              <h3 className="venue-card-title">{place.venueName}</h3>
              <cite className="venue-card-cite">
                {place.address || "Live show venue"}
              </cite>
              <p className="venue-card-snippet">
                Shoutout to the rooms that hosted.
              </p>
            </article>
          ))}
        </div>

        <div className="venue-deck-hint">Swipe for more venues</div>
      </div>
    </div>
  );
};

export default Map;
