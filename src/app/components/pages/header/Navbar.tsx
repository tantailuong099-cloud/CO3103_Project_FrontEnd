"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import type { SVGProps } from "react";
import Image from "next/image";
import SideMenu from "@/app/components/pages/header/SideMenu";
import { getMe, logout } from "@/app/services/auth";

/* ----------------------------- Reusable Logo ----------------------------- */
type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  href?: string | null;
};

function Logo({
  width = 120,
  height = 40,
  className = "h-8 w-auto",
  href = "/",
}: LogoProps) {
  const img = (
    <Image
      src="/icon/logo.png"
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
  const router = useRouter();

  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // TẤT CẢ REF ĐẶT ĐÚNG TRONG COMPONENT
  const notifRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* CLICK OUTSIDE ĐỂ TẮT TỪNG POPUP */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }

      if (userRef.current && !userRef.current.contains(target)) {
        setUserOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* CHECK LOGIN */
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await getMe();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setUserOpen(false);
    window.location.href = "/login";
  };
  const handleSearch = () => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };


  return (
    <header className="w-full bg-[#1e1e1e] text-white z-999">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="h-16 flex items-center gap-4">

          {/* ☰ MENU */}
          <button onClick={() => setMenuOpen(true)} className="p-2 rounded-xl hover:bg-white/10">
            <IconHamburger className="h-6 w-6" />
          </button>

          <Logo />

          {/* SEARCH DESKTOP */}
          <div className="ml-auto md:mx-8 flex-1 max-w-2xl hidden md:flex">
            <div className="flex w-full items-center rounded-xl bg-black px-3 py-2 ring-1 ring-white/10">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search..."
              />
              <button onClick={handleSearch}>
                <IconSearch className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* RIGHT ICONS */}
          <div className="ml-auto md:ml-0 flex items-center gap-5">

            <button onClick={() => router.push("/cart")}>
              <IconCart className="h-6 w-6" />
            </button>

            {/* NOTIFICATION */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(v => !v)}>
                <IconBell className="h-6 w-6" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl bg-[#111] p-3 ring-1 ring-white/10 z-999">
                  <p className="text-sm">No new notifications</p>
                </div>
              )}
            </div>

            {/* USER */}
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserOpen(v => !v)}>
                <IconUser className="h-7 w-7" />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl bg-[#111] p-2 ring-1 ring-white/10 z-999">
                  {isLoggedIn ? (
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
                      Đăng xuất
                    </button>
                  ) : (
                    <>
                      <button onClick={() => router.push("/login")} className="w-full px-4 py-2 text-left text-sm hover:bg-white/10">Đăng nhập</button>
                      <button onClick={() => router.push("/register")} className="w-full px-4 py-2 text-left text-sm hover:bg-white/10">Đăng ký</button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* DRAWER MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-999">
          <div className="absolute inset-0 bg-black/50" />
          <aside ref={menuRef} className="absolute left-0 top-0 h-full w-[300px] bg-[#111]">
            <SideMenu onClose={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}
    </header>
  );
}
