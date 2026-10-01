"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import "./SearchBar.css";
import { useRouter } from "next/navigation";
const searchApi = { current: null };

function loadSearch() {
  if (!searchApi.current) {
    searchApi.current = import("../../lib/siteSearch");
  }
  return searchApi.current;
}

function isMobileSearch() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function SearchBar({
  suggestions = [],
  currentPath = "/home",
  showActions = false,
  luckyPaths = [],
  initialQuery = "",
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isReadonly, setIsReadonly] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [index, setIndex] = useState([]);
  const [searchSite, setSearchSite] = useState(() => () => []);
  const [activeIndex, setActiveIndex] = useState(0);

  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const query = inputValue.trim();
  const hits = useMemo(
    () => (query ? searchSite(index, query) : []),
    [index, query]
  );

  const uniqueSuggestions = useMemo(
    () =>
      Array.from(new Map(suggestions.map((item) => [item.name, item])).values()),
    [suggestions]
  );

  const rows = query
    ? hits.map((hit) => ({
        key: hit.id,
        title: hit.title,
        source: hit.source,
        snippet: hit.snippet,
        path: hit.href,
        external: !hit.internal,
        kind: "hit",
      }))
    : uniqueSuggestions.map((item) => ({
        key: item.name,
        title: item.name,
        path: item.path,
        kind: "suggest",
      }));

  const collapseSearch = () => {
    setIsDropdownVisible(false);
    setIsReadonly(true);
    setIsExpanded(false);
    setActiveIndex(0);
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      collapseSearch();
    }
  };

  const allowTyping = () => {
    setIsReadonly(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const warmIndex = () => {
    loadSearch()
      .then((mod) => {
        setSearchSite(() => mod.searchSite);
        return mod.getSearchIndex();
      })
      .then(setIndex)
      .catch(() => setIndex([]));
  };

  const activateInput = () => {
    setIsExpanded(true);
    setIsDropdownVisible(true);
    warmIndex();
    if (isMobileSearch()) return;
    allowTyping();
  };

  const handleInputClick = () => {
    if (isMobileSearch() && isReadonly && isDropdownVisible) {
      allowTyping();
      return;
    }
    activateInput();
  };

  const goTo = (row) => {
    if (!row?.path) return;
    collapseSearch();
    if (row.external || row.path.startsWith("http")) {
      window.open(row.path, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(row.path);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      collapseSearch();
      inputRef.current?.blur();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsDropdownVisible(true);
      setActiveIndex((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (!rows.length) return;
      goTo(rows[activeIndex] || rows[0]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("q") || "";
    const q = initialQuery || fromUrl;
    if (!q) return;
    setInputValue(q);
    setIsExpanded(true);
    setIsDropdownVisible(true);
    setIsReadonly(false);
    warmIndex();
  }, [initialQuery]);

  const feelingLucky = () => {
    const paths = luckyPaths.filter(Boolean);
    if (!paths.length) {
      router.push("/music");
      return;
    }
    const href = paths[Math.floor(Math.random() * paths.length)];
    collapseSearch();
    router.push(href);
  };

  const submitSearch = () => {
    if (!query) {
      activateInput();
      return;
    }
    if (!rows.length) {
      activateInput();
      return;
    }
    goTo(rows[activeIndex] || rows[0]);
  };

  return (
    <div
      className={`searchbar-container${isExpanded ? " searchbar-container--expanded" : ""}${
        isDropdownVisible ? " searchbar-container--open" : ""
      }${showActions ? " searchbar-container--home" : ""}`}
      ref={searchBarRef}
    >
      <div className="searchbar-shell">
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder={currentPath === "/" ? "Search" : "Search Drew Della"}
          aria-label={currentPath === "/" ? "Search" : "Search Drew Della"}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onFocus={() => setIsDropdownVisible(true)}
          onKeyDown={handleKeyDown}
          readOnly={isReadonly}
          inputMode={isReadonly ? "none" : "search"}
          onClick={handleInputClick}
          autoComplete="off"
          spellCheck={false}
        />
        {isDropdownVisible && (
          <div className="dropdown-menu" role="listbox">
            {query && rows.length === 0 ? (
              <div className="dropdown-empty">No results for “{query}”</div>
            ) : (
              rows.map((row, i) => (
                <div
                  key={row.key}
                  className={`dropdown-item${row.kind === "hit" ? " dropdown-item--hit" : ""}${
                    i === activeIndex ? " is-active" : ""
                  }`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => goTo(row)}
                >
                  <span className="dropdown-item-title">{row.title}</span>
                  {row.kind === "hit" && (
                    <span className="dropdown-item-meta">
                      {row.source}
                      {row.snippet ? ` — ${row.snippet}` : ""}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className="search-icon"
        onClick={activateInput}
        aria-label="Search"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
      </button>

      {showActions ? (
        <div className="home-actions">
          <button type="button" className="home-btn" onClick={submitSearch}>
            Della Search
          </button>
          <button type="button" className="home-btn" onClick={feelingLucky}>
            I&apos;m Feeling Lucky
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
