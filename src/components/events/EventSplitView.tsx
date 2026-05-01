"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import MOCK_EVENTS from "@/data/mockEvents.json";
import { useTranslations, useLocale } from "next-intl";

const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_TH = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_TH = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/explore/MapView'),
  { ssr: false, loading: () => <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center text-neutral-400 font-medium">Loading Interactive Map...</div> }
);

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/explore/MapView'),
  { ssr: false, loading: () => <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center text-neutral-400 font-medium">Loading Interactive Map...</div> }
);

export function EventSplitView() {
  const t = useTranslations("Events");
  const locale = useLocale();
  const isThai = locale === "th";
  const MONTH_NAMES = isThai ? MONTH_NAMES_TH : MONTH_NAMES_EN;
  const DAYS = isThai ? DAYS_TH : DAYS_EN;
  const [activeLocation, setActiveLocation] = useState<[number, number] | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Determine events for the selected date
  const activeEvents = MOCK_EVENTS.filter(e => {
    if (e.year !== year || e.month !== month) return false;

    if (selectedDate !== null) {
      return e.date === selectedDate;
    } else {
      // If no selected date, show all events from today onwards in the current month
      const eventDate = new Date(e.year, e.month, e.date);
      return eventDate >= todayDateOnly;
    }
  });

  // Map activeEvents to generic PLACES structure for MapView compatibility
  const mapLocations = activeEvents.map(e => ({
    id: e.id,
    name: e.title,
    position: e.position as [number, number]
  }));

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden">

      {/* Left Panel: Scrollable Calendar & List (Hidden purely Mobile Maps) */}
      <div className="hidden md:flex flex-col w-full md:w-[450px] lg:w-[500px] h-full bg-background border-r border-neutral-200 dark:border-neutral-800 z-10 shadow-xl overflow-y-auto relative pt-16">

        {/* Sticky Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-xl px-6 py-4 z-20 border-b border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
            {MONTH_NAMES[month]} {isThai ? year + 543 : year}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6 pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider text-center">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {/* Empty padding days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 pointer-events-none"></div>
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const dayEvents = MOCK_EVENTS.filter(e => e.year === year && e.month === month && e.date === date);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === date;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(isSelected ? null : date)}
                  className={`relative h-10 rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-300 ${isSelected
                    ? 'bg-primary text-white shadow-md scale-105'
                    : hasEvents
                      ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20'
                      : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <span>{date}</span>
                  {hasEvents && !isSelected && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${e.color}`}></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="p-4 flex flex-col gap-4">
          {/* Section Title */}
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              {selectedDate ? `${selectedDate} ${MONTH_NAMES[month]}` : t("all_events_in")}
            </h3>
            <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs px-2 py-1 rounded-full font-bold">
              {activeEvents.length}
            </span>
          </div>

          {activeEvents.length === 0 ? (
            <div className="py-10 text-center text-neutral-500 text-sm border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
              {t("no_events_scheduled")}
            </div>
          ) : (
            activeEvents.map((event) => (
              <div
                key={event.id}
                onMouseEnter={() => setActiveLocation(event.position as [number, number])}
                onClick={() => setActiveLocation(event.position as [number, number])}
                className="flex flex-col gap-3 p-3 rounded-2xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 group hover:shadow-md"
              >
                {/* Image */}
                <div className="w-full h-32 rounded-xl bg-cover bg-center shrink-0 relative overflow-hidden shadow-inner" style={{ backgroundImage: `url(${event.img})` }}>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-[10px] font-bold uppercase tracking-wider">{isThai ? event.type_th : event.type}</div>
                </div>

                {/* Data */}
                <div className="flex flex-col">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{isThai ? event.title_th : event.title}</h4>
                  <div className="flex flex-col gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium text-foreground">{event.date} {MONTH_NAMES[event.month]} {isThai ? event.year + 543 : event.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-medium text-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      <span>{isThai ? event.location_th : event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Card Carousel Overlay */}
      <div className="md:hidden flex flex-col absolute bottom-24 left-0 right-0 z-[1000] pointer-events-none">
        {/* Mobile Calendar Toggle/Date Header */}
        <div className="pointer-events-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl mx-4 mb-3 p-3 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm">{selectedDate ? `${selectedDate} ${MONTH_NAMES[month]}` : t("explore_month")}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md font-bold text-xs">{"<"}</button>
            <span className="text-xs font-bold px-1">{MONTH_NAMES[month]}</span>
            <button onClick={nextMonth} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md font-bold text-xs">{">"}</button>
          </div>
        </div>

        {/* Event Cards Carousel */}
        <div className="overflow-x-auto flex gap-4 px-4 snap-x snap-mandatory pb-4 hide-scrollbar pointer-events-auto">
          {activeEvents.length === 0 ? (
            <div className="w-[85vw] sm:w-72 shrink-0 snap-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 text-center text-sm font-bold text-neutral-500">
              {t("no_events_today")}
            </div>
          ) : (
            activeEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setActiveLocation(event.position as [number, number])}
                className="w-[85vw] sm:w-72 shrink-0 snap-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex gap-3 active:scale-95 transition-transform"
              >
                <div className="w-20 h-20 shrink-0 rounded-xl bg-cover bg-center shadow-md relative overflow-hidden" style={{ backgroundImage: `url(${event.img})` }}></div>
                <div className="flex flex-col py-1 flex-grow">
                  <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded-full inline-block w-max mb-1">{isThai ? event.type_th : event.type}</span>
                  <h3 className="font-extrabold text-sm leading-tight line-clamp-2 md:line-clamp-1 mb-1">{isThai ? event.title_th : event.title}</h3>
                  <div className="mt-auto flex items-center justify-between text-xs text-neutral-500 gap-2">
                    <span className="flex items-center gap-1 min-w-0"><CalendarIcon className="w-3 h-3 text-primary shrink-0" /><span className="truncate">{event.date} {MONTH_NAMES[event.month]}</span></span>
                    <span className="flex items-center gap-1 shrink-0"><Clock className="w-3 h-3 text-emerald-500" />{event.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full h-[100dvh] md:h-full md:flex-1 relative bg-neutral-200 dark:bg-neutral-800 z-0">
        <MapView locations={mapLocations} activeLocation={activeLocation} />
      </div>

    </div>
  );
}
