import { setRequestLocale } from "next-intl/server";
import { ItinerarySplitView } from "@/components/itinerary/ItinerarySplitView";

export async function generateMetadata() {
  return { title: "City Tour & Guide | Itinerary" };
}

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen pt-16 md:pt-24 px-4 md:px-8 pb-20 md:pb-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mt-2 mb-6 md:mt-0 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Itinerary
          </h1>
        </div>
        <ItinerarySplitView />
      </div>
    </main>
  );
}
