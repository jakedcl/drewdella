// MapPage.jsx
import "./MapPage.css";

const MapPage = () => {
  return (
    <div className="map-container">
      <div className="map-embed">
        <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1k_2Kl0I0i77SW5fwv8HHvSib76haHfk&ehbc=2E312F&noprof=1" width="100%" height="600"></iframe>      </div>
    </div>
  );
};

export default MapPage;
