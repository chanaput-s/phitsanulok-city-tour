"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Star, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import MOCK_EVENTS from "@/data/mockEvents.json";

// Dynamically import MapView to prevent Server-Side Rendering (SSR) issues with Leaflet
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"><div className="flex flex-col items-center gap-2"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div><span className="text-neutral-500 font-medium">Loading Map Data...</span></div></div>
});

type Place = {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  rating: number | string;
  img: string;
  position: [number, number];
  isEvent?: boolean;
};

const PLACES: Place[] = [
  { id: "1", name: "Wat Phra Si Rattana Mahathat", category: "Temple", rating: 4.9, img: "https://images.unsplash.com/photo-1540610996881-1bc54ee5512b?q=80&w=800", position: [16.8235, 100.2608] },
  { id: "2", name: "River Nan Night Market", category: "Food & Shop", rating: 4.7, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800", position: [16.8200, 100.2640] },
  { id: "3", name: "Phitsanulok City Pillar Shrine", category: "Historical", rating: 4.8, img: "https://images.unsplash.com/photo-1520626337972-00ab56cbd5e5?q=80&w=800", position: [16.8250, 100.2665] },
  { id: "4", name: "Sergeant Major Thawee Folk Museum", category: "Museum", rating: 4.6, img: "https://images.unsplash.com/photo-1563294336-16d7a4cb88dd?q=80&w=800", position: [16.8120, 100.2740] },
  { id: "5", name: "Chan Royal Palace", category: "Historical", rating: 4.5, img: "https://images.unsplash.com/photo-1552353617-3bfd679b10b0?q=80&w=800", position: [16.8270, 100.2580] },
  { id: "6", name: "Naresuan University Art Gallery", category: "Art", rating: 4.6, img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800", position: [16.7431, 100.1983] },
];

const EVENT_PLACES: Place[] = MOCK_EVENTS.map((e: any) => ({
  id: `event-${e.id}`,
  name: e.title,
  category: "Event",
  subcategory: e.type,
  rating: "Event",
  img: e.img,
  position: e.position as [number, number],
  isEvent: true
}));

const ALL_PLACES: Place[] = [...PLACES, ...EVENT_PLACES];

export function ExploreSplitView() {
  const [activeLocation, setActiveLocation] = useState<[number, number] | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState("All Places");

  const categories = ["All Places", ...Array.from(new Set(ALL_PLACES.map(p => p.category)))];

  const filteredPlaces = activeFilter === "All Places" 
    ? ALL_PLACES 
    : ALL_PLACES.filter(p => p.category === activeFilter);

  return (
    <div className="flex flex-col md:flex-row absolute inset-0 w-full overflow-hidden">
      
      {/* Left Panel: Scrollable List (Hidden on purely Mobile Maps) */}
      <div className="hidden md:flex flex-col w-full md:w-[450px] lg:w-[500px] h-full bg-background border-r border-neutral-200 dark:border-neutral-800 z-10 shadow-xl relative overflow-y-auto shrink-0 custom-scrollbar">
        <div className="sticky top-0 left-0 right-0 bg-background/95 backdrop-blur-xl py-4 z-20 border-b border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-3 px-6">Popular Recommendations</h2>
            <div className="flex flex-wrap gap-2 pb-1 px-6 w-full">
                {categories.map((cat) => (
                  <span 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition border ${
                      activeFilter === cat 
                        ? 'bg-primary text-primary-foreground border-transparent shadow-sm' 
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-transparent dark:border-neutral-700'
                    }`}
                  >
                    {cat}
                  </span>
                ))}
            </div>
        </div>

        <div className="p-4 flex flex-col gap-3 pb-10">
          {filteredPlaces.length === 0 && (
            <div className="text-center text-neutral-500 py-10">No places found for this category.</div>
          )}
          {filteredPlaces.map((place) => (
            <div 
              key={place.id}
              className="flex gap-4 p-3 rounded-2xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 group hover:shadow-md"
              onMouseEnter={() => setActiveLocation(place.position as [number, number])}
              onClick={() => setActiveLocation(place.position as [number, number])}
            >
              {/* Thumbnail */}
              <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500 ease-out" style={{ backgroundImage: `url(${place.img})` }}></div>
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-grow py-1">
                <div className="text-xs font-bold text-primary mb-1 tracking-wider uppercase bg-primary/10 rounded-full px-2 py-0.5 inline-block w-max">{place.category}</div>
                <h3 className="font-bold text-lg mb-1 leading-tight group-hover:text-primary transition-colors">{place.name}</h3>
                
                <div className="mt-auto flex items-center justify-between text-sm">
                  <Link 
                    href={place.isEvent ? `/events` : `/place/${place.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-bold transition-colors"
                  >
                    <span className="text-xs">View detail</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    {!place.isEvent && <Star className="w-4 h-4 fill-current" />}
                    <span className={place.isEvent ? "text-primary text-xs" : ""}>{place.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Carousel (overlaid on bottom of map) */}
      <div className="md:hidden flex flex-col absolute bottom-24 left-0 right-0 z-[1000] pointer-events-none">
          {/* Mobile Filters */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 mb-3 pointer-events-auto">
             {categories.map((cat) => (
                <span 
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap shadow-lg backdrop-blur-md border ${
                    activeFilter === cat 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white/90 dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {cat}
                </span>
             ))}
          </div>

          <div className="overflow-x-auto flex gap-4 px-4 snap-x snap-mandatory pb-4 hide-scrollbar pointer-events-auto">
              {filteredPlaces.map((place) => (
                <div 
                    key={place.id}
                    onClick={() => setActiveLocation(place.position as [number, number])}
                    className="w-[85vw] sm:w-72 shrink-0 snap-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex gap-3 active:scale-95 transition-transform"
                >
                    <div className="w-20 h-20 shrink-0 rounded-xl bg-cover bg-center shadow-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${place.img})` }}></div>
                    </div>
                    <div className="flex flex-col py-1 flex-grow">
                        <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded-full inline-block w-max mb-1">{place.category}</span>
                        <h3 className="font-extrabold text-sm leading-tight line-clamp-2 md:line-clamp-1 mb-1">{place.name}</h3>
                        <div className="mt-auto flex items-center justify-between text-xs">
                            <Link 
                              href={place.isEvent ? `/events` : `/place/${place.id}`}
                              className="text-primary font-bold flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md active:bg-primary/20"
                            >
                              View <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </Link>
                            <div className="font-bold text-amber-500 flex items-center gap-1">
                                {!place.isEvent && <Star className="w-3 h-3 fill-current" />}
                                <span className={place.isEvent ? "text-primary text-[10px]" : ""}>{place.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
              ))}
          </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full h-[100dvh] md:h-full md:flex-1 relative bg-neutral-200 dark:bg-neutral-800 z-0">
        <MapView locations={filteredPlaces} activeLocation={activeLocation} />
      </div>

    </div>
  );
}
