// MapPage.jsx
import React from 'react';
import Map from '../../components/Map/Map';
import './MapPage.css';

const MapPage = () => {
  return (
    <div className="map-page">
      <Map />
      <p className="map-page-footer">Shoutout to the venues that have hosted me</p>
    </div>
  );
};

export default MapPage;
