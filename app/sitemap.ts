import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://dart-travel.vercel.app",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
