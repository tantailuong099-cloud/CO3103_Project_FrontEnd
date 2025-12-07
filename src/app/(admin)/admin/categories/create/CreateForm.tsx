"use client";
import React, { useState } from "react";
import { api } from "@/app/services/api"; // Đảm bảo đường dẫn đúng
import { useRouter } from "next/navigation";

export default function CreateCategoryForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Gửi dữ liệu dạng JSON (Vì chỉ có text, không có file)
      // Nếu Backend của bạn bắt buộc dùng FormData ngay cả khi không có file, hãy comment dòng này và mở dòng FormData bên dưới
      await api.post("/api/categories", form);

      /* 
      // -- Nếu Backend bắt buộc FormData --
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      await api.post("/api/categories", formData);
      */

      setMessage("✅ Tạo danh mục thành công!");

      // Reset form
      setForm({
        name: "",
        description: "",
      });

      // 2. Chuyển hướng về trang danh sách danh mục
      // Đợi 1 chút để user thấy thông báo thành công (tùy chọn)
      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh(); // Refresh để đảm bảo list cập nhật data mới
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Lỗi khi tạo danh mục: " + (err.message || "Lỗi server"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-10 max-w-4xl mx-auto shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Hàng 1: Tên danh mục */}
        <div>
          <label className="font-semibold text-gray-600 block mb-2">
            Tên Danh Mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ví dụ: Laptop Gaming, Phụ kiện..."
            className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        {/* Hàng 2: Mô tả */}
        <div>
          <label className="font-semibold text-gray-600 block mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-4 h-40 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Nhập mô tả về danh mục này..."
          />
        </div>

        {/* Nút Submit */}
        <div className="text-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-10 py-3 text-white font-bold rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang xử lý..." : "Tạo mới"}
          </button>

          {/* Thông báo lỗi/thành công */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-medium ${
                message.includes("✅")
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
