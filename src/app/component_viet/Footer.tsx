import type { SVGProps } from "react";

import Image from "next/image";
import Logo from "@/public/icon/logo.png";

const IconGlobe = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 0 0 20a15.3 15.3 0 0 0 0-20z" />
  </svg>
);

const IconPhone = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.1 5.18A2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.6a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.86 6.86l1.27-1.27a2 2 0 0 1 2.11-.45c.83.26 1.7.45 2.6.57A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMail = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16v16H4z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Image src={Logo} alt="ARC logo" priority className="h-11 w-auto object-contain" />
            <p className="mt-4 text-sm text-gray-200">
              ARC brings all gamers together...
            </p>
          </div>

          {/* Col 2: Contact us via */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight">CONTACT US VIA</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <IconGlobe className="h-6 w-6" />
                <a href="https://ARCshop.vn" target="_blank" rel="noreferrer" className="hover:underline">ARCshop.vn</a>
              </li>
              <li className="flex items-center gap-3">
                <IconPhone className="h-6 w-6" />
                <a href="tel:0123456789" className="hover:underline">0123 456 789</a>
              </li>
              <li className="flex items-center gap-3">
                <IconMail className="h-6 w-6" />
                <a href="mailto:arc_company@gmail.com" className="hover:underline">arc_company@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <IconGlobe className="h-6 w-6" />
                <span>ARC Official</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Information */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight">INFORMATION</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a href="#about" className="hover:underline">About ARC</a></li>
              <li><a href="#support" className="hover:underline">Support</a></li>
              <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/70">
          © {new Date().getFullYear()} ARC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
