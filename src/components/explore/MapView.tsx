"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Phitsanulok city bounding box
const PHITSANULOK_BOUNDS: L.LatLngBoundsLiteral = [
  [16.78, 100.20],
  [16.87, 100.33],
];
const PHITSANULOK_CENTER: [number, number] = [16.823, 100.263];

function BoundsController() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(PHITSANULOK_BOUNDS);
    map.on("drag", () => map.panInsideBounds(PHITSANULOK_BOUNDS, { animate: false }));
  }, [map]);
  return null;
}

// ─── Category → pin color map ─────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Cafe:         "#f59e0b",
  Temple:       "#eab308",
  Restaurant:   "#ef4444",
  Park:         "#22c55e",
  Bar:          "#a855f7",
  Workshop:     "#3b82f6",
  Museum:       "#6366f1",
  "Local shop": "#ec4899",
};

const CATEGORY_ICONS: Record<string, string> = {
  Cafe:         '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>',
  Temple:       '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  Restaurant:   '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/>',
  Park:         '<path d="M11 20a7 7 0 0 1-7-7 4 4 0 0 1 4-4 4 4 0 0 1 4 4"/><path d="M11 20V8"/><path d="M16.5 8.5a4 4 0 0 1 1.5 7.5"/><path d="M16.5 8.5 17 20"/>',
  Bar:          '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="m17 3-5 7-5-7Z"/>',
  Workshop:     '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 5.6a5.009 5.009 0 0 0-6.16.88l3.26 3.26 1.79 1.79 1.73 1.73L20.91 11.7Z"/>',
  Museum:       '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  "Local shop": '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
};

function createCategoryIcon(category: string) {
  const color = CATEGORY_COLORS[category] ?? "#6b7280";
  const iconPath = CATEGORY_ICONS[category] ?? '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
  const html = `
    <div style="background:${color}" class="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
    </div>`;
  return new L.DivIcon({
    html,
    className: "bg-transparent border-0",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MapViewProps {
  locations: { id: string; name: string; position: [number, number]; category?: string }[];
  onSelectId?: (id: string) => void;
  userPosition?: [number, number];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapView({ locations, onSelectId, userPosition }: MapViewProps) {
  return (
    <>
      <style>{`
        @media (max-width: 768px) { .leaflet-control-zoom { display: none !important; } }
        .bg-transparent.border-0 { background: transparent !important; border: none !important; }
      `}</style>
      <MapContainer
        center={PHITSANULOK_CENTER}
        zoom={14}
        minZoom={13}
        scrollWheelZoom
        zoomControl
        className="w-full h-full z-0 font-sans"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <BoundsController />

        {/* Place markers */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.position}
            icon={createCategoryIcon(loc.category ?? "")}
            eventHandlers={{
              click: () => onSelectId?.(loc.id),
            }}
          />
        ))}

        {/* User position dot */}
        {userPosition && (
          <CircleMarker
            center={userPosition}
            radius={8}
            pathOptions={{ color: "#fff", weight: 2, fillColor: "#3b82f6", fillOpacity: 1 }}
          />
        )}
      </MapContainer>
    </>
  );
}