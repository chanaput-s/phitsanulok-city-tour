import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSectionNew } from "@/components/home/HeroSectionNew";
import { ValueProposition } from "@/components/home/ValueProposition";
import { TopSpotsCarousel } from "@/components/home/TopSpotsCarousel";
import { LocalEventsSection } from "@/components/home/LocalEventsSection";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Index" });
  return { title: `City Tour & Guide | ${t("title")}` };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative bg-[#F9EFEF] overflow-x-hidden">
      {/* Section 1: Hero */}
      <HeroSectionNew />

      {/* Section 2: Top Spots Carousel */}
      <TopSpotsCarousel />

      {/* Section 3: Local Events */}
      <LocalEventsSection />

      {/* Section 4: Value Proposition */}
      <ValueProposition />
    </main>
  );
}
