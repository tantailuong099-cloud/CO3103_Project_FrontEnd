"use client";

import React, { useEffect, useState } from "react";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
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

  const renderStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    const currentStyle =
      statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStyle} capitalize`}
      >
        {status}
      </span>
    );
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    // 1. Xác nhận người dùng trước khi xóa
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác."
    );
    if (!isConfirmed) return;

    try {
      // 2. Gọi API xóa
      const response = await fetch(`http://localhost:4000/api/order/${id}`, {
        method: "DELETE",
        credentials: "include", // Quan trọng: Gửi kèm cookie/session nếu backend yêu cầu auth
      });

      if (!response.ok) {
        throw new Error("Xóa đơn hàng thất bại");
      }

      // 3. Cập nhật UI ngay lập tức (Xóa item khỏi mảng state)
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));

      // Thông báo nhỏ (Option)
      alert("Đã xóa thành công!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/order", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Thông tin khách</th>
              <th className="px-6 py-4 w-[30%]">Danh sách sản phẩm</th>
              <th className="px-6 py-4">Thanh toán</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Ngày đặt</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const { time, date } = formatDate(order.createdAt);

              return (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Mã đơn */}
                  <td className="px-6 py-4 align-top">
                    <span className="font-bold text-blue-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>

                  {/* Thông tin khách */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1 text-sm">
                      {order.user ? (
                        <>
                          <div>
                            <span className="font-semibold text-gray-900">
                              Họ tên:
                            </span>{" "}
                            {order.user.name}
                          </div>
                          <div className="text-gray-500">
                            <span className="font-semibold text-gray-700">
                              Email:
                            </span>{" "}
                            {order.user.email}
                          </div>
                          {order.user.phone && (
                            <div className="text-gray-500">
                              <span className="font-semibold text-gray-700">
                                SĐT:
                              </span>{" "}
                              {order.user.phone}
                            </div>
                          )}
                          {order.shippingAddress && (
                            <div className="text-gray-500 mt-1 italic text-xs">
                              <span className="not-italic font-semibold text-gray-700">
                                Đ/C:
                              </span>{" "}
                              {order.shippingAddress}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">
                          Khách vãng lai / Đã xóa
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Sản phẩm */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-3">
                      {order.productDetailList?.map((product, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={
                                product.avatar ||
                                "https://via.placeholder.com/60"
                              }
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/60?text=No+Img")
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-gray-900 truncate"
                              title={product.name}
                            >
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {product.quantity} x{" "}
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Thanh toán */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </div>
                      {order.paymentMethod && (
                        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                          {order.paymentMethod}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 align-top text-center">
                    {renderStatusBadge(order.status)}
                  </td>

                  {/* Ngày đặt */}
                  <td className="px-6 py-4 align-top text-center">
                    <div className="font-bold text-gray-900 text-sm">
                      {time}
                    </div>
                    <div className="text-xs text-gray-500">{date}</div>
                  </td>

                  {/* Hành động - Chỉ còn nút Xóa */}
                  <td className="px-6 py-4 align-top text-center">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="group p-2 rounded-md border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200 shadow-sm"
                      title="Xóa đơn hàng"
                    >
                      {/* Trash Icon SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
