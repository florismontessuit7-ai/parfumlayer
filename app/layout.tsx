import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ParfumLayer - L'art du layering par l'IA",
  description: "Découvrez les meilleures associations de parfums grâce à l'intelligence artificielle et une base de 70 000 fragrances.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cormorant.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
