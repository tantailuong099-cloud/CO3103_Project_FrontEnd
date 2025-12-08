"use client";

import { FaFilter, FaRotateLeft } from "react-icons/fa6";
import React from "react";

// 🧩 Interface cho từng loại filter
export type FilterType = "select" | "date-range";

export interface BaseFilter {
  type: FilterType;
}

export interface SelectFilter extends BaseFilter {
  type: "select";
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange?: (value: string) => void;
}

export interface DateRangeFilter extends BaseFilter {
  type: "date-range";
  startDate: string;
  endDate: string;
  onChange?: (range: { startDate: string; endDate: string }) => void;
}

export type FilterItem = SelectFilter | DateRangeFilter;

interface FilterSectionProps {
  filters: FilterItem[];
  onReset?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onReset }) => {
  return (
    <div className="mb-[15px]">
      {/* ⚙️ Thanh filter co giãn theo nội dung */}
      <div className="inline-flex flex-wrap bg-white border border-[#D5D5D5] rounded-[14px] overflow-hidden items-stretch">
        {/* Label */}
        <div className="flex items-center gap-3 px-6 py-[23.75px] font-bold text-[14px] text-gray-700 border-r border-[#D5D5D5] whitespace-nowrap">
          <FaFilter className="text-[22px]" /> Bộ lọc
        </div>

        {/* Dynamic filters */}
        {filters.map((filter, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-6 py-[23.75px] border-r border-[#D5D5D5] whitespace-nowrap`}
          >
            {filter.type === "select" && (
              <select
                className="font-bold text-[14px] text-gray-700 outline-none cursor-pointer border-0 bg-transparent"
                value={filter.value}
                onChange={(e) => filter.onChange?.(e.target.value)}
              >
                {filter.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {filter.type === "date-range" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) =>
                    filter.onChange?.({
                      startDate: e.target.value,
                      endDate: filter.endDate,
                    })
                  }
                  className="w-[110px] font-bold text-[14px] text-gray-700 border-0 outline-none cursor-pointer bg-transparent"
                />
                <span className="text-black">-</span>
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) =>
                    filter.onChange?.({
                      startDate: filter.startDate,
                      endDate: e.target.value,
                    })
                  }
                  className="w-[110px] font-bold text-[14px] text-gray-700 border-0 outline-none cursor-pointer bg-transparent"
                />
              </div>
            )}
          </div>
        ))}

        {/* Reset button */}
        <div
          className="flex items-center gap-3 px-6 py-[23.75px] font-semibold text-[#EA0234] cursor-pointer hover:bg-red-50 transition-colors whitespace-nowrap"
          onClick={onReset}
        >
          <FaRotateLeft /> Xóa bộ lọc
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
