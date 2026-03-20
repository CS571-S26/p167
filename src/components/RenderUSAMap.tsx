import React, { useState, useEffect, useContext, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { type LeafletMouseEvent, type PathOptions } from 'leaflet';
import { useNavigate } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import ThemeContext from "../contexts/ThemeContext";
import '@luomus/leaflet-smooth-wheel-zoom';
import { useMap } from 'react-leaflet';

const RenderUSAMap: React.FC = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState<any>(null);

  // Define the tiles based on what the theme is
  const landTiles = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Labels apply only when dark mode is applied, the landTiles for light mode already has labels included
  const darkLabelTiles = "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";

  const DEFAULT_STYLE: PathOptions = {
    fillColor:  theme === "dark" ? "transparent" : "#8daa92",
    color: theme === "dark" ? "#6a6a6a" : "#2c3e50",
    weight: 1.5,
    fillOpacity: 0.5
  };

  const HOVER_STYLE: PathOptions = {
    fillColor: theme === "dark" ? "#4fd9ff" : "#3498db",
    color: theme === "dark" ? "#ffffff" : "#000000",
    weight: 2,
    fillOpacity: 0.4
  };

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // Update the map to prevent ghosting when switches themes
  const ThemeSync = ({ theme }: { theme: string }) => {
    const map = useMap();

    useEffect(() => {
      // Tell Leaflet the container might have changed size/style
      map.invalidateSize();

      // Forcing a tiny move resynchronizes the TileLayer and GeoJSON
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      
      // Nudge the map view to force a full redraw of the coordinate system
      map.setView(currentCenter, currentZoom, { animate: false });
      
  }, [theme, map]);

  return null;
  };

  const onEachState = useCallback((feature: any, layer: L.Layer) => {
    layer.bindTooltip(feature.properties.name, {
      sticky: true,
      direction: 'top',
      opacity: 0.9
    });

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(HOVER_STYLE);
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(DEFAULT_STYLE);
      },
      click: () => {
        const stateName = feature.properties.name;
        navigate(`/news/United States/${stateName}`);
      }
    });
  }, [theme, navigate, DEFAULT_STYLE]); // Dependencies ensure the function updates

  return (
    <div style={{ background: theme === "dark" ? "#000" : "#aad3df" }}> 
      <MapContainer
        center={[38, -97]} 
        zoom={4} 
        style={{height: 'calc(100vh - 64px)', width: "100%"}}
        minZoom={3}
        maxZoom={12}
        wheelDebounceTime={10}
        maxBounds={[[5, -175], [75, -45]]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={false}
        smoothWheelZoom={true}
        smoothSensitivity={5}
      >

        <ThemeSync theme={theme}/>

        <TileLayer url={landTiles} opacity={1.0} />

        {theme === "dark" && (
          <TileLayer
            url={darkLabelTiles}
            zIndex={10}
            pane="markerPane"
          />
        )}

        {geoData && (
          <GeoJSON 
            key={theme} 
            data={geoData}
            style={DEFAULT_STYLE} 
            onEachFeature={onEachState} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RenderUSAMap;