"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

import MOCK_EVENTS from "@/data/mockEvents.json";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(2); // Default to week containing 15th

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Generate cells array
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const prev = () => {
    if (isExpanded) {
      setCurrentDate(new Date(year, month - 1, 1));
      setCurrentWeekIndex(0);
      setSelectedDate(null);
    } else {
      if (currentWeekIndex > 0) {
        setCurrentWeekIndex(currentWeekIndex - 1);
      } else {
        const prevMonthDate = new Date(year, month - 1, 1);
        setCurrentDate(prevMonthDate);
        const prevDaysInMonth = new Date(year, month, 0).getDate();
        const prevFirstDay = prevMonthDate.getDay();
        const prevCellsLength = prevDaysInMonth + prevFirstDay;
        const prevWeeksCount = Math.ceil(prevCellsLength / 7);
        setCurrentWeekIndex(prevWeeksCount - 1);
      }
    }
  };

  const next = () => {
    const weeksInMonth = cells.length / 7;
    if (isExpanded) {
      setCurrentDate(new Date(year, month + 1, 1));
      setCurrentWeekIndex(0);
      setSelectedDate(null);
    } else {
      if (currentWeekIndex < weeksInMonth - 1) {
        setCurrentWeekIndex(currentWeekIndex + 1);
      } else {
        setCurrentDate(new Date(year, month + 1, 1));
        setCurrentWeekIndex(0);
      }
    }
  };

  // Determine which cells to show
  const currentWeekStart = currentWeekIndex * 7;
  const visibleCells = isExpanded ? cells : cells.slice(currentWeekStart, currentWeekStart + 7);

  const handleDateClick = (date: number) => {
    setSelectedDate(selectedDate === date ? null : date);
    if (!isExpanded) {
      // Find the index of the clicked date to ensure the week index stays correct
      const idx = cells.indexOf(date);
      if (idx !== -1) {
        setCurrentWeekIndex(Math.floor(idx / 7));
      }
    }
  };

  // Determine events for the selected date
  const activeEvents = MOCK_EVENTS.filter(e =>
    e.year === year && e.month === month && (selectedDate === null || e.date === selectedDate)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">

      {/* Left Column: Calendar UI */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-6 shadow-lg">

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
              {MONTH_NAMES[month]} {year}
            </h2>
            <div className="flex items-center gap-1.5">
              <button onClick={prev} className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={next} className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 sm:gap-x-1.5 text-center mb-1">
            {DAYS.map(day => (
              <div key={day} className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 sm:gap-y-2.5 gap-x-1 sm:gap-x-1.5">
            {visibleCells.map((date, index) => {
              if (date === null) {
                return <div key={`empty-${index}`} className="h-9 sm:h-10 md:h-11 pointer-events-none"></div>;
              }

              // Check if this date has events
              const dayEvents = MOCK_EVENTS.filter(e => e.year === year && e.month === month && e.date === date);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === date;

              return (
                <button
                  key={date}
                  onClick={() => handleDateClick(date)}
                  className={`relative h-9 sm:h-10 md:h-11 rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${isSelected
                    ? 'bg-primary text-white shadow-md scale-110 z-10 border-2 border-primary ring-2 ring-primary/20'
                    : hasEvents
                      ? 'bg-primary/5 text-primary hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 border-2 border-transparent'
                      : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-transparent'
                    }`}
                >
                  <span>{date}</span>

                  {/* Event indicators (dots) */}
                  {hasEvents && !isSelected && (
                    <div className="absolute bottom-1 md:bottom-1.5 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${e.color}`}></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Toggle View Button */}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-[11px] sm:text-xs font-bold text-neutral-500 hover:text-primary transition-colors flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full"
            >
              {isExpanded ? "Show Week Only" : "Show Full Month"}
            </button>
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
