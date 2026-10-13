/**
 * Recolor Mapbox Streets so the basemap reads like Google Maps.
 * Streets-v12 stays the source of roads, water, and labels. These overrides
 * only change paint and the label font (Roboto, which Mapbox hosts).
 */

const LAND = "#f5f3ef";
const WATER = "#aadaff";
const PARK = "#c6e8b8";
const PARK_SOFT = "#d5edc8";
const HIGHWAY = "#f6d365";
const HIGHWAY_EDGE = "#e3c04a";
const ROAD = "#ffffff";
const ROAD_EDGE = "#ddd9d3";
const BUILDING = "#ebe6df";
const LABEL = "#5f6368";
const LABEL_HALO = "#f7f5f2";

const PARK_COLOR = [
  "match",
  ["get", "class"],
  "park",
  PARK,
  "grass",
  PARK_SOFT,
  "wood",
  PARK,
  "scrub",
  "#d3ebc6",
  "pitch",
  "#b7d99a",
  "cemetery",
  "#d5e6d0",
  "hospital",
  "#f4e4e4",
  "school",
  "#f3efe4",
  "airport",
  "#e7eef6",
  "sand",
  "#f6e7c8",
  "agriculture",
  "#eef3d4",
  "glacier",
  "#e4eef5",
  "residential",
  "#f3f1ee",
  LAND,
];

function paint(map, id, prop, value) {
  try {
    map.setPaintProperty(id, prop, value);
  } catch {
    /* layer does not have this property */
  }
}

function layout(map, id, prop, value) {
  try {
    map.setLayoutProperty(id, prop, value);
  } catch {
    /* layer does not have this property */
  }
}

function roadRole(id) {
  if (/rail|aerialway|oneway|arrow|label|shield|turning|crosswalk|golf/.test(id)) {
    return null;
  }
  if (!/^(road|tunnel|bridge)-/.test(id)) return null;
  if (/motorway|trunk|major-link/.test(id)) return "highway";
  if (/path|steps|pedestrian|construction/.test(id)) return "path";
  return "street";
}

function applyLabelFont(map, id) {
  let stack;
  try {
    stack = map.getLayoutProperty(id, "text-font");
  } catch {
    return;
  }
  if (!Array.isArray(stack) || !stack.length) return;
  const emphasis = stack.some((name) => /medium|bold/i.test(String(name)));
  layout(
    map,
    id,
    "text-font",
    emphasis
      ? ["Roboto Medium", "Arial Unicode MS Bold"]
      : ["Roboto Regular", "Arial Unicode MS Regular"]
  );
}

export function applyGoogleBasemap(map) {
  const layers = map.getStyle()?.layers || [];

  for (const layer of layers) {
    const { id, type } = layer;

    if (id === "land" || id === "background") {
      paint(map, id, "background-color", LAND);
    }

    if (id === "landcover" || id === "landuse") {
      paint(map, id, "fill-color", PARK_COLOR);
    }

    if (id === "national-park") {
      paint(map, id, "fill-color", PARK);
    }

    if (id === "water" || id === "water-depth") {
      paint(map, id, "fill-color", WATER);
    }

    if (id === "water-shadow") {
      paint(map, id, "fill-color", "#9ecff5");
    }

    if (id === "waterway") {
      paint(map, id, "line-color", "#93cef8");
    }

    if (id === "hillshade") {
      paint(map, id, "fill-opacity", 0.25);
    }

    if (id === "building" || id === "building-underground" || id === "land-structure-polygon") {
      paint(map, id, "fill-color", BUILDING);
      paint(map, id, "fill-outline-color", "#e0dbd4");
    }

    if (id === "land-structure-line") {
      paint(map, id, "line-color", "#e0dbd4");
    }

    if (id === "road-polygon" || id === "road-pedestrian-polygon-fill") {
      paint(map, id, "fill-color", ROAD);
      paint(map, id, "fill-outline-color", ROAD_EDGE);
    }

    if (id === "ferry" || id === "ferry-auto") {
      paint(map, id, "line-color", "#7eb6e0");
    }

    if (id.startsWith("admin-")) {
      paint(map, id, "line-color", id.includes("disputed") ? "#9aa0a6" : "#c5c5c5");
    }

    if (type === "line") {
      const role = roadRole(id);
      if (role) {
        const casing = /-case$|-bg$/.test(id);
        const color =
          role === "highway"
            ? casing
              ? HIGHWAY_EDGE
              : HIGHWAY
            : role === "path"
              ? casing
                ? "#d9d4cc"
                : ROAD
              : casing
                ? ROAD_EDGE
                : ROAD;
        paint(map, id, "line-color", color);
      }
    }

    if (type === "symbol") {
      applyLabelFont(map, id);

      if (/road-label|path-pedestrian|road-intersection|building-number|block-number|building-entrance/.test(id)) {
        paint(map, id, "text-color", LABEL);
        paint(map, id, "text-halo-color", LABEL_HALO);
        paint(map, id, "text-halo-width", 1.15);
      } else if (/settlement|state-label|country-label|continent/.test(id)) {
        paint(map, id, "text-color", "#202124");
        paint(map, id, "text-halo-color", "#ffffff");
      } else if (/poi-label|airport-label|transit-label/.test(id)) {
        paint(map, id, "text-color", "#616161");
        paint(map, id, "text-halo-color", "#ffffff");
        paint(map, id, "text-halo-width", 1);
      } else if (/water/.test(id)) {
        paint(map, id, "text-color", "#3d7ea6");
        paint(map, id, "text-halo-color", "rgba(255,255,255,0.8)");
      } else if (/natural|golf/.test(id)) {
        paint(map, id, "text-color", "#3d7a3d");
        paint(map, id, "text-halo-color", "#ffffff");
      }
    }
  }
}
