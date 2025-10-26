"use client";

import Image from "next/image";

export type CartItem = {
  id: number;
  title: string;
  image: string;
  platform: "PS5" | "Nintendo Switch 2" | "XBOX" | "PC";
  version: string;
  price: number;          // base price
  discount?: number | null; // numeric amount off (e.g. 3 -> $3 off)
  quantity: number;
  isDigital: boolean;
  selected: boolean;
};

export type CartItemProps = {
  item: CartItem;
  onToggle: (id: number) => void;
  onQty: (id: number, qty: number) => void;
  onDelete: (id: number) => void;
};

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function CartItemRow({
  item,
  onToggle,
  onQty,
  onDelete,
}: CartItemProps) {
  const finalUnit = Math.max(0, item.price - (item.discount ?? 0));
  const rowSubtotal = finalUnit * item.quantity;

  return (
    <div className="bg-[#1e1e1e] rounded-[10px] p-4 w-full">
      <div className="flex gap-4">
        {/* Select */}
        <label className="mt-1 inline-flex items-center">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => onToggle(item.id)}
            className="size-[18px] accent-[#fe8c31]"
          />
        </label>

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

        {/* Middle: title, platform, version */}
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
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className="opacity-70"
              >
                <path
                  d="M9 1L5 5L1 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Price small stack (mobile) */}
          <div className="mt-2 flex gap-2 items-end lg:hidden">
            {item.discount ? (
              <>
                <span className="text-[#bababa] line-through text-sm">
                  {money(item.price)}
                </span>
                <span className="text-white text-base font-semibold">
                  {money(finalUnit)}
                </span>
              </>
            ) : (
              <span className="text-white text-base font-semibold">
                {money(item.price)}
              </span>
            )}
          </div>
        </div>

        {/* Right side: price, qty, delete, subtotal */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Price big (desktop) */}
          <div className="hidden lg:flex items-baseline gap-2">
            {item.discount ? (
              <>
                <span className="text-[#bababa] line-through text-sm">
                  {money(item.price)}
                </span>
                <span className="text-white text-lg font-semibold">
                  {money(finalUnit)}
                </span>
              </>
            ) : (
              <span className="text-white text-lg font-semibold">
                {money(item.price)}
              </span>
            )}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onQty(item.id, Math.max(1, item.quantity - 1))}
              className="size-[30px] rounded-lg border border-[#3a3a3a] text-white hover:bg-[#242424] transition"
              aria-label="Decrease quantity"
              title="Decrease"
            >
              −
            </button>
            <div className="size-[30px] rounded-lg bg-white text-black grid place-items-center font-medium min-w-[38px]">
              {item.quantity}
            </div>
            <button
              onClick={() => onQty(item.id, Math.min(99, item.quantity + 1))}
              className="size-[30px] rounded-lg border border-[#3a3a3a] text-white hover:bg-[#242424] transition"
              aria-label="Increase quantity"
              title="Increase"
            >
              +
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() => onDelete(item.id)}
            className="text-[#bababa] text-sm hover:text-white transition mt-2"
          >
            Delete
          </button>

          {/* Subtotal */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[#bababa] text-sm">Subtotal:</span>
            <span className="text-white text-lg font-semibold">
              {money(rowSubtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
