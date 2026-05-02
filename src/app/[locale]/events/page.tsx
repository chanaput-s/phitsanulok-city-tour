import { EventCalendar } from "@/components/events/EventCalendar";
import { EventHero } from "@/components/events/EventHero";
import { UpcomingCarousel } from "@/components/events/UpcomingCarousel";
import MOCK_EVENTS from "@/data/mockEvents.json";
import { useTranslations } from "next-intl";
import { normalizeEvent } from "@/lib/eventUtils";

export default function EventsPage() {
  const t = useTranslations("Events");
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const twoWeeksFromNow = new Date(todayDateOnly);
  twoWeeksFromNow.setDate(todayDateOnly.getDate() + 14);

  // Get upcoming events: not highlighted, and within the next 2 weeks
  const upcomingEvents = MOCK_EVENTS.filter(e => {
    if (e.isHighlight) return false;
    const normEvent = normalizeEvent(e as any);
    const eventDate = new Date(normEvent.startDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= todayDateOnly && eventDate <= twoWeeksFromNow;
  }).sort((a, b) => {
    const normA = normalizeEvent(a as any);
    const normB = normalizeEvent(b as any);
    return new Date(normA.startDate).getTime() - new Date(normB.startDate).getTime();
  });

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto bg-white dark:bg-neutral-950 font-sans overflow-x-hidden">
      <EventHero />

      {/* Upcoming Events Carousel Section */}
      <section className="mb-10 w-full relative">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{t("upcoming_events")}</h2>
          <span className="text-sm font-bold text-teal-600 dark:text-teal-400 cursor-pointer hover:underline">{t("see_all")}</span>
        </div>
        <UpcomingCarousel events={upcomingEvents} />
      </section>

      <EventCalendar />
    </main>
  );
}
