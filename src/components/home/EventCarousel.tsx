"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const events = [
  {
    id: 1,
    title: "Lantern Festival 2026",
    date: "Nov 15 - Nov 17",
    location: "Riverside Park",
    image: "https://images.unsplash.com/photo-1541746927958-9630c79ca9fc?q=80&w=1200&auto=format&fit=crop",
    category: "Culture"
  },
  {
    id: 2,
    title: "Night Market Grand Opening",
    date: "Every Weekend",
    location: "Old Town District",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop",
    category: "Food"
  },
  {
    id: 3,
    title: "Jazz in the City",
    date: "Dec 5, 2026",
    location: "Central Square",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
    category: "Music"
  },
  {
    id: 4,
    title: "Historical Walking Tour",
    date: "Daily at 10:00 AM",
    location: "City Gates",
    image: "https://images.unsplash.com/photo-1563124840-7ab718edecaa?q=80&w=1200&auto=format&fit=crop",
    category: "Tour"
  }
];

export function EventCarousel() {
  return (
    <div className="w-full relative mt-12 py-10">
      <div className="flex gap-6 md:gap-8 px-4 md:px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mb-8">
        {events.map((event, i) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative w-[85vw] sm:w-[400px] aspect-square rounded-3xl overflow-hidden shrink-0 snap-center group shadow-2xl"
          >
            {/* Background Image */}
            <motion.div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Category Badge */}
            <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-white font-medium text-sm tracking-wide">
              {event.category}
            </div>

            {/* Content box */}
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{event.title}</h3>
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center text-white/80 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
              </div>
              
              <button className="flex items-center text-primary font-semibold text-sm group/btn hover:text-white transition-colors">
                View Details 
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
