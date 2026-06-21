# Claude Code Edit Log — Phitsanulok City Tour

This file is maintained by Claude Code to track every edit session.
Each entry includes: date, branch, files changed, and a summary of changes.

---

## Project Overview (inspected 2026-06-21)

### Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + clsx/tailwind-merge
- **i18n:** next-intl — locales: `en`, `th` (files in `/messages/`)
- **Map:** Leaflet + react-leaflet (dynamic import, SSR disabled)
- **Animation:** framer-motion
- **Font:** IBM Plex Sans Thai (all weights)
- **Deployment:** Cloudflare via OpenNext (`wrangler.toml`, `open-next.config.ts`)

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Dark navy | `#1D1D2B` | BottomNav bg, text |
| Lavender | `#AEADF0` | Navbar bg, accents |
| Cream pink | `#F9EFEF` | Page bg, light text |
| Gold | `#FCD091` | CTA buttons |

### Routes
| Path | Page | Notes |
|------|------|-------|
| `/` | Home | HeroSectionNew → TopSpotsCarousel → LocalEventsSection → ValueProposition |
| `/explore` | Explore | Full-screen Leaflet map + category chips + Place Card slide-up |
| `/events` | Events | EventCalendar + EventCard list |
| `/events/[id]` | Event detail | — |
| `/itinerary` | Itinerary | Activity card list with category filter |
| `/itinerary/[id]` | Activity detail | Hero + about + amenities + gallery + contact |
| `/place/[id]` | Place detail | — |

### Key Data Files
- `src/data/activities.ts` — 8 activities (Cafe, Temple, Restaurant, Park, Bar, Workshop, Museum, Local shop)
- `src/data/mockEvents.json` — mock event data
- `src/components/explore/ExploreSplitView.tsx` — PLACES array (11 places) inline

### Public Assets
- `/public/Plan_png/` — activity plan PNGs (named `{id}.png`); `Cafe_Plan_1.png`, `History_Plan_1.png`, `History_Plan_2.png` exist
- `/public/images/events/` — SVG event images per category

### Edit Log Convention
Every time Claude Code makes edits, a new section is appended below with:
- Date + session number and branch
- Files changed (with brief description)
- Summary of what was done and why

---

## 2026-05-01 (session 1) — Branch: `P_branch1_Map`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Full rewrite
- `src/components/explore/MapView.tsx` — Updated props and map bounds

### Summary
**Explore Page Redesign** — per user design reference (Navios-style map app)

**ExploreSplitView.tsx:**
- Replaced old single-select category filter with multi-select category chips
- New categories: Cafe, Temple, Restaurant, Park, Bar, Workshop, Museum, Local shop
- Each category has a unique color and lucide-react icon
- Added "Near Me" checkbox — uses browser Geolocation API, filters places within 3 km (Haversine formula)
- Removed left-panel list; map is now full-screen on both mobile and desktop
- Category chips overlaid on top of map
- Clicking a map pin shows a bottom slide-up Place Card
- Place Card shows: photo, category badge, name, hashtags, phone number, close button
- Mock data: 1 place per category with hashtags and phone numbers
- Responsive: chips scroll horizontally on mobile, wrap on desktop

**MapView.tsx:**
- Added `maxBounds` to restrict map to Phitsanulok city area ([16.78, 100.20] → [16.87, 100.33])
- Added `onSelectId` callback prop — fires when a marker is clicked, returns place id
- Markers now fire `onSelectId` on click instead of opening a Leaflet Popup
- Zoom controls hidden on mobile (unchanged)

---

## 2026-05-01 (session 2) — Branch: `P_branch1_Map`

### Files Changed
- `src/app/[locale]/explore/page.tsx` — Header + layout fix

### Summary
**Explore Page Header & Scroll Lock**

**explore/page.tsx:**
- Added `pt-16` on mobile so map container starts below the fixed Navbar
- Removed `hidden md:flex` from title — "Explore" heading now shows on all screen sizes
- Title style changed to `text-4xl md:text-5xl font-extrabold text-foreground tracking-tight` — matches "City Event Calendar" on Events page
- Removed the "Interactive Map" badge next to the title
- Page scroll locked by `h-[100dvh] overflow-hidden` on `<main>`

---

## 2026-05-01 (session 3) — Branch: `P_branch1_Map`

### Files Changed
- `src/app/[locale]/explore/page.tsx` — Mobile spacing fix
- `src/components/explore/ExploreSplitView.tsx` — Restored + Place Card offset fix

### Summary
**Mobile padding + file restore**

**explore/page.tsx:**
- `px-0 pb-0` → `px-3 pb-3` on mobile — adds side and bottom padding around the map
- Map container: `rounded-none` → `rounded-2xl` on mobile
- Border now visible on mobile too

**ExploreSplitView.tsx:**
- File was accidentally overwritten with Discord chat content — restored to correct code
- Place Card bottom offset: `bottom-20` → `bottom-4` on mobile (card is inside padded map container)

---

## 2026-05-02 (session 1) — Branch: `P_branch1_Map`

### Files Changed
- `src/app/[locale]/itinerary/page.tsx` — Full rewrite (scrollable layout)
- `src/components/itinerary/ItinerarySplitView.tsx` — Full rewrite (card list)
- `src/data/activities.ts` — New file: activity data
- `public/Plan_png/.gitkeep` — New folder for activity plan PNGs

### Summary
**Itinerary Page Redesign** — removed map, replaced with activity card list

**itinerary/page.tsx:**
- Changed from `h-[100dvh] overflow-hidden` (fixed) to `min-h-screen` (scrollable)
- Layout now matches Events page style: `pt-16 md:pt-24 px-4 md:px-8 pb-20 md:pb-8`
- Title uses same font as Events and Explore pages
- Content constrained to `max-w-3xl mx-auto` for readability

**ItinerarySplitView.tsx:**
- Removed map and timeline layout entirely
- New: category filter chips (All/None + same categories as Explore page)
- New: scrollable list of ActivityCard components
- ActivityCard: horizontal layout — image left, content right (category badge, name, hashtags, explanation)
- Clicking a card opens `/Plan_png/{activity.id}.png` in a new browser tab

**activities.ts:**
- New data file with 8 mock activities (1 per category)
- Each activity: id, name, category, hashtags[], explanation, img

**public/Plan_png/:**
- Folder created for plan PNG files
- User will add PNG files named `{activity.id}.png` manually

---

## 2026-05-02 (session 2) — Branch: `P_branch1_Map`

### Files Changed
- `src/data/activities.ts` — Added detail fields to Activity type
- `src/app/[locale]/itinerary/[id]/page.tsx` — New detail page
- `src/components/itinerary/ItinerarySplitView.tsx` — Card click → Link navigation

### Summary
**Itinerary Activity Detail Page**

**activities.ts:**
- Added fields: `address`, `hours`, `phone`, `website`, `about`, `amenities[]`, `gallery[]`
- Populated full mock data for "Cafe trip on Holiday" (all fields)
- Other activities have basic fields only

**itinerary/[id]/page.tsx (new):**
- Hero section: full-width image + dark overlay, category badge, title, hashtags
- Two-column layout (desktop): left = content, right = info card
- Left: About, Amenities & Features (grid with checkmarks), Gallery (2-col grid)
- Right: Contact card (address, hours, phone, website), Get Directions button (Google Maps link)
- Download Plan button: `<a download>` pointing to `/Plan_png/{planPng}`
- Uses `generateStaticParams` for static generation

**ItinerarySplitView.tsx:**
- Replaced `window.open` + `onClick` with `<Link href="/itinerary/{id}">` — navigates in same tab

---

## 2026-04-29 (session 3) — Branch: `P_branch1_Map`

### Files Changed
- `src/components/home/TopSpotsCarousel.tsx` — Card redesign + Explore page linking
- `src/app/[locale]/explore/page.tsx` — Added `searchParams` for `?place=` param
- `src/components/explore/ExploreSplitView.tsx` — Added `initialPlaceId` prop + auto-open logic

### Summary
**Home → Explore deep-link: Trending Local Spots cards now navigate to specific map pins**

**TopSpotsCarousel.tsx:**
- Replaced 5-card mock data with 4 real cards mapped to temple-001–004 (Explore PLACES IDs)
- Card 1: Wat Phra Si Rattana Mahathat → temple-001 (uses real Explore place image)
- Cards 2–4: วัดนางพญา, วัดจันทร์ตะวันตก, วัดจันทร์ตะวันออก → temple-002/003/004 (location: "xxx, xxx")
- Removed star rating and review count from all cards
- Removed 5th card (Phitsanulok Craft Workshop)
- Each card wrapped in `<Link href="/explore?place={exploreId}">` for same-tab navigation

**explore/page.tsx:**
- Added `searchParams: Promise<{ place?: string }>` to page props
- Reads `place` value and passes it as `initialPlaceId` to `<ExploreSplitView>`

**ExploreSplitView.tsx:**
- Added `initialPlaceId?: string` prop
- `useEffect` on mount: if `initialPlaceId` is set, finds the matching place and calls `setSelectedPlace` to auto-open its Place Card
- `visiblePlaces` override: when `initialPlaceId` is provided, shows only that single place on the map (ignores category filter and Near Me)

---

## 2026-06-21 (session 1) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Added new temple place (วัดอรัญญิก)

### Summary
**Added วัดอรัญญิก (Wat Aranyik) to the Explore map**

**ExploreSplitView.tsx:**
- Appended new `temple-005` entry to the `PLACES` array
- Source: Google Maps share link `https://maps.app.goo.gl/kjxhC9VNEuqLfwjU7`
- Coordinates set to exact Google Maps position: `[16.8262453, 100.277955]`
- Category: `Temple` (matches existing category)
- Hashtags: `#วัดพิษณุโลก`, `#unseen`, `#วัดเก่าแก่`
- Coordinates fall within map `maxBounds` ([16.78, 100.20] → [16.87, 100.33]) — pin visible on map

---

## 2026-06-21 (session 2) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Real image for วัดอรัญญิก

### Summary
**Added real photo to วัดอรัญญิก Place Card**

**ExploreSplitView.tsx:**
- Replaced placeholder image URL on `temple-005` with a real photo from Wikimedia Commons (March 2022, 800px width)
- Image rendered via inline `background-image` on Place Card — no `next.config` image domain whitelist needed

---

## 2026-06-22 (session 1) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Fixed broken image URL for วัดอรัญญิก

### Summary
**Image URL fix — `temple-005` photo was returning HTTP 400**

**ExploreSplitView.tsx:**
- The previous Wikimedia `thumb/.../800px-` URL returned HTTP 400 (the source file is smaller than 800px so that variant doesn't exist)
- Replaced with the direct full-resolution Commons URL (`commons/3/35/...`) which returns HTTP 200
- Verified via `curl` before committing

---

## 2026-06-22 (session 2) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Added 4 museum places

### Summary
**Added 4 museums to Explore map (category: Museum)**

**ExploreSplitView.tsx:** appended 4 new entries to `PLACES`:
- `museum-002` ศูนย์ประวัติศาสตร์พระราชวังจันทน์ — `[16.828452, 100.2617166]`
- `museum-003` พิพิธภัณฑ์ทหารกลางแจ้ง กองทัพภาคที่ 3 — `[16.8369684, 100.2616398]`
- `museum-004` พิพิธภัณฑ์เมืองพิษณุโลก — `[16.8185755, 100.257165]`
- `museum-005` พิพิธภัณฑ์ทหาร กองทัพภาคที่ 3 — `[16.8355592, 100.2625132]`

All coordinates extracted from user-provided Google Maps share URLs (`!3d{lat}!4d{lng}` segment) and fall within map `maxBounds`. Images use a generic museum Unsplash placeholder — replace with real photos when available.

---

## 2026-06-22 (session 3) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Real photos for 4 museum places

### Summary
**Replaced Unsplash placeholders with real Wikimedia Commons photos**

Searched Wikimedia Commons via MediaWiki API (with proper User-Agent header to avoid 403). All 3 image URLs verified HTTP 200 via curl.

- `museum-002` ศูนย์ประวัติศาสตร์พระราชวังจันทน์ → `Chan_Royal_Palace_Historical_Center_(March_2022).jpg` (exact match)
- `museum-003` พิพิธภัณฑ์ทหารกลางแจ้ง กองทัพภาคที่ 3 → `King_Naresuan_Maharat_Camp,_Phitsanulok.jpg` (same army camp where the outdoor museum is located)
- `museum-004` พิพิธภัณฑ์เมืองพิษณุโลก → `ศาลสมเด็จพระนเรศวรที่วังจันทร์ - panoramio.jpg` (closest Phitsanulok heritage shot available; no exact Wikimedia match found for the city museum)
- `museum-005` พิพิธภัณฑ์ทหาร กองทัพภาคที่ 3 → same `King_Naresuan_Maharat_Camp` photo (located inside this camp)

---

## 2026-06-22 (session 4) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Fixed 3 broken/missing images

### Summary
**Replaced broken Google Maps user-photo URLs and stale placeholder with real Wikimedia photos**

The original `lh3.googleusercontent.com/gps-cs-s/...` URLs for `temple-002` and `temple-004` were Google Maps user-contributed photo references that had expired/changed and stopped returning images. `museum-001` was still using the Unsplash generic museum placeholder.

- `temple-002` วัดนางพญา → `Wat_Nang_Phaya,_Phitsanulok_(March_2022)_-_img_04.jpg`
- `temple-004` วัดจันทร์ตะวันออก → `Wat_Chan_Tawan-ok_-_img_01.jpg`
- `museum-001` พิพิธภัณฑ์พื้นบ้านจ่าทวี → `Sgt._Maj._Thawee_Folk_Museum,_Phitsanulok,_Sukhothai,_Thailand.JPG`

All 3 URLs verified HTTP 200 via curl.

---

## 2026-06-22 (session 5) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Added 5 cafe places

### Summary
**Added 5 cafes to Explore map (category: Cafe)**

Coordinates extracted from user-provided Google Maps share URLs.

- `cafe-002` Churn Cafe Phitsanulok (เชิญคาเฟ่) — `[16.8279362, 100.2654858]`
- `cafe-003` หลง คาเฟ่ — `[16.8265984, 100.2635209]`
- `cafe-004` Finally Coffee Co. — `[16.8120838, 100.2595145]`
- `cafe-005` Jipiti (Coffee and friends) — `[16.8177603, 100.2630715]`
- `cafe-006` Ruma Cafe & Co-Working Space — `[16.8096919, 100.2568048]`

Images are diverse Unsplash cafe photos (no Wikimedia matches for individual cafes). Replace with real photos when available.

---

## 2026-06-22 (session 6) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Added 3 more cafe places

### Summary
**Added 3 cafes to Explore map (category: Cafe)**

Coordinates extracted from user-provided Google Maps share URLs.

- `cafe-007` The Key Café & Roaster — `[16.8287381, 100.2514281]`
- `cafe-008` Hashtag coffee & cafe — `[16.8221945, 100.253567]`
- `cafe-009` Carb and Cof. — `[16.8203643, 100.2550174]`

Images are Unsplash cafe placeholders.

---

## 2026-06-22 (session 7) — Branch: `P_Fix21-06-2026`

### Files Changed
- `src/components/explore/ExploreSplitView.tsx` — Added 5 park places

### Summary
**Added 5 public parks to Explore map (category: Park)**

Coordinates extracted from user-provided Google Maps share URLs.

- `park-002` สวนชมน่านเฉลิมพระเกียรติ หน้าวัดราชบูรณะ — `[16.8220341, 100.2600966]`
- `park-003` สวนชมน่าน (วังจันทน์) — `[16.8194115, 100.257869]`
- `park-004` สวนสาธารณะเทศบาลพิษณุโลก — `[16.8181684, 100.2594343]`
- `park-005` สวนสาธารณะริมน้ำน่าน — `[16.8157262, 100.2611198]`
- `park-006` ลานคนเมือง — `[16.8155243, 100.2627074]`

Images are diverse Unsplash park photos (no Wikimedia matches for these specific parks).

---

## 2026-06-22 (session 8) — Branch: `P_Fix21-06-2026`

### Summary
**Replaced Unsplash placeholders on 5 parks with real Wikimedia photos of the actual area**

Searched Wikimedia Commons with multiple Thai/English queries. No photos exist for the specific park names, but several authentic photos of the Nan River and surrounding landmarks (where these parks are located) were found.

- `park-002` หน้าวัดราชบูรณะ → `Wat_Ratchaburana,_Phitsanulok.jpg` (park is in front of this temple — exact location match)
- `park-003` สวนชมน่าน วังจันทน์ → `Nan_River_in_Phitsanulok_2.jpg` (riverside)
- `park-004` สวนสาธารณะเทศบาล → `Nan_River_in_Phitsanulok_3.jpg`
- `park-005` สวนสาธารณะริมน้ำน่าน → `Nan_River_in_Phitsanulok_5.jpg` (literal riverside)
- `park-006` ลานคนเมือง → `Phitsanulok_skyline.JPG` (downtown plaza)

All URLs verified HTTP 200. Photos are area-accurate even when not name-specific.
