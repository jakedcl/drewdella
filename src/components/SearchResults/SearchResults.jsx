import React from "react";
import { Link, useLocation } from "react-router-dom";
import { searchSuggestions } from "../../constants/searchSuggestions";
import "./SearchResults.css";

const OWN_HOST = "drewdella.com";

export function pathCite(...parts) {
  return parts.filter(Boolean).join(" › ");
}

export function formatCite(url) {
  try {
    const parsed = new URL(url, `https://${OWN_HOST}`);
    const host = parsed.hostname.replace(/^www\./, "");
    const crumbs = parsed.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 4)
      .map((part) => decodeURIComponent(part));
    if (host === OWN_HOST) return crumbs.join(" › ");
    return [host, ...crumbs].join(" › ");
  } catch {
    return url;
  }
}

export function formatAdCite(href) {
  if (!href) return "";
  if (href.startsWith("/")) return `www.${OWN_HOST}${href}`;
  try {
    const parsed = new URL(href);
    const host = parsed.hostname.startsWith("www.")
      ? parsed.hostname
      : `www.${parsed.hostname}`;
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${host}${path}`;
  } catch {
    return href;
  }
}

export function formatListingDate(value) {
  if (!value) return "";
  const raw = String(value);
  const dayOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = dayOnly
    ? new Date(
        Number(dayOnly[1]),
        Number(dayOnly[2]) - 1,
        Number(dayOnly[3])
      )
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function datedSnippet(dateValue, ...parts) {
  return [formatListingDate(dateValue), ...parts]
    .filter(Boolean)
    .join(" — ");
}

export function formatElapsed(ms) {
  const seconds = Math.max(ms / 1000, 0.04);
  return seconds.toFixed(2);
}

export function snippetFromPortableText(blocks, max = 165) {
  if (!blocks) return "";
  const text = String(blocks)
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")} ...`;
}

export function blogPreviewSnippet(item, max = 165) {
  const text = snippetFromPortableText(item?.preview, max);
  if (text) return text;
  const n = Number(item?.imageCount) || 0;
  if (n === 1) return "Image attached.";
  if (n > 1) return `${n} images attached.`;
  return "";
}

export function socialSnippet(item) {
  const written = String(item?.description || "").trim();
  if (written) return written;
  const name = String(item?.title || "this page").trim();
  return `Follow Drew Della on ${name}.`;
}

export function SearchResults({
  count,
  elapsed,
  children,
  query,
  onQueryChange,
  queryPlaceholder = "Filter results",
  sort,
  onSortChange,
  sortOptions,
}) {
  const n = Number(count) || 0;
  const showTools = Boolean(onQueryChange) || Boolean(sortOptions?.length);

  return (
    <div className="serp">
      {showTools && (
        <div className="serp-tools">
          {onQueryChange && (
            <input
              type="search"
              className="serp-filter"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={queryPlaceholder}
              aria-label={queryPlaceholder}
            />
          )}
          {sortOptions?.length > 0 && (
            <label className="serp-sort">
              Sort
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      <p className="serp-stats">
        About {n.toLocaleString("en-US")} result{n === 1 ? "" : "s"} ({elapsed}{" "}
        seconds)
      </p>
      <div className="serp-list">{children}</div>
      <SerpFooter />
    </div>
  );
}

export function SerpFooter() {
  return <SerpRelated />;
}

function SerpRelated() {
  const location = useLocation();
  const items = searchSuggestions.filter((item) => {
    if (!item?.path || !item?.name) return false;
    if (item.path === "/") {
      return location.pathname !== "/" && location.pathname !== "/all";
    }
    return (
      location.pathname !== item.path &&
      !location.pathname.startsWith(`${item.path}/`)
    );
  });

  if (!items.length) return null;

  return (
    <div className="serp-related">
      <p className="serp-related-label">Searches related to drew della</p>
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchResult({
  href,
  title,
  cite,
  snippet,
  internal = false,
  sponsored = false,
}) {
  const className = "serp-title";
  const titleEl = internal ? (
    <Link className={className} to={href}>
      {title}
    </Link>
  ) : (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </a>
  );

  const citeText = sponsored ? formatAdCite(href) : cite;
  const citeEl = citeText ? (
    <cite className="serp-cite">
      {sponsored && (
        <span className="serp-ad" aria-label="Advertisement">
          Ad
        </span>
      )}
      {citeText}
      {!sponsored && (
        <span className="serp-cite-arrow" aria-hidden>
          ▼
        </span>
      )}
    </cite>
  ) : null;

  return (
    <div className={`serp-result${sponsored ? " serp-result--ad" : ""}`}>
      {titleEl}
      {citeEl}
      {snippet && <p className="serp-snippet">{snippet}</p>}
    </div>
  );
}

export function VideoResult({ video }) {
  if (!video) return null;

  const href = `https://www.youtube.com/watch?v=${video.id}`;
  const dateLabel = formatListingDate(video.publishedAt);

  return (
    <div className="video-result">
      <a
        className="video-result-thumb"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={video.thumbnail} alt="" />
      </a>
      <div className="video-result-copy">
        <a
          className="serp-title"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {video.title}
        </a>
        <cite className="serp-cite">
          youtube.com › watch
          <span className="serp-cite-arrow" aria-hidden>
            ▼
          </span>
        </cite>
        {dateLabel && <p className="serp-snippet">{dateLabel}</p>}
      </div>
    </div>
  );
}
