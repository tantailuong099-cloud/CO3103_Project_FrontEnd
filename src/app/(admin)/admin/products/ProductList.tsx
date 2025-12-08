"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit3, Trash2, RefreshCcw, AlertCircle, Tv } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  category: string; // ID category
  type: GameType;
  version: string;
  price: number;
  stock: number;
  metacriticScore: number;
  ignScore: number;
  createdBy: string;
  updatedBy: string;
  deleted: boolean;
  // ... các field khác
}

// Cập nhật Props để nhận state từ cha
interface ProductTableProps {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  refreshTrigger: number;
}

export default function ProductList({
  selectedIds,
  setSelectedIds,
  refreshTrigger,
}: ProductTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook lấy params từ URL

  const [allProducts, setAllProducts] = useState<Product[]>([]); // Dữ liệu gốc
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Dữ liệu sau khi lọc
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Format Helpers ---
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "";

  // --- 1. Fetch All Products ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Product[] | { data: Product[] }>(
        "/api/product"
      );
      const productsData = Array.isArray(data)
        ? data
        : (data as any).data || [];

      // Chỉ lấy sản phẩm chưa xóa
      const activeProducts = productsData.filter((p: Product) => !p.deleted);
      setAllProducts(activeProducts);
      setDisplayedProducts(activeProducts); // Mặc định hiển thị hết
    } catch (err: any) {
      console.error("Lỗi fetch:", err);
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetch khi mount hoặc khi cha yêu cầu refresh (sau khi xóa)
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  // --- 2. Filter Logic (Client-side) ---
  // Mỗi khi URL params hoặc allProducts thay đổi, tính toán lại displayedProducts
  useEffect(() => {
    if (allProducts.length === 0) return;

    let result = [...allProducts];

    // Lấy params
    const type = searchParams.get("type");
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category"); // Đây có thể là ID category
    const priceRange = searchParams.get("priceRange");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Lọc theo Type (Digital/Physical)
    if (type) {
      result = result.filter(
        (p) => p.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Lọc theo Keyword (Tên)
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(lowerKeyword)
      );
    }

    // Lọc theo Category
    if (category) {
      // Cần đảm bảo p.category khớp với value trong options (thường là ID)
      // Nếu trong data p.category là object populate thì dùng p.category._id
      result = result.filter((p) => p.category === category);
    }

    // Lọc theo Price Range
    if (priceRange) {
      if (priceRange === "under_1m") {
        result = result.filter((p) => p.price < 1000000);
      } else if (priceRange === "1m_2m") {
        result = result.filter((p) => p.price >= 1000000 && p.price <= 2000000);
      } else if (priceRange === "above_2m") {
        result = result.filter((p) => p.price > 2000000);
      }
    }

    // Lọc theo Date Range (Release Date hoặc CreatedAt)
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      result = result.filter((p) => {
        const pDate = new Date(p.releaseDate).getTime();
        return pDate >= start && pDate <= end;
      });
    }

    setDisplayedProducts(result);
  }, [searchParams, allProducts]);

  // --- Handlers ---
  const toggleSelectAll = () => {
    if (selectedIds.length === displayedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedProducts.map((t) => t._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSingle = async (product: Product) => {
    if (!confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    try {
      await api.patch(`/api/product/deleted/${product._id}`);
      // Optimistic update
      setAllProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (e) {
      alert("Xóa thất bại");
    }
  };

  // --- Render ---
  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        <RefreshCcw className="animate-spin inline mr-2" /> Đang tải...
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

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
                    displayedProducts.length > 0 &&
                    selectedIds.length === displayedProducts.length
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </th>
              <th className="p-4 w-[280px]">Thông tin Game</th>
              <th className="p-4">Phân loại & NSX</th>
              <th className="p-4">Giá & Kho</th>
              <th className="p-4">Đánh giá</th>
              <th className="p-4">Người tạo</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayedProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product._id)}
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
                        className="object-cover rounded-lg border border-gray-200"
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
                      <span className="text-gray-500 text-xs px-2 py-0.5 border border-gray-200 rounded bg-gray-50 mt-1 inline-block">
                        v{product.version}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {product.type === GameType.PHYSICAL ? (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-medium w-fit">
                        <Tv size={12} /> Physical
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-[11px] font-medium w-fit">
                        <Tv size={12} /> Digital
                      </span>
                    )}
                    <span className="text-gray-400 text-xs">
                      {formatDate(product.releaseDate)}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  <div className="font-bold text-gray-900">
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
                            : "bg-yellow-500"
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

                <td className="p-4 text-xs text-gray-600">
                  <div className="truncate w-24">{product.createdBy}</div>
                </td>

                <td className="p-4 text-center">
                  <div className="inline-flex border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition border-r border-gray-200"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteSingle(product)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {displayedProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Không tìm thấy sản phẩm phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
