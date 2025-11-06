"use client";
import { useRouter } from "next/navigation";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export type SummaryInput = {
  digitalSubtotal: number;
  physicalSubtotal: number;
};

export default function CartSummary({
  digitalSubtotal,
  physicalSubtotal,
}: SummaryInput) {
  const router = useRouter(); // ✅ moved inside component

  const itemsSubtotal = digitalSubtotal + physicalSubtotal;
  const arcDiscount = itemsSubtotal >= 120 ? 10 : 0;
  const total = Math.max(0, itemsSubtotal - arcDiscount);

  return (
    <aside className="bg-white text-black rounded-[10px] p-6 w-full lg:w-[420px] h-fit ">
      <div className="border-b border-[#e5e5e5] pb-2 mb-2">
        <h3 className="text-lg font-semibold text-neutral-900">
          Order Summary
        </h3>
      </div>

      <div className="space-y-2 text-sm text-neutral-700">
        <div className="flex justify-between">
          <span>Digital items Subtotal</span>
          <span className="font-medium text-neutral-900">
            {money(digitalSubtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Physical items Subtotal</span>
          <span className="font-medium text-neutral-900">
            {money(physicalSubtotal)}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-neutral-700">
        <div className="flex justify-between">
          <span>ARC Discount</span>
          <span className="font-medium text-neutral-900">
            {arcDiscount > 0 ? `-${money(arcDiscount)}` : money(0)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">Total</span>
          <span className="text-xl font-bold text-neutral-900">
            {money(total)}
          </span>
        </div>
      </div>

      <button
        className="mt-4 w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-[12px] font-medium transition"
        onClick={() => router.push("/checkout")}
      >
        Continue Payment
      </button>

      <p className="mt-2 text-xs text-neutral-500">
        Taxes and shipping calculated at checkout.
      </p>
    </aside>
  );
}
