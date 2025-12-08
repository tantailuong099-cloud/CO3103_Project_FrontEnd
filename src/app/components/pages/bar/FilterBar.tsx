"use client";

import React from "react";
import { FaFilter, FaRotateLeft } from "react-icons/fa6";
import { useQueryFilters } from "@/app/hook/useQueryFilters";

export type FilterType = "select" | "date-range";

export interface BaseFilter {
  type: FilterType;
}

export interface SelectFilter extends BaseFilter {
  type: "select";
  queryKey: string;
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
}

export interface DateRangeFilter extends BaseFilter {
  type: "date-range";
  queryKeyFrom: string;
  queryKeyTo: string;
}

export type FilterItem = SelectFilter | DateRangeFilter;

interface ClientFilterSectionProps {
  filters: FilterItem[];
}

const ClientFilterSection: React.FC<ClientFilterSectionProps> = ({
  filters,
}) => {
  const { getFilter, setFilters } = useQueryFilters();

  const handleReset = () => {
    const updates: Record<string, null> = {};
    filters.forEach((f) => {
      if (f.type === "select") updates[f.queryKey] = null;
      if (f.type === "date-range") {
        updates[f.queryKeyFrom] = null;
        updates[f.queryKeyTo] = null;
      }
    });
    setFilters(updates);
  };

  return (
    <div className="mb-6">
      <div className="inline-flex flex-wrap bg-black border border-gray-800 rounded-xl overflow-hidden items-stretch text-white">

        {/* TITLE */}
        <div className="flex items-center gap-3 px-5 py-3 font-bold text-sm border-r border-gray-800">
          <FaFilter className="text-white" /> Bộ lọc
        </div>

        {/* FILTER ITEMS */}
        {filters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-5 py-3 border-r border-gray-800"
          >
            {/* SELECT */}
            {filter.type === "select" && (
              <select
                className="bg-black text-white outline-none text-sm font-semibold cursor-pointer"
                value={getFilter(filter.queryKey) || ""}
                onChange={(e) =>
                  setFilters({ [filter.queryKey]: e.target.value })
                }
              >
                {filter.options.map((opt, i) => (
                  <option
                    key={i}
                    value={opt.value}
                    className="bg-black text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* DATE RANGE */}
            {filter.type === "date-range" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={getFilter(filter.queryKeyFrom)}
                  onChange={(e) =>
                    setFilters({ [filter.queryKeyFrom]: e.target.value })
                  }
                  className="bg-black text-white outline-none text-sm cursor-pointer"
                />
                <span className="text-white">-</span>
                <input
                  type="date"
                  value={getFilter(filter.queryKeyTo)}
                  onChange={(e) =>
                    setFilters({ [filter.queryKeyTo]: e.target.value })
                  }
                  className="bg-black text-white outline-none text-sm cursor-pointer"
                />
              </div>
            )}
          </div>
        ))}

        {/* RESET */}
        <div
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-3 font-semibold text-white cursor-pointer hover:bg-white/10 transition"
        >
          <FaRotateLeft className="text-white" /> Reset
        </div>
      </div>
    </div>
  );
};

export default ClientFilterSection;
