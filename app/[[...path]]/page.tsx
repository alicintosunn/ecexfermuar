import type { Metadata } from "next";
import { EcexSite } from "./site";

const base = "https://ecex-premium-zippers.alicintosunai.chatgpt.site";
const routePairs: Record<string, string> = { "": "tr", about: "tr/hakkimizda", products: "tr/urunler", industries: "tr/sektorler", innovation: "tr/inovasyon", sustainability: "tr/surdurulebilirlik", contact: "tr/iletisim", "products/metal-zippers": "tr/urunler/metal-fermuarlar" };

export async function generateMetadata({ params }: { params: Promise<{ path?: string[] }> }): Promise<Metadata> {
  const slug = (await params).path?.join("/") || "";
  const isTr = slug === "tr" || slug.startsWith("tr/");
  const en = isTr ? Object.keys(routePairs).find((key) => routePairs[key] === slug) ?? "" : slug;
  const tr = routePairs[en] ?? "tr";
  const title = isTr ? "Premium Fermuar Mühendisliği" : "Premium Zipper Engineering";
  const description = isTr ? "Türkiye’de geliştirilen, dünyaya ulaştırılan premium fermuar sistemleri." : "Premium zipper systems engineered in Türkiye and delivered worldwide.";
  return { title, description, alternates: { canonical: `${base}/${isTr ? tr : en}`, languages: { en: `${base}/${en}`, tr: `${base}/${tr}`, "x-default": `${base}/${en}` } } };
}

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const path = (await params).path?.join("/") || "";
  return <EcexSite initialPath={path} />;
}
