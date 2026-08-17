import React from "react";
import { Link } from "react-router-dom";
import "./SearchResults.css";

export function formatCite(url) {
  try {
    const parsed = new URL(url, "https://drewdella.com");
    const host = parsed.hostname.replace(/^www\./, "");
    const crumbs = parsed.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 4)
      .map((part) => decodeURIComponent(part));
    return [host, ...crumbs].join(" › ");
  } catch {
    return url;
  }
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

  const citeEl = cite ? (
    <cite className="serp-cite">
      {sponsored && (
        <span className="serp-ad" aria-label="Advertisement">
          Ad
        </span>
      )}
      {cite}
      {!sponsored && (
        <span className="serp-cite-arrow" aria-hidden>
          ▼
        </span>
      )}
    </cite>
  ) : null;

  return (
    <div className={`serp-result${sponsored ? " serp-result--ad" : ""}`}>
      {sponsored ? (
        <>
          {titleEl}
          {citeEl}
        </>
      ) : (
        <>
          {citeEl}
          {titleEl}
        </>
      )}
      {snippet && <p className="serp-snippet">{snippet}</p>}
    </div>
  );
}
