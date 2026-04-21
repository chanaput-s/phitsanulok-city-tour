import { getTranslations, setRequestLocale } from "next-intl/server";
import { ItinerarySplitView } from "@/components/itinerary/ItinerarySplitView";
import { ITINERARIES } from "@/data/itineraries";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });
  return { title: `City Tour & Guide | Itinerary` };
}

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedTours = ITINERARIES[locale] || ITINERARIES["en"];

  return (
    <main className="h-[100dvh] pt-0 md:pt-24 px-0 md:px-8 pb-0 md:pb-8 flex flex-col overflow-hidden bg-background">
        <div className="hidden md:flex items-center gap-3 mb-4 px-4 md:px-0">
          <h1 className="text-3xl font-extrabold">Itinerary</h1>
          <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">Tour Route Map</span>
        </div>
        
        {/* Wrap split view in flex-grow container so it stretches tightly to bounds */}
        <div className="flex-grow min-h-0 relative rounded-none md:rounded-3xl overflow-hidden border border-transparent md:border-neutral-200 md:dark:border-neutral-800 shadow-none md:shadow-2xl">
           <ItinerarySplitView tour={localizedTours[1]} />
        </div>
    </main>
  );
}
