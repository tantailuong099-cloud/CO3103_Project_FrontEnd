"use client";

import Image from "next/image";
import { formatVND } from "@/app/hook/money";

export type OrderItem = {
  id: number;
  title: string;
  image: string;
  platform: "PS5" | "Nintendo Switch 2" | "XBOX" | "PC";
  version: string;
  price: number;           // base price
  discount?: number | null; // dollar amount off
  quantity: number;
  isDigital: boolean;
};



export default function OrderItemRow({ item }: { item: OrderItem }) {
  const finalUnit = Math.max(0, item.price - (item.discount ?? 0));
  const subtotal = finalUnit * item.quantity;

  return (
    <div className="bg-[#1e1e1e] rounded-[10px] p-4 w-full">
      <div className="flex gap-4">
        
        {/* Image */}
        <div className="relative w-[110px] h-[150px] rounded-md overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="110px"
          />
        </div>

        {/* Middle */}
        <div className="flex-1">
          <p className="text-white text-base font-semibold line-clamp-2">
            {item.title}
          </p>

          <div className="mt-2 inline-flex items-center gap-2">
            <span className="bg-[#fa4d38] text-white text-xs px-2 py-1 rounded">
              {item.platform}
            </span>
            <div className="bg-black text-[#dedddd] text-sm px-3 py-2 rounded-[10px] inline-flex items-center gap-2">
              <span className="font-medium">{item.version}</span>
            </div>
          </div>

          {/* Price small (mobile) */}
          <div className="mt-3 flex gap-2 items-end lg:hidden">
            {item.discount ? (
              <>
                <span className="text-[#bababa] line-through text-sm">
                  {formatVND(item.price)}
                </span>
                <span className="text-white text-base font-semibold">
                  {formatVND(finalUnit)}
                </span>
              </>
            ) : (
              <span className="text-white text-base font-semibold">
                {formatVND(item.price)}
              </span>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Price (desktop) */}
          <div className="hidden lg:flex items-baseline gap-2">
            {item.discount ? (
              <>
                <span className="text-[#bababa] line-through text-sm">
                  {formatVND(item.price)}
                </span>
                <span className="text-white text-lg font-semibold">
                  {formatVND(finalUnit)}
                </span>
              </>
            ) : (
              <span className="text-white text-lg font-semibold">
                {formatVND(item.price)}
              </span>
            )}
          </div>

          {/* Quantity Display */}
          <div className="mt-1 text-[#bababa] text-sm">
            Qty: <span className="text-white font-medium">{item.quantity}</span>
          </div>

          {/* Subtotal */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[#bababa] text-sm">Subtotal:</span>
            <span className="text-white text-lg font-semibold">
              {formatVND(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
