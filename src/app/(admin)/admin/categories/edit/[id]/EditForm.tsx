"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // Lấy ID từ URL

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false); // Loading khi submit
  const [fetching, setFetching] = useState(true); // Loading khi lấy dữ liệu ban đầu
  const [message, setMessage] = useState("");

  // 1. Lấy dữ liệu cũ khi vào trang
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        setFetching(true);
        // Gọi API lấy chi tiết: GET /api/categories/:id
        const data: any = await api.get(`/api/categories/${id}`);

        // Backend có thể trả về trực tiếp object hoặc bọc trong { data: ... }
        // Hãy kiểm tra log nếu dữ liệu không hiện
        const category = data.data || data;

        setForm({
          name: category.name || "",
          description: category.description || "",
        });
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        setMessage("❌ Không thể tải thông tin danh mục.");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý Submit Cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Gọi API Update: PATCH /api/categories/:id
      await api.patch(`/api/categories/${id}`, form);

      setMessage("✅ Cập nhật danh mục thành công!");

      // Chuyển hướng về trang danh sách
      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Lỗi khi cập nhật: " + (err.message || "Lỗi server"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center p-10 text-gray-500">Đang tải dữ liệu...</div>
    );
  }

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

        {/* Nút Action */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {/* Nút Hủy */}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
          >
            Hủy bỏ
          </button>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`px-10 py-3 text-white font-bold rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div
            className={`mt-2 p-3 rounded-lg text-center font-medium ${
              message.includes("✅")
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
