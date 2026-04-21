"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

import MOCK_EVENTS from "@/data/mockEvents.json";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(15);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  // Determine events for the selected date
  const activeEvents = MOCK_EVENTS.filter(e =>
    e.year === year && e.month === month && (selectedDate === null || e.date === selectedDate)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">

      {/* Left Column: Calendar UI */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl">

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
              {MONTH_NAMES[month]} {year}
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
          <div className="grid grid-cols-7 gap-y-4 gap-x-1 sm:gap-x-2 text-center mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 gap-x-1 sm:gap-x-2">
            {/* Empty padding days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 sm:h-14 md:h-16 pointer-events-none"></div>
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              // Check if this date has events
              const dayEvents = MOCK_EVENTS.filter(e => e.year === year && e.month === month && e.date === date);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === date;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(isSelected ? null : date)}
                  className={`relative h-12 sm:h-14 md:h-16 rounded-2xl flex flex-col items-center justify-center text-sm sm:text-lg font-bold transition-all duration-300 ${isSelected
                    ? 'bg-primary text-white shadow-xl scale-110 z-10 border-2 border-primary ring-4 ring-primary/20'
                    : hasEvents
                      ? 'bg-primary/5 text-primary hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 border-2 border-transparent'
                      : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-transparent'
                    }`}
                >
                  <span>{date}</span>

                  {/* Event indicators (dots) */}
                  {hasEvents && !isSelected && (
                    <div className="absolute bottom-1.5 md:bottom-2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${e.color}`}></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Event List Details */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {selectedDate ? `${MONTH_NAMES[month]} ${selectedDate}, ${year}` : `All Events in ${MONTH_NAMES[month]}`}
          </h3>
          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-xs font-bold">
            {activeEvents.length} Events
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {activeEvents.length === 0 ? (
            <div className="h-64 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-neutral-400">
              <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
              <p>No events scheduled for this date.</p>
              <button onClick={() => setSelectedDate(null)} className="mt-4 text-primary font-bold hover:underline">View all month events</button>
            </div>
          ) : (
            activeEvents.map((event) => (
              <div key={event.id} className="group flex flex-col sm:flex-row gap-4 bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="w-full sm:w-40 h-40 sm:h-auto rounded-2xl bg-cover bg-center shrink-0 relative overflow-hidden" style={{ backgroundImage: `url(${event.img})` }}>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">{event.type}</div>
                </div>

                {/* Data */}
                <div className="flex flex-col flex-grow justify-center py-2">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{event.title}</h4>

                  <div className="flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium text-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                    <button className="text-sm font-bold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                      Get Tickets / Info <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
