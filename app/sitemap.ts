import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ecex-premium-zippers.alicintosunai.chatgpt.site";
  const pairs = [["", "tr"], ["about", "tr/hakkimizda"], ["about/history", "tr/hakkimizda/tarihce"], ["about/vision", "tr/hakkimizda/vizyon"], ["about/mission", "tr/hakkimizda/misyon"], ["about/data-protection", "tr/hakkimizda/kvkk"], ["about/reference-brands", "tr/hakkimizda/referans-markalarimiz"], ["products", "tr/urunler"], ["products/metal-zippers", "tr/urunler/metal-fermuarlar"], ["products/nylon-zippers", "tr/urunler/naylon-fermuarlar"], ["products/molded-plastic-zippers", "tr/urunler/kemik-fermuarlar"], ["kalite", "tr/kalite"], ["quality/policy", "tr/kalite/politikasi"], ["quality/certificates", "tr/kalite/belgeleri"], ["quality/test-methods-and-measurement-standards", "tr/kalite/test-yontemleri-ve-olcme-standartlari"], ["blog", "tr/blog"], ["contact", "tr/iletisim"]];
  return pairs.flatMap(([en, tr]) => [
    { url: `${base}/${en}`, alternates: { languages: { en: `${base}/${en}`, tr: `${base}/${tr}`, "x-default": `${base}/${en}` } } },
    { url: `${base}/${tr}`, alternates: { languages: { en: `${base}/${en}`, tr: `${base}/${tr}`, "x-default": `${base}/${en}` } } },
  ]);
}
