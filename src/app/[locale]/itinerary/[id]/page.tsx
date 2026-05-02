import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Download } from "lucide-react";
import { ACTIVITIES } from "@/data/activities";
import {
  Coffee, Landmark, UtensilsCrossed, TreePine, Wine,
  Hammer, Building2, ShoppingBag,
} from "lucide-react";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: Record<string, { color: string; icon: React.ReactNode }> = {
  Cafe:         { color: "bg-amber-500",  icon: <Coffee size={13} /> },
  Temple:       { color: "bg-yellow-500", icon: <Landmark size={13} /> },
  Restaurant:   { color: "bg-red-500",    icon: <UtensilsCrossed size={13} /> },
  Park:         { color: "bg-green-500",  icon: <TreePine size={13} /> },
  Bar:          { color: "bg-purple-500", icon: <Wine size={13} /> },
  Workshop:     { color: "bg-blue-500",   icon: <Hammer size={13} /> },
  Museum:       { color: "bg-indigo-500", icon: <Building2 size={13} /> },
  "Local shop": { color: "bg-pink-500",   icon: <ShoppingBag size={13} /> },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return ACTIVITIES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = ACTIVITIES.find((a) => a.id === id);
  return { title: activity ? `${activity.name} | CityGuide` : "Activity" };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const activity = ACTIVITIES.find((a) => a.id === id);
  if (!activity) notFound();

  const catCfg = CATEGORIES[activity.category];

  return (
    <main className="min-h-screen bg-background pb-20 md:pb-8">

      {/* ── Hero ── */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${activity.img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6 max-w-3xl mx-auto w-full">
          {/* Category badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-3 ${catCfg?.color ?? "bg-neutral-500"}`}>
            {catCfg?.icon}
            {activity.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-3">
            {activity.name}
          </h1>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2">
            {activity.hashtags.map((tag) => (
              <span key={tag} className="text-white/80 text-xs font-semibold bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8 flex flex-col gap-8">

        {/* About */}
        {activity.about && (
          <section>
            <h2 className="text-xl font-extrabold mb-3 tracking-tight">About this activity</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base">
              {activity.about}
            </p>
          </section>
        )}

        {activity.about && <hr className="border-neutral-200 dark:border-neutral-800" />}

        {/* Itinerary plan image + Download button */}
        {activity.planPng && (
          <section>
            <h2 className="text-xl font-extrabold mb-3 tracking-tight">Itinerary</h2>

            {/* Download Plan button — under heading */}
            <a
              href={`/Plan_png/${activity.planPng}`}
              download={activity.planPng}
              className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-md mb-5"
            >
              <Download className="w-4 h-4" />
              Download Plan
            </a>

            {/* Full plan image */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/Plan_png/${activity.planPng}`}
                alt={`${activity.name} plan`}
                className="w-full h-auto object-contain"
              />
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
