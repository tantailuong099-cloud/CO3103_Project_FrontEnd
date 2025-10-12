"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type FilterCategory = {
  title: string;
  options?: string[];
  type?: "select" | "input";
};

export default function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[] | string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Category Data ---
  const filterCategories: FilterCategory[] = [
    {
      title: "Platform",
      options: [
        "All type",
        "PlayStation 5",
        "PlayStation 4",
        "Nintendo Switch",
        "Nintendo Switch OLED",
        "Nintendo Switch Lite",
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
        "Casual",
        "Adventure",
        "Arcade",
        "Education",
        "Horror",
        "Open World",
        "Puzzle",
        "Racing",
        "RPG",
        "Strategy",
        "Sports",
        "Shooter",
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
        "Canada",
        "United Kingdom",
        "Others",
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
        "Tencent",
        "Activision",
        "Ubisoft",
        "Konami",
        "Square Enix",
        "miHoYo",
        "Krafton",
        "Others",
      ],
      type: "select",
    },
    {
      title: "Player",
      type: "input", 
    },
    {
      title: "Age",
      type: "input", 
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers ---
  const toggleOption = (category: string, option: string) => {
    setFilters((prev) => {
      const selected = (prev[category] as string[]) || [];
      const newSelected = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option];
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

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Filter Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 pl-[10px] pr-[30px] py-2 rounded-[10px] text-[16px] font-medium transition-colors duration-200
          ${open ? "bg-black text-white" : "bg-[#fa4d38] text-white hover:bg-[#ff5c47]"}`}
      >
        <Image src="/icon/filter.png" alt="Filter" width={18} height={18} />
        <span>Filter</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-screen bg-[#121212] border border-gray-700 rounded-[10px] shadow-lg p-4 z-50">
          <div className="flex flex-col gap-4">
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
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleReset}
              className="bg-[#1e1e1e] px-4 py-2 rounded-md text-sm text-[#bababa] hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="bg-[#fa4d38] px-4 py-2 rounded-md text-sm text-white hover:bg-[#ff624e]"
            >
              Apply filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

type FilterSectionProps = {
  category: FilterCategory;
  filters: Record<string, string[] | string>;
  toggleOption: (category: string, option: string) => void;
};

function FilterSection({ category, filters, toggleOption }: FilterSectionProps) {
  return (
    <div className="flex flex-wrap items-center w-full">
      <p className="font-semibold text-sm text-white w-[130px] shrink-0">
        {category.title}:
      </p>

      <div className="flex flex-wrap gap-3 grow items-start">
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
      className={`px-2 py-1 rounded-md text-sm transition-colors duration-150
        ${selected ? "bg-black text-white" : "text-[#bababa] hover:text-white"}`}
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
      <p className="font-semibold text-sm text-white w-[130px] shrink-0">
        {category.title}:
      </p>
      <input
        type="number"
        min="1"
        placeholder={`Enter ${category.title.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(category.title, e.target.value)}
        className="bg-[#1e1e1e] text-white placeholder:text-[12px] rounded-md px-3 py-2 w-[130px] outline-none focus:ring-2 focus:ring-[#fa4d38] "
      />
    </div>
  );
}
