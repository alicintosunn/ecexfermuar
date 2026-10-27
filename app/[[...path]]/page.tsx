import type { Metadata } from "next";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts, contentSections, popups, productItems, productOptions, siteSettings } from "@/db/schema";
import { EcexSite } from "./site";

export const dynamic = "force-dynamic";

const base = "https://ecex-premium-zippers.alicintosunai.chatgpt.site";
const routePairs: Record<string, string> = { "": "tr", about: "tr/hakkimizda", products: "tr/urunler", kalite: "tr/kalite", blog: "tr/blog", contact: "tr/iletisim", "about/history": "tr/hakkimizda/tarihce", "about/vision": "tr/hakkimizda/vizyon", "about/mission": "tr/hakkimizda/misyon", "about/data-protection": "tr/hakkimizda/kvkk", "about/reference-brands": "tr/hakkimizda/referans-markalarimiz", "products/metal-zippers": "tr/urunler/metal-fermuarlar", "products/nylon-zippers": "tr/urunler/naylon-fermuarlar", "products/molded-plastic-zippers": "tr/urunler/kemik-fermuarlar", "quality/policy":"tr/kalite/politikasi", "quality/certificates":"tr/kalite/belgeleri", "quality/test-methods-and-measurement-standards":"tr/kalite/test-yontemleri-ve-olcme-standartlari" };

const pageTitles: Record<string, string> = { kalite: "Quality", blog: "Blog", contact: "Contact", "tr/kalite": "Kalite", "tr/blog": "Blog", "tr/iletisim": "İletişim", "about/history": "Our History", "about/vision": "Vision", "about/mission": "Mission", "about/data-protection": "Personal Data Protection", "about/reference-brands": "Our Reference Brands", "products/metal-zippers": "Metal Zippers", "products/nylon-zippers": "Nylon Zippers", "products/molded-plastic-zippers": "Molded Plastic Zippers", "tr/hakkimizda/tarihce": "Tarihçe", "tr/hakkimizda/vizyon": "Vizyon", "tr/hakkimizda/misyon": "Misyon", "tr/hakkimizda/kvkk": "Kişisel Verilerin Korunması", "tr/hakkimizda/referans-markalarimiz": "Referans Markalarımız", "tr/urunler/metal-fermuarlar": "Metal Fermuar", "tr/urunler/naylon-fermuarlar": "Naylon Fermuar", "tr/urunler/kemik-fermuarlar": "Kemik Fermuar", "quality/policy":"Quality Policy", "tr/kalite/politikasi":"Kalite Politikası", "quality/certificates":"Quality Certificates", "tr/kalite/belgeleri":"Kalite Belgeleri", "quality/test-methods-and-measurement-standards":"Zipper Test Methods & Measurement Standards", "tr/kalite/test-yontemleri-ve-olcme-standartlari":"Fermuar Test Yöntemleri ve Ölçme Standartları" };

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
  const language=path==="tr"||path.startsWith("tr/")?"tr":"en";
  const category=path.includes("molded-plastic")||path.includes("kemik-fermuarlar")?"molded":path.includes("nylon-zippers")||path.includes("naylon-fermuarlar")?"nylon":path.includes("metal-zippers")||path.includes("metal-fermuarlar")?"metal":null;
  const db=getDb();
  const [sections,posts,settingsRows,popupRows,items,options]=await Promise.all([
    db.select().from(contentSections),
    db.select().from(blogPosts).where(eq(blogPosts.published,true)).orderBy(desc(blogPosts.createdAt)),
    db.select().from(siteSettings).where(inArray(siteSettings.key,["logoKey","sliderImages","popupEnabled","popupMessageEn","popupMessageTr","popupImageKey","popupVideoKey"])),
    db.select().from(popups).where(and(eq(popups.language,language),eq(popups.published,true))).orderBy(desc(popups.updatedAt),desc(popups.id)),
    category?db.select().from(productItems).where(eq(productItems.category,category)).orderBy(asc(productItems.sortOrder),asc(productItems.id)):Promise.resolve([]),
    category?db.select().from(productOptions).where(eq(productOptions.category,category)).orderBy(asc(productOptions.sortOrder),asc(productOptions.id)):Promise.resolve([]),
  ]);
  return <EcexSite initialPath={path} initialData={{sections,posts,settings:Object.fromEntries(settingsRows.map(row=>[row.key,row.value])),popups:popupRows.map(row=>({...row,language:row.language==="tr"?"tr" as const:"en" as const})),items,options:options.map(row=>({...row,optionType:row.optionType==="finish"?"finish" as const:"coating" as const}))}} />;
}
