import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Star, Clock, Phone, Globe, ChevronLeft, Map, Share2, Heart } from "lucide-react";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return { title: `City Tour & Guide | Place Details ${id}` };
}

// Mock Data Fetcher
function getPlaceDetails(id: string) {
  return {
    id,
    name: "Wat Phra Si Rattana Mahathat",
    category: "Historical Temple",
    rating: 4.9,
    reviews: 1284,
    description: "Also known locally as Wat Yai, this majestic temple is the most important historical site in Phitsanulok. It is famous for housing the Phra Phuttha Chinnarat, widely considered one of the most beautiful Buddha statues in Thailand. The temple's striking golden spires reflect over the Nan River, offering an incredible atmosphere at dawn and dusk.",
    address: "92/3 Phutthabucha Rd, Nai Mueang, Mueang Phitsanulok District",
    hours: "06:00 AM - 18:00 PM (Daily)",
    phone: "+66 55 258 715",
    website: "https://example.com/wat-yai",
    images: [
      "https://images.unsplash.com/photo-1540610996881-1bc54ee5512b?q=80&w=2600",
      "https://images.unsplash.com/photo-1552353617-3bfd679b10b0?q=80&w=2600",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2600"
    ],
    amenities: ["Free Entry", "Parking Available", "Wheelchair Accessible", "Photography Allowed"]
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Navigation");
  
  const place = getPlaceDetails(id);

  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Image Carousel */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-neutral-200 dark:bg-neutral-800">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${place.images[0]})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10"></div>
        
        {/* Top Navbar Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-8 z-20 flex justify-between items-start pt-safe">
          <Link href="/explore">
            <button className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg border border-white/20">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </Link>
          <div className="flex gap-3">
             <button className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg border border-white/20">
               <Share2 className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             <button className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg border border-white/20">
               <Heart className="w-4 h-4 md:w-5 md:h-5" />
             </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 max-w-5xl mx-auto w-full">
           <span className="inline-block bg-primary text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3 shadow-md">{place.category}</span>
           <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 md:mb-4 tracking-tight drop-shadow-lg leading-tight">{place.name}</h1>
           <div className="flex items-center gap-4 text-white/90 text-sm md:text-base font-medium">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                <span className="text-white font-bold">{place.rating}</span>
                <span className="text-white/60 font-normal">({place.reviews} reviews)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span>Phitsanulok</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col lg:flex-row gap-8 md:gap-16">
        
        {/* Left Column (Details) */}
        <div className="lg:w-2/3 flex flex-col gap-10">
           
           <section>
             <h2 className="text-2xl font-bold mb-4">About this place</h2>
             <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                {place.description}
             </p>
           </section>

           <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800"></div>

           <section>
             <h2 className="text-2xl font-bold mb-6">Amenities & Features</h2>
             <div className="grid grid-cols-2 gap-4">
                {place.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                     <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-primary shrink-0">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                     </div>
                     <span className="font-medium">{amenity}</span>
                  </div>
                ))}
             </div>
           </section>
           
           {/* Gallery Grid preview */}
           <section>
             <h2 className="text-2xl font-bold mb-4">Gallery</h2>
             <div className="grid grid-cols-2 gap-4">
                <div className="h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-sm" style={{ backgroundImage: `url(${place.images[1]})` }}></div>
                <div className="h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-sm" style={{ backgroundImage: `url(${place.images[2]})` }}></div>
             </div>
           </section>

        </div>

        {/* Right Column (Sticky Information & Actions) */}
        <div className="lg:w-1/3">
           <div className="sticky top-28 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
              <h3 className="text-xl font-bold">Contact & Location</h3>
              
              <div className="flex flex-col gap-4">
                 <div className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400">
                   <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                   <span className="leading-snug">{place.address}</span>
                 </div>
                 <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                   <Clock className="w-5 h-5 shrink-0 text-primary" />
                   <span>{place.hours}</span>
                 </div>
                 <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                   <Phone className="w-5 h-5 shrink-0 text-primary" />
                   <span>{place.phone}</span>
                 </div>
                 <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                   <Globe className="w-5 h-5 shrink-0 text-primary" />
                   <a href="#" className="hover:underline text-primary">{place.website}</a>
                 </div>
              </div>

              <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800 my-2"></div>

              <button className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary/90 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
                 <Map className="w-5 h-5" /> Get Directions
              </button>
           </div>
        </div>

      </div>
    </main>
  );
}
