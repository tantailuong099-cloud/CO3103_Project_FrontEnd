"use client";

import { useState } from "react";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import ProductList from "./TrashList";

export default function Products() {
  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">Thùng Rác</h1>
      <AppliedBar linktocreate="/admin/products/create" trigger={2} />
      {/* Nội dung trang */}
      <ProductList
        onEdit={(tour) => alert(`Edit: ${tour.name}`)}
        onDelete={(tour) => alert(`Delete: ${tour.name}`)}
      />
    </div>
  );
}
