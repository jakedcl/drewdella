"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import "./SearchBar.css";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { getSearchIndex, searchSite } from "../../lib/siteSearch";

function isMobileSearch() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function SearchBar({
  suggestions = [],
  currentPath = "/home",
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isReadonly, setIsReadonly] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [index, setIndex] = useState([]);
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

  const activateInput = () => {
    setIsExpanded(true);
    setIsDropdownVisible(true);
    getSearchIndex().then(setIndex).catch(() => setIndex([]));
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

  return (
    <div
      className={`searchbar-container${isExpanded ? " searchbar-container--expanded" : ""}${
        isDropdownVisible ? " searchbar-container--open" : ""
      }`}
      ref={searchBarRef}
    >
      <div className="searchbar-shell">
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder={currentPath === "/" ? "Search" : "Search Drew Della"}
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
        <SearchIcon sx={{ fontSize: 22 }} />
      </button>
    </div>
  );
}

export default SearchBar;
