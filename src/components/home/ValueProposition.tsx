"use client";

import { motion } from "framer-motion";
import { MapPin, UtensilsCrossed, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

const socialLinks = [
  {
    label: "LINE",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2C6.48 2 2 6.03 2 11c0 4.08 2.72 7.56 6.59 9.16.29.11.49.39.49.7v2.14c0 .44.47.71.85.49l2.46-1.4c.19-.11.42-.13.63-.07.78.22 1.61.33 2.48.33 5.52 0 10-4.03 10-9C22 6.03 17.52 2 12 2zm-4 12H7v-5h1v5zm3 0h-1v-3.5l-1.5 2h-.5l-1.5-2V14H7v-5h1l1.5 2.5L11 9h1v5zm4 0h-3V9h1v4h2v1zm3 0h-1v-2h-1v-1h1v-1h-1V9h1v1h1v1h-1v1h1v2z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export function ValueProposition() {
  const t = useTranslations("Home");

  const stats = [
    { value: "50+", label: t("stat_spots") },
    { value: "20+", label: t("stat_itineraries") },
    { value: "24/7", label: t("stat_insights") },
  ];

  const features = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: t("feat_expertise_title"),
      desc: t("feat_expertise_desc"),
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: t("feat_food_title"),
      desc: t("feat_food_desc"),
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      title: t("feat_events_title"),
      desc: t("feat_events_desc"),
    },
  ];

  return (
    <section id="why" className="py-24 md:py-32 px-6 bg-[#F9EFEF]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left column ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Eyebrow */}
            <span className="inline-block text-[#1D1D2B] font-bold uppercase tracking-widest text-xs mb-4">
              {t("why_eyebrow")}
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-black text-[#AEADF0] leading-tight mb-6">
              {t("why_title")}
            </h2>

            {/* Body */}
            <p className="text-[#1D1D2B]/60 text-lg leading-relaxed mb-10 max-w-lg">
              {t("why_body")}
            </p>

            {/* Social icons */}
            {/* <div className="flex items-center gap-3 mb-12">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-[#1D1D2B] text-[#F9EFEF] flex items-center justify-center hover:bg-[#AEADF0] hover:text-[#1D1D2B] transition-colors"
                >
                  {s.svg}
                </a>
              ))}
            </div> */}

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl font-black text-[#AEADF0]">{s.value}</span>
                  <span className="text-sm font-semibold text-[#1D1D2B]/50 leading-tight mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column: feature cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white/60 backdrop-blur-md border border-[#1D1D2B]/8 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-[#AEADF0]/20 text-[#AEADF0] flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D2B] mb-1 text-lg">{f.title}</h3>
                  <p className="text-[#1D1D2B]/55 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
