"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const SORT_OPTIONS = [
  "Most relevant",
  "Newest",
  "Oldest",
  "Highest rating",
  "Lowest rating",
  "Price: Low to High",
  "Price: High to Low",
];

export default function SortedBy() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(SORT_OPTIONS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    console.log("Sorting by:", option);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Label + Button */}
      <div className="flex items-center gap-2">
        <p className="text-[14px] font-medium text-white whitespace-nowrap">
          Sorted by
        </p>

        <button
          onClick={() => setOpen(!open)}
          className={`
            flex items-center gap-2
            bg-black px-4 py-2 rounded-xl
            text-white text-[14px] font-medium
            border border-transparent
            hover:bg-[#1e1e1e] transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa4d38]
          `}
        >
          <span className="truncate">{selected}</span>
          <Image
            src="/icon/arrow.svg"
            alt="arrow"
            width={10}
            height={6}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-[200px]
            bg-[#121212] border border-gray-700 rounded-xl shadow-lg
            overflow-hidden z-50
            animate-in fade-in slide-in-from-top-1 duration-150
          "
        >
          {SORT_OPTIONS.map((option, i) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`
                w-full text-left px-4 py-2 text-[14px]
                transition-colors duration-150
                ${
                  option === selected
                    ? "bg-[#fa4d38] text-white"
                    : "text-[#bababa] hover:bg-[#1e1e1e] hover:text-white"
                }
                ${i === 0 ? "rounded-t-xl" : ""}
                ${i === SORT_OPTIONS.length - 1 ? "rounded-b-xl" : ""}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
