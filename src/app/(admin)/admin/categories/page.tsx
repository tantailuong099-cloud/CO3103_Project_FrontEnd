"use client";

import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar";
import CategoryTable, { Category } from "./CategoryList";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import { useState } from "react";

const mockData: Category[] = [
  {
    _id: "654321",
    name: "Laptop Gaming",
    description: "Các dòng laptop cấu hình cao phục vụ chơi game đồ họa nặng.",
    createdBy: "Admin Root",
    createdAt: "2023-11-20T10:00:00.000Z",
    updatedBy: "Manager A",
    updatedAt: "2023-11-21T15:30:00.000Z",
  },
  {
    _id: "123456",
    name: "Phụ kiện",
    description: "Chuột, bàn phím, tai nghe chính hãng.",
    createdBy: "Admin Root",
    createdAt: "2023-10-15T09:00:00.000Z",
    updatedBy: "Admin Root",
    updatedAt: "2023-10-15T09:00:00.000Z",
  },
];

export default function Page() {
  const [status, setStatus] = useState("");
  const [creator, setCreator] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const filters: FilterItem[] = [
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
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Quản lý danh mục
      </h1>
      <FilterSection filters={filters} onReset={handleReset} />
      <AppliedBar linktocreate="/admin/categories/create" trigger={1}/>
      <CategoryTable pathAdmin="admin" />
    </div>
  );
}
