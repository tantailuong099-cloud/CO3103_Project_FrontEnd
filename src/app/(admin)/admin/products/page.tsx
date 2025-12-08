"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar"; // Đã sửa lại đường dẫn gọn hơn
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import ProductList from "./ProductList";
import { api } from "@/app/services/api";

export default function ProductsPage() {
  const router = useRouter();

  // 1. Quản lý trạng thái Selection và Reload
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 2. Cấu hình bộ lọc
  const filters: FilterItem[] = [
    {
      type: "select",
      queryKey: "type",
      options: [
        { label: "Phân Loại", value: "" },
        { label: "Digital", value: "digital" },
        { label: "Physical", value: "physical" },
      ],
    },
    {
      type: "date-range",
      queryKeyFrom: "startDate",
      queryKeyTo: "endDate",
    },
    {
      type: "select",
      queryKey: "category",
      options: [
        { label: "Danh Mục", value: "" },
        { label: "Action", value: "action" },
        { label: "RPG", value: "rpg" },
        { label: "Adventure", value: "adventure" },
      ],
    },
    {
      type: "select",
      queryKey: "priceRange",
      options: [
        { label: "Mức Giá", value: "" },
        { label: "Dưới 1 triệu", value: "under_1m" },
        { label: "1 - 2 triệu", value: "1m_2m" },
        { label: "Trên 2 triệu", value: "above_2m" },
      ],
    },
  ];

  // 3. Xử lý hành động từ AppliedBar
  const handleApplyAction = async (action: string) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    // Chỉ xử lý hành động xóa
    if (action === "delete") {
      const confirm = window.confirm(
        `CẢNH BÁO: Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn vào thùng rác?`
      );
      if (!confirm) return;

      try {
        // Gọi API Soft Delete (Patch) cho từng sản phẩm
        await Promise.all(
          selectedIds.map((id) => api.patch(`/api/product/deleted/${id}`))
        );

        alert("Đã chuyển các sản phẩm đã chọn vào thùng rác!");
        setSelectedIds([]); // Reset selection
        setRefreshTrigger((prev) => prev + 1); // Trigger reload table
        router.refresh();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Quản lý Sản Phẩm
      </h1>

      <FilterSection filters={filters} />

      <AppliedBar
        linktocreate="/admin/products/create"
        onApplyAction={handleApplyAction}
        // trigger={0} // Mặc định hiển thị nút Thùng rác
      />

      <ProductList
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
  