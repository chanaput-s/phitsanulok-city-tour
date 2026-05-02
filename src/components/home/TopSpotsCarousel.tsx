"use client";

import { motion } from "framer-motion";
import { Star, MapPin, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRef } from "react";
import { useTranslations } from "next-intl";

const spots = [
  {
    id: 1,
    title: "Wat Phra Si Rattana Mahathat",
    category: "Temple",
    price: "Free",
    rating: 4.9,
    reviews: 2841,
    location: "Nai Mueang District",
    image: "https://images.unsplash.com/photo-1540610996881-1bc54ee5512b?q=80&w=800",
  },
  {
    id: 2,
    title: "Nan River Night Market",
    category: "Street Food",
    price: "starts at ฿50",
    rating: 4.7,
    reviews: 1203,
    location: "Riverside, Mueang",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
  },
  {
    id: 3,
    title: "Made for Mouth Cafe",
    category: "Cafe",
    price: "starts at ฿120",
    rating: 4.8,
    reviews: 892,
    location: "Aranyik Sub-district",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
  },
  {
    id: 4,
    title: "สวนสมเด็จพระนเรศวร",
    category: "Park",
    price: "Free",
    rating: 4.5,
    reviews: 560,
    location: "Mueang District",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800",
  },
  {
    id: 5,
    title: "Phitsanulok Craft Workshop",
    category: "Workshop",
    price: "starts at ฿300",
    rating: 4.6,
    reviews: 318,
    location: "Aranyik Sub-district",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800",
  },
];

const categoryColors: Record<string, string> = {
  Temple: "bg-[#AEADF0] text-[#1D1D2B]",
  "Street Food": "bg-[#FCD091] text-[#1D1D2B]",
  Cafe: "bg-[#FCD091] text-[#1D1D2B]",
  Park: "bg-[#AEADF0] text-[#1D1D2B]",
  Workshop: "bg-[#1D1D2B] text-[#F9EFEF]",
};

export function TopSpotsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Home");

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  return (
    <section id="spots" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#AEADF0] font-bold uppercase tracking-widest text-xs">{t("spots_eyebrow")}</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1D1D2B] mt-2 leading-tight">
              {t("spots_title")}
            </h2>
          </div>
          <p className="text-[#1D1D2B]/55 text-base md:text-lg max-w-sm leading-relaxed md:text-right">
            {t("spots_desc")}
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6"
        >
          {spots.map((spot, i) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative w-[260px] md:w-[290px] h-[380px] rounded-3xl overflow-hidden shrink-0 group shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${spot.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D2B]/90 via-[#1D1D2B]/30 to-transparent" />

              {/* Price badge */}
              <div className="absolute top-4 right-4 bg-[#FCD091] text-[#1D1D2B] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                {spot.price}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {/* Category tag */}
                <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 ${categoryColors[spot.category] ?? "bg-[#AEADF0] text-[#1D1D2B]"}`}>
                  {spot.category}
                </span>

                {/* Title */}
                <h3 className="font-bold text-[#F9EFEF] text-base leading-tight mb-2">
                  {spot.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="w-3.5 h-3.5 text-[#FCD091] fill-[#FCD091]" />
                  <span className="text-[#F9EFEF] text-xs font-bold">{spot.rating}</span>
                  <span className="text-[#F9EFEF]/50 text-xs">({spot.reviews.toLocaleString()})</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#AEADF0] shrink-0" />
                  <span className="text-[#F9EFEF]/70 text-xs truncate">{spot.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          <Link href="/explore">
            <button className="flex items-center gap-2 bg-[#1D1D2B] text-[#F9EFEF] font-bold px-6 py-3 rounded-full text-sm hover:bg-[#AEADF0] hover:text-[#1D1D2B] transition-colors">
              {t("spots_view_all")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border-2 border-[#1D1D2B]/20 flex items-center justify-center text-[#1D1D2B] hover:bg-[#1D1D2B] hover:text-[#F9EFEF] hover:border-[#1D1D2B] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-[#1D1D2B] flex items-center justify-center text-[#F9EFEF] hover:bg-[#AEADF0] hover:text-[#1D1D2B] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
