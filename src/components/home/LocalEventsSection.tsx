"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import MOCK_EVENTS from "@/data/mockEvents.json";
import {
  selectFeaturedEvent,
  formatDateRange,
  t as pick,
  type EventV2,
  type Locale,
} from "@/lib/eventUtils";

export function LocalEventsSection() {
  const locale = useLocale() as Locale;
  const isThai = locale === "th";

  const result = useMemo(
    () => selectFeaturedEvent(MOCK_EVENTS as EventV2[]),
    []
  );

  if (!result) return null;

  const { event, status } = result;

  const displayTitle    = pick(event.title,          locale);
  const displayLocation = pick(event.locationName,   locale);
  const displaySubtitle = pick(event.description,    locale);
  const displayHours    = pick(event.operatingHours, locale);
  const dateLabel       = formatDateRange(event, locale);

  const badgeNow  = isThai ? "กำลังเกิดขึ้น" : "Happening Now";
  const badgeSoon = isThai ? "เร็วๆ นี้"     : "Coming Soon";
  const joinBtn   = status === "now"
    ? (isThai ? "เข้าร่วมงาน"   : "Join Event")
    : (isThai ? "ดูรายละเอียด" : "Get Details");
  const allBtn = isThai ? "ดูกิจกรรมทั้งหมด" : "View All Events";

  const isNow = status === "now";

  return (
    <section id="local-events" className="w-full">

      {/* ── Mobile: stacked layout ── */}
      <div className="md:hidden flex flex-col">
        {/* Top: image */}
        <div
          className="w-full h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.img})` }}
        />

        {/* Bottom: solid content block */}
        <div className="bg-[#1D1D2B] px-6 py-10 flex flex-col gap-6">
          {/* Dynamic status badge */}
          {isNow ? (
            <span className="badge active inline-flex items-center gap-2 bg-[#AEADF0]/15 border border-[#AEADF0]/30 text-[#AEADF0] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-max">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AEADF0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AEADF0]" />
              </span>
              {badgeNow}
            </span>
          ) : (
            <span className="badge upcoming inline-flex items-center gap-2 bg-[#FCD091]/15 border border-[#FCD091]/30 text-[#FCD091] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-max">
              <span className="inline-flex rounded-full h-2 w-2 bg-[#FCD091]" />
              {badgeSoon}
            </span>
          )}

          <div>
            <h2 className="text-3xl font-black text-[#F9EFEF] leading-tight mb-3">
              {displayTitle}
            </h2>
            <p className="text-[#F9EFEF]/60 text-base leading-relaxed line-clamp-3">
              {displaySubtitle}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#F9EFEF]/70 text-sm">
              <CalendarDays className="w-4 h-4 text-[#FCD091] shrink-0" />
              <span>{dateLabel} · {displayHours}</span>
            </div>
            <div className="flex items-center gap-2 text-[#F9EFEF]/70 text-sm">
              <MapPin className="w-4 h-4 text-[#AEADF0] shrink-0" />
              <span>{displayLocation}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link href={`/events/${event.id}`} className="w-full">
              <button className="w-full bg-[#FCD091] text-[#1D1D2B] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-[#AEADF0] transition-colors">
                {joinBtn}
              </button>
            </Link>
            <Link href="/events">
              <button className="w-full flex items-center justify-center gap-1 text-[#F9EFEF]/60 hover:text-[#F9EFEF] text-sm font-bold transition-colors">
                {allBtn} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Desktop: full-bleed image with overlay ── */}
      <div className="hidden md:block relative w-full h-[600px] lg:h-[680px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.img})` }}
        />

        {/* Gradient overlay — readable text on any photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1D2B]/95 via-[#1D1D2B]/70 to-[#1D1D2B]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D2B]/60 to-transparent" />

        {/* Content overlay */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-20 max-w-2xl"
        >
          {/* Dynamic status badge */}
          {isNow ? (
            <span className="badge active inline-flex items-center gap-2 bg-[#AEADF0]/15 border border-[#AEADF0]/30 backdrop-blur-sm text-[#AEADF0] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-max mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AEADF0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AEADF0]" />
              </span>
              {badgeNow}
            </span>
          ) : (
            <span className="badge upcoming inline-flex items-center gap-2 bg-[#FCD091]/15 border border-[#FCD091]/30 backdrop-blur-sm text-[#FCD091] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-max mb-6">
              <span className="inline-flex rounded-full h-2 w-2 bg-[#FCD091]" />
              {badgeSoon}
            </span>
          )}

          {/* Title */}
          <h2 className="text-5xl lg:text-6xl font-black text-[#F9EFEF] leading-tight mb-4">
            {displayTitle}
          </h2>

          {/* Subtitle */}
          <p className="text-[#F9EFEF]/65 text-lg leading-relaxed mb-8 max-w-lg line-clamp-3">
            {displaySubtitle}
          </p>

          {/* Metadata */}
          <div className="flex flex-col gap-2.5 mb-10">
            <div className="flex items-center gap-2.5 text-[#F9EFEF]/75 text-sm font-medium">
              <CalendarDays className="w-4 h-4 text-[#FCD091] shrink-0" />
              <span>{dateLabel} · {displayHours}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#F9EFEF]/75 text-sm font-medium">
              <MapPin className="w-4 h-4 text-[#AEADF0] shrink-0" />
              <span>{displayLocation}</span>
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex items-center gap-4">
            <Link href={`/events/${event.id}`}>
              <button className="bg-[#AEADF0] text-[#1D1D2B] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-[#1D1D2B] hover:text-[#F9EFEF] hover:scale-105 active:scale-95 transition-all shadow-xl">
                {joinBtn}
              </button>
            </Link>

            <Link href="/events">
              <button className="flex items-center gap-1.5 border border-[#F9EFEF]/30 hover:border-[#F9EFEF]/70 text-[#F9EFEF]/75 hover:text-[#F9EFEF] font-bold px-8 py-3.5 rounded-full text-sm backdrop-blur-sm transition-all">
                {allBtn} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
