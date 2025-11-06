"use client";

import { useState } from "react";
import OrderHistoryCard from "@/app/components/pages/order/OrderHistoryCard";
import OrderHistoryDetailPanel from "@/app/components/pages/order/OrderHistoryPanel";
import { makeMockProducts } from "@/app/components/mockup/product";
import { makeMockOrderItems } from "@/app/components/mockup/orderItem";

export default function OrderHistoryPage() {
  // ✅ Generate mock orders here
  const products = makeMockProducts(12, { seed: 5 });

  const mockOrders = [
    {
      orderId: "A12345",
      date: "14 May, 2025",
      items: makeMockOrderItems(4, products, 42),
    },
    {
      orderId: "B54421",
      date: "20 May, 2025",
      items: makeMockOrderItems(3, products, 11),
    },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex gap-6 px-6 py-10">
      {/* LEFT LIST */}
      <div className="flex-1 space-y-4">
        {mockOrders.map((o) => (
          <OrderHistoryCard
            key={o.orderId}
            orderId={o.orderId}
            date={o.date}
            items={o.items}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* RIGHT DETAIL VIEW */}
      <div className="w-[400px] shrink-0">
        {selected ? (
          <OrderHistoryDetailPanel
            orderId={selected}
            items={mockOrders.find((o) => o.orderId === selected)!.items}
          />
        ) : (
          <div className="text-[#6f6f6f] text-sm pt-16">
            Select an order to view details →
          </div>
        )}
      </div>
    </div>
  );
}