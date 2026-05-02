// ─────────────────────────────────────────────────────────────────────────────
// eventUtils.ts
// Normalizes BOTH the old flat schema and the new nested i18n schema
// into a single `NormalizedEvent` type consumed by all components.
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = "en" | "th";

// ── New v2 schema (nested i18n objects + ISO dates) ──────────────────────────
export type EventV2 = {
  id: string;
  status?: "active" | "cancelled" | "postponed";
  isHighlight?: boolean;
  startDate: string;           // ISO: "2026-11-15"
  endDate: string;             // ISO: "2026-11-17"
  operatingHours?: { en: string; th: string };
  title: { en: string; th: string } | string;
  type: { en: string; th: string } | string;
  description?: { en: string; th: string } | string;
  isFree?: boolean;
  priceDetail?: { en: string; th: string };
  tags?: string[];
  locationName?: { en: string; th: string } | string;
  locationCoordinates?: { lat: number; lng: number };
  img?: string;
  rating?: string;
  contactFacebook?: string;
  contactPhone?: string;
  color?: string;
  // Old-compat fields (may still exist)
  date?: number;
  month?: number;
  year?: number;
  time?: string;
  location?: string;
  location_th?: string;
  title_th?: string;
  type_th?: string;
  description_th?: string;
  position?: [number, number];
};

// ── Normalised shape all components use ──────────────────────────────────────
export type NormalizedEvent = {
  id: string;
  status: "active" | "cancelled" | "postponed";
  isHighlight: boolean;
  /** ISO "YYYY-MM-DD" */
  startDate: string;
  /** ISO "YYYY-MM-DD" */
  endDate: string;
  title: { en: string; th: string };
  type: { en: string; th: string };
  description: { en: string; th: string };
  operatingHours: { en: string; th: string };
  isFree: boolean;
  priceDetail: { en: string; th: string };
  tags: string[];
  locationName: { en: string; th: string };
  locationCoordinates: { lat: number; lng: number } | null;
  img: string;
  rating: string;
  contactFacebook: string;
  contactPhone: string;
  color: string;
};

// ── ISO date helpers ──────────────────────────────────────────────────────────

/** Build ISO date string from old {date, month (0-indexed), year} */
function toISO(date: number, month: number, year: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(date)}`;
}

// ── Main adapter ──────────────────────────────────────────────────────────────

export function normalizeEvent(raw: EventV2): NormalizedEvent {
  // Determine whether title is new nested or old flat string
  const isNestedTitle = typeof raw.title === "object" && raw.title !== null && "en" in raw.title;
  const isNestedType  = typeof raw.type  === "object" && raw.type  !== null && "en" in raw.type;
  const isNestedDesc  = typeof raw.description === "object" && raw.description !== null && "en" in (raw.description as any);
  const isNestedLoc   = typeof raw.locationName === "object" && raw.locationName !== null && "en" in (raw.locationName as any);

  // Dates — prefer new ISO fields, fall back to old numeric fields
  const startDate =
    raw.startDate ??
    (raw.date !== undefined && raw.month !== undefined && raw.year !== undefined
      ? toISO(raw.date, raw.month, raw.year)
      : "2026-01-01");
  
  let endDate = raw.endDate ?? startDate;
  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    console.warn(`Event ${raw.id} has endDate before startDate. Falling back to startDate only.`);
    endDate = startDate;
  }

  // Location coordinates — prefer new, fall back to position array
  let coords: { lat: number; lng: number } | null = null;
  if (raw.locationCoordinates) {
    coords = raw.locationCoordinates;
  } else if (raw.position && raw.position.length === 2) {
    coords = { lat: raw.position[0], lng: raw.position[1] };
  }

  // Operating hours — prefer new, fall back to old time string
  const opHours = raw.operatingHours ?? {
    en: raw.time ?? "",
    th: raw.time ?? "",
  };

  return {
    id: String(raw.id),
    status: raw.status ?? "active",
    isHighlight: raw.isHighlight ?? false,
    startDate,
    endDate,
    title: isNestedTitle
      ? (raw.title as { en: string; th: string })
      : { en: raw.title as string, th: (raw as any).title_th ?? raw.title as string },
    type: isNestedType
      ? (raw.type as { en: string; th: string })
      : { en: raw.type as string, th: (raw as any).type_th ?? raw.type as string },
    description: isNestedDesc
      ? (raw.description as { en: string; th: string })
      : {
          en: raw.description as string ?? "",
          th: (raw as any).description_th ?? raw.description as string ?? "",
        },
    operatingHours: opHours,
    isFree: raw.isFree ?? false,
    priceDetail: raw.priceDetail ?? { en: "", th: "" },
    tags: raw.tags ?? [],
    locationName: isNestedLoc
      ? (raw.locationName as { en: string; th: string })
      : {
          en: (raw.location ?? "") as string,
          th: ((raw as any).location_th ?? raw.location ?? "") as string,
        },
    locationCoordinates: coords,
    img: raw.img ?? "",
    rating: raw.rating ?? "",
    contactFacebook: raw.contactFacebook ?? "",
    contactPhone: raw.contactPhone ?? "",
    color: raw.color ?? "",
  };
}

// ── Locale accessor ───────────────────────────────────────────────────────────

export function t(field: { en: string; th: string }, locale: Locale): string {
  return field[locale] ?? field.en ?? "";
}

// ── Status badge logic ────────────────────────────────────────────────────────

export type EventStatus = "now" | "soon" | "past";

export function getEventStatus(event: NormalizedEvent): EventStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(event.startDate);
  const end   = new Date(event.endDate);
  if (today >= start && today <= end) return "now";
  if (today < start) return "soon";
  return "past";
}

// ── Date display helper ───────────────────────────────────────────────────────

const MONTH_SHORT_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL_EN  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_FULL_TH  = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

export function formatDateRange(event: NormalizedEvent, locale: Locale): string {
  const s = new Date(event.startDate);
  const e = new Date(event.endDate);
  const MONTH = locale === "th" ? MONTH_FULL_TH : MONTH_FULL_EN;
  const displayYear = locale === "th" ? s.getFullYear() + 543 : s.getFullYear();

  if (event.startDate === event.endDate) {
    return `${s.getDate()} ${MONTH[s.getMonth()]} ${displayYear}`;
  }
  // Range
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${e.getDate()} ${MONTH[s.getMonth()]} ${displayYear}`;
  }
  return `${s.getDate()} ${MONTH_SHORT_EN[s.getMonth()]} – ${e.getDate()} ${MONTH_SHORT_EN[e.getMonth()]} ${displayYear}`;
}

// ── Featured event selector (for home page) ───────────────────────────────────

export function selectFeaturedEvent(
  events: EventV2[]
): { event: NormalizedEvent; status: EventStatus } | null {
  const normalized = events
    .map(normalizeEvent)
    .filter((e) => e.isHighlight && e.status === "active");

  if (normalized.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Priority 1: currently happening (today within startDate – endDate)
  const happening = normalized.filter((e) => getEventStatus(e) === "now");
  if (happening.length > 0) {
    const picked = happening[Math.floor(Math.random() * happening.length)];
    return { event: picked, status: "now" };
  }

  // Priority 2: nearest upcoming
  const upcoming = normalized
    .filter((e) => getEventStatus(e) === "soon")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  if (upcoming.length > 0) return { event: upcoming[0], status: "soon" };

  // Priority 3: most recent past
  const past = normalized
    .filter((e) => getEventStatus(e) === "past")
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
  if (past.length > 0) return { event: past[0], status: "past" };

  return null;
}
