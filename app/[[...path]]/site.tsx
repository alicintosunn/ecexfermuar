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

const aboutMenu = [
  { en: ["HISTORY", "about/history"], tr: ["TARİHÇE", "tr/hakkimizda/tarihce"] },
  { en: ["VISION", "about/vision"], tr: ["VİZYON", "tr/hakkimizda/vizyon"] },
  { en: ["MISSION", "about/mission"], tr: ["MİSYON", "tr/hakkimizda/misyon"] },
  { en: ["DATA PROTECTION", "about/data-protection"], tr: ["KVKK", "tr/hakkimizda/kvkk"] },
  { en: ["OUR REFERENCE BRANDS", "about/reference-brands"], tr: ["REFERANS MARKALARIMIZ", "tr/hakkimizda/referans-markalarimiz"] },
] as const;

const productMenu = [
  { en: ["METAL ZIPPERS", "products/metal-zippers"], tr: ["METAL FERMUAR", "tr/urunler/metal-fermuarlar"] },
  { en: ["NYLON ZIPPERS", "products/nylon-zippers"], tr: ["NAYLON FERMUAR", "tr/urunler/naylon-fermuarlar"] },
  { en: ["MOLDED PLASTIC ZIPPERS", "products/molded-plastic-zippers"], tr: ["KEMİK FERMUAR", "tr/urunler/kemik-fermuarlar"] },
] as const;

const pageContent: Record<string, { eyebrow: string; title: string; body: string[] }> = {
  "about/history": { eyebrow: "ABOUT ECEX", title: "Our History", body: [
    "Operating in the garment accessories industry since 1988, Ece Zipper continues its operations at its modern facilities in Avcılar Firuzköy, featuring 20,000 m² of enclosed space.",
    "Ece Zipper is a fully integrated company with a narrow fabric weaving unit, a modern dyehouse, a foundry where custom zipper pulls are designed and manufactured, and advanced zipper production machinery.",
    "Our narrow fabric weaving machines can manufacture both standard and custom-patterned woven tapes for all types of zippers, with an annual production capacity of 60 million meters of zipper tape.",
    "Our HT system dyehouse has an annual dyeing capacity of 900 tons, making it one of the highest-capacity dyehouses in the industry.",
    "Manufactured to world-class standards, Ece Zipper products are exported to EU countries—primarily Germany, Italy, the Netherlands, the United Kingdom and France—as well as Morocco and Algeria.",
    "Metal, molded plastic and nylon zippers manufactured in line with customer requirements are quality-controlled at every stage and delivered to customers right on time.",
    "Our guiding principle, shaping every activity from order intake to after-sales services with meticulous discipline, is unconditional customer satisfaction."
  ] },
  "tr/hakkimizda/tarihce": { eyebrow: "ECE FERMUAR HAKKINDA", title: "Tarihçe", body: [
    "1988 yılından beri Konfeksiyon Yan Sanayi Sektörü'nde faaliyet gösteren Ece Fermuar, Avcılar Firuzköy'deki 20.000 m² kapalı alana sahip modern tesislerinde faaliyetini sürdürmektedir.",
    "Ece Fermuar, dar dokuma ünitesi, modern boyahanesi, özel elciklerin tasarlanıp üretildiği dökümhanesi ve ileri teknoloji ürünü fermuar üretim makineleri ile entegre bir kuruluştur.",
    "Tüm fermuar çeşitleri için standart ve özel desenli dokuma şeritler imal edebilen dar dokuma makinelerimiz, yıllık 60 milyon metre fermuar şeridi dokuma kapasitesine sahiptir.",
    "HT sistem boyahanemiz yıllık 900 ton boyama kapasitesi ile sektörün en yüksek kapasiteli boyahanelerinden biridir.",
    "Dünya standartlarında üretim yapan Ece Fermuar ürünleri; Almanya, İtalya, Hollanda, İngiltere ve Fransa başta olmak üzere AB ülkelerine, Fas ve Cezayir'e ihraç edilmektedir.",
    "Müşteri isteklerine uygun olarak imal edilen metal, kemik ve naylon fermuarlar, her adımda kalitesi kontrol edilen ürünler olarak tam zamanında müşterisine teslim edilmektedir.",
    "Sipariş alımından satış sonrası hizmetlerine kadar titiz bir disiplin içerisinde yürütülen faaliyetlerimizi şekillendiren ana ilkemiz koşulsuz müşteri memnuniyetidir."
  ] },
  "about/vision": { eyebrow: "OUR DIRECTION", title: "Vision", body: ["To become the leading brand in Türkiye and a recognized brand worldwide."] },
  "tr/hakkimizda/vizyon": { eyebrow: "HEDEFİMİZ", title: "Vizyon", body: ["Yurt içinde lider, dünyada tanınan bir marka olmak."] },
  "about/mission": { eyebrow: "OUR PURPOSE", title: "Mission", body: ["With our corporate structure, long-standing team, evolving organization and culture that embraces change, we manufacture and sell zippers in line with customer requirements and global standards."] },
  "tr/hakkimizda/misyon": { eyebrow: "VARLIK NEDENİMİZ", title: "Misyon", body: ["Kurumsal yapımız, süreklilik arz eden personelimiz, gelişen organizasyonumuz ve değişime açık kültür yapımızla, dünya standartları doğrultusunda müşteri isteklerine göre fermuar üretir ve satarız."] },
  "about/data-protection": { eyebrow: "PRIVACY & SECURITY", title: "Personal Data Protection", body: [
    "Dear Valued Stakeholders,",
    "As Ece Fermuar Sanayi Ticaret A.Ş., we attach great importance to information security and personal data security. The security and confidentiality of the personal data of our customers, business partners, visitors and employees are among our highest priorities. In this context, personal data is processed, stored and protected in accordance with the Turkish Personal Data Protection Law No. 6698 (KVKK), the European Union General Data Protection Regulation (GDPR) to the extent applicable, and other relevant legislation.",
    "This page has been prepared to explain clearly and transparently which personal data we process and for what purposes, to whom and under which conditions data may be transferred, the applicable retention periods, and the rights of data subjects. Your personal data is processed solely for specific, explicit and legitimate purposes and in accordance with the principle of data minimization.",
    "Our company implements the necessary technical and administrative measures to ensure data security and carries out continuous improvement activities to protect personal data against unauthorized access, disclosure, loss or misuse. Our data-processing practices are reviewed regularly to maintain compliance with current legislation. You may use the application channels provided on this page to exercise your rights regarding your personal data or to request detailed information.",
    "Sincerely,", "Ece Zipper KVKK Organization"
  ] },
  "tr/hakkimizda/kvkk": { eyebrow: "GİZLİLİK & GÜVENLİK", title: "Kişisel Verilerin Korunması", body: [
    "Değerli Muhataplarımız,",
    "Ece Fermuar Sanayi Ticaret A.Ş. olarak bilgi güvenliğine, kişisel veri güvenliğine önem veriyoruz. Müşterilerimizin, iş ortaklarımızın, ziyaretçilerimizin ve çalışanlarımızın kişisel verilerinin güvenliği ve gizliliği en önemli önceliklerimizden biridir. Bu kapsamda kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve uygulanabilir olduğu ölçüde Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) başta olmak üzere ilgili mevzuata uygun şekilde işlenmekte, saklanmakta ve korunmaktadır.",
    "Oluşturulan bu sayfa; hangi kişisel verileri hangi amaçlarla işlediğimizi, verilerin kimlere ve hangi şartlarda aktarılabileceğini, saklama sürelerini ve ilgili kişilerin haklarını açık ve anlaşılır şekilde açıklamak amacıyla hazırlanmıştır. Kişisel verileriniz yalnızca belirli, açık ve meşru amaçlar doğrultusunda ve veri minimizasyonu ilkesine uygun olarak işlenir.",
    "Şirketimiz, veri güvenliğini sağlamak amacıyla gerekli teknik ve idari tedbirleri uygulamakta ve kişisel verilerin yetkisiz erişime, ifşaya, kayba veya kötüye kullanıma karşı korunması için sürekli iyileştirme faaliyetleri yürütmektedir. Bu kapsamda veri işleme süreçlerimiz düzenli olarak gözden geçirilmekte ve güncel mevzuat ile uyumluluğu sağlanmaktadır. Kişisel verileriniz ile ilgili haklarınızı kullanmak veya detaylı bilgi almak için bu sayfada yer alan başvuru kanallarını kullanabilirsiniz.",
    "Saygılarımızla", "Ece Fermuar KVKK Organizasyonu"
  ] },
  "about/reference-brands": { eyebrow: "TRUSTED PARTNERSHIPS", title: "Our Reference Brands", body: ["The brands that choose ECEX reflect the trust built through consistent quality, dependable delivery and long-term collaboration."] },
  "tr/hakkimizda/referans-markalarimiz": { eyebrow: "GÜVENİLİR İŞ ORTAKLIKLARI", title: "Referans Markalarımız", body: ["ECEX'i tercih eden markalar; istikrarlı kalite, güvenilir teslimat ve uzun vadeli iş birlikleriyle oluşturduğumuz güveni yansıtır."] },
  "products/metal-zippers": { eyebrow: "PRODUCTS", title: "Metal Zippers", body: ["High-strength metal zipper solutions engineered for premium apparel, denim, leather goods and demanding applications."] },
  "tr/urunler/metal-fermuarlar": { eyebrow: "ÜRÜNLER", title: "Metal Fermuar", body: ["Premium giyim, denim, deri ürünleri ve zorlu uygulamalar için geliştirilen yüksek mukavemetli metal fermuar çözümleri."] },
  "products/nylon-zippers": { eyebrow: "PRODUCTS", title: "Nylon Zippers", body: ["Lightweight, flexible and dependable nylon zipper systems for apparel, accessories and technical textile applications."] },
  "tr/urunler/naylon-fermuarlar": { eyebrow: "ÜRÜNLER", title: "Naylon Fermuar", body: ["Giyim, aksesuar ve teknik tekstil uygulamaları için hafif, esnek ve güvenilir naylon fermuar sistemleri."] },
  "products/molded-plastic-zippers": { eyebrow: "PRODUCTS", title: "Molded Plastic Zippers", body: ["Durable molded plastic zipper solutions designed for sportswear, outerwear, bags and everyday performance."] },
  "tr/urunler/kemik-fermuarlar": { eyebrow: "ÜRÜNLER", title: "Kemik Fermuar", body: ["Spor giyim, dış giyim, çanta ve günlük kullanım için tasarlanan dayanıklı kemik fermuar çözümleri."] },
};

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
  const t = ui[lang]; const c = copy[lang]; const isAdmin = initialPath.endsWith("admin"); const detail = pageContent[initialPath] ?? (initialPath === "about" ? pageContent["about/history"] : initialPath === "tr/hakkimizda" ? pageContent["tr/hakkimizda/tarihce"] : undefined);
  const otherRoute = useMemo(() => { const found = [...routes, ...aboutMenu, ...productMenu].find((r) => r[lang][1] === initialPath); return found ? `/${found[lang === "en" ? "tr" : "en"][1]}` : lang === "en" ? "/tr/" : "/"; }, [initialPath, lang]);
  function update(l: Lang, key: keyof Copy, value: string) { setCopy((prev) => ({ ...prev, [l]: { ...prev[l], [key]: value } })); }
  function persist() { localStorage.setItem("ecex-content", JSON.stringify(copy)); setSaved(true); setTimeout(() => setSaved(false), 2500); }

  if (isAdmin) return <Admin lang={lang} copy={copy} update={update} persist={persist} saved={saved} />;
  return <div className="site-shell">
    <header className="header"><Logo/><button className="mobile-toggle" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X/> : <Menu/>}</button>
      <nav className={menu ? "nav open" : "nav"}>{routes.map((r, index) => { const sub = index === 1 ? aboutMenu : index === 2 ? productMenu : null; const active = r[lang][1] === initialPath || !!sub?.some((item) => item[lang][1] === initialPath); return <div className={sub ? "nav-item has-submenu" : "nav-item"} key={r.en[0]}><a className={active ? "active" : ""} href={`/${r[lang][1]}`}>{r[lang][0]}{sub && <ChevronDown size={13}/>}</a>{sub && <div className="submenu">{sub.map((item) => <a key={item.en[0]} className={item[lang][1] === initialPath ? "active" : ""} href={`/${item[lang][1]}`}>{item[lang][0]}</a>)}</div>}</div>})}</nav>
      <div className="lang-wrap"><button className="lang-button" onClick={() => setLangs(!langs)} aria-expanded={langs}>{lang.toUpperCase()} <ChevronDown size={14}/></button>{langs && <div className="lang-menu"><a href={lang === "en" ? `/${initialPath}` : otherRoute}>🇬🇧 English</a><a href={lang === "tr" ? `/${initialPath}` : otherRoute}>🇹🇷 Türkçe</a></div>}</div>
    </header>
    <main>{detail ? <ContentPage content={detail} lang={lang}/> : <>
      <section className="hero"><div className="hero-shade"/><img src="/hero-v2.png" alt="Precision-engineered zipper opening to a connected world"/><div className="hero-copy"><span>{c.heroTitle}</span><strong>{c.heroAccent}</strong><span>{c.heroTail}</span><p>{c.heroText}</p><a className="primary-button" href={`/${routes[2][lang][1]}`}>{t.explore}</a></div><div className="slide-count"><b>01</b><i/><span>03</span></div></section>
      <Stats lang={lang}/>
      <section className="section products"><div className="section-head"><div><small>{t.products}</small><h2>{t.quality}</h2></div><a className="ghost-button" href={`/${routes[2][lang][1]}`}>{t.all}</a></div><div className="product-grid">{products[lang].map((name, i) => <a className={`product-card product-${i+1}`} key={name} href={i === 0 ? (lang === "en" ? "/products/metal-zippers" : "/tr/urunler/metal-fermuarlar") : `/${routes[2][lang][1]}`}><img src="/hero-v2.png" alt={name}/><div><h3>{name}</h3><span>↗</span></div></a>)}</div></section>
      <section className="world"><div className="world-copy"><small>{t.global}</small><h2>{t.deliver}</h2><p>{t.map}</p><a className="primary-button" href={`/${routes[3][lang][1]}`}>{t.discover}</a></div><div className="map-art"><div className="orbit o1"/><div className="orbit o2"/><div className="hub"><Logo/></div>{[1,2,3,4,5].map(n=><i key={n} className={`point p${n}`}/>)}</div></section>
      <section className="pillars">{t.pillars.map((title,i)=>{const Icon=[Zap,ShieldCheck,Lightbulb,Leaf][i]; return <article className={`pillar-${i+1}`} key={title}><img src="/hero-v2.png" alt=""/><div><Icon/><span><h3>{title}</h3><p>{t.pdesc[i]}</p></span></div></article>})}</section>
    </>}</main><footer><Logo/><p>© 2026 ECEX. {lang === "en" ? "Engineered in Türkiye." : "Türkiye’de mühendislikle üretildi."}</p><a href={`/${lang === "tr" ? "tr/" : ""}admin`}>{t.admin}</a><b>{t.connect}</b></footer>
  </div>;
}

function Stats({ lang }: { lang: Lang }) { const data = lang === "en" ? [["35+","Years experience"],["1000+","Products"],["70+","Export countries"],["24/7","Production"],["ISO","Certified quality"]] : [["35+","Yıllık deneyim"],["1000+","Ürün"],["70+","İhracat ülkesi"],["24/7","Üretim"],["ISO","Sertifikalı kalite"]]; const icons=[Award,Box,Globe2,Sparkles,ShieldCheck]; return <section className="stats">{data.map(([n,l],i)=>{const Icon=icons[i];return <div key={l}><Icon/><span><b>{n}</b><small>{l}</small></span></div>})}</section> }

function ContentPage({ content, lang }: { content: { eyebrow: string; title: string; body: string[] }; lang: Lang }) { return <article className="content-page"><div className="content-visual"><img src="/hero-v2.png" alt=""/><div><small>{content.eyebrow}</small><h1>{content.title}</h1></div></div><div className="content-layout"><aside><span>ECEX</span><strong>{lang === "en" ? "Since 1988" : "1988’den beri"}</strong></aside><div className="prose">{content.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div></article> }

function Admin({ lang, copy, update, persist, saved }: { lang: Lang; copy: Record<Lang,Copy>; update:(l:Lang,k:keyof Copy,v:string)=>void; persist:()=>void; saved:boolean }) { const t=ui[lang]; return <div className="admin"><header><Logo/><a href={lang === "en" ? "/" : "/tr/"}>← {lang === "en" ? "Back to site" : "Siteye dön"}</a></header><main><div className="admin-title"><small>ECEX CMS</small><h1>{t.admin}</h1><p>{lang === "en" ? "Every field clearly separates the English and Turkish versions." : "Her alan İngilizce ve Türkçe karşılıkları açıkça ayırır."}</p></div><div className="editor-grid">{(["en","tr"] as Lang[]).map(l=><section key={l}><h2>{l === "en" ? `🇬🇧 ${t.english}` : `🇹🇷 ${t.turkish}`}</h2>{Object.entries(copy[l]).map(([key,value])=><label key={key}><span>{key.replace(/([A-Z])/g," $1")}</span>{key.includes("Description") || key === "heroText" ? <textarea value={value} onChange={e=>update(l,key as keyof Copy,e.target.value)}/> : <input value={value} onChange={e=>update(l,key as keyof Copy,e.target.value)}/>}</label>)}</section>)}</div><button className="primary-button save" onClick={persist}>{t.save}</button>{saved&&<output>{t.saved}</output>}</main></div> }
