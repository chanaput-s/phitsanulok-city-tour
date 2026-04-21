import { EventCalendar } from "@/components/events/EventCalendar";

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto bg-background">
      <div className="flex flex-col mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">City Event Calendar</h1>
        <p className="text-neutral-500 text-lg">Discover local festivals, night markets, and cultural events.</p>
      </div>

      <EventCalendar />
    </main>
  );
}
