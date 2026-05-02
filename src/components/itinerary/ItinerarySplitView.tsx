"use client";

import { useState } from "react";
import {
  Coffee, Landmark, UtensilsCrossed, TreePine, Wine,
  Hammer, Building2, ShoppingBag,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { ACTIVITIES, type Activity } from "@/data/activities";

// ─── Category config (same as Explore) ───────────────────────────────────────

type CategoryConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  bgLight: string;
};

const CATEGORIES: Record<string, CategoryConfig> = {
  Cafe:         { label: "Cafe",        icon: <Coffee size={13} />,          color: "bg-amber-500",   textColor: "text-amber-600",  bgLight: "bg-amber-50 dark:bg-amber-950/30" },
  Temple:       { label: "Temple",      icon: <Landmark size={13} />,        color: "bg-yellow-500",  textColor: "text-yellow-600", bgLight: "bg-yellow-50 dark:bg-yellow-950/30" },
  Restaurant:   { label: "Restaurant",  icon: <UtensilsCrossed size={13} />, color: "bg-red-500",     textColor: "text-red-600",    bgLight: "bg-red-50 dark:bg-red-950/30" },
  Park:         { label: "Park",        icon: <TreePine size={13} />,        color: "bg-green-500",   textColor: "text-green-600",  bgLight: "bg-green-50 dark:bg-green-950/30" },
  Bar:          { label: "Bar",         icon: <Wine size={13} />,            color: "bg-purple-500",  textColor: "text-purple-600", bgLight: "bg-purple-50 dark:bg-purple-950/30" },
  Workshop:     { label: "Workshop",    icon: <Hammer size={13} />,          color: "bg-blue-500",    textColor: "text-blue-600",   bgLight: "bg-blue-50 dark:bg-blue-950/30" },
  Museum:       { label: "Museum",      icon: <Building2 size={13} />,       color: "bg-indigo-500",  textColor: "text-indigo-600", bgLight: "bg-indigo-50 dark:bg-indigo-950/30" },
  "Local shop": { label: "Local shop",  icon: <ShoppingBag size={13} />,     color: "bg-pink-500",    textColor: "text-pink-600",   bgLight: "bg-pink-50 dark:bg-pink-950/30" },
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({ activity }: { activity: Activity }) {
  const cfg = CATEGORIES[activity.category];

  return (
    <Link
      href={`/itinerary/${activity.id}`}
      className="flex gap-4 bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      {/* Image */}
      <div className="w-32 sm:w-40 shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${activity.img})` }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col py-4 pr-4 flex-grow min-w-0">
        {/* Category badge */}
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white w-max mb-2 ${cfg?.color ?? "bg-neutral-500"}`}>
          {cfg?.icon}
          {activity.category}
        </span>

        {/* Name */}
        <h3 className="font-extrabold text-base md:text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {activity.name}
        </h3>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {activity.hashtags.map((tag) => (
            <span
              key={tag}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg?.bgLight ?? "bg-neutral-100 dark:bg-neutral-800"} ${cfg?.textColor ?? "text-neutral-600"}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Explanation */}
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 md:line-clamp-3">
          {activity.explanation}
        </p>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ItinerarySplitView() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_KEYS]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const visibleActivities = ACTIVITIES.filter((a) =>
    selectedCategories.includes(a.category)
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Category filter chips ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* All / None */}
        <button
          onClick={() =>
            selectedCategories.length === 0
              ? setSelectedCategories([...CATEGORY_KEYS])
              : setSelectedCategories([])
          }
          className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm border transition-all active:scale-95 bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 border-transparent"
        >
          {selectedCategories.length === 0 ? "All" : "None"}
        </button>

        {CATEGORY_KEYS.map((cat) => {
          const cfg = CATEGORIES[cat];
          const active = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm border transition-all active:scale-95 ${
                active
                  ? `${cfg.color} text-white border-transparent`
                  : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300"
              }`}
            >
              {cfg.icon}
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* ── Activity cards ── */}
      {visibleActivities.length === 0 ? (
        <div className="text-center text-neutral-400 py-20 text-sm font-medium">
          No activities for the selected categories.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
