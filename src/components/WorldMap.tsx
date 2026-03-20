import React, { useState, useEffect, useContext, useCallback} from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { type LeafletMouseEvent, type PathOptions } from 'leaflet';
import { useNavigate } from "react-router-dom"
import 'leaflet/dist/leaflet.css';
import ThemeContext from "../contexts/ThemeContext"

const WorldMap: React.FC = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState<any>(null);

    // Define the tiles based on what the theme is
    const landTiles = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

    const labelTiles = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png";
    
    const DEFAULT_STYLE: PathOptions = theme === "dark" ? {
      fillColor: "#000000",
      color: "#6a6a6a",
      weight: 0.5,
      fillOpacity: 0
    } :
    { 
      fillColor: "#2E6F40",
      color: "#2a2a2a",
      weight: 0.5,
      fillOpacity: 0.5,
    };

    const HOVER_STYLE: PathOptions = theme === "dark" ? {
      fillColor: "#4fd9ff",
      color: "#0056cf",
      weight: 3,
      fillOpacity: 0.5
    } :
    {
      fillColor: "#ffffff",
      color: "#0056cf",
      weight: 3,
      fillOpacity: 0.5
    };

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
      .then(res => res.json())
      .then(data => {setGeoData(data)})
      .catch(err => console.error("Fetch error:", err));
  }, []);

 const onEachCountry = useCallback((feature: any, layer: L.Layer) => {
    layer.bindTooltip(feature.properties.name, { 
      sticky: true,
      direction: 'top',
      opacity: 0.9
    });

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(HOVER_STYLE);
        target.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(DEFAULT_STYLE);
      },
      click: () => {
        const isoShortCode = feature.properties.iso_a2;
        const countryName = feature.properties.name;
        navigate(`/news/${countryName}?iso=${isoShortCode}`);
      }
    });
  }, [theme, navigate, DEFAULT_STYLE]); // Dependencies ensure the function updates
  
  return (
    <MapContainer
        center={[30, 0]} 
        zoom={3} 
        style={{height: 'calc(100vh - 64px)', width: "100%"}}
        minZoom={2.4}
        maxZoom={20}
        maxBounds={[[-90, -180], [90, 180]]} // Locks the view to one world width
        maxBoundsViscosity={1.0}            // Makes the edge "hard" (no bouncing)
        worldCopyJump={false}               // Prevents jumping to a copy of the world
        >
        {/* Layer 1: The Base (Land and Water) */}
        <TileLayer
          url={landTiles}
          opacity={1.0}
        />

        {/* Layer 2: The Text (Cities and Countries) */}
        <TileLayer
          url={labelTiles}
          zIndex={10} // Ensures labels stay on top of everything else
          pane="markerPane"
        />

        {geoData && (
        <GeoJSON 
            key={theme === "dark" ? 'dark-layer' : 'light-layer'} // Force a rerender when the theme changes
            data={geoData}
            style={DEFAULT_STYLE} 
            onEachFeature={onEachCountry} 
            eventHandlers={{
              add: (e) => {
              e.target.bringToBack(); // Pushes the land behind the labels
            }
          }}
        />
        )}
    </MapContainer>
  );
};

export default WorldMap;