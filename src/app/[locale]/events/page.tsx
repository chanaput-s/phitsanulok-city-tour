import { EventCalendar } from "@/components/events/EventCalendar";
import { EventHero } from "@/components/events/EventHero";
import { UpcomingCarousel } from "@/components/events/UpcomingCarousel";
import MOCK_EVENTS from "@/data/mockEvents.json";

export default function EventsPage() {
  // Get upcoming events (all events that are not highlighted)
  const upcomingEvents = MOCK_EVENTS.filter(e => !e.isHighlight);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto bg-slate-50 font-sans overflow-x-hidden">
      <EventHero />
      
      {/* Upcoming Events Carousel Section */}
      <section className="mb-10 w-full relative">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-2xl font-extrabold text-neutral-900">Upcoming Events</h2>
          <span className="text-sm font-bold text-teal-600 cursor-pointer hover:underline">See all</span>
        </div>
        <UpcomingCarousel events={upcomingEvents} />
      </section>

      <EventCalendar />
    </main>
  );
}
