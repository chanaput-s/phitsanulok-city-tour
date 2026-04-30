"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Users } from "lucide-react";
import MOCK_EVENTS from "@/data/mockEvents.json";
import { useTranslations, useLocale } from "next-intl";

export function EventHero() {
  const t = useTranslations("Events");
  const locale = useLocale();
  const isThai = locale === "th";
  const [featuredEvent, setFeaturedEvent] = useState(MOCK_EVENTS[0]);

  useEffect(() => {
    // Filter events to only include highlights
    const highlightEvents = MOCK_EVENTS.filter((event: any) => event.isHighlight);
    
    // Fallback to all events if no highlights are found
    const pool = highlightEvents.length > 0 ? highlightEvents : MOCK_EVENTS;
    
    // Pick a random event from the highlight pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    setFeaturedEvent(pool[randomIndex]);
  }, []);

  if (!featuredEvent) return null;

  return (
    <section className="w-full mb-8 md:mb-12 relative">
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .animate-kenburns {
          animation: kenburns 20s ease-out forwards;
        }
      `}</style>
      
      <div className="relative w-full h-[360px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
        {/* Photographic background with vector-like color grade and Ken Burns effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-kenburns"
          style={{ backgroundImage: `url(${featuredEvent.img})`, filter: 'saturate(1.2) contrast(1.1)' }}
        ></div>
        
        {/* Dark Teal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/70 to-transparent"></div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
          
          {/* Urgency Badge */}
          <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase mb-3 shadow-lg ring-2 ring-orange-500/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            {t("featured_event")}
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-wide drop-shadow-lg uppercase">
            {isThai ? featuredEvent.title_th : featuredEvent.title}
          </h1>
          
          {/* Subhead */}
          <p className="text-teal-50 text-sm md:text-lg font-medium mb-5 max-w-md drop-shadow-sm">
            {isThai ? featuredEvent.type_th : featuredEvent.type} • {t("rating")} {featuredEvent.rating}
          </p>

          {/* Quick Metadata Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-teal-50 text-xs md:text-sm font-medium mb-6">
            <div className="flex items-center gap-1.5 bg-teal-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-800/50 shadow-sm">
              <MapPin className="w-4 h-4 text-orange-400" />
              {isThai ? featuredEvent.location_th : featuredEvent.location}
            </div>
            <div className="flex items-center gap-1.5 bg-teal-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-800/50 shadow-sm">
              <Clock className="w-4 h-4 text-orange-400" />
              {featuredEvent.time}
            </div>
            <div className="flex items-center gap-1.5 bg-teal-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-800/50 shadow-sm hidden md:flex">
              <Users className="w-4 h-4 text-orange-400" />
              {t("high_turnout")}
            </div>
          </div>

          {/* Call to Action */}
          <button className="bg-white text-teal-900 font-extrabold px-8 py-3.5 rounded-full shadow-xl hover:bg-teal-50 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 transform active:scale-95 flex items-center gap-2">
            {t("view_details")}
          </button>
        </div>
      </div>
    </section>
  );
}
