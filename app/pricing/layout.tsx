import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans — Transparent & Affordable",
  description:
    "Explore transparent pricing plans for ManuMaker. Free starter tier for single kiosks, Pro plan with unlimited dishes and custom QR standees for busy restaurants.",
  openGraph: {
    title: "ManuMaker Pricing — Free & Pro Plans for Restaurants",
    description:
      "All-in-one digital menu and QR code management. Free forever tier available. Pro tier starting at ₹499/month.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
