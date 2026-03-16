import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { type LeafletMouseEvent, type PathOptions } from 'leaflet';
import { useNavigate } from "react-router-dom"
import 'leaflet/dist/leaflet.css';

const DEFAULT_STYLE: PathOptions = {
  fillColor: "#d1d1d1",
  color: "#333333",
  weight: 1.5,
  fillOpacity: 0.6
};

const HOVER_STYLE: PathOptions = {
  fillColor: "#4fd9ff",
  color: "#0056cf",
  weight: 3,
  fillOpacity: 0.5
};

const WorldMap: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // Using a reliable GeoJSON source
    fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
      .then(res => res.json())
      .then(data => {setGeoData(data)})
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const onEachCountry = (feature: any, layer: L.Layer) => {
    const navigate = useNavigate();
    // Tooltip setup
    layer.bindTooltip(feature.properties.name, { 
      sticky: true,
      direction: 'top',
      opacity: 0.9
    });

    // Event Handlers
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle(HOVER_STYLE);
        layer.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle(DEFAULT_STYLE); // Works better in React than resetStyle
      },
      click: () => {
        const countryCode = feature.properties.ISO_43 || feature.properties.name;
        navigate(`/country/${countryCode}`);
        
      }
    });
  };

  return (
    <MapContainer 
        center={[0, 0]} 
        zoom={3} 
        style={{height: 'calc(100vh - 56px)', width: "100%"}}
        minZoom={2}
        maxZoom={20}
        maxBounds={[[-90, -180], [90, 180]]} // Locks the view to one world width
        maxBoundsViscosity={1.0}            // Makes the edge "hard" (no bouncing)
        worldCopyJump={false}               // Prevents jumping to a copy of the world
        >
        <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; Esri'
        noWrap = {true}
        bounds={[[-90, -180], [90, 180]]} // Keeps the layer within one world
        />

        {geoData && (
        <GeoJSON 
            data={geoData} 
            style={DEFAULT_STYLE} 
            onEachFeature={onEachCountry} 
        />
        )}
    </MapContainer>
  );
};

export default WorldMap;