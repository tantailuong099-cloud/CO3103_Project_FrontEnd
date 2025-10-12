"use client";

import Image from "next/image";
import { useState } from "react";
import type { SVGProps } from "react";

import Image from "next/image";
// 👉 import trực tiếp từ /public
import LOGO from "@/public/icon/logo.png"; // đảm bảo đúng đúng tên: logo.png (chữ thường)


<a href="/" className="flex items-center gap-2 select-none">
  {/* static import: Next biết sẵn width/height */}
  <Image src={LOGO} alt="ARC logo" priority className="h-8 w-auto object-contain" />
</a>

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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="w-full bg-[#1e1e1e] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="h-16 flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex md:hidden items-center justify-center rounded-xl p-2 hover:bg-white/10"
          >
            <IconHamburger className="h-6 w-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 select-none">
            <Image src={LOGO} alt="ARC logo" width={120} height={40} className="h-8 w-auto object-contain" />
          </a>

          {/* Search (desktop) */}
          <div className="ml-auto md:mx-8 flex-1 max-w-xl hidden md:flex">
            <label className="flex w-full items-center gap-2 rounded-xl bg-black px-3 py-2 ring-1 ring-white/10 focus-within:ring-white/25">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-400 outline-none"
                aria-label="Search"
              />
              <IconSearch className="h-5 w-5" />
            </label>
          </div>

          {/* Right icons */}
          <div className="ml-auto md:ml-0 flex items-center gap-5">
                <button aria-label="Cart" className="relative inline-flex items-center justify-center hover:text-[#FF6B35] transition-colors">
                <IconCart className="h-6 w-6" />
                </button>
             <IconUser className="h-7 w-7" />
          </div>
        </div>

        {/* Mobile search */}
        {open && (
          <div className="pb-3 md:hidden">
            <label className="flex w-full items-center gap-2 rounded-xl bg-black px-3 py-2 ring-1 ring-white/10 focus-within:ring-white/25">
              <IconSearch className="h-5 w-5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-400 outline-none"
                aria-label="Search"
              />
            </label>
          </div>
        )}
      </div>
    </header>
  );
}
