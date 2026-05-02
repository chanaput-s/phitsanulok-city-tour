"use client";

import { motion } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRef } from "react";
import { useTranslations } from "next-intl";

const spots = [
  {
    id: 1,
    exploreId: "temple-001",
    title: "Wat Phra Si Rattana Mahathat",
    category: "Temple",
    price: "Free",
    location: "Nai Mueang District",
    image: "https://image-tc.galaxy.tf/wijpeg-3fvrgksxjmddlgex2zime0tve/temple-of-wat-phra-si-rattana-mahathat-hop-inn-hotel_standard.jpg?crop=0%2C0%2C555%2C416",
  },
  {
    id: 2,
    exploreId: "temple-002",
    title: "วัดนางพญา",
    category: "Temple",
    price: "Free",
    location: "xxx, xxx",
    image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFGscDrVIz21hoBsWNi3tjQOHwDmht-g2Ad9UG59jzavArFmNqX1AQexlOWeTlEUveha7Pf_ryyGNFdVgQak_9Qk5O2NsOb0LjmqGPn_cAslVEzHeREo4M4UR7jlGeloSf1Sq-gIUvFK8w=w408-h306-k-no",
  },
  {
    id: 3,
    exploreId: "temple-003",
    title: "วัดจันทร์ตะวันตก",
    category: "Temple",
    price: "Free",
    location: "xxx, xxx",
    image: "https://ik.imagekit.io/tvlk/blog/2024/11/background-religious-attractions-phitsanulok-province-wat-1024x683.jpg?tr=q-70,c-at_max,w-1000,h-600",
  },
  {
    id: 4,
    exploreId: "temple-004",
    title: "วัดจันทร์ตะวันออก",
    category: "Temple",
    price: "Free",
    location: "xxx, xxx",
    image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG1wQzuvEvZX4rcOSr5pjQnsU96u0Pwxu2K_oS24zDhNo8u0wzlFy5AzHPtiK6IssiaUT31FKpw3roeDkRJTmT9oelKs3FhKjlCvEZllSzMtdgXNOA3y_gaGk8BDyrWn_FWFZc62A=w408-h306-k-no",
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
            <Link key={spot.id} href={`/explore?place=${spot.exploreId}`}>
              <motion.div
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

                  {/* Location */}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#AEADF0] shrink-0" />
                    <span className="text-[#F9EFEF]/70 text-xs truncate">{spot.location}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
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
