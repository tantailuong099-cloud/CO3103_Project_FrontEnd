"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import OrderTable from "./OrderTable";
import { api } from "@/app/services/api";

export default function OrdersPage() {
  const router = useRouter();

  // 1. Quản lý trạng thái Selection và Reload
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 2. Cấu hình bộ lọc
  const filters: FilterItem[] = [
    {
      type: "select",
      queryKey: "status",
      options: [
        { label: "Trạng thái", value: "" },
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      type: "date-range",
      queryKeyFrom: "startDate",
      queryKeyTo: "endDate",
    },
    {
      type: "select",
      queryKey: "paymentMethod",
      options: [
        { label: "Phương Thức Thanh Toán", value: "" },
        { label: "Zalo Pay", value: "zalopay" },
        { label: "Ví MoMo", value: "momo" },
        { label: "COD", value: "cod" },
      ],
    },
  ];

  // 3. Xử lý hành động từ AppliedBar (Chỉ xử lý Xóa)
  const handleApplyAction = async (action: string) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng!");
      return;
    }

    // Chỉ xử lý hành động 'delete' vì AppliedBar đã bỏ các option khác
    if (action === "delete") {
      const confirm = window.confirm(
        `CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn ${selectedIds.length} đơn hàng đã chọn?`
      );
      if (!confirm) return;

      try {
        // Gọi API xóa
        await Promise.all(selectedIds.map((id) => api.del(`/api/order/${id}`)));

        alert("Đã xóa các đơn hàng được chọn!");
        setSelectedIds([]); // Reset selection
        setRefreshTrigger((prev) => prev + 1); // Trigger reload table
        router.refresh();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa đơn hàng!");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Quản lý Đơn Hàng
      </h1>

      <FilterSection filters={filters} />

      <AppliedBar
        linktocreate="/admin/orders/create"
        onApplyAction={handleApplyAction} // Truyền hàm xử lý xuống Component con
        // Nếu muốn ẩn nút "Thùng rác", bạn có thể thêm prop: trigger={1}
        trigger={3}
      />

      <OrderTable
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
