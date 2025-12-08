"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export type SortValue =
  | "relevant"
  | "newest"
  | "oldest"
  | "priceLow"
  | "priceHigh";

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: "Most relevant", value: "relevant" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "priceLow" },
  { label: "Price: High to Low", value: "priceHigh" },
];

type SortedByProps = {
  value: SortValue;
  onChange: (val: SortValue) => void;
};

export default function SortedBy({ value, onChange }: SortedByProps) {
  const [open, setOpen] = useState(false);
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

  const handleSelect = (val: SortValue) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel =
    SORT_OPTIONS.find((opt) => opt.value === value)?.label ??
    SORT_OPTIONS[0].label;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <p className="text-[14px] font-medium text-white whitespace-nowrap">
          Sorted by
        </p>

        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2
            bg-black px-4 py-2 rounded-xl
            text-white text-[14px] font-medium
            border border-transparent
            hover:bg-[#1e1e1e] transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa4d38]
          "
        >
          <span className="truncate">{selectedLabel}</span>
          <Image
            src="/icon/arrow.svg"
            alt="arrow"
            width={10}
            height={6}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-[220px]
            bg-[#121212] border border-gray-700 rounded-xl shadow-lg
            overflow-hidden z-40
          "
        >
          {SORT_OPTIONS.map((option, i) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full text-left px-4 py-2 text-[14px]
                transition-colors duration-150
                ${
                  option.value === value
                    ? "bg-[#fa4d38] text-white"
                    : "text-[#bababa] hover:bg-[#1e1e1e] hover:text-white"
                }
                ${i === 0 ? "rounded-t-xl" : ""}
                ${i === SORT_OPTIONS.length - 1 ? "rounded-b-xl" : ""}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
