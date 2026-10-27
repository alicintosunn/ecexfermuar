import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./brand-theme.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ecex-premium-zippers.alicintosunai.chatgpt.site"),
  title: { default: "ECEX | Premium Zipper Engineering", template: "%s | ECEX" },
  description: "Premium zipper systems engineered in Türkiye and delivered worldwide.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M2V2E2CWZV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-M2V2E2CWZV');`}
        </Script>
      </body>
    </html>
  );
}
