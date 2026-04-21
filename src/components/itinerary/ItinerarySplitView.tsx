"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Clock, MapPin, Navigation } from "lucide-react";
import { Link } from "@/i18n/routing";

// Dynamically import MapView to prevent Server-Side Rendering (SSR) issues with Leaflet
const MapView = dynamic(() => import("@/components/explore/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-neutral-500 font-medium">Loading Map Data...</span>
      </div>
    </div>
  ),
});

import { Tour } from "../../data/itineraries";

export function ItinerarySplitView({ tour }: { tour: Tour }) {
  const [activeLocation, setActiveLocation] = useState<[number, number] | undefined>(undefined);

  // Map to the format MapView expects
  const mapLocations = tour.stops.map((stop) => ({
    id: stop.id,
    name: stop.name,
    category: stop.category,
    position: stop.position,
  }));

  return (
    <div className="flex flex-col md:flex-row absolute inset-0 w-full overflow-hidden">
      {/* Left Panel: Scrollable Timeline */}
      <div className="hidden md:flex flex-col w-full md:w-[450px] lg:w-[500px] h-full bg-background border-r border-neutral-200 dark:border-neutral-800 z-10 shadow-xl relative overflow-y-auto shrink-0 custom-scrollbar">
        <div className="sticky top-0 left-0 right-0 bg-background/95 backdrop-blur-xl py-6 px-6 z-20 border-b border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-center">
          <span className="text-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center gap-1">
            <Navigation className="w-4 h-4" /> {tour.durationLabel}
          </span>
          <h2 className="text-2xl font-extrabold text-foreground">{tour.title}</h2>
          <p className="text-sm text-neutral-500 font-medium mt-2 leading-relaxed">{tour.description}</p>
        </div>

        <div className="p-6 flex flex-col gap-6 pb-24 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[40px] top-8 bottom-24 w-[2px] bg-neutral-200 dark:bg-neutral-800 z-0"></div>
          
          {tour.stops.map((stop, index) => (
            <div
              key={stop.id}
              className="relative z-10 flex gap-4 cursor-pointer group"
              onMouseEnter={() => setActiveLocation(stop.position)}
              onClick={() => setActiveLocation(stop.position)}
            >
              {/* Timeline Node */}
              <div className="flex flex-col items-center mt-3 shrink-0">
                <div className={`w-8 h-8 rounded-full border-4 border-background flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 ${
                  activeLocation === stop.position ? 'bg-primary text-white scale-125' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-primary/20 group-hover:text-primary'
                }`}>
                  {index + 1}
                </div>
              </div>

              {/* Stop Content Card */}
              <div className={`flex flex-col flex-grow bg-card border-2 rounded-2xl p-4 transition-all duration-300 shadow-sm ${
                activeLocation === stop.position 
                  ? 'border-primary shadow-xl bg-primary/5' 
                  : 'border-neutral-100 dark:border-neutral-800/80 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-md'
              }`}>
                {/* Thumbnail */}
                <div className="w-full h-36 rounded-xl bg-cover bg-center mb-4 relative overflow-hidden group-hover:shadow-inner" style={{ backgroundImage: `url(${stop.img})` }}>
                   <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">{stop.category}</div>
                </div>
                
                <h3 className="font-extrabold text-lg tracking-tight mb-2 group-hover:text-primary transition-colors">{stop.name}</h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-bold mb-3">
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5" />{stop.time}</div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Carousel (overlaid on bottom of map) */}
      <div className="md:hidden flex flex-col absolute bottom-24 left-0 right-0 z-[1000] pointer-events-none">
          <div className="pointer-events-auto bg-white/95 dark:bg-neutral-900/90 backdrop-blur-xl mx-4 mb-3 p-3.5 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex flex-col">
               <h2 className="font-extrabold text-sm flex items-center gap-1.5"><Navigation className="w-4 h-4 text-primary" /> {tour.title} Tour</h2>
               <span className="text-xs text-neutral-500 font-bold mt-0.5">{tour.stops.length} Stops • {tour.durationLabel}</span>
            </div>
          </div>

          <div className="overflow-x-auto flex gap-4 px-4 snap-x snap-mandatory pb-4 hide-scrollbar pointer-events-auto">
              {tour.stops.map((stop, index) => (
                <div 
                    key={stop.id}
                    onClick={() => setActiveLocation(stop.position)}
                    className="w-[85vw] sm:w-72 shrink-0 snap-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex gap-3 active:scale-95 transition-transform"
                >
                    <div className="w-20 h-20 shrink-0 rounded-xl bg-cover bg-center shadow-md relative overflow-hidden ring-1 ring-black/5" style={{ backgroundImage: `url(${stop.img})` }}>
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm border border-white/10">{index + 1}</div>
                    </div>
                    <div className="flex flex-col py-0.5 flex-grow">
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md inline-block w-max mb-1.5">{stop.time}</span>
                        <h3 className="font-extrabold text-sm leading-tight line-clamp-2 md:line-clamp-1 mb-1">{stop.name}</h3>
                        <div className="mt-auto flex items-center gap-1 text-xs text-neutral-500 font-bold">
                             <MapPin className="w-3.5 h-3.5 text-secondary" /><span className="line-clamp-1">{stop.category}</span>
                        </div>
                    </div>
                </div>
              ))}
          </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full h-[100dvh] md:h-full md:flex-1 relative bg-neutral-200 dark:bg-neutral-800 z-0">
        <MapView locations={mapLocations} activeLocation={activeLocation} showRoute={true} />
      </div>

    </div>
  );
}
