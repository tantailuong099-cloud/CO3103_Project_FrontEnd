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

  const totals = items.reduce((acc, it) => {
    const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
    return acc + finalUnit * it.quantity;
  }, 0);

  // Only allow cancel on these statuses
  const canCancel = status === "pending" || status === "paid";

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setLoading(true);
      await api.post(`/api/order/cancel/${orderId}`);
      alert("✅ Order cancelled successfully");

      onCancelled?.(); //  refresh parent data
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
        {shippingAddress ? (
          <span>{shippingAddress}</span>
        ) : (
          <span className="text-[#777]">No shipping address</span>
        )}
      </div>

      {/* Order Status */}
      <div className="text-sm text-[#cdcdcd]">
        <p className="text-white font-semibold mb-1">Order Status</p>
        <span className="capitalize">{status}</span>
      </div>

      {/*Cancel Button */}

      {/* Items */}
      <div className="space-y-4 max-h-[60vh] overflow-auto pr-1">
        {items.map((it) => {
          const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
          return (
            <div key={it.orderItemId} className="flex gap-3 items-center">
              <div className="relative w-[55px] h-[75px] rounded-md overflow-hidden shrink-0">
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
                  {it.platform} • Version {it.version}
                </p>
                <p className="text-[#9d9d9d] text-xs">Qty: {it.quantity}</p>
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
        <span className="text-[#bdbdbd]">Total</span>
        <span className="text-white text-xl font-bold">
          {money(totals)}
        </span>
      </div>
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 transition text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
}
