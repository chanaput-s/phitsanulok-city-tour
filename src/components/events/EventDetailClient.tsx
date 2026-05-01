"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft, CalendarDays, MapPin, Clock, Share2,
  Navigation, CalendarPlus, Star, ChevronLeft, ChevronRight
} from "lucide-react";
import { useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type MockEvent = {
  id: string;
  title: string;
  title_th?: string;
  date: number;
  month: number;
  year: number;
  time: string;
  location: string;
  location_th?: string;
  type: string;
  type_th?: string;
  img: string;
  description?: string;
  description_th?: string;
  rating?: string;
  isHighlight?: boolean;
  position?: [number, number];
};

const MONTH_FULL_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_FULL_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getStatusBadge(event: MockEvent) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDate = new Date(event.year, event.month, event.date);
  return eventDate.getTime() === todayStart.getTime() ? "now" : eventDate > todayStart ? "soon" : "past";
}

// ── Share helpers ─────────────────────────────────────────────────────────────

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
}

function shareOnFacebook() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
}

function shareOnLine() {
  window.open(`https://line.me/R/msg/text/?${encodeURIComponent(window.location.href)}`, "_blank");
}

// ── Google Calendar link ──────────────────────────────────────────────────────

function buildGoogleCalendarLink(event: MockEvent) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${event.year}${pad(event.month + 1)}${pad(event.date)}`;
  const title = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.location);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&location=${location}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  event: MockEvent;
  related: MockEvent[];
}

export function EventDetailClient({ event, related }: Props) {
  const locale = useLocale();
  const isThai = locale === "th";
  const scrollRef = useRef<HTMLDivElement>(null);

  const MONTH_FULL = isThai ? MONTH_FULL_TH : MONTH_FULL_EN;

  const title = isThai ? event.title_th || event.title : event.title;
  const location = isThai ? event.location_th || event.location : event.location;
  const typeName = isThai ? event.type_th || event.type : event.type;
  const description = isThai ? event.description_th || event.description : event.description;
  const dateLabel = `${event.date} ${MONTH_FULL[event.month]} ${isThai ? event.year + 543 : event.year}`;

  const status = getStatusBadge(event);

  // Google Maps link using position
  const mapsLink = event.position
    ? `https://www.google.com/maps/search/?api=1&query=${event.position[0]},${event.position[1]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location + " Phitsanulok")}`;

  // Leaflet-style static map URL (using OpenStreetMap tile)
  const mapEmbedUrl = event.position
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${event.position[1] - 0.01},${event.position[0] - 0.01},${event.position[1] + 0.01},${event.position[0] + 0.01}&layer=mapnik&marker=${event.position[0]},${event.position[1]}`
    : null;

  const scrollCarousel = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#F9EFEF] font-sans">

      {/* ── Back breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-4">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-[#1D1D2B]/60 hover:text-[#1D1D2B] text-sm font-bold transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {isThai ? "กลับไปหน้ากิจกรรม" : "Back to Events"}
        </Link>
      </div>

      {/* ── Hero Image ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-0">
        <div className="relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.img})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D2B]/80 via-[#1D1D2B]/20 to-transparent" />

          {/* Floating status badge */}
          <div className="absolute top-6 left-6">
            {status === "now" ? (
              <span className="inline-flex items-center gap-2 bg-[#AEADF0]/20 border border-[#AEADF0]/40 backdrop-blur-md text-[#F9EFEF] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AEADF0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AEADF0]" />
                </span>
                {isThai ? "กำลังเกิดขึ้น" : "Happening Now"}
              </span>
            ) : status === "soon" ? (
              <span className="inline-flex items-center gap-2 bg-[#FCD091]/20 border border-[#FCD091]/40 backdrop-blur-md text-[#FCD091] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <span className="inline-flex rounded-full h-2 w-2 bg-[#FCD091]" />
                {isThai ? "เร็วๆ นี้" : "Coming Soon"}
              </span>
            ) : null}
          </div>

          {/* Bottom title overlay */}
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
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[#1D1D2B] text-sm font-semibold">
            <MapPin className="w-4 h-4 text-[#AEADF0] shrink-0" />
            <span>{location}</span>
          </div>
          {event.rating && (
            <div className="flex items-center gap-1.5 ml-auto text-[#1D1D2B] text-sm font-bold">
              <Star className="w-4 h-4 text-[#FCD091] fill-[#FCD091]" />
              {event.rating}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content: Two Column ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left Column (65%) ── */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8">

            {/* About This Event */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1D1D2B]/5">
              <h2 className="text-xl font-black text-[#1D1D2B] mb-4">
                {isThai ? "เกี่ยวกับกิจกรรมนี้" : "About This Event"}
              </h2>
              <p className="text-[#1D1D2B]/65 leading-relaxed text-base">
                {description || (isThai ? "ไม่มีรายละเอียด" : "No description available.")}
              </p>
            </div>

            {/* Schedule (static template — could be made dynamic with a schedule[] field) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1D1D2B]/5">
              <h2 className="text-xl font-black text-[#1D1D2B] mb-6">
                {isThai ? "ตารางกิจกรรม" : "Schedule"}
              </h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#AEADF0]/30" />
                <div className="flex flex-col gap-6 pl-10">
                  {[
                    { time: event.time, label: isThai ? "เริ่มกิจกรรม" : "Event Starts" },
                    { time: "—", label: isThai ? "กิจกรรมหลัก" : "Main Activities" },
                    { time: "—", label: isThai ? "สิ้นสุดกิจกรรม" : "Event Ends" },
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

          {/* ── Right Column (35%) — Sticky Sidebar ── */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#1D1D2B]/5 flex flex-col gap-5">
              <h3 className="font-black text-[#1D1D2B] text-lg">
                {isThai ? "ข้อมูลการเข้าร่วม" : "Event Info"}
              </h3>

              {/* Primary CTA — Directions */}
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#1D1D2B] text-[#F9EFEF] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-[#AEADF0] hover:text-[#1D1D2B] transition-all">
                <Navigation className="w-4 h-4" />
                {isThai ? "นำทางไปยังสถานที่" : "Get Directions"}
              </a>

              {/* Secondary CTA — Add to Calendar */}
              <a
                href={buildGoogleCalendarLink(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-[#1D1D2B]/20 text-[#1D1D2B] font-bold px-6 py-3.5 rounded-full text-sm hover:border-[#AEADF0] hover:text-[#AEADF0] transition-all"
              >
                <CalendarPlus className="w-4 h-4" />
                {isThai ? "เพิ่มในปฏิทิน" : "Add to Calendar"}
              </a>

              {/* Share Row */}
              <div className="pt-2 border-t border-[#1D1D2B]/8">
                <p className="text-xs font-bold text-[#1D1D2B]/40 uppercase tracking-widest mb-3">
                  {isThai ? "แชร์กิจกรรมนี้" : "Share"}
                </p>
                <div className="flex items-center gap-3">
                  {/* LINE */}
                  <button onClick={shareOnLine} className="w-10 h-10 rounded-full bg-[#AEADF0]/10 text-[#1D1D2B] hover:bg-[#AEADF0] hover:text-[#1D1D2B] flex items-center justify-center transition-all" aria-label="Share on LINE">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.03 2 11c0 4.08 2.72 7.56 6.59 9.16.29.11.49.39.49.7v2.14c0 .44.47.71.85.49l2.46-1.4c.19-.11.42-.13.63-.07.78.22 1.61.33 2.48.33 5.52 0 10-4.03 10-9C22 6.03 17.52 2 12 2z"/></svg>
                  </button>
                  {/* Facebook */}
                  <button onClick={shareOnFacebook} className="w-10 h-10 rounded-full bg-[#AEADF0]/10 text-[#1D1D2B] hover:bg-[#AEADF0] hover:text-[#1D1D2B] flex items-center justify-center transition-all" aria-label="Share on Facebook">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  {/* Copy Link */}
                  <button onClick={copyLink} className="w-10 h-10 rounded-full bg-[#AEADF0]/10 text-[#1D1D2B] hover:bg-[#AEADF0] hover:text-[#1D1D2B] flex items-center justify-center transition-all" aria-label="Copy link">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mini Map */}
              {mapEmbedUrl && (
                <div className="pt-2 border-t border-[#1D1D2B]/8">
                  <p className="text-xs font-bold text-[#1D1D2B]/40 uppercase tracking-widest mb-3">
                    {isThai ? "แผนที่" : "Location"}
                  </p>
                  <div className="rounded-2xl overflow-hidden border border-[#1D1D2B]/10 shadow-sm">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Event location map"
                    />
                  </div>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs font-bold text-[#AEADF0] hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {isThai ? "เปิดใน Google Maps" : "Open in Google Maps"}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── More Events Like This ── */}
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

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {related.map((rel) => {
              const relTitle = isThai ? rel.title_th || rel.title : rel.title;
              const relLocation = isThai ? rel.location_th || rel.location : rel.location;
              return (
                <Link
                  key={rel.id}
                  href={`/events/${rel.id}`}
                  className="flex-shrink-0 w-[260px] rounded-3xl overflow-hidden bg-white border border-[#1D1D2B]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${rel.img})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D2B]/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-wider text-[#F9EFEF] bg-[#AEADF0]/80 px-2 py-0.5 rounded-full">
                      {isThai ? rel.type_th || rel.type : rel.type}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-[#1D1D2B] text-sm leading-tight mb-2 group-hover:text-[#AEADF0] transition-colors line-clamp-2">
                      {relTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[#1D1D2B]/50 text-xs">
                      <CalendarDays className="w-3.5 h-3.5 text-[#FCD091] shrink-0" />
                      <span>{rel.date} {MONTH_SHORT[rel.month]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1D1D2B]/50 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#AEADF0] shrink-0" />
                      <span className="truncate">{relLocation}</span>
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
