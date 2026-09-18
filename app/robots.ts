import { MetadataRoute } from "next";
import { getAppBaseUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/menu/*", "/login", "/signup"],
        disallow: ["/dashboard/*", "/onboarding", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
