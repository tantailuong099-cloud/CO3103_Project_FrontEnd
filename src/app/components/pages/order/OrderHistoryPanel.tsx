"use client";

import Image from "next/image";
import { OrderItemView } from "./order-view.type";
import { api } from "@/app/services/api";
import { useState } from "react";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function OrderHistoryDetailPanel({
  orderId,
  items,
  shippingAddress,
  status,
  onCancelled,
}: {
  orderId: string;
  items: OrderItemView[];
  shippingAddress?: string;
  status: string;
  onCancelled?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const totals = items.reduce((acc, it) => {
    const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
    return acc + finalUnit * it.quantity;
  }, 0);

  // Điều kiện hiển thị nút
  const canCancel = status === "pending" || status === "paid";
  const canPay = status === "pending";

  // ✅ Xử lý thanh toán lại cho đơn hàng Pending
  const handlePay = async () => {
    try {
      setPaying(true);
      const res: any = await api.post("/api/payment/zalopay", { orderId });

      if (res.return_code === 1) {
        window.location.href = res.order_url; // Chuyển hướng sang ZaloPay
      } else {
        alert("ZaloPay Error: " + res.return_message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ✅ Xử lý hủy đơn hàng và thông báo hoàn tiền
  const handleCancel = async () => {
    const confirmMsg =
      status === "paid"
        ? `This order is paid. If you cancel, ${money(
            totals
          )} will be refunded to your account. Proceed?`
        : "Are you sure you want to cancel this order?";

    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await api.post(`/api/order/cancel/${orderId}`);

      // Thông báo đặc biệt nếu đã thanh toán
      if (status === "paid") {
        alert(
          `✅ Order cancelled. Refund of ${money(
            totals
          )} has been processed to your wallet.`
        );
      } else {
        alert("✅ Order cancelled successfully");
      }

      onCancelled?.(); // Refresh lại danh sách
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "❌ Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2e2e2a] rounded-2xl p-5 w-full space-y-5">
      <h2 className="text-white text-lg font-semibold">Order Details</h2>
      <p className="text-[#bdbdbd] text-sm">
        Order ID: <span className="text-[#fe8c31]">{orderId}</span>
      </p>

      {/* Shipping Address */}
      <div className="text-sm text-[#cdcdcd]">
        <p className="text-white font-semibold mb-1">Shipping Address</p>
        <span>{shippingAddress || "No shipping address"}</span>
      </div>

      {/* Order Status */}
      <div className="text-sm text-[#cdcdcd]">
        <p className="text-white font-semibold mb-1">Order Status</p>
        <span
          className={`capitalize font-medium ${
            status === "cancelled" ? "text-red-500" : "text-green-500"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-4 max-h-[40vh] overflow-auto pr-1">
        {items.map((it) => {
          const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
          return (
            <div key={it.orderItemId} className="flex gap-3 items-center">
              <div className="relative w-[50px] h-[70px] rounded-md overflow-hidden shrink-0">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="text-white line-clamp-1 font-medium">
                  {it.title}
                </p>
                <p className="text-[#9d9d9d] text-xs">
                  Qty: {it.quantity} • {money(finalUnit)}
                </p>
              </div>
              <p className="text-white font-semibold text-sm">
                {money(finalUnit * it.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="pt-3 border-t border-[#2a2a2a] flex justify-between items-center">
        <span className="text-[#bdbdbd]">Total Amount</span>
        <span className="text-white text-xl font-bold">{money(totals)}</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {canPay && (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-[#fe8c31] hover:bg-[#ff9d4f] disabled:opacity-50 transition text-white py-3 rounded-xl font-bold"
          >
            {paying ? "Processing..." : "PAY NOW"}
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 transition py-2 rounded-xl font-semibold"
          >
            {loading ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
}
