"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Settings, Info } from "lucide-react";
import Image from "next/image";

/* ---------------------------- Filter definitions ---------------------------- */
const FILTERS = [
  {
    title: "Platform",
    options: [
      "PlayStation 5",
      "PlayStation 4",
      "Nintendo Switch",
      "Xbox Series X",
      "Xbox Series S",
      "Xbox One",
    ],
  },
  {
    title: "Genre",
    options: ["Action", "Adventure", "RPG", "Strategy", "Shooter", "Puzzle", "Simulation"],
  },
  {
    title: "Country",
    options: ["Japan", "United States", "China", "South Korea", "France", "United Kingdom"],
  },
  {
    title: "Manufacturer",
    options: ["Nintendo", "Sony", "Microsoft", "Ubisoft", "Square Enix", "Krafton", "Others"],
  },
];

/* --------------------------- Main Side Menu Component --------------------------- */
export default function SideMenu({ onClose }: { onClose: () => void }) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const router = useRouter();

  // ✅ When user selects an item → navigate to /search?filter=Genre&value=Action
  const handleSelect = (category: string, value: string) => {
    router.push(`/search?category=${encodeURIComponent(value)}`);
    onClose(); // close the sidebar after navigation (optional)
  };

  return (
    <div className="flex h-full w-[300px] bg-[#1e1e1e] text-white flex-col justify-between relative">
      {/* Top logo & close */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
        <Image src="/icon/logo.png" alt="ARC Logo" width={110} height={36} className="object-contain" />
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 text-[17px]">
        <MenuItem label="My Account" />
        <MenuItem label="History Order" iconRight={<ChevronDown size={16} />} />
        <MenuItem label="Notification" iconRight={<ChevronDown size={16} />} />
        <Divider />

        {/* Filter Items */}
        {FILTERS.map((f) => (
          <MenuItem
            key={f.title}
            label={f.title}
            iconRight={<ChevronDown size={16} />}
            onClick={() => setOpenPanel(f.title)}
          />
        ))}

        <Divider />
        <MenuItem label="Settings" iconLeft={<Settings size={18} />} />
        <MenuItem label="About Us" iconLeft={<Info size={18} />} />
      </nav>

      {/* Footer */}
      <div className="py-3 border-t border-white/10 text-center text-xs text-gray-400">
        © 2025 ARC Studio
      </div>

      {/* Slide Panel for options */}
      {openPanel && (
        <OptionPanel
          title={openPanel}
          options={FILTERS.find((f) => f.title === openPanel)?.options ?? []}
          onBack={() => setOpenPanel(null)}
          onSelect={(value) => handleSelect(openPanel, value)}
        />
      )}
    </div>
  );
}

/* ----------------------------- Menu item component ---------------------------- */
function MenuItem({ label, iconLeft, iconRight, highlight, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-[12px] px-5 py-3 transition text-left ${
        highlight ? "bg-[#fe8c31] text-white shadow-md" : "hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        {iconLeft}
        <span>{label}</span>
      </div>
      {iconRight}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-white/10 my-2" />;
}

/* ----------------------------- Slide-out Option Panel ---------------------------- */
function OptionPanel({
  title,
  options,
  onBack,
  onSelect,
}: {
  title: string;
  options: string[];
  onBack: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="absolute top-0 left-[300px] h-full w-[260px] bg-black text-white shadow-lg z-50">
      <div className="flex items-center justify-between bg-[#fe8c31] h-12 px-4">
        <p className="font-semibold">{title}</p>
        <button onClick={onBack}>✕</button>
      </div>
      <ul className="p-3 space-y-2">
        {options.map((opt) => (
          <li
            key={opt}
            onClick={() => onSelect(opt)}
            className="cursor-pointer py-2 px-3 border-b border-white/10 hover:bg-[#1e1e1e] rounded-md"
          >
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}
