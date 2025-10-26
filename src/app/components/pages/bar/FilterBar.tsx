"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/* ---------------------------------- TYPES ---------------------------------- */

type FilterCategory = {
  title: string;
  options?: string[];
  type?: "select" | "input";
};

type FiltersState = Record<string, string[] | string>;

/* -------------------------------- COMPONENT -------------------------------- */

export default function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Categories ---
  const filterCategories: FilterCategory[] = [
    {
      title: "Platform",
      options: [
        "All type",
        "PlayStation 5",
        "PlayStation 4",
        "Nintendo Switch",
        "Xbox Series X",
        "Xbox Series S",
        "Xbox One",
      ],
      type: "select",
    },
    {
      title: "Genre",
      options: [
        "All type",
        "Action",
        "Adventure",
        "RPG",
        "Strategy",
        "Shooter",
        "Puzzle",
        "Simulation",
      ],
      type: "select",
    },
    {
      title: "Country",
      options: [
        "All type",
        "Japan",
        "United States",
        "China",
        "South Korea",
        "France",
        "United Kingdom",
      ],
      type: "select",
    },
    {
      title: "Manufacturer",
      options: [
        "All type",
        "Nintendo",
        "Sony",
        "Microsoft",
        "Ubisoft",
        "Square Enix",
        "Krafton",
        "Others",
      ],
      type: "select",
    },
    { title: "Player", type: "input" },
    { title: "Age", type: "input" },
  ];

  /* ----------------------------- Outside Click ----------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------------- Handlers -------------------------------- */
  const toggleOption = (category: string, option: string) => {
    setFilters((prev) => {
      const current = (prev[category] as string[]) || [];
      const newSelected = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [category]: newSelected };
    });
  };

  const handleInputChange = (category: string, value: string) => {
    setFilters((prev) => ({ ...prev, [category]: value }));
  };

  const handleReset = () => setFilters({});
  const handleApply = () => {
    console.log("Applied filters:", filters);
    setOpen(false);
  };

  /* ------------------------------- RENDERING ------------------------------- */
  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[15px] font-medium
          transition-all duration-200
          ${open ? "bg-black text-white" : "bg-[#fa4d38] text-white hover:bg-[#ff5c47]"}`}
      >
        <Image src="/icon/filter.png" alt="Filter" width={18} height={18} />
        <span>Filter</span>
        <Image
          src="/icon/arrow.svg"
          alt="arrow"
          width={10}
          height={6}
          className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="mt-4 w-full bg-[#121212] border border-gray-700 rounded-xl shadow-xl p-5 z-10"
        >
          <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {filterCategories.map((category) =>
              category.type === "input" ? (
                <InputRow
                  key={category.title}
                  category={category}
                  value={(filters[category.title] as string) || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <FilterSection
                  key={category.title}
                  category={category}
                  filters={filters}
                  toggleOption={toggleOption}
                />
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 border-t border-gray-700 pt-4">
            <button
              onClick={handleReset}
              className="bg-[#1e1e1e] px-4 py-2 rounded-md text-sm text-[#bababa] hover:bg-gray-700 transition"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="bg-[#fa4d38] px-4 py-2 rounded-md text-sm text-white hover:bg-[#ff624e] transition"
            >
              Apply Filter
            </button>
          
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Helper Components ---------------------------- */

type FilterSectionProps = {
  category: FilterCategory;
  filters: FiltersState;
  toggleOption: (category: string, option: string) => void;
};

function FilterSection({ category, filters, toggleOption }: FilterSectionProps) {
  return (
    <div className="flex flex-wrap items-start w-full">
      <p className="font-semibold text-sm text-white w-[130px] shrink-0">{category.title}:</p>
      <div className="flex flex-wrap gap-2">
        {category.options?.map((option) => {
          const isSelected = (filters[category.title] as string[])?.includes(option);
          return (
            <FilterButton
              key={option}
              label={option}
              selected={isSelected}
              onClick={() => toggleOption(category.title, option)}
            />
          );
        })}
      </div>
    </div>
  );
}

type FilterButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function FilterButton({ label, selected, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm border transition-all duration-150
        ${selected
          ? "bg-[#fa4d38] border-[#fa4d38] text-white"
          : "border-gray-600 text-gray-300 hover:border-[#fa4d38] hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}

type InputRowProps = {
  category: FilterCategory;
  value: string;
  onChange: (category: string, value: string) => void;
};

function InputRow({ category, value, onChange }: InputRowProps) {
  return (
    <div className="flex items-center w-full">
      <p className="font-semibold text-sm text-white w-[130px] shrink-0">{category.title}:</p>
      <input
        type="number"
        min="1"
        placeholder={`Enter ${category.title.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(category.title, e.target.value)}
        className="bg-[#1e1e1e] text-white placeholder:text-gray-500 rounded-md px-3 py-2
                   w-[140px] outline-none focus:ring-2 focus:ring-[#fa4d38] transition"
      />
    </div>
  );
}
