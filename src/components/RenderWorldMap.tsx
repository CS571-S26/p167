import React, { useState, useEffect, useContext, useCallback} from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { type LeafletMouseEvent, type PathOptions } from 'leaflet';
import { useNavigate } from "react-router-dom"
import 'leaflet/dist/leaflet.css';
import ThemeContext from "../contexts/ThemeContext"
import '@luomus/leaflet-smooth-wheel-zoom';
import { useMap } from 'react-leaflet';

const RenderWorldMap: React.FC = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState<any>(null);

  // Define the tiles based on what the theme is
   const landTiles = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Labels apply only when dark mode is applied, the landTiles for light mode already has labels included
  const labelTiles = "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";
  
  const DEFAULT_STYLE: PathOptions = { 
      fillColor:  theme === "dark" ? "transparent" : "#8daa92",
      color:  theme === "dark" ? "#6a6a6a" : "#444444",
      weight: 1.5,
      fillOpacity: 0.5
    };

    const HOVER_STYLE: PathOptions = {
    fillColor: theme === "dark" ? "#4fd9ff" : "#007bff",
    color: "#0056cf",
    weight: 2,
    fillOpacity: 0.3
  };

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
      .then(res => res.json())
      .then(data => {setGeoData(data)})
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
        minZoom={2}
        maxZoom={20}
        wheelDebounceTime={10}   // Reduces the "lag" feel between scroll increments
        maxBounds={[[-90, -180], [90, 180]]} // Locks the view to one world width
        maxBoundsViscosity={1.0}            // Makes the edge "hard" (no bouncing)
        worldCopyJump={false}               // Prevents jumping to a copy of the world
        scrollWheelZoom={false} // Disable default scroll
        smoothWheelZoom={true}  // Enable the smooth scrolling plugin
        smoothSensitivity={5}  // Adjust this for scrolling speed (smaller number is slower, higher number is faster)
        >

        <ThemeSync theme={theme}/>

        {/* Layer 1: The Base (Land and Water) */}
        <TileLayer
          url={landTiles}
          opacity={1.0}
        />

        {/* Layer 2: The Text (Cities and Countries) */}
        {theme === "dark" && (
          <TileLayer
            url={labelTiles}
            zIndex={10}
            pane="markerPane"
          />
        )}

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

export default RenderWorldMap;