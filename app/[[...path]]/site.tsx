"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Box, ChevronDown, Globe2, Leaf, Lightbulb, Menu, ShieldCheck, Sparkles, X, Zap } from "lucide-react";

type Lang = "en" | "tr";
type Copy = { heroTitle: string; heroAccent: string; heroTail: string; heroText: string; seoTitle: string; seoDescription: string };
const defaults: Record<Lang, Copy> = {
  en: { heroTitle: "ENGINEERING", heroAccent: "PREMIUM ZIPPERS", heroTail: "FOR THE WORLD", heroText: "Innovative manufacturing · Sustainable production · Export to 70+ countries", seoTitle: "ECEX | Premium Zipper Engineering", seoDescription: "Premium zipper systems engineered in Türkiye and delivered worldwide." },
  tr: { heroTitle: "DÜNYA İÇİN", heroAccent: "PREMİUM FERMUAR", heroTail: "MÜHENDİSLİĞİ", heroText: "Yenilikçi üretim · Sürdürülebilir çözümler · 70+ ülkeye ihracat", seoTitle: "ECEX | Premium Fermuar Mühendisliği", seoDescription: "Türkiye’de geliştirilen, dünyaya ulaştırılan premium fermuar sistemleri." },
};

const routes = [
  { en: ["HOME", ""], tr: ["ANA SAYFA", "tr"] }, { en: ["ABOUT US", "about"], tr: ["HAKKIMIZDA", "tr/hakkimizda"] },
  { en: ["PRODUCTS", "products"], tr: ["ÜRÜNLER", "tr/urunler"] }, { en: ["INDUSTRIES", "industries"], tr: ["SEKTÖRLER", "tr/sektorler"] },
  { en: ["INNOVATION", "innovation"], tr: ["İNOVASYON", "tr/inovasyon"] }, { en: ["SUSTAINABILITY", "sustainability"], tr: ["SÜRDÜRÜLEBİLİRLİK", "tr/surdurulebilirlik"] },
  { en: ["CONTACT", "contact"], tr: ["İLETİŞİM", "tr/iletisim"] },
] as const;

const products = { en: ["Metal Zippers", "Nylon Zippers", "Plastic Zippers", "Waterproof Zippers", "Invisible Zippers", "Special Zippers"], tr: ["Metal Fermuarlar", "Naylon Fermuarlar", "Plastik Fermuarlar", "Su Geçirmez Fermuarlar", "Gizli Fermuarlar", "Özel Fermuarlar"] };
const ui = {
  en: { explore: "EXPLORE COLLECTION", products: "OUR PRODUCTS", quality: "QUALITY IN EVERY DETAIL", all: "VIEW ALL PRODUCTS", global: "GLOBAL PRESENCE", deliver: "DELIVERING TO THE WORLD", map: "We export our high-quality zippers to more than 70 countries across 5 continents.", discover: "DISCOVER OUR NETWORK", pillars: ["High Technology", "Quality Control", "Innovation", "Sustainability"], pdesc: ["Advanced machinery and automation for superior product quality.", "Rigorous testing at every stage to ensure perfection.", "Continuous R&D for intelligent zipper solutions.", "Committed to eco-friendly production and a better future."], connect: "LET’S CONNECT", admin: "Content Management", save: "Save changes", saved: "Changes saved on this device", english: "English content", turkish: "Turkish content" },
  tr: { explore: "KOLEKSİYONU KEŞFET", products: "ÜRÜNLERİMİZ", quality: "HER DETAYDA KALİTE", all: "TÜM ÜRÜNLER", global: "GLOBAL VARLIK", deliver: "DÜNYAYA ULAŞIYORUZ", map: "Yüksek kaliteli fermuarlarımızı 5 kıtada 70’ten fazla ülkeye ihraç ediyoruz.", discover: "AĞIMIZI KEŞFEDİN", pillars: ["Yüksek Teknoloji", "Kalite Kontrol", "İnovasyon", "Sürdürülebilirlik"], pdesc: ["Üstün ürün kalitesi için gelişmiş makine ve otomasyon.", "Kusursuzluk için her aşamada titiz testler.", "Akıllı fermuar çözümleri için sürekli Ar-Ge.", "Çevre dostu üretim ve daha iyi bir gelecek taahhüdü."], connect: "İLETİŞİME GEÇİN", admin: "İçerik Yönetimi", save: "Değişiklikleri kaydet", saved: "Değişiklikler bu cihazda kaydedildi", english: "İngilizce içerik", turkish: "Türkçe içerik" },
};

function Logo() { return <a className="logo" href="/" aria-label="ECEX home"><span className="logo-mark"><i/><b/></span><strong>ECEX</strong></a>; }

export function EcexSite({ initialPath }: { initialPath: string }) {
  const lang: Lang = initialPath === "tr" || initialPath.startsWith("tr/") ? "tr" : "en";
  const [menu, setMenu] = useState(false); const [langs, setLangs] = useState(false);
  const [copy, setCopy] = useState(defaults); const [saved, setSaved] = useState(false);
  useEffect(() => { const value = localStorage.getItem("ecex-content"); if (value) { try { setCopy(JSON.parse(value)); } catch {} } document.documentElement.lang = lang; }, [lang]);
  const t = ui[lang]; const c = copy[lang]; const isAdmin = initialPath.endsWith("admin");
  const otherRoute = useMemo(() => { const found = routes.find((r) => r[lang][1] === initialPath); return found ? `/${found[lang === "en" ? "tr" : "en"][1]}` : lang === "en" ? "/tr/" : "/"; }, [initialPath, lang]);
  function update(l: Lang, key: keyof Copy, value: string) { setCopy((prev) => ({ ...prev, [l]: { ...prev[l], [key]: value } })); }
  function persist() { localStorage.setItem("ecex-content", JSON.stringify(copy)); setSaved(true); setTimeout(() => setSaved(false), 2500); }

  if (isAdmin) return <Admin lang={lang} copy={copy} update={update} persist={persist} saved={saved} />;
  return <div className="site-shell">
    <header className="header"><Logo/><button className="mobile-toggle" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X/> : <Menu/>}</button>
      <nav className={menu ? "nav open" : "nav"}>{routes.map((r) => <a key={r.en[0]} className={r[lang][1] === initialPath ? "active" : ""} href={`/${r[lang][1]}`}>{r[lang][0]}</a>)}</nav>
      <div className="lang-wrap"><button className="lang-button" onClick={() => setLangs(!langs)} aria-expanded={langs}>{lang.toUpperCase()} <ChevronDown size={14}/></button>{langs && <div className="lang-menu"><a href={lang === "en" ? `/${initialPath}` : otherRoute}>🇬🇧 English</a><a href={lang === "tr" ? `/${initialPath}` : otherRoute}>🇹🇷 Türkçe</a></div>}</div>
    </header>
    <main>
      <section className="hero"><div className="hero-shade"/><img src="/hero-v2.png" alt="Precision-engineered zipper opening to a connected world"/><div className="hero-copy"><span>{c.heroTitle}</span><strong>{c.heroAccent}</strong><span>{c.heroTail}</span><p>{c.heroText}</p><a className="primary-button" href={`/${routes[2][lang][1]}`}>{t.explore}</a></div><div className="slide-count"><b>01</b><i/><span>03</span></div></section>
      <Stats lang={lang}/>
      <section className="section products"><div className="section-head"><div><small>{t.products}</small><h2>{t.quality}</h2></div><a className="ghost-button" href={`/${routes[2][lang][1]}`}>{t.all}</a></div><div className="product-grid">{products[lang].map((name, i) => <a className={`product-card product-${i+1}`} key={name} href={i === 0 ? (lang === "en" ? "/products/metal-zippers" : "/tr/urunler/metal-fermuarlar") : `/${routes[2][lang][1]}`}><img src="/hero-v2.png" alt={name}/><div><h3>{name}</h3><span>↗</span></div></a>)}</div></section>
      <section className="world"><div className="world-copy"><small>{t.global}</small><h2>{t.deliver}</h2><p>{t.map}</p><a className="primary-button" href={`/${routes[3][lang][1]}`}>{t.discover}</a></div><div className="map-art"><div className="orbit o1"/><div className="orbit o2"/><div className="hub"><Logo/></div>{[1,2,3,4,5].map(n=><i key={n} className={`point p${n}`}/>)}</div></section>
      <section className="pillars">{t.pillars.map((title,i)=>{const Icon=[Zap,ShieldCheck,Lightbulb,Leaf][i]; return <article className={`pillar-${i+1}`} key={title}><img src="/hero-v2.png" alt=""/><div><Icon/><span><h3>{title}</h3><p>{t.pdesc[i]}</p></span></div></article>})}</section>
    </main><footer><Logo/><p>© 2026 ECEX. {lang === "en" ? "Engineered in Türkiye." : "Türkiye’de mühendislikle üretildi."}</p><a href={`/${lang === "tr" ? "tr/" : ""}admin`}>{t.admin}</a><b>{t.connect}</b></footer>
  </div>;
}

function Stats({ lang }: { lang: Lang }) { const data = lang === "en" ? [["35+","Years experience"],["1000+","Products"],["70+","Export countries"],["24/7","Production"],["ISO","Certified quality"]] : [["35+","Yıllık deneyim"],["1000+","Ürün"],["70+","İhracat ülkesi"],["24/7","Üretim"],["ISO","Sertifikalı kalite"]]; const icons=[Award,Box,Globe2,Sparkles,ShieldCheck]; return <section className="stats">{data.map(([n,l],i)=>{const Icon=icons[i];return <div key={l}><Icon/><span><b>{n}</b><small>{l}</small></span></div>})}</section> }

function Admin({ lang, copy, update, persist, saved }: { lang: Lang; copy: Record<Lang,Copy>; update:(l:Lang,k:keyof Copy,v:string)=>void; persist:()=>void; saved:boolean }) { const t=ui[lang]; return <div className="admin"><header><Logo/><a href={lang === "en" ? "/" : "/tr/"}>← {lang === "en" ? "Back to site" : "Siteye dön"}</a></header><main><div className="admin-title"><small>ECEX CMS</small><h1>{t.admin}</h1><p>{lang === "en" ? "Every field clearly separates the English and Turkish versions." : "Her alan İngilizce ve Türkçe karşılıkları açıkça ayırır."}</p></div><div className="editor-grid">{(["en","tr"] as Lang[]).map(l=><section key={l}><h2>{l === "en" ? `🇬🇧 ${t.english}` : `🇹🇷 ${t.turkish}`}</h2>{Object.entries(copy[l]).map(([key,value])=><label key={key}><span>{key.replace(/([A-Z])/g," $1")}</span>{key.includes("Description") || key === "heroText" ? <textarea value={value} onChange={e=>update(l,key as keyof Copy,e.target.value)}/> : <input value={value} onChange={e=>update(l,key as keyof Copy,e.target.value)}/>}</label>)}</section>)}</div><button className="primary-button save" onClick={persist}>{t.save}</button>{saved&&<output>{t.saved}</output>}</main></div> }
