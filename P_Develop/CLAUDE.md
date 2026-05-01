# Claude Code Edit Log — Phitsanulok City Tour

This file is maintained by Claude Code to track every edit session.
Each entry includes: date, branch, files changed, and a summary of changes.

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
