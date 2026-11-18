import { SITE } from "../lib/seo";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api"] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
