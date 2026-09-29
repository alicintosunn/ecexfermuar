import type { Metadata } from "next";
import { EcexSite } from "./site";

const base = "https://ecex-premium-zippers.alicintosunai.chatgpt.site";
const routePairs: Record<string, string> = { "": "tr", about: "tr/hakkimizda", products: "tr/urunler", industries: "tr/sektorler", innovation: "tr/inovasyon", sustainability: "tr/surdurulebilirlik", contact: "tr/iletisim", "about/history": "tr/hakkimizda/tarihce", "about/vision": "tr/hakkimizda/vizyon", "about/mission": "tr/hakkimizda/misyon", "about/data-protection": "tr/hakkimizda/kvkk", "about/reference-brands": "tr/hakkimizda/referans-markalarimiz", "products/metal-zippers": "tr/urunler/metal-fermuarlar", "products/nylon-zippers": "tr/urunler/naylon-fermuarlar", "products/molded-plastic-zippers": "tr/urunler/kemik-fermuarlar" };

const pageTitles: Record<string, string> = { "about/history": "Our History", "about/vision": "Vision", "about/mission": "Mission", "about/data-protection": "Personal Data Protection", "about/reference-brands": "Our Reference Brands", "products/metal-zippers": "Metal Zippers", "products/nylon-zippers": "Nylon Zippers", "products/molded-plastic-zippers": "Molded Plastic Zippers", "tr/hakkimizda/tarihce": "Tarihçe", "tr/hakkimizda/vizyon": "Vizyon", "tr/hakkimizda/misyon": "Misyon", "tr/hakkimizda/kvkk": "Kişisel Verilerin Korunması", "tr/hakkimizda/referans-markalarimiz": "Referans Markalarımız", "tr/urunler/metal-fermuarlar": "Metal Fermuar", "tr/urunler/naylon-fermuarlar": "Naylon Fermuar", "tr/urunler/kemik-fermuarlar": "Kemik Fermuar" };

export async function generateMetadata({ params }: { params: Promise<{ path?: string[] }> }): Promise<Metadata> {
  const slug = (await params).path?.join("/") || "";
  const isTr = slug === "tr" || slug.startsWith("tr/");
  const en = isTr ? Object.keys(routePairs).find((key) => routePairs[key] === slug) ?? "" : slug;
  const tr = routePairs[en] ?? "tr";
  const title = pageTitles[slug] ?? (isTr ? "Premium Fermuar Mühendisliği" : "Premium Zipper Engineering");
  const description = isTr ? "Türkiye’de geliştirilen, dünyaya ulaştırılan premium fermuar sistemleri." : "Premium zipper systems engineered in Türkiye and delivered worldwide.";
  return { title, description, alternates: { canonical: `${base}/${isTr ? tr : en}`, languages: { en: `${base}/${en}`, tr: `${base}/${tr}`, "x-default": `${base}/${en}` } } };
}

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const path = (await params).path?.join("/") || "";
  return <EcexSite initialPath={path} />;
}
