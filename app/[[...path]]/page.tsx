import type { Metadata } from "next";
import { EcexSite } from "./site";

const base = "https://ecex-premium-zippers.alicintosunai.chatgpt.site";
const routePairs: Record<string, string> = { "": "tr", about: "tr/hakkimizda", products: "tr/urunler", kalite: "tr/kalite", blog: "tr/blog", contact: "tr/iletisim", "about/history": "tr/hakkimizda/tarihce", "about/vision": "tr/hakkimizda/vizyon", "about/mission": "tr/hakkimizda/misyon", "about/data-protection": "tr/hakkimizda/kvkk", "about/reference-brands": "tr/hakkimizda/referans-markalarimiz", "products/metal-zippers": "tr/urunler/metal-fermuarlar", "products/nylon-zippers": "tr/urunler/naylon-fermuarlar", "products/molded-plastic-zippers": "tr/urunler/kemik-fermuarlar", "quality/policy":"tr/kalite/politikasi", "quality/certificates":"tr/kalite/belgeleri", "quality/test-methods":"tr/kalite/test-yontemleri", "quality/measurement-standards":"tr/kalite/olcme-standartlari" };

const pageTitles: Record<string, string> = { kalite: "Quality", blog: "Blog", contact: "Contact", "tr/kalite": "Kalite", "tr/blog": "Blog", "tr/iletisim": "İletişim", "about/history": "Our History", "about/vision": "Vision", "about/mission": "Mission", "about/data-protection": "Personal Data Protection", "about/reference-brands": "Our Reference Brands", "products/metal-zippers": "Metal Zippers", "products/nylon-zippers": "Nylon Zippers", "products/molded-plastic-zippers": "Molded Plastic Zippers", "tr/hakkimizda/tarihce": "Tarihçe", "tr/hakkimizda/vizyon": "Vizyon", "tr/hakkimizda/misyon": "Misyon", "tr/hakkimizda/kvkk": "Kişisel Verilerin Korunması", "tr/hakkimizda/referans-markalarimiz": "Referans Markalarımız", "tr/urunler/metal-fermuarlar": "Metal Fermuar", "tr/urunler/naylon-fermuarlar": "Naylon Fermuar", "tr/urunler/kemik-fermuarlar": "Kemik Fermuar", "quality/policy":"Quality Policy", "tr/kalite/politikasi":"Kalite Politikası", "quality/certificates":"Quality Certificates", "tr/kalite/belgeleri":"Kalite Belgeleri", "quality/test-methods":"Zipper Test Methods", "tr/kalite/test-yontemleri":"Fermuar Test Yöntemleri", "quality/measurement-standards":"Measurement Standards", "tr/kalite/olcme-standartlari":"Ölçme Standartları" };

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
