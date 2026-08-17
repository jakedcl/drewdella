import React from "react";
import { SearchResults } from "../../components/SearchResults/SearchResults.jsx";
import "./ShopPage.css";

export default function ShopPage() {
  return (
    <SearchResults count={0} elapsed="0.41">
      <div className="shop-empty">
        <div className="shop-doodle" aria-hidden>
          <svg
            className="shop-cart"
            viewBox="0 0 140 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12h18l8 8 14 52h62l14-36H42"
              stroke="#555"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="58" cy="92" r="9" stroke="#555" strokeWidth="3.2" />
            <circle cx="100" cy="92" r="9" stroke="#555" strokeWidth="3.2" />
            <path
              className="shop-tag-string"
              d="M86 28v18"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="shop-tag">COMING SOON</span>
          <span className="shop-scan" />
        </div>

        <div className="shop-copy">
          <p className="shop-error">
            <b>Coming soon.</b> <ins>No products yet.</ins>
          </p>
          <p className="shop-detail">
            Your search did not match any merch. Nothing is for sale yet —
            new stuff is on the way. Check back.
          </p>
        </div>
      </div>
    </SearchResults>
  );
}
