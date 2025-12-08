"use client";

import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar";
import { useState } from "react";

export default function orders() {
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [price, setPrice] = useState("");

  const filters: FilterItem[] = [
    {
      type: "select",
      value: status,
      onChange: setStatus,
      options: [
        { label: "Trạng thái", value: "" },
        { label: "Pending", value: "Pending" },
        { label: "Paid", value: "Paid" },
        { label: "Cancelled", value: "Cancelled" },
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
      value: paymentMethod,
      onChange: setPaymentMethod,
      options: [
        { label: "Phương Thức Thanh Toán", value: "" },
        { label: "Zalo Pay", value: "zlp" },
        { label: "Ví MoMo", value: "momo" },
      ],
    },

  ];

  const handleReset = () => {
    setStatus("");
    setCreator("");
    setDateRange({ startDate: "", endDate: "" });
  };
  return (
    <>
      <div className="p-6">
        <h1 className="text-black mb-[30px] font-[700] text-[32px]">
          Quản lý Sản Phẩm
        </h1>
        <FilterSection filters={filters} onReset={handleReset} />
        <AppliedBar linktocreate="/admin/products/create" />
        {/* Nội dung trang */}
      </div>
    </>
  );
}
