"use client";

import { useEffect, useMemo, useState } from "react";
import OrderHistoryCard from "@/app/components/pages/order/OrderHistoryCard";
import OrderHistoryDetailPanel from "@/app/components/pages/order/OrderHistoryPanel";
import { api } from "@/app/services/api";
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
type OrderDTO = {
  _id: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress?: string;
  paymentMethod?: string;
};

type ProductDTO = {
  _id: string;
  name: string;
  avatar: string;
  platform: string;
  version: string;
  price: number;
  discount?: number;
  type: "DIGITAL" | "PHYSICAL";
};

type OrderItemView = {
  orderItemId: string;
  title: string;
  image: string;
  platform: string;
  version: string;
  quantity: number;
  price: number;
  discount?: number;
  isDigital: boolean;
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [orderItemsMap, setOrderItemsMap] = useState<Record<string, OrderItemView[]>>({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await api.get<OrderDTO[]>("/api/order/my");
      setOrders(orders);

      const map: Record<string, OrderItemView[]> = {};

      for (const order of orders) {
        const detailedItems: OrderItemView[] = [];

        for (const it of order.items) {
          const product = await api.get<ProductDTO>(`/api/product/${it.productId}`);

          detailedItems.push({
            orderItemId: it.productId,
            title: product.name,
            image: product.avatar,
            platform: product.platform,
            version: product.version,
            quantity: it.quantity,
            price: product.price,
            discount: product.discount,
            isDigital: product.type === "DIGITAL",
          });
        }

        map[order._id] = detailedItems;
      }

      setOrderItemsMap(map);
      if (orders.length > 0) setSelected(orders[0]._id);
    };

    loadOrders();
  }, []);
  const selectedOrder = orders.find((o) => o._id === selected);
  return (
    <div className="flex gap-6 px-6 py-10">
      {/* LEFT */}
      <div className="flex-1 space-y-4">
        {orders.map((o) => (
          <OrderHistoryCard
            key={o._id}
            orderId={o._id}
            date="--"
            items={orderItemsMap[o._id] || []}
            status={o.status}
            onSelect={setSelected}
          />
        ))}
      </div>
      
      {/* RIGHT */}
      <div className="w-[400px] shrink-0">
        {selected && orderItemsMap[selected] ? (
          <OrderHistoryDetailPanel
            orderId={selected}
            items={orderItemsMap[selected]}
            shippingAddress={selectedOrder.shippingAddress}
            status={selectedOrder?.status}
          />
        ) : (
          <div className="text-[#6f6f6f] text-sm pt-16">
            Select an order →
          </div>
        )}
      </div>
    </div>
  );
}
