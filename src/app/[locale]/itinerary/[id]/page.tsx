import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ACTIVITIES } from "@/data/activities";
import { DownloadPlanButton } from "@/components/itinerary/DownloadPlanButton";
import {
  Coffee, Landmark, UtensilsCrossed, TreePine, Wine,
  Hammer, Building2, ShoppingBag,
} from "lucide-react";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: Record<string, { color: string; icon: React.ReactNode }> = {
  Cafe:         { color: "bg-[#884529]",  icon: <Coffee size={13} /> },
  Temple:       { color: "bg-[#E68A58]",  icon: <Landmark size={13} /> },
  Restaurant:   { color: "bg-[#c4697a]",  icon: <UtensilsCrossed size={13} /> },
  Park:         { color: "bg-[#818546]",  icon: <TreePine size={13} /> },
  Bar:          { color: "bg-[#C3A05B]",  icon: <Wine size={13} /> },
  Workshop:     { color: "bg-[#4482A3]",  icon: <Hammer size={13} /> },
  Museum:       { color: "bg-[#6096a8]",  icon: <Building2 size={13} /> },
  "Local shop": { color: "bg-[#6e9e8a]",  icon: <ShoppingBag size={13} /> },
};

const CAT_I18N_KEY: Record<string, string> = {
  Cafe: "cafe", Temple: "temple", Restaurant: "restaurant",
  Park: "park", Bar: "bar", Workshop: "workshop",
  Museum: "museum", "Local shop": "localshop",
};

// ─── Page ─────────────────────────────────────────────────────────────────────


export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "Itinerary" });
  const activity = ACTIVITIES.find((a) => a.id === id);
  const name = activity
    ? (t.has(`activities.${id}.name`) ? t(`activities.${id}.name`) : activity.name)
    : "Activity";
  return { title: `${name} | CityGuide` };
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

  const t = await getTranslations("Itinerary");

  const displayName     = t.has(`activities.${id}.name`)  ? t(`activities.${id}.name`)  : activity.name;
  const displayAbout    = t.has(`activities.${id}.about`) ? t(`activities.${id}.about`) : (activity.about ?? "");
  const catI18nKey      = CAT_I18N_KEY[activity.category];
  const displayCategory = catI18nKey && t.has(`categories.${catI18nKey}`)
    ? t(`categories.${catI18nKey}`)
    : activity.category;

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
            {displayCategory}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-3">
            {displayName}
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
        {displayAbout && (
          <section>
            <h2 className="text-xl font-extrabold mb-3 tracking-tight">{t("about_heading")}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base">
              {displayAbout}
            </p>
          </section>
        )}

        {displayAbout && <hr className="border-neutral-200 dark:border-neutral-800" />}

        {/* Itinerary plan images + Download button */}
        {activity.planPngs && activity.planPngs.length > 0 && (
          <section>
            <h2 className="text-xl font-extrabold mb-3 tracking-tight">{t("plan_heading")}</h2>

            <DownloadPlanButton planPngs={activity.planPngs} label={t("download_plan")} />

            {/* Plan images stacked */}
            <div className="flex flex-col gap-4">
              {activity.planPngs.map((file) => (
                <div key={file} className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/Plan_png/${file}`}
                    alt={`${displayName} plan`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
