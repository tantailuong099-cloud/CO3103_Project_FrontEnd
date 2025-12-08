"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import CategoryTable from "./CategoryList"; // Đảm bảo filename là CategoryList.tsx
import { api } from "@/app/services/api";

// Interface cho Admin User dùng trong bộ lọc
interface AdminUser {
  _id: string;
  name: string;
}

export default function CategoriesPage() {
  const router = useRouter();

  // 1. State quản lý Selection và Reload
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State cho options bộ lọc
  const [creatorOptions, setCreatorOptions] = useState([
    { label: "Người tạo", value: "" },
  ]);

  // 2. Lấy danh sách Admin để đổ vào bộ lọc
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await api.get<AdminUser[]>("/api/users/admin"); // Check lại route API lấy admin của bạn
        if (Array.isArray(data)) {
          const options = data.map((user) => ({
            label: user.name,
            value: user.name, // Lưu ý: Lọc theo tên hoặc ID tùy DB của bạn
          }));
          setCreatorOptions([{ label: "Người tạo", value: "" }, ...options]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách admin:", error);
      }
    };
    fetchAdmins();
  }, []);

  // 3. Cấu hình bộ lọc
  const filters: FilterItem[] = [
    {
      type: "select",
      queryKey: "creator",
      options: creatorOptions,
    },
    {
      type: "date-range",
      queryKeyFrom: "startDate",
      queryKeyTo: "endDate",
    },
  ];

  // 4. Xử lý hành động từ AppliedBar (Chỉ Xóa)
  const handleApplyAction = async (action: string) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục!");
      return;
    }

    if (action === "delete") {
      const confirm = window.confirm(
        `CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn ${selectedIds.length} danh mục đã chọn?`
      );
      if (!confirm) return;

      try {
        // Gọi API xóa từng item
        await Promise.all(
          selectedIds.map((id) => api.del(`/api/categories/${id}`))
        );

        alert("Đã xóa các danh mục được chọn!");
        setSelectedIds([]); // Reset selection
        setRefreshTrigger((prev) => prev + 1); // Trigger reload table
        router.refresh();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa danh mục!");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Quản lý Danh mục
      </h1>

      <FilterSection filters={filters} />

      <AppliedBar
        linktocreate="/admin/categories/create"
        onApplyAction={handleApplyAction}
        trigger={1} // trigger=1 để ẩn nút Thùng rác nếu không cần, hoặc 0 để hiện
      />

      <CategoryTable
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
