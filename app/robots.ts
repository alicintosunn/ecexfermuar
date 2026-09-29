import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/adminpanel"] }, sitemap: "https://ecex-premium-zippers.alicintosunai.chatgpt.site/sitemap.xml" }; }
