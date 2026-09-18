import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MenuStoreProvider } from "@/lib/store";
import { PosProvider } from "@/lib/pos/pos-context";
import { ToastProvider } from "@/components/ui/toast";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { OrganizationSchema } from "@/components/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "ManuMaker — Beautiful Digital Menus. One QR.",
    template: "%s | ManuMaker",
  },
  description:
    "Create a modern, digital QR restaurant menu in under 2 minutes. Instant mobile browsing with Indian Rupee (₹) pricing, FSSAI food indicators, 4 designer themes, and zero apps required.",
  keywords: [
    "ManuMaker",
    "Manu Maker",
    "digital menu maker",
    "QR code restaurant menu",
    "restaurant QR menu India",
    "contactless dining menu",
    "online restaurant menu creator",
    "FSSAI food menu",
    "cafe digital menu",
    "cloud kitchen QR menu",
    "table QR standee generator",
  ],
  authors: [{ name: "ManuMaker Team" }],
  creator: "ManuMaker",
  publisher: "ManuMaker",
  applicationName: "ManuMaker",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "ManuMaker — Beautiful Digital Menus. One QR.",
    description:
      "Create a modern, digital QR restaurant menu in under 2 minutes. Instant mobile browsing with zero apps required.",
    url: "/",
    siteName: "ManuMaker",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManuMaker — Beautiful Digital Menus. One QR.",
    description:
      "Create a modern, digital QR restaurant menu in under 2 minutes. Instant mobile browsing with zero apps required.",
  },
  verification: {
    other: {
      "facebook-domain-verification": [
        process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || "",
      ],
    },
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
        <OrganizationSchema />
        <MetaPixel />
        <MenuStoreProvider>
          <PosProvider>
            <ToastProvider>{children}</ToastProvider>
          </PosProvider>
        </MenuStoreProvider>
      </body>
    </html>
  );
}
