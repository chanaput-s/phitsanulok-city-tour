"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix generic Leaflet icons not loading correctly in Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

interface MapViewProps {
  locations: { id: string; name: string; position: [number, number]; category?: string; subcategory?: string }[];
  activeLocation?: [number, number];
  showRoute?: boolean;
}

const getIconSvg = (category: string = "", subcategory: string = "") => {
  const cat = category.toLowerCase();
  const sub = subcategory.toLowerCase();
  let color = "bg-primary";
  let path = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'; // MapPin

  if (cat.includes("food") || sub.includes("food")) {
    color = "bg-orange-500";
    path = '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>'; // Utensils
  } else if (cat.includes("temple") || cat.includes("history") || cat.includes("museum") || sub.includes("culture")) {
    color = "bg-amber-500";
    path = '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>'; // Landmark
  } else if (cat === "event") {
    color = "bg-pink-500";
    path = '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>'; // Calendar
  } else if (cat.includes("shop") || sub.includes("shop")) {
    color = "bg-blue-500";
    path = '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'; // ShoppingBag
  }

  return `
    <div class="${color} w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform transition-transform hover:scale-110">
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>
    </div>
  `;
};

const createCustomIcon = (category?: string, subcategory?: string) => {
  return new L.DivIcon({
    html: getIconSvg(category, subcategory),
    className: "custom-leaflet-marker bg-transparent border-0",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function MapView({ locations, activeLocation, showRoute = false }: MapViewProps) {
  const defaultCenter = locations.length > 0 ? locations[0].position : [16.8211, 100.2659];
  const [routeSegments, setRouteSegments] = useState<[number, number][][]>([]);

  useEffect(() => {
    if (showRoute && locations.length > 1) {
      const fetchRoute = async () => {
        try {
          const coordinates = locations.map(loc => `${loc.position[1]},${loc.position[0]}`).join(";");
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false&steps=true&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const segments = data.routes[0].legs.map((leg: any) => {
              const legCoords: [number, number][] = [];
              if (leg.steps) {
                leg.steps.forEach((step: any) => {
                  if (step.geometry && step.geometry.coordinates) {
                    step.geometry.coordinates.forEach((c: [number, number]) => {
                      legCoords.push([c[1], c[0]]);
                    });
                  }
                });
              }
              return legCoords;
            });
            setRouteSegments(segments);
          }
        } catch (error) {
          console.error("Error fetching route from OSRM:", error);
          // Fallback to straight lines, 1 segment for each pair
          const fallbackSegments = [];
          for (let i = 0; i < locations.length - 1; i++) {
            fallbackSegments.push([locations[i].position as [number, number], locations[i+1].position as [number, number]]);
          }
          setRouteSegments(fallbackSegments);
        }
      };
      fetchRoute();
    } else {
      setRouteSegments([]);
    }
  }, [showRoute, locations]);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .leaflet-control-zoom {
            display: none !important;
          }
        }
      `}</style>
      <MapContainer
        center={defaultCenter as [number, number]}
        zoom={14}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full z-0 font-sans"
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Modern light theme map tile
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={loc.position} icon={createCustomIcon(loc.category, loc.subcategory)}>
          <Popup className="font-sans">
              <strong className="text-base">{loc.name}</strong>
          </Popup>
        </Marker>
      ))}

      {showRoute && routeSegments.map((segment, index) => {
        let activeIndex = -1;
        if (activeLocation) {
          activeIndex = locations.findIndex(loc => loc.position[0] === activeLocation[0] && loc.position[1] === activeLocation[1]);
        }
        
        // Default to all segments blue if nothing explicitly picked
        let color = "#3b82f6"; // Blue
        let weight = 4;
        let dashArray = undefined;

        if (activeLocation && activeIndex !== -1) {
          if (index < activeIndex - 1) {
            color = "#10b981"; // Emerald green for completed segments
          } else if (index === activeIndex - 1) {
            color = "#3b82f6"; // Blue for the active routing segment
            weight = 6; // Thicker line for the active route
          } else {
            color = "#9ca3af"; // Gray for upcoming segments
            dashArray = "8, 8";
          }
        }

        return (
          <Polyline 
            key={`segment-${index}`} 
            positions={segment} 
            pathOptions={{ color, weight, dashArray }} 
          />
        );
      })}

      {activeLocation && <MapController center={activeLocation} />}
    </MapContainer>
    </>
  );
}
