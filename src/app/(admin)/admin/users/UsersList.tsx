"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit3, Trash2, RefreshCcw, AlertCircle } from "lucide-react";
import { api } from "@/app/services/api";
import Link from "next/link";

// 1. Định nghĩa kiểu dữ liệu User dựa trên Schema của bạn
// (Cần đảm bảo khớp với dữ liệu backend trả về)
export interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

export default function UserTable() {
  // State lưu danh sách user
  const [userList, setUserList] = useState<User[]>([]);

  // State quản lý loading và lỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State checkbox
  const [selected, setSelected] = useState<string[]>([]);

  // --- 2. HÀM GỌI API LẤY DANH SÁCH ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi đúng API bạn yêu cầu: /api/users/user
      const data = await api.get<User[]>("/api/users/user");

      // Kiểm tra nếu API trả về dạng { data: [...] } thì lấy data.data
      const usersData = Array.isArray(data) ? data : (data as any).data || [];

      setUserList(usersData);
    } catch (err: any) {
      console.error("Lỗi tải danh sách khách hàng:", err);
      setError(err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Xử lý Checkbox ---
  const toggleSelectAll = () => {
    if (selected.length === userList.length) {
      setSelected([]);
    } else {
      setSelected(userList.map((user) => user._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // --- Render Loading ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <RefreshCcw className="w-8 h-8 animate-spin mb-2 text-blue-500" />
        <p>Đang tải danh sách khách hàng...</p>
      </div>
    );
  }

  // --- Render Error ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 bg-red-50 text-red-600 rounded-xl border border-red-200">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-2 text-sm underline font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mb-[15px] overflow-x-auto">
      <div className="rounded-[14px] border border-[#B9B9B9] bg-white overflow-hidden shadow-sm min-w-[1141px]">
        <table className="w-full text-left border-collapse">
          {/* --- HEADER (Đã chỉnh font đẹp) --- */}
          <thead>
            <tr className="bg-[#FCFDFD]">
              <th className="border-b border-[#D5D5D5] p-[14px] text-center w-[50px]">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  checked={
                    userList.length > 0 && selected.length === userList.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase">
                Họ tên
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase text-center w-[120px]">
                Ảnh đại diện
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase">
                Email
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase">
                Số điện thoại
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase w-[250px]">
                Địa chỉ
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase text-center w-[150px]">
                Trạng thái
              </th>

              <th className="border-b border-[#D5D5D5] p-[14px] font-sans font-bold text-[14px] text-[#333] uppercase text-center w-[140px]">
                Hành động
              </th>
            </tr>
          </thead>

          {/* --- BODY --- */}
          <tbody>
            {userList.map((user) => (
              <tr
                key={user._id}
                className="border-b border-[#D5D5D5] last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                {/* Checkbox */}
                <td className="p-[8px_14px] text-center bg-white">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={selected.includes(user._id)}
                    onChange={() => toggleSelect(user._id)}
                  />
                </td>

                {/* Họ tên */}
                <td className="p-[8px_14px] font-sans font-medium text-[14px] text-[#333] bg-white">
                  {user.name}
                </td>

                {/* Avatar */}
                <td className="p-[8px_14px] bg-white">
                  <div className="relative w-[50px] h-[50px] mx-auto">
                    <Image
                      src={user.avatar || "/placeholder.png"} // Fallback ảnh nếu null
                      alt={user.name}
                      fill
                      className="rounded-[6px] object-cover border border-gray-200"
                      unoptimized // Dùng nếu ảnh từ nguồn ngoài chưa config domain
                    />
                  </div>
                </td>

                {/* Email */}
                <td className="p-[8px_14px] font-sans font-medium text-[14px] text-[#333] bg-white">
                  {user.email}
                </td>

                {/* Phone */}
                <td className="p-[8px_14px] font-sans font-medium text-[14px] text-[#333] bg-white">
                  {user.phone || "---"}
                </td>

                {/* Address */}
                <td className="p-[8px_14px] font-sans font-normal text-[14px] text-gray-600 bg-white">
                  {user.address || "---"}
                </td>

                {/* Status */}
                <td className="p-[8px_14px] text-center bg-white">
                  {user.status === "active" ? (
                    <span className="inline-block px-3 py-1 rounded-[6px] text-xs font-bold text-green-700 bg-green-100 border border-green-200">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-[6px] text-xs font-bold text-red-700 bg-red-100 border border-red-200">
                      Dừng hoạt động
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-[8px_14px] text-center bg-white">
                  <div className="inline-flex items-center bg-[#FAFBFD] border border-[#D5D5D5] rounded-[8px] overflow-hidden">
                    <Link
                      href={`/admin/users/edit/${user._id}`}
                      className="flex items-center justify-center px-[12px] py-[8px] border-r border-[#D5D5D5] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button className="flex items-center justify-center px-[12px] py-[8px] text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {userList.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
