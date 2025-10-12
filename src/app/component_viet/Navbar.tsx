import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Discover" },
  { href: "/deals", label: "Deals" },
  { href: "/collections", label: "Collections" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111014]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold uppercase">
          <span className="rounded bg-gradient-to-br from-[#ff6f61] to-[#ff914d] px-3 py-1 text-sm tracking-widest text-black">
            ARC
          </span>
          <span className="hidden text-sm tracking-[0.32em] text-white/80 sm:block">
            Game Store
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.3em] text-white/60 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-white/70">
          <button
            type="button"
            aria-label="Search games"
            className="rounded-full border border-white/10 p-2 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M11 5a6 6 0 1 1-4.243 10.243l-2.83 2.83a1 1 0 0 1-1.414-1.414l2.83-2.83A6 6 0 0 1 11 5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Open cart"
            className="rounded-full border border-white/10 p-2 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M5 5h1.5l1.2 9h8.6l1.2-6H7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
              <circle cx="16" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Account menu"
            className="rounded-full border border-white/10 p-2 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <circle
                cx="12"
                cy="9"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}