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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Navigation");

  return (
    <main className="h-[100dvh] pt-16 md:pt-24 px-0 md:px-8 pb-0 md:pb-8 flex flex-col overflow-hidden bg-background">
        <div className="flex items-center mb-3 md:mb-4 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">{t("explore")}</h1>
        </div>

        <div className="flex-grow min-h-0 relative rounded-none md:rounded-3xl overflow-hidden border border-transparent md:border-neutral-200 md:dark:border-neutral-800 shadow-none md:shadow-2xl">
           <ExploreSplitView />
        </div>
    </main>
  );
}