import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { client } from '../../lib/sanity';
import './Map.css';

// Initialize Mapbox with your access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const getCoordinates = async (query) => {
    if (!query) return null;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].center; // [lng, lat]
        }
    } catch (e) {
        // ignore
    }
    return null;
};

// Classic black and white pin SVG
const pinSVG = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="11" rx="7" ry="7" fill="#fff" stroke="#222" stroke-width="2"/><path d="M14 18V24" stroke="#222" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="11" r="2.5" fill="#222"/></svg>`;

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const query = `*[_type == "mapLocation"] {
          _id,
          venueName,
          address,
          coordinates
        }`;

                const data = await client.fetch(query);
                setLocations(data);
            } catch (err) {
                console.error('Error fetching locations:', err);
                setError('Failed to load locations');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        if (!mapboxgl.accessToken) {
            setError('Mapbox token is not configured');
            return;
        }

        // Only initialize if locations are loaded and ref is set
        if (!mapContainer.current || !locations.length || map.current) return;

        const setupMap = async () => {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12', // Modern, colorful style
                center: [-74.006, 40.7128],
                zoom: 11
            });

            map.current.on('load', async () => {
                for (const location of locations) {
                    let lngLat = null;
                    if (location.coordinates && location.coordinates.lng && location.coordinates.lat) {
                        lngLat = [location.coordinates.lng, location.coordinates.lat];
                    } else if (location.address) {
                        lngLat = await getCoordinates(location.address);
                    } else if (location.venueName) {
                        lngLat = await getCoordinates(location.venueName);
                    }
                    if (lngLat) {
                        const el = document.createElement('div');
                        el.className = 'marker';
                        el.innerHTML = pinSVG;
                        const popup = new mapboxgl.Popup({ offset: 25 })
                            .setHTML(`
              <div class="popup-content modern-popup">
                <h3>${location.venueName || ''}</h3>
                ${location.address ? `<p>${location.address}</p>` : ''}
              </div>
            `);

                        new mapboxgl.Marker(el)
                            .setLngLat(lngLat)
                            .setPopup(popup)
                            .addTo(map.current);
                    }
                }
            });
        };
        setupMap();
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [locations]);

    if (error) {
        return <div className="map-error">{error}</div>;
    }

    if (loading) {
        return <div className="map-loading">Loading map...</div>;
    }

    return (
        <div className="map-wrapper">
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map; 