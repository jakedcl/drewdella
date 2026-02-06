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

  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate(); // Use useNavigate from react-router-dom v6

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
      setIsReadonly(true); // Set input back to readonly when clicked outside
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const suggestion = suggestions.find(
        (item) => item.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (suggestion) {
        // Close the dropdown and navigate to the selected suggestion
        setIsDropdownVisible(false);
        handleNavigation(suggestion.path);
      } else {
        console.log("Invalid input");
      }
    }
  };

  const activateInput = () => {
    setIsReadonly(false); // Make input writable when clicked
    setTimeout(() => {
      inputRef.current.focus(); // Programmatically focus input after readonly is removed
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
    setIsDropdownVisible(false); // Close the dropdown
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
    <div className="searchbar-container" ref={searchBarRef}>
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

      {/* The search icon, which is only visible on mobile, trigger handled in css */}
      <div className="search-icon" onClick={activateInput}>
        <SearchIcon sx={{ paddingTop: ".2rem" }} />
      </div>
    </div>
  );
}

export default SearchBar;
