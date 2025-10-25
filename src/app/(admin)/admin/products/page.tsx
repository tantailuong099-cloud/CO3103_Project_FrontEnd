"use client";

import { useState } from "react";
import FilterSection, { FilterItem } from "../../../components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";

export default function Products() {
  const [status, setStatus] = useState("");
  const [creator, setCreator] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const filters: FilterItem[] = [
    {
      type: "select",
      value: status,
      onChange: setStatus,
      options: [
        { label: "Trạng thái", value: "" },
        { label: "Hoạt động", value: "active" },
        { label: "Tạm dừng", value: "paused" },
      ],
    },
    {
      type: "select",
      value: creator,
      onChange: setCreator,
      options: [
        { label: "Người tạo", value: "" },
        { label: "Lê Văn A", value: "a" },
        { label: "Lê Văn B", value: "b" },
      ],
    },
    {
      type: "date-range",
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      onChange: setDateRange,
    },
  ];

  const handleReset = () => {
    setStatus("");
    setCreator("");
    setDateRange({ startDate: "", endDate: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">Quản lý Sản Phẩm</h1>
      <FilterSection filters={filters} onReset={handleReset} />
      <AppliedBar linktocreate="/admin/products/create"/>
      {/* Nội dung trang */}
    </div>
  );
}
