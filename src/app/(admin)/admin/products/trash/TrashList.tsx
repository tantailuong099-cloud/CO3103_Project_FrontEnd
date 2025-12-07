"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// 1. Import thêm icon RotateCcw cho nút Restore
import { Trash2, RefreshCcw, AlertCircle, Tv, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";

export enum GameType {
  DIGITAL = "digital",
  PHYSICAL = "physical",
}

export interface Product {
  _id: string;
  name: string;
  avatar: string;
  releaseDate: string;
  category: string;
  type: GameType;
  version: string;
  price: number;
  stock: number;
  description: string;
  metacriticScore: number;
  metacriticURL: string;
  ignScore: number;
  ignURL: string;
  playerNumber: number;
  ageConstraints: number;
  productImage: string[];
  videoLink: string;
  manufactor: string;
  options: string[];
  playmode: string;
  language: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deleted: boolean;
}

interface ProductTableProps {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductList({ onEdit, onDelete }: ProductTableProps) {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Product[] | { data: Product[] }>(
        "/api/product/trash"
      );
      const productsData = Array.isArray(data)
        ? data
        : (data as any).data || [];

      setProductList(productsData);
    } catch (err: any) {
      console.error("Lỗi fetch products:", err);
      const errorMessage = err.message || "";
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("Invalid Credentials")
      ) {
        router.push("/login");
        return;
      }
      setError(errorMessage || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. HÀM KHÔI PHỤC (RESTORE) ---
  const handleRestore = async (product: Product) => {
    const confirmRestore = window.confirm(
      `Bạn có muốn khôi phục sản phẩm "${product.name}"?`
    );
    if (!confirmRestore) return;

    try {
      // Gọi API Restore
      await api.patch(`/api/product/restore/${product._id}`);

      // Cập nhật UI: Loại bỏ sản phẩm khỏi danh sách thùng rác
      setProductList((prevList) =>
        prevList.filter((item) => item._id !== product._id)
      );

      // console.log("Khôi phục thành công:", product.name);
    } catch (err: any) {
      console.error("Lỗi khi khôi phục:", err);
      alert("Khôi phục thất bại: " + (err.message || "Lỗi server"));
    }
  };

  // --- 3. HÀM XÓA VĨNH VIỄN (HARD DELETE) ---
  const handleHardDelete = async (product: Product) => {
    const confirmDelete = window.confirm(
      `CẢNH BÁO: Bạn có chắc chắn muốn xóa VĨNH VIỄN sản phẩm "${product.name}"?\nHành động này KHÔNG THỂ hoàn tác!`
    );
    if (!confirmDelete) return;

    try {
      // Gọi API Hard Delete (Dùng method DELETE)
      // Lưu ý: api.del phải được định nghĩa trong file api wrapper của bạn
      await api.del(`/api/product/deleted/${product._id}`);

      // Cập nhật UI
      setProductList((prevList) =>
        prevList.filter((item) => item._id !== product._id)
      );

      // console.log("Đã xóa vĩnh viễn:", product.name);
    } catch (err: any) {
      console.error("Lỗi khi xóa vĩnh viễn:", err);
      alert("Xóa thất bại: " + (err.message || "Lỗi server"));
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === productList.length) setSelected([]);
    else setSelected(productList.map((t) => t._id));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <RefreshCcw className="animate-spin w-8 h-8 mr-2" /> Đang tải dữ liệu...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-40 bg-red-50 text-red-600 rounded-xl border border-red-200 mb-8">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-2 text-sm underline font-medium hover:text-red-800"
        >
          Thử lại
        </button>
      </div>
    );

  return (
    <div className="w-full overflow-x-auto mb-8 pb-4">
      <div className="rounded-[20px] border border-gray-300 shadow-sm overflow-hidden bg-white">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={
                    productList.length > 0 &&
                    selected.length === productList.length
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </th>
              <th className="p-4 w-[280px]">Thông tin Game</th>
              <th className="p-4">Phân loại & NSX</th>
              <th className="p-4">Giá & Kho</th>
              <th className="p-4">Đánh giá</th>
              <th className="p-4">Quản lý</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {productList.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(product._id)}
                    onChange={() => toggleSelect(product._id)}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </td>

                <td className="p-4 max-w-[280px]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={product.avatar || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg border border-gray-200 shadow-sm"
                        unoptimized
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div
                        className="font-bold text-gray-900 text-sm truncate"
                        title={product.name}
                      >
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-xs px-2 py-0.5 border border-gray-200 rounded bg-gray-50">
                          v{product.version}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {product.type === GameType.PHYSICAL ? (
                        <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-medium w-fit">
                          <Tv size={12} /> Physical
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-[11px] font-medium w-fit">
                          <Tv size={12} /> Digital
                        </span>
                      )}
                    </div>

                    <div className="text-gray-400 text-xs">
                      {formatDate(product.releaseDate)}
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="font-bold text-gray-900 text-base">
                    {formatCurrency(product.price)}
                  </div>
                  <div
                    className={`text-xs mt-1 font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Kho: {product.stock}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase w-8">
                        Meta
                      </span>
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${
                          product.metacriticScore >= 75
                            ? "bg-green-500"
                            : product.metacriticScore >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {product.metacriticScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase w-8">
                        IGN
                      </span>
                      <span className="text-xs font-bold text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded bg-blue-50">
                        {product.ignScore}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 w-8">Tạo:</span>
                      <span className="truncate max-w-[80px]">
                        {product.createdBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-gray-400 w-8">Sửa:</span>
                      <span className="truncate max-w-[80px]">
                        {product.updatedBy}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 4. CẬP NHẬT CỘT HÀNH ĐỘNG */}
                <td className="p-4 text-center">
                  <div className="inline-flex border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
                    {/* Nút KHÔI PHỤC */}
                    <button
                      onClick={() => handleRestore(product)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition border-r border-gray-200"
                      title="Khôi phục"
                    >
                      <RotateCcw size={16} />
                    </button>

                    {/* Nút XÓA VĨNH VIỄN */}
                    <button
                      onClick={() => handleHardDelete(product)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {productList.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  Thùng rác trống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
