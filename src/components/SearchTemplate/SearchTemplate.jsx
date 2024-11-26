// SearchTemplate.jsx
import "./SearchTemplate.css";
import Header from "../Header/Header.jsx";
import NavTabs from "../NavTabs/NavTabs.jsx";

function SearchTemplate({ page }) {
  return (
    <div>
      <div className="images-header">
        <Header />
      </div>
      <div>
        <NavTabs />
      </div>
      <div className="home-hero">{page}</div>
    </div>
  );
}

export default SearchTemplate;
