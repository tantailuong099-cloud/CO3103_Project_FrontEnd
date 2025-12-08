"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Edit3, Trash2, RefreshCcw } from "lucide-react";
import { api } from "@/app/services/api";

// --- Interfaces ---
interface CategoryTableProps {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  refreshTrigger: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export default function CategoryTable({
  selectedIds,
  setSelectedIds,
  refreshTrigger,
}: CategoryTableProps) {
  const searchParams = useSearchParams();

  // State nội bộ
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // --- Helper: Format Date ---
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

  // --- 1. Fetch Data (Lấy tất cả) ---
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get<Category[] | { data: Category[] }>(
        "/api/categories"
      );

      let list: Category[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as any).data)
      ) {
        list = (data as any).data;
      }

      // Sắp xếp mới nhất lên đầu
      const sortedList = list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllCategories(sortedList);
      setDisplayedCategories(sortedList);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
      setAllCategories([]);
      setDisplayedCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  // --- 2. Client-side Filter Logic ---
  useEffect(() => {
    if (!allCategories || allCategories.length === 0) {
      if (displayedCategories.length > 0) setDisplayedCategories([]);
      return;
    }

    let result = [...allCategories];

    const keyword = searchParams.get("keyword");
    const creator = searchParams.get("creator");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Lọc theo Keyword (Tên danh mục)
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(lowerKeyword)
      );
    }

    // Lọc theo Creator
    if (creator) {
      result = result.filter(
        (c) => c.createdBy?.toLowerCase() === creator.toLowerCase()
      );
    }

    // Lọc theo Date Range
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const endOfDay = end + 86400000; // Bao gồm cả ngày cuối

      result = result.filter((c) => {
        const createdDate = new Date(c.createdAt).getTime();
        return createdDate >= start && createdDate < endOfDay;
      });
    }

    setDisplayedCategories(result);
  }, [searchParams, allCategories]);

  // --- Handlers ---
  const handleDeleteSingle = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await api.del(`/api/categories/${id}`);
      // Optimistic update
      setAllCategories((prev) => prev.filter((c) => c._id !== id));
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      }
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  const toggleSelectAll = () => {
    if (
      displayedCategories.length > 0 &&
      selectedIds.length === displayedCategories.length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedCategories.map((c) => c._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 animate-pulse">
        <RefreshCcw className="w-8 h-8 animate-spin mb-2 text-blue-500" />
        <p>Đang tải dữ liệu danh mục...</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-[15px] overflow-x-auto">
      <div className="rounded-[14px] border border-[#B9B9B9] bg-white overflow-hidden shadow-sm">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
            <tr className="bg-[#FCFDFD] bg-gray-100 border-b border-[#D5D5D5]">
              <th className="p-[14px] text-center w-[50px]">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
                  checked={
                    displayedCategories.length > 0 &&
                    selectedIds.length === displayedCategories.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-[14px] w-[200px]">Tên danh mục</th>
              <th className="p-[14px]">Mô tả</th>
              <th className="p-[14px] w-[180px]">Tạo bởi</th>
              <th className="p-[14px] w-[180px]">Cập nhật bởi</th>
              <th className="p-[14px] text-center w-[140px]">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayedCategories.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-[14px] text-center bg-white align-middle">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                  />
                </td>

                <td className="p-[14px] bg-white align-top">
                  <div className="font-semibold text-gray-800 text-sm">
                    {item.name}
                  </div>
                </td>

                <td className="p-[14px] bg-white align-top">
                  <div
                    className="text-gray-600 text-sm line-clamp-2"
                    title={item.description}
                  >
                    {item.description || "---"}
                  </div>
                </td>

                <td className="p-[14px] bg-white align-top">
                  <div className="font-medium text-gray-800 text-sm">
                    {item.createdBy}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(item.createdAt)}
                  </div>
                </td>

                <td className="p-[14px] bg-white align-top">
                  <div className="font-medium text-gray-800 text-sm">
                    {item.updatedBy || "---"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(item.updatedAt)}
                  </div>
                </td>

                <td className="p-[14px] text-center bg-white align-middle">
                  <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <Link
                      href={`/admin/categories/edit/${item._id}`}
                      className="p-2 border-r border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteSingle(item._id)}
                      className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                      title="Xóa danh mục"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {displayedCategories.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500 bg-white"
                >
                  Không tìm thấy danh mục phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
