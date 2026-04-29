import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { MapPin, Calendar, Navigation, Map } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { DotNavigation } from "@/components/home/DotNavigation";
import { AnimatedSearch } from "@/components/home/AnimatedSearch";
import { EventCarousel } from "@/components/home/EventCarousel";
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

          <AnimatedSearch 
            placeholders={[
              "Search for hidden cafes...",
              "Find historic temples...",
              "Discover local night markets...",
              "Explore top-rated restaurants..."
            ]}
            exploreText={t('explore_btn')}
          />
        </div>
      </section>

      {/* Section 2: City Events */}
      <section id="events" className="min-h-[100dvh] flex flex-col justify-center py-20 bg-neutral-50 dark:bg-neutral-950 snap-start snap-always w-full pt-28 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 mb-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Calendar className="w-6 h-6 md:w-8 md:h-8" />
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-foreground overflow-visible">Upcoming Events</h2>
          </div>
          <p className="text-neutral-500 mt-4 text-lg md:text-xl font-medium max-w-2xl">Don't miss out on what's happening around the city this week.</p>
        </div>
        <EventCarousel />
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
              <a href={`tel:${service.num}`} key={i} className="relative w-[75vw] sm:w-[280px] lg:w-auto flex-shrink-0 snap-center bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl text-card-foreground p-6 md:p-8 rounded-3xl shadow-lg border border-white/20 dark:border-white/10 text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] transition-all duration-300 group block overflow-hidden">
                <div className={`absolute -inset-x-20 top-0 h-32 opacity-20 dark:opacity-10 blur-3xl ${service.color} group-hover:opacity-40 transition-opacity`}></div>
                <div className={`relative z-10 w-16 h-16 md:w-20 md:h-20 mx-auto ${service.color}/15 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                  <span className={`${service.text} text-2xl md:text-3xl font-extrabold tracking-widest drop-shadow-md`}>{service.num}</span>
                </div>
                <h3 className="relative z-10 text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t(service.id as any)}</h3>
                <p className="relative z-10 text-neutral-600 dark:text-neutral-400 text-xs md:text-sm font-medium leading-relaxed">{t(`${service.id}_desc` as any)}</p>
                <div className="relative z-10 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <span className={`${service.text} text-xs font-bold uppercase tracking-wider`}>Tap to Call</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Explore More */}
      <section id="explore" className="relative h-[100dvh] flex flex-col items-center justify-center py-20 px-4 md:px-6 text-center snap-start snap-always w-full pb-28 md:pb-20 overflow-hidden bg-gradient-to-b from-transparent to-primary/5 dark:to-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mb-8 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
            <div className="relative z-10 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary w-full h-full rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.3)]">
              <Map className="w-12 h-12 md:w-14 md:h-14" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 drop-shadow-sm">
            Ready to explore?
          </h2>
          <p className="text-xl md:text-2xl text-neutral-500 mb-10 md:mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover hidden gems, elegant cafes, local favorites, and top-rated attractions across the city.
          </p>
          
          <Link href="/explore">
            <button className="relative group bg-primary text-primary-foreground px-10 md:px-14 py-5 md:py-6 rounded-full font-bold text-xl hover:bg-primary/95 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:shadow-[0_0_50px_rgba(var(--primary),0.7)] flex items-center gap-3 overflow-hidden">
              <span className="relative z-10">Start Exploring Now</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
