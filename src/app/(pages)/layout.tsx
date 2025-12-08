import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../components/pages/header/Navbar";
import Footer from "../components/pages/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARC - Game Store",
  description:
    "ARC brings all gamers together. Shop your favorite video games, explore new worlds, and level up your collection — no matter what you play on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} bg-[#0e0e0f] text-white antialiased`}
        >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
