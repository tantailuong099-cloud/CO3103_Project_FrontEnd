"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

function useActiveBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width };
}

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
  const { width } = useActiveBreakpoint();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(SORT_OPTIONS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div ref={dropdownRef} className="relative text-left">
      <div className="flex items-center gap-[10px]">
        {/* Label */}
        <p className="text-[14px] font-medium text-white whitespace-nowrap">
          Sorted by
        </p>

        {/* Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-black pl-[10px] pr-[20px] py-[10px] rounded-[15px]
                     text-white text-[14px] font-medium hover:bg-[#1e1e1e] transition-colors "
        >
          <span className="whitespace-nowrap">{selected}</span>
          <Image
            src="/icon/arrow.svg"
            alt="arrow"
            width={10}
            height={6}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-[200px] bg-[#121212] border border-gray-700 rounded-[10px] shadow-lg z-50">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-2 text-[14px] rounded-[10px] transition-colors
                ${
                  option === selected
                    ? "bg-[#fa4d38] text-white"
                    : "text-[#bababa] hover:bg-[#1e1e1e] hover:text-white"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
