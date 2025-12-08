"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/app/services/api";
import { Trash2, Phone, MapPin, Mail } from "lucide-react";

// --- Interfaces ---
interface UserTableProps {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  refreshTrigger: number;
}

interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  createdAt?: string; // Thêm field này nếu API có trả về để lọc ngày
}

export default function UserTable({
  selectedIds,
  setSelectedIds,
  refreshTrigger,
}: UserTableProps) {
  const searchParams = useSearchParams();

  // State nội bộ
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Helper Functions ---
  const renderStatusBadge = (status: string) => {
    return status === "active" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        Tạm dừng
      </span>
    );
  };

  // --- 1. Fetch Data ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<User[]>("/api/users/user");

      let list: User[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as any).data)
      ) {
        list = (data as any).data;
      }

      // Sắp xếp (Ví dụ: theo tên, hoặc createdAt nếu có)
      const sortedList = list.reverse(); // Mặc định cái mới nhất lên đầu (giả định API trả về theo thứ tự thêm)

      setAllUsers(sortedList);
      setDisplayedUsers(sortedList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
      setDisplayedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  // --- 2. Filter Logic ---
  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      if (displayedUsers.length > 0) setDisplayedUsers([]);
      return;
    }

    let result = [...allUsers];

    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Lọc Status
    if (status) {
      result = result.filter(
        (u) => u.status?.toLowerCase() === status.toLowerCase()
      );
    }

    // Lọc Keyword (Tên, Email, SĐT)
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter((u) => {
        const nameMatch = u.name?.toLowerCase().includes(lowerKeyword);
        const emailMatch = u.email?.toLowerCase().includes(lowerKeyword);
        const phoneMatch = u.phone?.includes(lowerKeyword);
        return nameMatch || emailMatch || phoneMatch;
      });
    }

    // Lọc Date Range (Nếu User có field createdAt)
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const endOfDay = end + 86400000;

      result = result.filter((u) => {
        if (!u.createdAt) return true; // Giữ lại nếu không có ngày tạo (hoặc false tùy logic)
        const createdDate = new Date(u.createdAt).getTime();
        return createdDate >= start && createdDate < endOfDay;
      });
    }

    setDisplayedUsers(result);
  }, [searchParams, allUsers]);

  // --- Handlers ---
  const handleDeleteSingle = async (id: string) => {
    if (
      !confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này?")
    )
      return;
    try {
      await api.del(`/api/users/deleted/${id}`);
      // Optimistic update
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa người dùng");
    }
  };

  const toggleSelectAll = () => {
    if (
      displayedUsers.length > 0 &&
      selectedIds.length === displayedUsers.length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedUsers.map((u) => u._id));
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
      <div className="w-full h-40 flex items-center justify-center text-gray-500 animate-pulse">
        Đang tải danh sách người dùng...
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={
                    displayedUsers.length > 0 &&
                    selectedIds.length === displayedUsers.length
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 w-[30%]">Người dùng</th>{" "}
              {/* Cột này chứa Avatar + Tên */}
              <th className="px-6 py-4">Thông tin liên hệ</th>
              <th className="px-6 py-4 w-[25%]">Địa chỉ</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user._id)}
                    onChange={() => toggleSelect(user._id)}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </td>

                {/* --- CỘT NGƯỜI DÙNG VỚI ẢNH LỚN --- */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50">
                      <img
                        src={user.avatar || "/placeholder.png"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.png")
                        }
                      />
                    </div>
                    <div className="flex flex-col justify-center h-16">
                      <p
                        className="font-bold text-gray-900 text-sm truncate max-w-[200px]"
                        title={user.name}
                      >
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {user._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={14} className="text-gray-400" />
                      <span
                        className="truncate max-w-[200px]"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={14} className="text-gray-400" />
                      <span>{user.phone || "---"}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    <span
                      className="text-sm text-gray-600 line-clamp-2"
                      title={user.address}
                    >
                      {user.address || "Chưa cập nhật"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 align-middle text-center">
                  {renderStatusBadge(user.status)}
                </td>

                <td className="px-6 py-4 align-middle text-center">
                  <button
                    onClick={() => handleDeleteSingle(user._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition border border-transparent hover:border-red-100"
                    title="Xóa vĩnh viễn"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {displayedUsers.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
