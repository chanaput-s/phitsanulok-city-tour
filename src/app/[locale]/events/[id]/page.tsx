import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import MOCK_EVENTS from "@/data/mockEvents.json";
import { EventDetailClient } from "@/components/events/EventDetailClient";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  return (MOCK_EVENTS as any[]).map((e) => ({ id: String(e.id) }));
}

export default async function EventDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const event = (MOCK_EVENTS as any[]).find((e) => String(e.id) === id);
  if (!event) notFound();

  // Related events: same type, exclude current
  const related = (MOCK_EVENTS as any[])
    .filter((e) => e.type === event.type && String(e.id) !== id)
    .slice(0, 4);

  return <EventDetailClient event={event} related={related} />;
}
