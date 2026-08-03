import type { Metadata } from "next";
import { Ysabeau_Office, EB_Garamond } from "next/font/google";
import LayoutShell from "./LayoutShell";
import "./globals.css";

const productionHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(
    productionHost ? `https://${productionHost}` : "http://localhost:3000",
  ),
  title: "Estelle Kim",
  description: "thank you for visiting my portfolio!",
  openGraph: {
    title: "Estelle Kim",
    description: "thank you for visiting my portfolio!",
    type: "website",
    images: [
      {
        url: "/portfolio-link-cover.jpg",
        width: 1600,
        height: 1144,
        alt: "Estelle Kim's portfolio homepage with selected product and graphics work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estelle Kim",
    description: "thank you for visiting my portfolio!",
    images: [
      {
        url: "/portfolio-link-cover.jpg",
        alt: "Estelle Kim's portfolio homepage with selected product and graphics work",
      },
    ],
  },
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
    <html
      lang="en"
      className={`${ysabeauOffice.variable} ${ebGaramond.variable}`}
    >
      <body className="scroll-smooth">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
