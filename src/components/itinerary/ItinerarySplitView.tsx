"use client";

import { useState } from "react";
import {
  Coffee, Landmark, UtensilsCrossed, TreePine, Wine,
  Hammer, Building2, ShoppingBag,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ACTIVITIES, type Activity } from "@/data/activities";

// ─── Category config ──────────────────────────────────────────────────────────

type CategoryConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  bgLight: string;
};

const CATEGORIES: Record<string, CategoryConfig> = {
  Cafe:         { label: "Cafe",        icon: <Coffee size={13} />,          color: "bg-[#884529]",   textColor: "text-[#884529]",  bgLight: "bg-[#f5ede8]" },
  Temple:       { label: "Temple",      icon: <Landmark size={13} />,        color: "bg-[#E68A58]",   textColor: "text-[#c4623a]",  bgLight: "bg-[#fdf0e8]" },
  Restaurant:   { label: "Restaurant",  icon: <UtensilsCrossed size={13} />, color: "bg-[#c4697a]",   textColor: "text-[#c4697a]",  bgLight: "bg-[#fef2f4]" },
  Park:         { label: "Park",        icon: <TreePine size={13} />,        color: "bg-[#818546]",   textColor: "text-[#818546]",  bgLight: "bg-[#f0f1e4]" },
  Bar:          { label: "Bar",         icon: <Wine size={13} />,            color: "bg-[#C3A05B]",   textColor: "text-[#9a7a38]",  bgLight: "bg-[#f9f4e6]" },
  Workshop:     { label: "Workshop",    icon: <Hammer size={13} />,          color: "bg-[#4482A3]",   textColor: "text-[#4482A3]",  bgLight: "bg-[#e8f2f7]" },
  Museum:       { label: "Museum",      icon: <Building2 size={13} />,       color: "bg-[#6096a8]",   textColor: "text-[#6096a8]",  bgLight: "bg-[#eef5f8]" },
  "Local shop": { label: "Local shop",  icon: <ShoppingBag size={13} />,     color: "bg-[#6e9e8a]",   textColor: "text-[#6e9e8a]",  bgLight: "bg-[#eef4f1]" },
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

// Map category name → i18n key
const CAT_I18N_KEY: Record<string, string> = {
  Cafe: "cafe", Temple: "temple", Restaurant: "restaurant",
  Park: "park", Bar: "bar", Workshop: "workshop",
  Museum: "museum", "Local shop": "localshop",
};

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({
  activity,
  t,
}: {
  activity: Activity;
  t: ReturnType<typeof useTranslations<"Itinerary">>;
}) {
  const cfg = CATEGORIES[activity.category];

  const name        = t.has(`activities.${activity.id}.name`)        ? t(`activities.${activity.id}.name`)        : activity.name;
  const explanation = t.has(`activities.${activity.id}.explanation`) ? t(`activities.${activity.id}.explanation`) : activity.explanation;
  const catI18nKey  = CAT_I18N_KEY[activity.category];
  const catLabel    = catI18nKey && t.has(`categories.${catI18nKey}`) ? t(`categories.${catI18nKey}`) : activity.category;

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
          {catLabel}
        </span>

        {/* Name */}
        <h3 className="font-extrabold text-base md:text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Hashtags (untranslated — contextual tags) */}
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
          {explanation}
        </p>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ItinerarySplitView() {
  const t = useTranslations("Itinerary");
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
          className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm border transition-all active:scale-95 bg-[#FFE4D2] text-[#884529] border-[#884529]/30"
        >
          {selectedCategories.length === 0 ? t("filter_all") : t("filter_none")}
        </button>

        {CATEGORY_KEYS.map((cat) => {
          const cfg = CATEGORIES[cat];
          const active = selectedCategories.includes(cat);
          const catI18nKey = CAT_I18N_KEY[cat];
          const label = catI18nKey && t.has(`categories.${catI18nKey}`) ? t(`categories.${catI18nKey}`) : cfg.label;
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
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Activity cards ── */}
      {visibleActivities.length === 0 ? (
        <div className="text-center text-neutral-400 py-20 text-sm font-medium">
          {t("no_activities")}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
