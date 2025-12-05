"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import Link from "next/link";

export interface product {
  id: string;
  name: string;
  image: string;
  price: { NL: number; TE: number; EB: number };
  remain: { NL: number; TE: number; EB: number };
  position: number;
  status: "active" | "inactive";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface productTableProps {
  products: product[];
  onEdit?: (product: product) => void;
  onDelete?: (product: product) => void;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: productTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selected.length === products.length) setSelected([]);
    else setSelected(products.map((t) => t.id));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full overflow-x-auto mb-8">
      <div className="rounded-[20px] border border-gray-300 shadow-sm overflow-hidden">
        <table className="w-full min-w-[1140px] bg-white border border-gray-300 rounded-[20px] shadow-sm">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="p-[14px] text-center font-semibold text-sm uppercase tracking-wide">
                <input
                  type="checkbox"
                  checked={selected.length === products.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-blue-600"
                />
              </th>
              <th className="p-[14px] text-left font-semibold text-sm uppercase tracking-wide">
                Tên sản phẩm
              </th>
              <th className="p-[14px] text-left font-semibold text-sm uppercase tracking-wide">
                Ảnh đại diện
              </th>
              <th className="p-[14px] text-left font-semibold text-sm uppercase tracking-wide">
                Giá
              </th>
              <th className="p-[14px] text-left font-semibold text-sm uppercase tracking-wide">
                Còn lại
              </th>
              <th className="p-[14px] text-center font-semibold text-sm uppercase tracking-wide">
                Vị trí
              </th>
              <th className="p-[14px] text-center font-semibold text-sm uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="p-[14px] text-left font-semibold text-sm uppercase tracking-wide">
                Tạo bởi
              </th>
              <th className="p-[14px] text-left font-semibold text-sm uppercase tracking-wide">
                Cập nhật bởi
              </th>
              <th className="p-[14px] text-center font-semibold text-sm uppercase tracking-wide">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-gray-200 transition-colors"
              >
                <td className="text-center px-[14px] py-[8px]">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>

                <td className="font-medium text-gray-900 px-[14px] py-[8px]">
                  {product.name}
                </td>

                <td className="px-[14px] py-[8px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover shadow-sm"
                  />
                </td>

                <td className="text-gray-800 px-[14px] py-[8px]">
                  <div>NL: {product.price.NL.toLocaleString()}đ</div>
                  <div>TE: {product.price.TE.toLocaleString()}đ</div>
                  <div>EB: {product.price.EB.toLocaleString()}đ</div>
                </td>

                <td className="text-gray-800 px-[14px] py-[8px]">
                  <div>NL: {product.remain.NL}</div>
                  <div>TE: {product.remain.TE}</div>
                  <div>EB: {product.remain.EB}</div>
                </td>

                <td className="text-center px-[14px] py-[8px] font-medium text-gray-800">
                  {product.position}
                </td>

                <td className="text-center px-[14px] py-[8px]">
                  <span
                    className={`px-3 py-1 text-sm rounded-lg font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {product.status === "active" ? "Hoạt động" : "Ngừng"}
                  </span>
                </td>

                <td className="px-[14px] py-[8px] text-gray-800">
                  <div className="font-medium">{product.createdBy}</div>
                  <div className="text-xs text-gray-500">
                    {product.createdAt}
                  </div>
                </td>

                <td className="px-[14px] py-[8px] text-gray-800">
                  <div className="font-medium">{product.updatedBy}</div>
                  <div className="text-xs text-gray-500">
                    {product.updatedAt}
                  </div>
                </td>

                <td className="text-center px-[14px] py-[8px]">
                  <div className="inline-flex border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
                    <Link
                      href={`/products/edit/${product.id}`}
                      className=" flex items-center justify-center text-gray-800 border-r border-gray-300 hover:bg-gray-100 transition px-[16.5px] py-[12.5px]"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={18} />
                    </Link>

                    <Link
                      href={`/products/delete/${product.id}`}
                      className=" flex items-center justify-center text-red-600 hover:bg-gray-100 transition px-[16.5px] py-[12.5px]"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
