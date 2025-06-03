import type { Metadata } from "next";
import { Ysabeau_Office, EB_Garamond } from "next/font/google";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  title: "Estelle Kim",
  description: "thank you for visiting my portfolio!",
};

const ysabeauOffice = Ysabeau_Office({
  subsets: ["latin"],
  variable: "--font-ysabeau-office",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800",],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yef8dto.css"/>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js" strategy="beforeInteractive" />
        <Script 
          src="https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.js" 
          strategy="beforeInteractive"
        />
        <Script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"/>

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
