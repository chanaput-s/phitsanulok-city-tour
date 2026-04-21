import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { MapPin, Calendar, Navigation, Map } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { DotNavigation } from "@/components/home/DotNavigation";
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
  const t = await getTranslations("Index");

  return (
    <main className="relative bg-background transition-colors duration-500 overflow-hidden">
      <DotNavigation />

      {/* Section 1: Hero */}
      <section id="hero" className="relative h-[100dvh] flex flex-col items-center justify-center snap-start snap-always w-full">
        <HeroSection />
        <div className="relative z-10 flex flex-col items-center px-4 md:px-6 w-full max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white drop-shadow-xl mb-4 md:mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow-md mb-8 md:mb-12 max-w-2xl font-medium">
            {t('description')}
          </p>

          <div className="w-full relative max-w-2xl group mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
              <MapPin className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search places..."
              className="w-full py-4 md:py-5 pl-12 md:pl-14 pr-24 md:pr-36 text-base md:text-lg rounded-full border-2 border-transparent bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-2xl outline-none focus:border-primary transition-all text-foreground placeholder:text-neutral-500"
            />
            <Link href="/explore">
              <button className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-primary text-primary-foreground px-4 md:px-8 rounded-full font-semibold shadow-md text-sm md:text-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                <span className="hidden sm:inline">{t('explore_btn')}</span>
                <span className="sm:hidden">Go</span>
              </button>
            </Link>
          </div>
        </div>
      </section>



      {/* Section 3: Local Services */}
      <section id="services" className="min-h-[100dvh] flex flex-col justify-center py-20 px-4 md:px-6 bg-neutral-100 dark:bg-neutral-900/30 snap-start snap-always w-full pt-28 md:pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <Navigation className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">{t('local_services')}</h2>
          </div>
          
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {[
              { id: 'tourist_police', num: '1155', color: 'bg-blue-500', text: 'text-blue-500' },
              { id: 'medical_emergency', num: '1669', color: 'bg-red-500', text: 'text-red-500' },
              { id: 'local_police', num: '191', color: 'bg-amber-500', text: 'text-amber-500' },
              { id: 'fire_rescue', num: '199', color: 'bg-orange-500', text: 'text-orange-500' }
            ].map((service, i) => (
              <a href={`tel:${service.num}`} key={i} className="w-[75vw] sm:w-[280px] lg:w-auto flex-shrink-0 snap-center bg-card text-card-foreground p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200/50 dark:border-neutral-800/50 text-center md:hover:-translate-y-2 group block">
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto ${service.color}/10 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                  <span className={`${service.text} text-2xl md:text-3xl font-extrabold tracking-widest`}>{service.num}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t(service.id as any)}</h3>
                <p className="text-neutral-500 text-xs md:text-sm font-medium leading-relaxed">{t(`${service.id}_desc` as any)}</p>
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <span className={`${service.text} text-xs font-bold uppercase tracking-wider`}>Tap to Call</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Explore More */}
      <section id="explore" className="h-[100dvh] flex flex-col items-center justify-center py-20 px-4 md:px-6 max-w-4xl mx-auto text-center snap-start snap-always w-full pb-28 md:pb-20">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 md:mb-8 mx-auto">
          <Map className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 md:mb-8 tracking-tight">Ready to explore?</h2>
        <p className="text-lg md:text-xl text-neutral-500 mb-8 md:mb-12 max-w-2xl mx-auto font-medium">
          Discover hidden gems, elegant cafes, local favorites, and top-rated attractions across the city.
        </p>
        <Link href="/explore">
          <button className="bg-primary text-primary-foreground px-8 md:px-12 py-4 md:py-5 rounded-full font-bold shadow-xl text-lg md:text-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
            Start Exploring Now
          </button>
        </Link>
      </section>
    </main>
  );
}
