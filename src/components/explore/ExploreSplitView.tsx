"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Coffee, Landmark, UtensilsCrossed, TreePine, Palette,
  Building2, Store, X, Phone, Navigation, Send, MapPin, Trees
} from "lucide-react";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-neutral-500 font-medium text-sm">Loading Map...</span>
      </div>
    </div>
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Place = {
  id: string;
  name: string;
  category: string;
  hashtags: string[];
  phone: string;
  img: string;
  position: [number, number];
};

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
  Park: { label: "PARK", icon: <Trees size={16} />, color: "bg-[#848B55]", pinColor: "bg-[#848B55]", textColor: "text-[#F4F2D3]" },
  "Local shop": { label: "LOCAL SHOP", icon: <Store size={16} />, color: "bg-[#9BBCA0]", pinColor: "bg-[#9BBCA0]", textColor: "text-[#E7F1E8]" },
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

// ─── Mock places (1 per category) ────────────────────────────────────────────

const PLACES: Place[] = [
  {
    id: "cafe-1",
    name: "Made for Mouth Cafe",
    category: "Cafe",
    hashtags: ["#คาเฟ่พิษณุโลก", "#ร้านดัง", "#minimalist"],
    phone: "055-123-456",
    img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
    position: [16.8210, 100.2550],
  },
  {
    id: "restaurant-1",
    name: "Pae the River",
    category: "Restaurant",
    hashtags: ["#ริมน้ำน่าน", "#อาหารไทย", "#วิวสวย"],
    phone: "055-301-789",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
    position: [16.8150, 100.2670],
  },
  {
    id: "park-1",
    name: "สวนสมเด็จพระนเรศวร",
    category: "Park",
    hashtags: ["#สวนสาธารณะ", "#พักผ่อน", "#ออกกำลังกาย"],
    phone: "055-244-100",
    img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800",
    position: [16.8300, 100.2620],
  },
  {
    id: "bar-1",
    name: "Riverside Bar & Lounge",
    category: "Bar",
    hashtags: ["#barพิษณุโลก", "#ริมน้ำ", "#nightlife"],
    phone: "092-456-7890",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
    position: [16.8185, 100.2635],
  },
  {
    id: "workshop-1",
    name: "Phitsanulok Craft Workshop",
    category: "Workshop",
    hashtags: ["#handmade", "#งานฝีมือ", "#DIY"],
    phone: "081-234-5678",
    img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800",
    position: [16.8170, 100.2590],
  },
  {
    id: "museum-1",
    name: "พิพิธภัณฑ์พื้นบ้านจ่าทวี",
    category: "Museum",
    hashtags: ["#museum", "#ประวัติศาสตร์", "#วัฒนธรรม"],
    phone: "055-258-858",
    img: "https://images.unsplash.com/photo-1563294336-16d7a4cb88dd?q=80&w=800",
    position: [16.8120, 100.2740],
  },
  {
    id: "localshop-1",
    name: "ตลาดริมน้ำน่าน",
    category: "Local shop",
    hashtags: ["#ตลาดพิษณุโลก", "#ของฝาก", "#streetfood"],
    phone: "086-789-0123",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    position: [16.8200, 100.2640],
  },
  {
  id: "temple-001",           // ห้ามซ้ำกับอันอื่น
  name: "วัดพระศรีรัตนมหาธาตุวรมหาวิหาร",
  category: "Temple",          // ต้องตรงกับ category ที่มี (ดูด้านล่าง)
  hashtags: ["#วัดพิษณุโลก", "#พระพุทธชินราช", "#unseen"],
  phone: "055258966",
  img: "https://image-tc.galaxy.tf/wijpeg-3fvrgksxjmddlgex2zime0tve/temple-of-wat-phra-si-rattana-mahathat-hop-inn-hotel_standard.jpg?crop=0%2C0%2C555%2C416",        // URL รูปภาพ
  position: [16.823680921126684, 100.26191685462676],  // [latitude, longitude]
  },
  {
  id: "temple-002",           // ห้ามซ้ำกับอันอื่น
  name: "วัดนางพญา",
  category: "Temple",          // ต้องตรงกับ category ที่มี (ดูด้านล่าง)
  hashtags: ["#วัดพิษณุโลก", "#unseen"],
  phone: "No contact number",
  img: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFGscDrVIz21hoBsWNi3tjQOHwDmht-g2Ad9UG59jzavArFmNqX1AQexlOWeTlEUveha7Pf_ryyGNFdVgQak_9Qk5O2NsOb0LjmqGPn_cAslVEzHeREo4M4UR7jlGeloSf1Sq-gIUvFK8w=w408-h306-k-no",        // URL รูปภาพ
  position: [16.822688075959178, 100.2619532168755],  // [latitude, longitude]
  },
  {
  id: "temple-003",           // ห้ามซ้ำกับอันอื่น
  name: "วัดจันทร์ตะวันตก",
  category: "Temple",          // ต้องตรงกับ category ที่มี (ดูด้านล่าง)
  hashtags: ["#วัดพิษณุโลก", "#unseen"],
  phone: "055251729",
  img: "https://ik.imagekit.io/tvlk/blog/2024/11/background-religious-attractions-phitsanulok-province-wat-1024x683.jpg?tr=q-70,c-at_max,w-1000,h-600",        // URL รูปภาพ
  position: [16.807252424523515, 100.24638104171648],  // [latitude, longitude]
  },
  {
  id: "temple-004",           // ห้ามซ้ำกับอันอื่น
  name: "วัดจันทร์ตะวันออก",
  category: "Temple",          // ต้องตรงกับ category ที่มี (ดูด้านล่าง)
  hashtags: ["#วัดพิษณุโลก", "#unseen"],
  phone: "06101483",
  img: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG1wQzuvEvZX4rcOSr5pjQnsU96u0Pwxu2K_oS24zDhNo8u0wzlFy5AzHPtiK6IssiaUT31FKpw3roeDkRJTmT9oelKs3FhKjlCvEZllSzMtdgXNOA3y_gaGk8BDyrWn_FWFZc62A=w408-h306-k-no",        // URL รูปภาพ
  position: [16.8046704601266, 100.2450000975198],  // [latitude, longitude]
  },
];

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

// ─── Component ────────────────────────────────────────────────────────────────

export function ExploreSplitView({ initialPlaceId }: { initialPlaceId?: string }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_KEYS]);
  const [nearMe, setNearMe] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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
        setGpsError("อุปกรณ์ไม่รองรับ GPS");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
          setGpsError(null);
          setNearMe(true);
        },
        () => setGpsError("ไม่สามารถเข้าถึง GPS ได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง")
      );
    } else {
      setNearMe(false);
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
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pointer-events-auto flex-wrap md:flex-nowrap">
          {/* None toggle */}
          <button
            onClick={() => setSelectedCategories([])}
            className={`flex items-center justify-center px-5 py-2.5 rounded-[12px] text-sm font-black whitespace-nowrap shadow-sm transition-all active:scale-95 ${
              selectedCategories.length === 0
                ? "bg-[#FDE1CF] text-[#DE8C62]"
                : "bg-[#FDE1CF]/80 text-[#DE8C62]/80 hover:bg-[#FDE1CF]"
            }`}
          >
            NONE
          </button>

          {CATEGORY_KEYS.map((cat) => {
            const cfg = CATEGORIES[cat];
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-black whitespace-nowrap shadow-sm transition-all active:scale-95 ${active
                  ? `${cfg.color} ${cfg.textColor}`
                  : "bg-white/90 dark:bg-neutral-900/90 text-neutral-500 dark:text-neutral-400 backdrop-blur-md"
                  }`}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            );
          })}

          {/* Near Me */}
          <button
            onClick={toggleNearMe}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-black whitespace-nowrap shadow-sm transition-all active:scale-95 ${nearMe
              ? "bg-white text-[#3A404F] ring-2 ring-[#3A404F]"
              : "bg-white text-[#3A404F] hover:bg-gray-50"
              }`}
          >
            <Send size={16} className="rotate-45 -mt-1" />
            NEAR ME
            {nearMe && <span className="ml-1 text-[10px] opacity-80">3 km</span>}
          </button>
        </div>

        {/* GPS error */}
        {gpsError && (
          <div className="pointer-events-auto bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-md w-max backdrop-blur-md">
            {gpsError}
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
                {selectedPlace.category}
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
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 ${catConfig.textColor}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Phone */}
              <a
                href={`tel:${selectedPlace.phone}`}
                className="flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
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
