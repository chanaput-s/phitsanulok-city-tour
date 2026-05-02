import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExploreSplitView } from "@/components/explore/ExploreSplitView";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });
  return { title: `City Tour & Guide | ${t('explore')}` };
}

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ place?: string }>;
}) {
  const { locale } = await params;
  const { place } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Navigation");

  return (
    <main className="h-[100dvh] pt-16 md:pt-24 px-4 md:px-8 pb-20 md:pb-8 flex flex-col overflow-hidden bg-background">
        <div className="flex items-center mt-2 mb-4 md:mt-0 md:mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">{t("explore")}</h1>
        </div>

        <div className="flex-grow min-h-0 relative rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 md:border-neutral-200 md:dark:border-neutral-800 shadow-md md:shadow-2xl">
           <ExploreSplitView initialPlaceId={place} />
        </div>
    </main>
  );
}