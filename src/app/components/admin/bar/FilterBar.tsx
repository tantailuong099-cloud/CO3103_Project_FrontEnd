"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/* ---------------------------------- TYPES ---------------------------------- */

export type FiltersState = {
  type?: string[];
  platform?: string[];
  player?: string;
  age?: string;
};

type FilterCategory = {
  title: string;
  options?: string[];
  type?: "select" | "input";
};

export default function FilterDropdown({
  onApply,
}: {
  onApply: (filters: FiltersState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterCategories: FilterCategory[] = [
    {
      title: "Type",
      options: ["All", "Digital", "Physical"],
      type: "select",
    },
    {
      title: "Platform",
      options: ["All", "Nintendo", "PS5", "Xbox"],
      type: "select",
    },
    { title: "Player", type: "input" },
    { title: "Age", type: "input" },
  ];

  /* ----------------------------- OUTSIDE CLICK ----------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------------- HANDLERS -------------------------------- */
  const toggleOption = (category: string, option: string) => {
    setFilters((prev) => {
      const key = category.toLowerCase() as keyof FiltersState;

      if (option === "All") {
        return { ...prev, [key]: [] };
      }

      const current = (prev[key] as string[]) || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];

      return { ...prev, [key]: updated };
    });
  };

  const handleInputChange = (category: string, value: string) => {
    const key = category.toLowerCase() as keyof FiltersState;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setFilters({});

  const handleApply = () => {
    onApply(filters);
    setOpen(false);
  };

  /* ------------------------------- RENDER -------------------------------- */
  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[15px] font-medium
          ${open ? "bg-black text-white" : "bg-[#fa4d38] text-white"}`}
      >
        <Image src="/icon/filter.png" alt="Filter" width={18} height={18} />
        <span>Filter</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[500px] bg-[#121212] border border-gray-700 rounded-xl p-5">
          <div className="flex flex-col gap-5">
            {filterCategories.map((category) =>
              category.type === "input" ? (
                <div key={category.title} className="flex items-center">
                  <p className="w-[100px] text-white">{category.title}:</p>
                  <input
                    type="number"
                    className="bg-[#1e1e1e] text-white px-3 py-2 rounded-md"
                    value={(filters[category.title.toLowerCase() as keyof FiltersState] as string) || ""}
                    onChange={(e) =>
                      handleInputChange(category.title, e.target.value)
                    }
                  />
                </div>
              ) : (
                <div key={category.title} className="flex gap-2 flex-wrap">
                  <p className="w-[100px] text-white">{category.title}:</p>
                  {category.options?.map((opt) => {
                    const key = category.title.toLowerCase() as keyof FiltersState;
                    const selected = (filters[key] as string[])?.includes(opt);

                    return (
                      <button
                        key={opt}
                        onClick={() => toggleOption(category.title, opt)}
                        className={`px-3 py-1 rounded-md border
                          ${selected ? "bg-[#fa4d38] text-white" : "text-gray-400 border-gray-600"}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button onClick={handleReset} className="px-4 py-2 bg-gray-700 rounded">
              Reset
            </button>
            <button onClick={handleApply} className="px-4 py-2 bg-[#fa4d38] rounded">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
