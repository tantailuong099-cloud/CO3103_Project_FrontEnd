"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, Trash2, RefreshCcw } from "lucide-react"; // Thêm icon loading
import { api } from "@/app/services/api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface CategoryTableProps {
  pathAdmin: string;
  // ❌ Đã xóa categoryList khỏi props
}

export default function CategoryTable({ pathAdmin }: CategoryTableProps) {
  // 1. State lưu danh sách category lấy từ API
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  // 2. State quản lý trạng thái loading dữ liệu
  const [fetching, setFetching] = useState(true);

  // State checkbox & loading khi xóa
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  // Helper format ngày
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // --- 3. HÀM GỌI API LẤY DANH SÁCH ---
  const fetchCategories = async () => {
    try {
      setFetching(true);
      // Gọi API GET /categories (Dựa trên Controller bạn cung cấp)
      // Lưu ý: Nếu file api.ts đã config base URL, bạn chỉ cần để '/categories' hoặc '/api/categories' tùy cấu hình prefix
      const data = await api.get<Category[]>("/api/categories");

      // Nếu API trả về dạng { data: [...] } thì sửa thành data.data
      setCategoryList(data);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setFetching(false);
    }
  };

  // --- 4. USE EFFECT: CHẠY 1 LẦN KHI MOUNT ---
  useEffect(() => {
    fetchCategories();
  }, []);

  // --- HÀM XÓA ---
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này?"
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await api.del(`/api/categories/${id}`); // Gọi API xóa

      alert("Xóa thành công!");

      // Sau khi xóa thành công, gọi lại API để cập nhật bảng
      fetchCategories();

      // Hoặc xóa nóng trên state để đỡ gọi API lại (Optimistic UI):
      // setCategoryList(prev => prev.filter(item => item._id !== id));
    } catch (error: any) {
      console.error("Lỗi khi xóa:", error);
      alert(error.message || "Xóa thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === categoryList.length) {
      setSelected([]);
    } else {
      setSelected(categoryList.map((item) => item._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // --- HIỂN THỊ LOADING KHI ĐANG TẢI DỮ LIỆU ---
  if (fetching) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
        <RefreshCcw className="w-8 h-8 animate-spin mb-2 text-blue-500" />
        <p>Đang tải dữ liệu danh mục...</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-[15px] overflow-x-auto">
      <div className="rounded-[14px] border border-[#B9B9B9] bg-white overflow-hidden shadow-sm">
        <table className="w-full min-w-[1000px]">
          {/* --- HEADER --- */}
          <thead className="bg-gray-100">
            <tr className="bg-[#FCFDFD] bg-gray-100">
              <th className="border-b border-[#D5D5D5] p-[14px] text-center w-[50px]">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  checked={
                    categoryList.length > 0 &&
                    selected.length === categoryList.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="border-b border-[#D5D5D5] p-[14px] text-left font-sans font-bold text-[14px] text-[#333] uppercase w-[200px]">
                Tên danh mục
              </th>
              <th className="border-b border-[#D5D5D5] p-[14px] text-left font-sans font-bold text-[14px] text-[#333] uppercase">
                Mô tả
              </th>
              <th className="border-b border-[#D5D5D5] p-[14px] text-left font-sans font-bold text-[14px] text-[#333] uppercase w-[180px]">
                Tạo bởi
              </th>
              <th className="border-b border-[#D5D5D5] p-[14px] text-left font-sans font-bold text-[14px] text-[#333] uppercase w-[180px]">
                Cập nhật bởi
              </th>
              <th className="border-b border-[#D5D5D5] p-[14px] text-center font-sans font-bold text-[14px] text-[#333] uppercase w-[140px]">
                Hành động
              </th>
            </tr>
          </thead>

          {/* --- BODY --- */}
          <tbody>
            {categoryList.map((item) => (
              <tr
                key={item._id}
                className="border-b border-[#D5D5D5] last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td className="p-[8px_14px] text-center bg-white">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={selected.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                  />
                </td>
                <td className="p-[8px_14px] bg-white">
                  <div className="font-[600] text-[14px] text-[#333]">
                    {item.name}
                  </div>
                </td>
                <td className="p-[8px_14px] bg-white">
                  <div
                    className="text-[14px] text-gray-600 line-clamp-2"
                    title={item.description}
                  >
                    {item.description || "---"}
                  </div>
                </td>
                <td className="p-[8px_14px] bg-white">
                  <div className="font-[600] text-[14px] text-[#333]">
                    {item.createdBy}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1">
                    {formatDate(item.createdAt)}
                  </div>
                </td>
                <td className="p-[8px_14px] bg-white">
                  <div className="font-[600] text-[14px] text-[#333]">
                    {item.updatedBy}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1">
                    {formatDate(item.updatedAt)}
                  </div>
                </td>

                <td className="p-[8px_14px] text-center bg-white">
                  <div className="inline-flex items-center bg-[#FAFBFD] border border-[#D5D5D5] rounded-[8px] overflow-hidden">
                    <Link
                      href={`/${pathAdmin}/categories/edit/${item._id}`}
                      className="flex items-center justify-center px-[16.5px] py-[8.5px] border-r border-[#D5D5D5] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={15} />
                    </Link>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center justify-center px-[16.5px] py-[8.5px] text-[#EF3826] hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Xóa"
                      disabled={deleting}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {categoryList.length === 0 && !fetching && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500 bg-white"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
