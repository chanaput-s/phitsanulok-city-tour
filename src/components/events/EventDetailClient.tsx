"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft, CalendarDays, MapPin, Clock, Share2,
  Navigation, CalendarPlus, Star, ChevronLeft, ChevronRight,
  Facebook, AlertTriangle, Tag
} from "lucide-react";
import { useRef } from "react";
import {
  normalizeEvent,
  formatDateRange,
  getEventStatus,
  t as pick,
  type EventV2,
  type Locale,
} from "@/lib/eventUtils";

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildGoogleCalendarLink(startDate: string, endDate: string, title: string, location: string) {
  const fmt = (d: string) => d.replace(/-/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(startDate)}/${fmt(endDate)}&location=${encodeURIComponent(location)}`;
}

const TAG_LABELS: Record<string, { en: string; th: string }> = {
  "family-friendly":   { en: "Family Friendly", th: "เหมาะสำหรับครอบครัว" },
  "outdoor":           { en: "Outdoor",          th: "กลางแจ้ง" },
  "cultural":          { en: "Cultural",         th: "วัฒนธรรม" },
  "parking-limited":   { en: "Limited Parking",  th: "ที่จอดรถจำกัด" },
  "romantic":          { en: "Romantic",         th: "โรแมนติก" },
  "night-event":       { en: "Night Event",      th: "งานกลางคืน" },
  "photography":       { en: "Photography",      th: "ถ่ายภาพ" },
  "food":              { en: "Food",             th: "อาหาร" },
  "local":             { en: "Local",            th: "ท้องถิ่น" },
  "pet-friendly":      { en: "Pet Friendly",     th: "รับสัตว์เลี้ยง" },
  "live-music":        { en: "Live Music",       th: "ดนตรีสด" },
  "wellness":          { en: "Wellness",         th: "สุขภาพ" },
  "beginner-friendly": { en: "Beginner OK",      th: "เหมาะมือใหม่" },
  "free":              { en: "Free",             th: "ฟรี" },
  "morning":           { en: "Morning",          th: "ช่วงเช้า" },
};

interface Props {
  event: EventV2;
  related: EventV2[];
}

export function EventDetailClient({ event: rawEvent, related: rawRelated }: Props) {
  const locale = useLocale() as Locale;
  const isThai = locale === "th";
  const scrollRef = useRef<HTMLDivElement>(null);

  const event   = normalizeEvent(rawEvent);
  const related = rawRelated.map(normalizeEvent);

  const status = getEventStatus(event);

  const title       = pick(event.title,          locale);
  const typeName    = pick(event.type,           locale);
  const description = pick(event.description,    locale);
  const locationStr = pick(event.locationName,   locale);
  const hours       = pick(event.operatingHours, locale);
  const priceStr    = pick(event.priceDetail,    locale);
  const dateLabel   = formatDateRange(event, locale);

  const coords = event.locationCoordinates;
  const mapsLink = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr + " Phitsanulok")}`;

  const mapEmbedUrl = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01},${coords.lat - 0.01},${coords.lng + 0.01},${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : null;

  const calLink = buildGoogleCalendarLink(event.startDate, event.endDate, title, locationStr);

  const scrollCarousel = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  const copyLink = () => navigator.clipboard.writeText(window.location.href);
  const shareFB  = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  const shareLine= () => window.open(`https://line.me/R/msg/text/?${encodeURIComponent(window.location.href)}`, "_blank");

  return (
    <main className="min-h-screen bg-[#F9EFEF]">

      {/* ── Status alert banner (cancelled / postponed) ── */}
      {(event.status === "cancelled" || event.status === "postponed") && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white text-center py-3 px-6 flex items-center justify-center gap-2 text-sm font-bold shadow-lg">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {event.status === "cancelled"
            ? (isThai ? "กิจกรรมนี้ถูกยกเลิกแล้ว" : "This event has been cancelled.")
            : (isThai ? "กิจกรรมนี้ถูกเลื่อนออกไป — โปรดติดตามข้อมูลล่าสุด" : "This event has been postponed — please check for updates.")}
        </div>
      )}

      {/* ── Back breadcrumb ── */}
      <div className={`max-w-7xl mx-auto px-4 md:px-8 pb-4 ${event.status !== "active" ? "pt-32" : "pt-24"}`}>
        <Link href="/events" className="inline-flex items-center gap-1.5 text-[#1D1D2B]/60 hover:text-[#1D1D2B] text-sm font-bold transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {isThai ? "กลับไปหน้ากิจกรรม" : "Back to Events"}
        </Link>
      </div>

      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-0">
        <div className="relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.img})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D2B]/85 via-[#1D1D2B]/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            {status === "now" ? (
              <span className="inline-flex items-center gap-2 bg-[#AEADF0]/20 border border-[#AEADF0]/50 backdrop-blur-md text-[#F9EFEF] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AEADF0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AEADF0]" />
                </span>
                {isThai ? "กำลังเกิดขึ้น" : "Happening Now"}
              </span>
            ) : status === "soon" ? (
              <span className="inline-flex items-center gap-2 bg-[#FCD091]/20 border border-[#FCD091]/50 backdrop-blur-md text-[#FCD091] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <span className="inline-flex rounded-full h-2 w-2 bg-[#FCD091]" />
                {isThai ? "เร็วๆ นี้" : "Coming Soon"}
              </span>
            ) : null}

            {/* Price badge */}
            {priceStr && (
              <span className="inline-flex items-center gap-1 bg-white/20 border border-white/30 backdrop-blur-md text-[#F9EFEF] text-xs font-bold px-3 py-2 rounded-full">
                {event.isFree ? "🎟️ " : "💰 "}{priceStr}
              </span>
            )}
          </div>

          {/* Bottom title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block bg-white/20 border border-white/30 backdrop-blur-sm text-[#F9EFEF] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {typeName}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#F9EFEF] leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Strip ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-md -mt-4 relative z-10 px-6 py-4 flex flex-wrap gap-6 items-center border border-[#1D1D2B]/5">
          <div className="flex items-center gap-2 text-[#1D1D2B] text-sm font-semibold">
            <CalendarDays className="w-4 h-4 text-[#AEADF0] shrink-0" />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-[#1D1D2B] text-sm font-semibold">
            <Clock className="w-4 h-4 text-[#FCD091] shrink-0" />
            <span>{hours}</span>
          </div>
          <div className="flex items-center gap-2 text-[#1D1D2B] text-sm font-semibold">
            <MapPin className="w-4 h-4 text-[#AEADF0] shrink-0" />
            <span>{locationStr}</span>
          </div>
          {event.rating && (
            <div className="flex items-center gap-1.5 ml-auto text-[#1D1D2B] text-sm font-bold">
              <Star className="w-4 h-4 text-[#FCD091] fill-[#FCD091]" />
              {event.rating}
            </div>
          )}
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left (65%) ── */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8">

            {/* About */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1D1D2B]/5">
              <h2 className="text-xl font-black text-[#1D1D2B] mb-4">
                {isThai ? "เกี่ยวกับกิจกรรมนี้" : "About This Event"}
              </h2>
              <p className="text-[#1D1D2B]/65 leading-relaxed text-base">
                {description || (isThai ? "ไม่มีรายละเอียด" : "No description available.")}
              </p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1D1D2B]/5">
              <h2 className="text-xl font-black text-[#1D1D2B] mb-6">
                {isThai ? "ตารางกิจกรรม" : "Schedule"}
              </h2>
              <div className="relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#AEADF0]/30" />
                <div className="flex flex-col gap-6 pl-10">
                  {[
                    { time: hours.split("–")[0]?.trim() ?? hours, label: isThai ? "เริ่มกิจกรรม" : "Event Starts" },
                    { time: "—", label: isThai ? "กิจกรรมหลัก" : "Main Activities" },
                    { time: hours.split("–")[1]?.trim() ?? "—", label: isThai ? "สิ้นสุดกิจกรรม" : "Event Ends" },
                  ].map((item, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      <div className="absolute -left-10 w-7 h-7 rounded-full bg-[#AEADF0]/20 border-2 border-[#AEADF0] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#AEADF0]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#AEADF0] uppercase tracking-wider">{item.time}</span>
                        <p className="text-[#1D1D2B] font-semibold text-sm mt-0.5">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Sticky Sidebar (35%) ── */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#1D1D2B]/5 flex flex-col gap-5">
              <h3 className="font-black text-[#1D1D2B] text-lg">
                {isThai ? "ข้อมูลการเข้าร่วม" : "Event Info"}
              </h3>

              {/* Directions */}
              <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1D1D2B] text-[#F9EFEF] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-[#AEADF0] hover:text-[#1D1D2B] transition-all">
                <Navigation className="w-4 h-4" />
                {isThai ? "นำทางไปยังสถานที่" : "Get Directions"}
              </a>

              {/* Add to Calendar */}
              <a href={calLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-[#1D1D2B]/20 text-[#1D1D2B] font-bold px-6 py-3.5 rounded-full text-sm hover:border-[#AEADF0] hover:text-[#AEADF0] transition-all">
                <CalendarPlus className="w-4 h-4" />
                {isThai ? "เพิ่มในปฏิทิน" : "Add to Calendar"}
              </a>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="pt-2 border-t border-[#1D1D2B]/8">
                  <p className="text-xs font-bold text-[#1D1D2B]/40 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Tag className="w-3 h-3" />{isThai ? "แท็ก" : "Tags"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => {
                      const label = TAG_LABELS[tag]?.[locale] ?? tag;
                      return (
                        <span key={tag} className="text-xs font-semibold bg-[#AEADF0]/15 text-[#1D1D2B] border border-[#AEADF0]/30 px-3 py-1 rounded-full">
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Share Row */}
              <div className="pt-2 border-t border-[#1D1D2B]/8">
                <p className="text-xs font-bold text-[#1D1D2B]/40 uppercase tracking-widest mb-3">
                  {isThai ? "แชร์กิจกรรมนี้" : "Share"}
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={shareLine} aria-label="Share on LINE"
                    className="w-10 h-10 rounded-full bg-[#AEADF0]/10 text-[#1D1D2B] hover:bg-[#AEADF0] flex items-center justify-center transition-all">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.03 2 11c0 4.08 2.72 7.56 6.59 9.16.29.11.49.39.49.7v2.14c0 .44.47.71.85.49l2.46-1.4c.19-.11.42-.13.63-.07.78.22 1.61.33 2.48.33 5.52 0 10-4.03 10-9C22 6.03 17.52 2 12 2z"/></svg>
                  </button>
                  <button onClick={shareFB} aria-label="Share on Facebook"
                    className="w-10 h-10 rounded-full bg-[#AEADF0]/10 text-[#1D1D2B] hover:bg-[#AEADF0] flex items-center justify-center transition-all">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button onClick={copyLink} aria-label="Copy link"
                    className="w-10 h-10 rounded-full bg-[#AEADF0]/10 text-[#1D1D2B] hover:bg-[#AEADF0] flex items-center justify-center transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Organizer / Facebook */}
              {event.contactFacebook && (
                <div className="pt-2 border-t border-[#1D1D2B]/8">
                  <p className="text-xs font-bold text-[#1D1D2B]/40 uppercase tracking-widest mb-2">
                    {isThai ? "ผู้จัดงาน" : "Organizer"}
                  </p>
                  <a href={event.contactFacebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-[#AEADF0] hover:underline">
                    <Facebook className="w-4 h-4" />
                    {isThai ? "ติดตามบน Facebook" : "Follow on Facebook"}
                  </a>
                </div>
              )}

              {/* Mini Map */}
              {mapEmbedUrl && (
                <div className="pt-2 border-t border-[#1D1D2B]/8">
                  <p className="text-xs font-bold text-[#1D1D2B]/40 uppercase tracking-widest mb-3">
                    {isThai ? "แผนที่" : "Location"}
                  </p>
                  <div className="rounded-2xl overflow-hidden border border-[#1D1D2B]/10 shadow-sm">
                    <iframe src={mapEmbedUrl} width="100%" height="200"
                      style={{ border: 0 }} loading="lazy" title="Event location map" />
                  </div>
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                    className="mt-2 text-xs font-bold text-[#AEADF0] hover:underline flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {isThai ? "เปิดใน Google Maps" : "Open in Google Maps"}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Related Events ── */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[#AEADF0] font-bold uppercase tracking-widest text-xs">
                {isThai ? "คุณอาจสนใจ" : "You May Also Like"}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#1D1D2B] mt-1">
                {isThai ? "กิจกรรมที่คล้ายกัน" : "More Events Like This"}
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel("left")} className="w-10 h-10 rounded-full border-2 border-[#1D1D2B]/20 flex items-center justify-center text-[#1D1D2B] hover:bg-[#1D1D2B] hover:text-[#F9EFEF] transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollCarousel("right")} className="w-10 h-10 rounded-full bg-[#1D1D2B] flex items-center justify-center text-[#F9EFEF] hover:bg-[#AEADF0] hover:text-[#1D1D2B] transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {related.map((rel) => {
              const relTitle = pick(rel.title, locale);
              const relLoc   = pick(rel.locationName, locale);
              const relType  = pick(rel.type, locale);
              const relDate  = formatDateRange(rel, locale);
              return (
                <Link key={rel.id} href={`/events/${rel.id}`}
                  className="flex-shrink-0 w-[260px] rounded-3xl overflow-hidden bg-white border border-[#1D1D2B]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-44 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${rel.img})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D2B]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-wider text-[#F9EFEF] bg-[#AEADF0]/80 px-2 py-0.5 rounded-full">
                      {relType}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1D1D2B] text-sm leading-tight mb-2 group-hover:text-[#AEADF0] transition-colors line-clamp-2">{relTitle}</h3>
                    <div className="flex items-center gap-1.5 text-[#1D1D2B]/50 text-xs">
                      <CalendarDays className="w-3.5 h-3.5 text-[#FCD091] shrink-0" />
                      <span>{relDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1D1D2B]/50 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#AEADF0] shrink-0" />
                      <span className="truncate">{relLoc}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </main>
  );
}
