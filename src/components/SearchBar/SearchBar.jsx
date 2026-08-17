import React, { useState, useRef, useEffect } from "react";
import "./SearchBar.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({
  suggestions = [], // Remove default suggestions
  currentPath = "/home",
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isReadonly, setIsReadonly] = useState(true); // Input starts as readonly on mobile
  const [isExpanded, setIsExpanded] = useState(false);

  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate(); // Use useNavigate from react-router-dom v6

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const collapseSearch = () => {
    setIsDropdownVisible(false);
    setIsReadonly(true);
    setIsExpanded(false);
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      collapseSearch();
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      collapseSearch();
      inputRef.current?.blur();
      return;
    }
    if (event.key === "Enter") {
      const suggestion = suggestions.find(
        (item) => item.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (suggestion) {
        // Close the dropdown and navigate to the selected suggestion
        collapseSearch();
        handleNavigation(suggestion.path);
      } else {
        console.log("Invalid input");
      }
    }
  };

  const activateInput = () => {
    setIsExpanded(true);
    setIsReadonly(false); // Make input writable when clicked
    setIsDropdownVisible(true);
    setTimeout(() => {
      inputRef.current?.focus(); // Programmatically focus input after readonly is removed
    }, 100);
  };

  // Helper function to determine if a path is external (starts with http)
  const isExternalLink = (path) => {
    return path.startsWith('http://') || path.startsWith('https://');
  };

  // Handle navigation - either use React Router or window.location
  const handleNavigation = (path) => {
    if (isExternalLink(path)) {
      // For external links, open in a new tab
      window.open(path, '_blank');
    } else {
      // For internal links, use React Router
      navigate(path);
    }
  };

  const handleOptionClick = (path) => {
    collapseSearch();
    handleNavigation(path);
  };

  // Deduplicate suggestions by name
  const uniqueSuggestions = Array.from(
    new Map(suggestions.map(item => [item.name, item])).values()
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`searchbar-container${isExpanded ? " searchbar-container--expanded" : ""}`}
      ref={searchBarRef}
    >
      <div className="searchbar-dropdown">
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder={currentPath === "/" ? "Search" : "Search Drew Della"}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          readOnly={isReadonly} // Initially readonly
          onClick={activateInput} // Remove readonly and focus when clicked
        />
        {isDropdownVisible && (
          <div className="dropdown-menu">
            {uniqueSuggestions.map((item) => (
              <div
                key={item.name}
                className="dropdown-item"
                onClick={() => handleOptionClick(item.path)}
              >
                {item.name}
              </div>
            ))}
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
