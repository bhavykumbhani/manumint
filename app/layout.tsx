import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MenuStoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MenuMint — Beautiful Digital Menus. One QR.",
  description:
    "Create a beautiful restaurant menu and QR code in minutes. Instant mobile browsing for your customers with zero apps required.",
  keywords: [
    "restaurant menu",
    "QR code menu",
    "digital menu",
    "cafe menu maker",
    "Indian restaurant menu",
    "contactless dining",
  ],
  authors: [{ name: "MenuMint" }],
  openGraph: {
    title: "MenuMint — Beautiful Digital Menus. One QR.",
    description:
      "Create a beautiful restaurant menu and QR code in minutes. Instant mobile browsing with zero apps.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <MenuStoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </MenuStoreProvider>
      </body>
    </html>
  );
}
