"use client";

import type { ReactNode } from "react";

// next-themes injects an inline <script> tag that React 19 warns about.
// Since the project forces light theme (forcedTheme="light") and has no
// active theme switching, we use a plain wrapper instead. The light class
// is applied statically on <html> in layout.tsx.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
