"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { formatDateRange, normalizeEvent, type Locale } from "@/lib/eventUtils";

const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

interface CarouselProps {
  events: any[];
}

export function UpcomingCarousel({ events }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const locale = useLocale();
  const isThai = locale === "th";
  const MONTH_NAMES = isThai ? MONTH_NAMES_TH : MONTH_NAMES_EN;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        setScrollProgress((scrollLeft / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full group flex flex-col">
      <div className="relative w-full">
        {/* Navigation Controls */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 md:-ml-5 z-10 w-10 h-10 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-700 flex items-center justify-center text-teal-900 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carousel Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 pt-2 px-1"
        >
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden shrink-0 snap-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card w-[260px] h-[320px] md:w-[280px] md:h-[350px]"
            >
              {/* Visual Header (Top 80%) */}
              <div className="relative w-full h-[80%] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-110"
                  style={{ backgroundImage: `url(${event.img})` }}
                ></div>

                {/* Subtle gradient overlay for better badge contrast */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent"></div>

                {/* Category Badge Overlay */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-teal-900 dark:text-teal-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                  {isThai ? event.type_th : event.type}
                </div>
              </div>

              {/* Details Footer (Bottom 20%) */}
              <div className="h-[20%] w-full px-4 py-3 flex flex-col justify-center bg-white dark:bg-neutral-900 z-10 border-t border-neutral-50 dark:border-neutral-800">
                {/* Event Title */}
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm md:text-base leading-none mb-1.5 truncate">
                  {isThai ? event.title_th : event.title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate pt-[3px]">{formatDateRange(normalizeEvent(event), locale as Locale)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate pt-[3px]">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate pt-[3px]">{isThai ? event.location_th : event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Navigation Control */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 md:-mr-5 z-10 w-10 h-10 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-700 flex items-center justify-center text-teal-900 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Bar Progress Indicator */}
      {events.length > 1 && (
        <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mx-auto mt-3 relative overflow-hidden">
          <div
            className="absolute top-0 bottom-0 bg-teal-800 dark:bg-teal-500 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${100 / events.length}%`,
              left: `${scrollProgress * (1 - 1 / events.length)}%`
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
