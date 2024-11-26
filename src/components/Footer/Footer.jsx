import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_left">
        <a href="/link1" className="footer_link">
          About
        </a>
        <a href="/link2" className="footer_link">
          Privacy
        </a>
      </div>
      <div className="footer_right">
        <a href="/link3" className="footer_link">
          Settings
        </a>
      </div>
    </footer>
  );
}

export default Footer;
