"use client";

import React from "react";
import { FaFilter, FaRotateLeft } from "react-icons/fa6";
import { useQueryFilters } from "@/app/hook/useQueryFilters";

export type FilterType = "select" | "date-range";

// 1️⃣ SỬA INTERFACE Ở ĐÂY
// BaseFilter chỉ chứa type chung
export interface BaseFilter {
  type: FilterType;
}

// SelectFilter chứa queryKey riêng của nó
export interface SelectFilter extends BaseFilter {
  type: "select";
  queryKey: string; // ✅ Chuyển queryKey vào đây
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
}

// DateRangeFilter không cần queryKey nữa, chỉ cần From và To
export interface DateRangeFilter extends BaseFilter {
  type: "date-range";
  queryKeyFrom: string;
  queryKeyTo: string;
}

// Type Union
export type FilterItem = SelectFilter | DateRangeFilter;

interface FilterSectionProps {
  filters: FilterItem[];
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters }) => {
  const { getFilter, setFilters } = useQueryFilters();

  const handleReset = () => {
    const updates: Record<string, null> = {};
    filters.forEach((f) => {
      // TypeScript sẽ tự hiểu f là SelectFilter khi check type
      if (f.type === "select") {
        updates[f.queryKey] = null;
      }
      // TypeScript sẽ tự hiểu f là DateRangeFilter khi check type
      if (f.type === "date-range") {
        updates[f.queryKeyFrom] = null;
        updates[f.queryKeyTo] = null;
      }
    });
    setFilters(updates);
  };

  return (
    <div className="mb-[15px]">
      <div className="inline-flex flex-wrap bg-white border border-[#D5D5D5] rounded-[14px] overflow-hidden items-stretch">
        <div className="flex items-center gap-3 px-6 py-[23.75px] font-bold text-[14px] text-gray-700 border-r border-[#D5D5D5] whitespace-nowrap">
          <FaFilter className="text-[22px]" /> Bộ lọc
        </div>

        {filters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-[23.75px] border-r border-[#D5D5D5]"
          >
            {/* TypeScript check type="select" -> filter tự động có queryKey */}
            {filter.type === "select" && (
              <select
                className="font-bold text-[14px] text-gray-700 outline-none cursor-pointer border-0 bg-transparent"
                value={getFilter(filter.queryKey) || filter.defaultValue || ""}
                onChange={(e) =>
                  setFilters({ [filter.queryKey]: e.target.value })
                }
              >
                {filter.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* TypeScript check type="date-range" -> filter tự động có queryKeyFrom/To */}
            {filter.type === "date-range" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={getFilter(filter.queryKeyFrom)}
                  onChange={(e) =>
                    setFilters({ [filter.queryKeyFrom]: e.target.value })
                  }
                  className="w-[110px] bg-transparent border-0 outline-none font-bold text-sm"
                />
                <span>-</span>
                <input
                  type="date"
                  value={getFilter(filter.queryKeyTo)}
                  onChange={(e) =>
                    setFilters({ [filter.queryKeyTo]: e.target.value })
                  }
                  className="w-[110px] bg-transparent border-0 outline-none font-bold text-sm"
                />
              </div>
            )}
          </div>
        ))}

        <div
          onClick={handleReset}
          className="flex items-center gap-3 px-6 py-[23.75px] font-semibold text-[#EA0234] cursor-pointer hover:bg-red-50 transition-colors"
        >
          <FaRotateLeft /> Xóa bộ lọc
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
