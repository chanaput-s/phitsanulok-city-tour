import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  subsets: ["latin", "thai"],
});

export const metadata: Metadata = {
  title: "City Tour & Guide",
  description: "Explore your city with our modern guide platform",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${ibmPlexSansThai.variable} antialiased min-h-screen bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <BottomNav />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
