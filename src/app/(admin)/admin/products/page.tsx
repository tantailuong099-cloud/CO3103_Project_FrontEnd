"use client";

import { useState } from "react";
import FilterSection, {
  FilterItem,
} from "../../../components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import ProductList, { product } from "./ProductList";

export default function Products() {
  const [status, setStatus] = useState("");
  const [creator, setCreator] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

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
    {
      type: "select",
      value: category,
      onChange: setCategory,
      options: [
        { label: "Danh Mục", value: "" },
        { label: "Action", value: "action" },
      ],
    },
    {
      type: "select",
      value: price,
      onChange: setPrice,
      options: [
        { label: "Mức Giá", value: "" },
        { label: "Dưới 2tr", value: "<2tr" },
      ],
    },
  ];

  const SampleProduct: product[] = [
    {
      id: "1",
      name: "Tour Hạ Long",
      image: "/assets/images/tour-1.jpg",
      price: { NL: 1900000, TE: 1600000, EB: 1000000 },
      remain: { NL: 30, TE: 20, EB: 10 },
      position: 1,
      status: "active",
      createdBy: "Lê Văn A",
      createdAt: "16:30 - 20/10/2024",
      updatedBy: "Lê Văn A",
      updatedAt: "16:30 - 20/10/2024",
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
        Quản lý Sản Phẩm
      </h1>
      <FilterSection filters={filters} onReset={handleReset} />
      <AppliedBar linktocreate="/admin/products/create" />
      {/* Nội dung trang */}
      <ProductList
        products={SampleProduct}
        onEdit={(tour) => alert(`Edit: ${tour.name}`)}
        onDelete={(tour) => alert(`Delete: ${tour.name}`)}
      />
    </div>
  );
}
