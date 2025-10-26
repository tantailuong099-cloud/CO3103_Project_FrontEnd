"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import Image from "next/image";
import SideMenu from "@/app/components/pages/header/SideMenu";


/* ----------------------------- Reusable Logo ----------------------------- */
type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  href?: string | null; // mặc định là link về "/"; muốn bỏ link => truyền null
};
function Logo({ width = 120, height = 40, className = "h-8 w-auto", href = "/" }: LogoProps) {
  const img = (
    <Image
      src="/icon/logo.png"         // ảnh trong public/icon/logo.png
      alt="ARC logo"
      width={width}
      height={height}
      priority
      className={`object-contain ${className}`}
    />
  );
  return href ? (
    <a href={href} className="flex items-center gap-2 select-none">
      {img}
    </a>
  ) : (
    img
  );
}

/* --------------------------------- Icons -------------------------------- */
const IconHamburger = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCart = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconUser = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21a8 8 0 1 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBell = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconX = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* -------------------------------- Navbar -------------------------------- */
export default function Navbar() {
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="w-full bg-[#1e1e1e] text-white z-40">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="h-16 flex items-center gap-4">
          {/* Menu */}
          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-xl p-2 hover:bg-white/10"
          >
            <IconHamburger className="h-6 w-6" />
          </button>

          {/* Logo dùng component, không phải gán path/size lặp lại */}
          <Logo />

          {/* Search (desktop) */}
          <div className="ml-auto md:mx-8 flex-1 max-w-2xl hidden md:flex">
            <div className="flex w-full items-center rounded-xl bg-black px-3 py-2 ring-1 ring-white/10 focus-within:ring-white/25">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                aria-label="Search"
                className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-400 outline-none"
              />
              <span className="mx-2 h-5 w-px bg-white/20" aria-hidden />
              <button aria-label="Do search" className="inline-flex items-center justify-center rounded-lg px-2 py-1 hover:bg-white/10">
                <IconSearch className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right icons */}
          <div className="ml-auto md:ml-0 relative flex items-center gap-5">
            <button aria-label="Cart" className="relative inline-flex items-center justify-center hover:text-white/80 transition-colors">
              <IconCart className="h-6 w-6" />
            </button>

            <div className="relative">
              <button
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((v) => !v)}
                className="relative inline-flex items-center justify-center hover:text-white/80 transition-colors"
              >
                <IconBell className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#1e1e1e]" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl bg-[#111] p-3 ring-1 ring-white/10 shadow-lg z-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Notifications</p>
                    <button aria-label="Close" onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-white/10">
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    <p>No new notifications.</p>
                  </div>
                </div>
              )}
            </div>

            <button aria-label="Account" className="inline-flex items-center justify-center hover:text-white/80 transition-colors">
              <IconUser className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Search (mobile) */}
        <div className="pb-3 md:hidden">
          <div className="flex w-full items-center rounded-xl bg-black px-3 py-2 ring-1 ring-white/10 focus-within:ring-white/25">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-400 outline-none"
            />
            <span className="mx-2 h-5 w-px bg-white/20" aria-hidden />
            <button aria-label="Do search" className="inline-flex items-center justify-center rounded-lg px-2 py-1 hover:bg-white/10">
              <IconSearch className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer menu trái */}
      {menuOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} aria-hidden />
          <aside className="absolute left-0 top-0 h-full w-[300px] max-w-[80vw] shadow-2xl ring-1 ring-white/10">
            <SideMenu onClose={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

    </header>
  );
}
