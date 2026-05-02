"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { normalizeEvent, formatDateRange, type Locale } from "@/lib/eventUtils";

import MOCK_EVENTS from "@/data/mockEvents.json";
import { useTranslations, useLocale } from "next-intl";

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_TH = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_TH = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

export function EventCalendar() {
  const t = useTranslations("Events");
  const locale = useLocale();
  const isThai = locale === "th";
  const DAYS = isThai ? DAYS_TH : DAYS_EN;
  const MONTH_NAMES = isThai ? MONTH_NAMES_TH : MONTH_NAMES_EN;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const todayInit = new Date();
  const initialFirstDay = new Date(todayInit.getFullYear(), todayInit.getMonth(), 1).getDay();
  const todayWeekIndex = Math.floor((todayInit.getDate() + initialFirstDay - 1) / 7);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(todayWeekIndex);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Generate cells array
  const cells: { date: number; type: 'prev' | 'current' | 'next' }[] = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({ date: prevMonthDays - firstDayOfMonth + i + 1, type: 'prev' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: i, type: 'current' });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: nextDay++, type: 'next' });
  }

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

  // Group cells into weeks for smooth animation
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const handleDateClick = (date: number) => {
    const isDeselecting = selectedDate === date;
    setSelectedDate(isDeselecting ? null : date);

    // Snap to the correct week
    const idx = cells.findIndex(c => c.type === 'current' && c.date === date);
    if (idx !== -1) {
      setCurrentWeekIndex(Math.floor(idx / 7));
    }
  };

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const normalizedEvents = (MOCK_EVENTS as any[]).map(e => normalizeEvent(e));

  // Determine events for the selected date
  const activeEvents = normalizedEvents.filter(e => {
    const s = new Date(e.startDate);
    s.setHours(0, 0, 0, 0);
    const end = new Date(e.endDate);
    end.setHours(0, 0, 0, 0);
    
    if (selectedType !== null && e.type.en !== selectedType) return false;

    if (selectedDate !== null) {
      const cellDate = new Date(year, month, selectedDate).getTime();
      return cellDate >= s.getTime() && cellDate <= end.getTime();
    } else {
      const monthStart = new Date(year, month, 1).getTime();
      const monthEnd = new Date(year, month + 1, 0).getTime();
      const inMonth = s.getTime() <= monthEnd && end.getTime() >= monthStart;
      if (!inMonth) return false;
      return end.getTime() >= todayDateOnly.getTime();
    }
  });

  return (
    <div className="flex flex-col gap-8 lg:gap-12 w-full">

      {/* Top Row: Calendar UI */}
      <div className="w-full flex flex-col">
        {/* Calendar Header Moved to Top */}
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className={`font-extrabold tracking-tight text-[#1D1D2B] ${isThai ? 'text-3xl' : 'text-2xl'}`}>
            {MONTH_NAMES[month]} {isThai ? year + 543 : year}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-[#F9EFEF] shadow-sm border border-[#1D1D2B]/10 flex items-center justify-center hover:bg-[#AEADF0] transition-colors text-[#1D1D2B]/80 hover:text-[#1D1D2B]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full bg-[#F9EFEF] shadow-sm border border-[#1D1D2B]/10 flex items-center justify-center hover:bg-[#AEADF0] transition-colors text-[#1D1D2B]/80 hover:text-[#1D1D2B]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-[#F9EFEF] border border-[#1D1D2B]/10 rounded-2xl p-4 md:p-6 shadow-lg">

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 sm:gap-x-1.5 text-center mb-1">
            {DAYS.map(day => (
              <div key={day} className="text-[9px] sm:text-[10px] font-bold text-[#1D1D2B]/40 uppercase tracking-wider">{day}</div>
            ))}
          </div>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out -mx-4 px-4 -mt-4 pt-4 -mb-4 pb-4 ${isExpanded ? 'max-h-[450px]' : 'max-h-[68px] sm:max-h-[72px] md:max-h-[76px]'}`}>
            <div
              className="flex flex-col transition-transform duration-500 ease-in-out"
              style={{ transform: isExpanded ? 'translateY(0)' : `translateY(calc(-${currentWeekIndex} * (100% / ${weeks.length})))` }}
            >
              {weeks.map((week, wIndex) => (
                <div
                  key={wIndex}
                  className={`grid grid-cols-7 gap-x-1 sm:gap-x-1.5 pb-2 sm:pb-2.5 transition-opacity duration-300 ${!isExpanded && wIndex !== currentWeekIndex ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  {week.map((cell, index) => {
                    if (cell.type !== 'current') {
                      return (
                        <div key={`other-${index}`} className="h-8 sm:h-9 md:h-11 flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold text-[#1D1D2B]/20 pointer-events-none">
                          {cell.date}
                        </div>
                      );
                    }

                    const date = cell.date;
                    const cellDateObj = new Date(year, month, date).getTime();

                    // Check if this date has events
                    const dayEvents = normalizedEvents.filter(e => {
                      const s = new Date(e.startDate);
                      s.setHours(0, 0, 0, 0);
                      const end = new Date(e.endDate);
                      end.setHours(0, 0, 0, 0);
                      
                      const isInRange = cellDateObj >= s.getTime() && cellDateObj <= end.getTime();
                      if (!isInRange) return false;
                      
                      return selectedType === null || e.type.en === selectedType;
                    });
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selectedDate === date;

                    return (
                      <button
                        key={date}
                        onClick={() => handleDateClick(date)}
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 shrink-0 mx-auto rounded-full flex flex-col items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${isSelected
                          ? 'bg-[#AEADF0] text-[#1D1D2B] shadow-lg scale-110 z-10'
                          : hasEvents
                            ? 'bg-[#AEADF0]/20 text-[#1D1D2B] hover:bg-[#AEADF0]/40 backdrop-blur-md border border-[#1D1D2B]/10 shadow-sm'
                            : 'bg-white/60 backdrop-blur-md border border-[#1D1D2B]/5 shadow-sm text-[#1D1D2B]/80 hover:bg-white hover:shadow-md'
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
              ))}
            </div>
          </div>


        </div>
        {/* Toggle View Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              const nextExpanded = !isExpanded;
              setIsExpanded(nextExpanded);
              if (nextExpanded) {
                setSelectedDate(null); // Reset selected date when expanding to show all
              }
            }}
            className="text-[11px] sm:text-xs font-bold text-[#1D1D2B]/60 hover:text-[#AEADF0] transition-colors flex items-center gap-1 bg-white/60 hover:bg-white px-4 py-2 rounded-full border border-[#1D1D2B]/5"
          >
            {isExpanded ? t("show_week_only") : t("show_full_month")}
          </button>
        </div>
      </div>

      {/* Bottom Row: Event List Details */}
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold flex items-center gap-2 text-[#1D1D2B] ${isThai ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
            <CalendarIcon className="w-5 h-5 text-[#AEADF0]" />
            {selectedDate ? `${MONTH_NAMES[month]} ${selectedDate}, ${isThai ? year + 543 : year}` : `${t("all_events_in")} ${MONTH_NAMES[month]}`}
          </h3>
          <span className="bg-[#FCD091] text-[#1D1D2B] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {activeEvents.length} {t("events_count")}
          </span>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${selectedType === null ? 'bg-[#1D1D2B] text-[#F9EFEF] shadow-md' : 'bg-[#F9EFEF] border border-[#1D1D2B]/10 text-[#1D1D2B]/70 hover:bg-white'}`}
          >
            {t("all_types")}
          </button>
          {Array.from(
            new Map(
              normalizedEvents
                .filter(e => {
                  const s = new Date(e.startDate);
                  s.setHours(0, 0, 0, 0);
                  const end = new Date(e.endDate);
                  end.setHours(0, 0, 0, 0);
                  const monthStart = new Date(year, month, 1).getTime();
                  const monthEnd = new Date(year, month + 1, 0).getTime();
                  return s.getTime() <= monthEnd && end.getTime() >= monthStart;
                })
                .map(e => [e.type.en, e])
            ).values()
          ).map(e => {
            const typeKey = e.type.en;
            const displayType = isThai ? e.type.th : e.type.en;
            return (
              <button
                key={typeKey}
                onClick={() => setSelectedType(typeKey)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${selectedType === typeKey ? 'bg-[#1D1D2B] text-[#F9EFEF] shadow-md' : 'bg-[#F9EFEF] border border-[#1D1D2B]/10 text-[#1D1D2B]/70 hover:bg-white'}`}
              >
                {displayType}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-4">
          {activeEvents.length === 0 ? (
            <div className="h-64 rounded-3xl border-2 border-dashed border-[#1D1D2B]/20 bg-[#F9EFEF]/50 flex flex-col items-center justify-center text-[#1D1D2B]/40">
              <CalendarIcon className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">{t("no_events_scheduled")}</p>
              <button onClick={() => setSelectedDate(null)} className="mt-4 text-[#AEADF0] font-bold hover:underline">{t("view_all_month_events")}</button>
            </div>
          ) : (
            activeEvents.map((event) => (
              <div key={event.id} className="group grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F9EFEF] border border-[#1D1D2B]/10 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="w-full h-48 sm:h-auto sm:aspect-video rounded-2xl bg-cover bg-center relative overflow-hidden sm:self-start" style={{ backgroundImage: `url(${event.img})` }}>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[#1D1D2B]/80 backdrop-blur-md rounded-lg text-[#F9EFEF] text-[10px] font-bold uppercase tracking-wider">{isThai ? event.type.th : event.type.en}</div>
                </div>

                {/* Data */}
                <div className="flex flex-col justify-center py-2">
                  <h4 className={`font-bold mb-3 text-[#1D1D2B] group-hover:text-[#AEADF0] transition-colors ${isThai ? 'text-2xl' : 'text-xl'}`}>{isThai ? event.title.th : event.title.en}</h4>

                  <div className={`flex flex-col gap-2 text-[#1D1D2B]/60 ${isThai ? 'text-base' : 'text-sm'}`}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#AEADF0]" />
                      <span className="font-medium text-[#1D1D2B]">{formatDateRange(event, locale as Locale)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#FCD091]" />
                      <span className="font-medium text-[#1D1D2B]">{isThai ? event.operatingHours.th : event.operatingHours.en}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#AEADF0]" />
                      <span>{isThai ? event.locationName.th : event.locationName.en}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1D1D2B]/10 flex justify-end">
                    <Link href={`/events/${event.id}`}>
                      <button className="text-sm font-bold text-[#AEADF0] flex items-center gap-1 hover:text-[#1D1D2B] transition-colors">
                        {t("get_tickets")} <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
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
