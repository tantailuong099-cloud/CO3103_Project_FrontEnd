"use client";

import { useState } from "react";
import FilterSection, {
  FilterItem,
} from "../../../components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import UserTable from "./UsersList";

export default function Products() {
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const filters: FilterItem[] = [
    {
      type: "select",
      value: status,
      onChange: setStatus,
      options: [
        { label: "Trạng Thái", value: "" },
        { label: "Hoạt Động", value: "active" },
        { label: "Tạm Dừng", value: "inactive" },
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
    setDateRange({ startDate: "", endDate: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Quản lý Người Dùng
      </h1>
      <FilterSection filters={filters} onReset={handleReset} />
      <AppliedBar linktocreate="/admin/products/create" trigger={2} />
      <UserTable />
    </div>
  );
}
