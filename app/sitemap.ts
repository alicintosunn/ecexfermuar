import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ecex-premium-zippers.alicintosunai.chatgpt.site";
  const pairs = [["", "tr"], ["about", "tr/hakkimizda"], ["products", "tr/urunler"], ["industries", "tr/sektorler"], ["innovation", "tr/inovasyon"], ["sustainability", "tr/surdurulebilirlik"], ["contact", "tr/iletisim"], ["products/metal-zippers", "tr/urunler/metal-fermuarlar"]];
  return pairs.flatMap(([en, tr]) => [
    { url: `${base}/${en}`, alternates: { languages: { en: `${base}/${en}`, tr: `${base}/${tr}`, "x-default": `${base}/${en}` } } },
    { url: `${base}/${tr}`, alternates: { languages: { en: `${base}/${en}`, tr: `${base}/${tr}`, "x-default": `${base}/${en}` } } },
  ]);
}
