"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import UserTable from "./UsersList";
import { api } from "@/app/services/api";

export default function UsersPage() {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filters: FilterItem[] = [
    {
      type: "select",
      queryKey: "status",
      options: [
        { label: "Trạng Thái", value: "" },
        { label: "Hoạt Động", value: "active" },
        { label: "Tạm Dừng", value: "inactive" },
      ],
    },
    {
      type: "date-range",
      queryKeyFrom: "startDate",
      queryKeyTo: "endDate",
    },
  ];

  // Xử lý hành động từ AppliedBar
  const handleApplyAction = async (action: string) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một người dùng!");
      return;
    }

    // Vì AppliedBar giờ chỉ có 'delete', ta tập trung xử lý nó
    if (action === "delete") {
      const confirm = window.confirm(
        `CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} người dùng đã chọn?`
      );
      if (!confirm) return;

      try {
        await Promise.all(
          selectedIds.map((id) => api.del(`/api/users/deleted/${id}`))
        );

        alert("Đã xóa các người dùng được chọn!");
        setSelectedIds([]);
        setRefreshTrigger((prev) => prev + 1);
        router.refresh();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa người dùng!");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Quản lý Người Dùng
      </h1>

      <FilterSection filters={filters} />

      <AppliedBar
        linktocreate="/admin/users/create"
        onApplyAction={handleApplyAction} // Truyền hàm xử lý xuống
        trigger={1}
      />

      <UserTable
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
