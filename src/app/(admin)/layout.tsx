import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "../components/admin/header/Header";
import "../../app/globals.css";
import Sider from "../components/admin/sidebar/Sider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARC - Game Store Admin Page",
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
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0e0e0f] text-white antialiased`}
      >
        <div className="min-h-screen bg-[#F5F6FA]">
          {/* Header cố định */}
          <Header />

          {/* Sidebar cố định */}
          <Sider />

          {/* Nội dung chính */}
          <main className="pt-[70px] ml-[260px] p-6 transition-all">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
