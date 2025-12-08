"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/app/services/api";

// --- Interfaces ---
// Vẫn giữ props để tránh lỗi ở file cha (page.tsx), nhưng không dùng tới trong UI nữa
interface OrderTableProps {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  refreshTrigger: number;
}

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  paymentMethod?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: string;
  productDetailList: any[];
}

export default function OrderTable({
  // Các props này hiện tại không còn tác dụng trong UI vì đã bỏ checkbox
  selectedIds,
  setSelectedIds,
  refreshTrigger,
}: OrderTableProps) {
  const searchParams = useSearchParams();

  // State
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Helper Functions ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return { time: "--:--", date: "--/--/----" };
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  };

  const renderStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    const statusStyles: Record<string, string> = {
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      paid: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    const currentStyle =
      statusStyles[statusLower] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStyle} capitalize`}
      >
        {status}
      </span>
    );
  };

  // --- Fetch Data ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get<Order[] | { data: Order[] }>("/api/order");
      let list: Order[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as any).data)
      ) {
        list = (data as any).data;
      }
      const sortedList = list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAllOrders(sortedList);
      setDisplayedOrders(sortedList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setAllOrders([]);
      setDisplayedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  // --- Filter Logic ---
  useEffect(() => {
    if (!allOrders || allOrders.length === 0) {
      if (displayedOrders.length > 0) setDisplayedOrders([]);
      return;
    }
    let result = [...allOrders];
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");
    const keyword = searchParams.get("keyword");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (status)
      result = result.filter(
        (o) => o.status?.toLowerCase() === status.toLowerCase()
      );
    if (paymentMethod)
      result = result.filter(
        (o) => o.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase()
      );
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter((o) => {
        const idMatch = o._id?.toLowerCase().includes(lowerKeyword);
        const nameMatch = o.user?.name?.toLowerCase().includes(lowerKeyword);
        const emailMatch = o.user?.email?.toLowerCase().includes(lowerKeyword);
        return idMatch || nameMatch || emailMatch;
      });
    }
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const endOfDay = end + 86400000;
      result = result.filter((o) => {
        const orderDate = new Date(o.createdAt).getTime();
        return orderDate >= start && orderDate < endOfDay;
      });
    }
    setDisplayedOrders(result);
  }, [searchParams, allOrders]);

  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-gray-500 animate-pulse">
        Đang tải dữ liệu đơn hàng...
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs border-b border-gray-200">
            <tr>
              {/* ĐÃ XÓA CỘT CHECKBOX */}
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Thông tin khách</th>
              <th className="px-6 py-4 w-[35%]">Sản phẩm</th>
              <th className="px-6 py-4">Thanh toán</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Ngày đặt</th>
              {/* ĐÃ XÓA CỘT HÀNH ĐỘNG */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedOrders.map((order) => {
              const { time, date } = formatDate(order.createdAt);
              return (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* ĐÃ XÓA CELL CHECKBOX */}
                  <td className="px-6 py-4 align-top">
                    <span className="font-bold text-blue-600">
                      #{order._id?.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1 text-sm">
                      {order.user ? (
                        <>
                          <div>
                            <span className="font-bold">{order.user.name}</span>
                          </div>
                          <div className="text-gray-500 text-xs">
                            {order.user.email}
                          </div>
                          {order.shippingAddress && (
                            <div
                              className="text-gray-500 text-xs italic mt-1 truncate max-w-[200px]"
                              title={order.shippingAddress}
                            >
                              {order.shippingAddress}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">
                          Guest / Đã xóa
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-3">
                      {order.productDetailList?.map(
                        (product: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="relative w-16 h-16 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                              <img
                                src={product.avatar || "/placeholder.png"}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.png")
                                }
                              />
                            </div>
                            <div className="flex flex-col justify-center h-16">
                              <p
                                className="font-semibold text-gray-800 text-sm truncate max-w-[200px]"
                                title={product.name}
                              >
                                {product.name}
                              </p>
                              <p className="text-gray-500 text-sm mt-0.5">
                                Số lượng:{" "}
                                <span className="font-bold text-gray-700">
                                  x{product.quantity}
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </div>
                    {order.paymentMethod && (
                      <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {order.paymentMethod}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    <div className="text-sm font-semibold">{time}</div>
                    <div className="text-xs text-gray-500">{date}</div>
                  </td>
                  {/* ĐÃ XÓA CELL HÀNH ĐỘNG */}
                </tr>
              );
            })}
            {displayedOrders.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  Không tìm thấy đơn hàng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
