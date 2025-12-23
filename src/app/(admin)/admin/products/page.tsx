"use client";

import { useState, useEffect } from "react"; // 1. Import useEffect
import { useRouter } from "next/navigation";
import FilterSection, {
  FilterItem,
} from "@/app/components/admin/bar/FilterBar";
import AppliedBar from "@/app/components/admin/bar/AppliedBar";
import ProductList from "./ProductList";
import { api } from "@/app/services/api";

// Định nghĩa interface cho Category
interface Category {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const router = useRouter();

  // 1. Quản lý trạng thái Selection, Reload và Danh mục
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([
    { label: "Danh Mục", value: "" }, // Giá trị mặc định
  ]);

  // 2. Call API lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Thay đổi URL nếu cần thiết, ở đây dùng endpoint bạn cung cấp
        const data = await api.get<Category[]>("/api/categories");

        // Map dữ liệu từ API sang định dạng cho FilterItem
        const formattedCategories = data.map((cat) => ({
          label: cat.name,
          value: cat._id, // Sử dụng ID để lọc chính xác
        }));

        // Cập nhật state với option mặc định ở đầu
        setCategoryOptions([
          { label: "Danh Mục", value: "" },
          ...formattedCategories,
        ]);
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 3. Cấu hình bộ lọc (Sử dụng dữ liệu từ categoryOptions)
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
      options: categoryOptions, // Dữ liệu động từ API
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

  // 4. Xử lý hành động từ AppliedBar
  const handleApplyAction = async (action: string) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    if (action === "delete") {
      const confirm = window.confirm(
        `CẢNH BÁO: Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn vào thùng rác?`
      );
      if (!confirm) return;

      try {
        await Promise.all(
          selectedIds.map((id) => api.patch(`/api/product/deleted/${id}`))
        );

        alert("Đã chuyển các sản phẩm đã chọn vào thùng rác!");
        setSelectedIds([]);
        setRefreshTrigger((prev) => prev + 1);
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
      />

      <ProductList
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
