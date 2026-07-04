"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  Coffee, Landmark, UtensilsCrossed, TreePine, Palette,
  Building2, Store, X, Phone, Navigation, Send, MapPin, Trees
} from "lucide-react";
import PLACES_DATA from "@/data/explorePlaceData.json";

export type Place = {
  id: string;
  name: string;
  category: string;
  location: string;
  highlightSpot: boolean;
  hashtags: string[];
  phone: string;
  img: string;
  position: [number, number];
};

const PLACES = PLACES_DATA as Place[];

function MapLoading() {
  const t = useTranslations("Explore");
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-neutral-500 font-medium text-sm">{t("loading_map")}</span>
      </div>
    </div>
  );
}

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <MapLoading />,
});

// ─── Category config ──────────────────────────────────────────────────────────

type CategoryConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
  pinColor: string;
  textColor: string;
};

const CATEGORIES: Record<string, CategoryConfig> = {
  Cafe: { label: "CAFE", icon: <Coffee size={16} />, color: "bg-[#92533C]", pinColor: "bg-[#92533C]", textColor: "text-[#D49D7E]" },
  Temple: { label: "TEMPLE", icon: <Landmark size={16} />, color: "bg-[#E68859]", pinColor: "bg-[#E68859]", textColor: "text-[#FCE6D2]" },
  Restaurant: { label: "RESTAURANT", icon: <UtensilsCrossed size={16} />, color: "bg-[#ECA1A5]", pinColor: "bg-[#ECA1A5]", textColor: "text-[#9B494F]" },
  Workshop: { label: "WORKSHOP", icon: <Palette size={16} />, color: "bg-[#9CC1D1]", pinColor: "bg-[#9CC1D1]", textColor: "text-[#4F7E94]" },
  Museum: { label: "MUSEUM", icon: <Building2 size={16} />, color: "bg-[#4B82A3]", pinColor: "bg-[#4B82A3]", textColor: "text-[#B0D0E2]" },
  Park: { label: "PARK", icon: <Trees size={16} />, color: "bg-[#848B55]", pinColor: "bg-[#A8B072]", textColor: "text-[#F4F2D3]" },
  "Local shop": { label: "LOCAL SHOP", icon: <Store size={16} />, color: "bg-[#9BBCA0]", pinColor: "bg-[#9BBCA0]", textColor: "text-[#E7F1E8]" },
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

// ─── Haversine distance (km) ──────────────────────────────────────────────────

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Category → i18n key map ──────────────────────────────────────────────────

const CAT_I18N_KEY: Record<string, string> = {
  Cafe: "cafe", Temple: "temple", Restaurant: "restaurant",
  Park: "park", Workshop: "workshop",
  Museum: "museum", "Local shop": "localshop",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ExploreSplitView({ initialPlaceId }: { initialPlaceId?: string }) {
  const t = useTranslations("Explore");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_KEYS]);
  const [nearMe, setNearMe] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [nearMeNotice, setNearMeNotice] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Phitsanulok province bounding box (generous coverage)
  const CITY_BOUNDS = { minLat: 16.70, maxLat: 16.95, minLng: 100.10, maxLng: 100.45 };

  useEffect(() => {
    if (initialPlaceId) {
      const place = PLACES.find((p) => p.id === initialPlaceId) ?? null;
      if (place) setSelectedPlace(place);
    }
  }, [initialPlaceId]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleNearMe = () => {
    if (!nearMe) {
      if (!navigator.geolocation) {
        setGpsError(t("gps_unsupported"));
        setNearMeNotice(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const inCity =
            lat >= CITY_BOUNDS.minLat && lat <= CITY_BOUNDS.maxLat &&
            lng >= CITY_BOUNDS.minLng && lng <= CITY_BOUNDS.maxLng;
          if (!inCity) {
            setGpsError(t("gps_out_of_bounds"));
            setNearMeNotice(null);
            return;
          }
          setUserPos([lat, lng]);
          setGpsError(null);
          setNearMeNotice(t("near_me_active"));
          setNearMe(true);
        },
        () => {
          setGpsError(t("gps_denied"));
          setNearMeNotice(null);
        }
      );
    } else {
      setNearMe(false);
      setNearMeNotice(null);
      setGpsError(null);
    }
  };

  const visiblePlaces = initialPlaceId
    ? PLACES.filter((p) => p.id === initialPlaceId)
    : PLACES.filter((p) => {
      const categoryMatch = selectedCategories.includes(p.category);
      if (!categoryMatch) return false;
      if (nearMe && userPos) {
        return getDistanceKm(userPos[0], userPos[1], p.position[0], p.position[1]) <= 3;
      }
      return true;
    });

  const handleSelectId = useCallback(
    (id: string) => {
      const place = PLACES.find((p) => p.id === id) ?? null;
      setSelectedPlace(place);
    },
    []
  );

  const catConfig = selectedPlace ? CATEGORIES[selectedPlace.category] : null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">

      {/* ── Map (full screen) ── */}
      <div className="absolute inset-0 z-0">
        <MapView
          locations={visiblePlaces}
          onSelectId={handleSelectId}
          userPosition={userPos ?? undefined}
        />
      </div>

      {/* ── Category chips + Near Me (top overlay) ── */}
      <div className="absolute top-0 left-0 right-0 z-[500] pt-3 pb-2 px-3 flex flex-col gap-2 pointer-events-none">
        {/* Mobile: horizontal slide bar. Desktop/tablet: wrap to next line */}
        <div className="flex items-center gap-1.5 md:gap-2 pointer-events-auto
          flex-nowrap overflow-x-auto hide-scrollbar
          md:flex-wrap md:overflow-x-visible">
          {/* None toggle */}
          <button
            onClick={() => setSelectedCategories([])}
            className={`flex items-center justify-center px-3 py-1.5 md:px-5 md:py-2.5 rounded-[10px] md:rounded-[12px] text-xs md:text-sm font-black whitespace-nowrap shadow-sm transition-all active:scale-95 ${selectedCategories.length === 0
              ? "bg-[#FDE1CF] text-[#DE8C62]"
              : "bg-[#FDE1CF]/80 text-[#DE8C62]/80 hover:bg-[#FDE1CF]"
              }`}
          >
            {t("filter_none")}
          </button>

          {CATEGORY_KEYS.map((cat) => {
            const cfg = CATEGORIES[cat];
            const active = selectedCategories.includes(cat);
            const catI18nKey = CAT_I18N_KEY[cat];
            const label = catI18nKey && t.has(`categories.${catI18nKey}`)
              ? t(`categories.${catI18nKey}`)
              : cfg.label;
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2.5 rounded-[10px] md:rounded-[12px] text-xs md:text-sm font-black whitespace-nowrap shadow-sm transition-all active:scale-95 ${active
                  ? `${cfg.color} ${cfg.textColor}`
                  : "bg-white/90 dark:bg-neutral-900/90 text-neutral-500 dark:text-neutral-400 backdrop-blur-md"
                  }`}
              >
                {cfg.icon}
                {label}
              </button>
            );
          })}

          {/* Near Me */}
          <button
            onClick={toggleNearMe}
            className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-[10px] md:rounded-[12px] text-xs md:text-sm font-black whitespace-nowrap shadow-sm transition-all active:scale-95 ${nearMe
              ? "bg-[#3A404F] text-white"
              : "bg-white text-[#3A404F] hover:bg-neutral-100"
              }`}
          >
            <Navigation size={14} className="shrink-0" />
            {t("near_me")}
          </button>
        </div>

        {/* Status banners — error or active notice */}
        {gpsError && (
          <div className="pointer-events-auto flex items-start gap-2 bg-red-500/90 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md backdrop-blur-md" style={{ maxWidth: 'calc(100vw - 1.5rem)' }}>
            <span className="shrink-0">⚠️</span>
            <span className="leading-snug break-words">{gpsError}</span>
          </div>
        )}
        {nearMeNotice && !gpsError && (
          <div className="pointer-events-auto flex items-start gap-2 bg-[#3A404F]/90 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md backdrop-blur-md" style={{ maxWidth: 'calc(100vw - 1.5rem)' }}>
            <Navigation size={12} className="shrink-0 mt-0.5" />
            <span className="leading-snug break-words">{nearMeNotice}</span>
          </div>
        )}
      </div>

      {/* ── Place Card (bottom overlay) ── */}
      <div
        className={`absolute left-0 right-0 z-[600] transition-all duration-300 ease-out ${selectedPlace
          ? "bottom-4 md:bottom-6 opacity-100 translate-y-0"
          : "bottom-0 opacity-0 translate-y-8 pointer-events-none"
          }`}
      >
        {selectedPlace && catConfig && (
          <div className="mx-3 md:mx-auto md:max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {/* Image */}
            <div className="relative h-40 w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedPlace.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Close btn */}
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>

              {/* Category badge */}
              <span
                className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white ${catConfig.color}`}
              >
                {catConfig.icon}
                {CAT_I18N_KEY[selectedPlace.category] && t.has(`categories.${CAT_I18N_KEY[selectedPlace.category]}`)
                  ? t(`categories.${CAT_I18N_KEY[selectedPlace.category]}`)
                  : selectedPlace.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-extrabold text-lg leading-tight mb-2">
                {selectedPlace.name}
              </h3>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedPlace.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F9EFEF] text-[#1D1D2B]/80 dark:bg-neutral-800 dark:text-neutral-300 border border-[#1D1D2B]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Phone */}
              <a
                href={`tel:${selectedPlace.phone}`}
                className="flex items-center gap-2 text-sm font-semibold text-[#AEADF0] dark:text-neutral-300 hover:text-primary transition-colors"
              >
                <div className="w-7 h-7 bg-[#AEADF0] text-[#F9EFEF] rounded-full flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                {selectedPlace.phone}
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
