import Link from "next/link";

const FOOTER_LINK_GROUPS = [
  {
    title: "Discover",
    links: [
      { href: "/search", label: "Browse Games" },
      { href: "/collections", label: "Collections" },
      { href: "/deals", label: "Flash Sales" },
      { href: "/new", label: "New Releases" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/support", label: "Help Center" },
      { href: "/support/contact", label: "Contact" },
      { href: "/support/faq", label: "FAQ" },
      { href: "/support/refunds", label: "Refund Policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About ARC" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
      { href: "/blog", label: "Blog" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08070b]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 text-sm text-white/70 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3 text-lg font-semibold uppercase text-white">
            <span className="rounded bg-gradient-to-br from-[#ff6f61] to-[#ff914d] px-3 py-1 text-sm tracking-widest text-black">
              ARC
            </span>
            <span className="tracking-[0.32em] text-white/70">
              Game Store
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/50">
            ARC brings every gamer together. Discover curated collections, keep up
            with the latest releases, and build a library that travels with you
            across every platform.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
                {group.title}
              </p>
              <ul className="space-y-3 text-sm text-white/50">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ARC Game Store. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="transition-colors hover:text-white/70">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-white/70">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}