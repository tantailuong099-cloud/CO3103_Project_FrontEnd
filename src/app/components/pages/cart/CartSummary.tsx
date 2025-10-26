"use client";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export type SummaryInput = {
  digitalSubtotal: number;
  physicalSubtotal: number;
  // Optional coupon/discount logic could be extended here.
};

export default function CartSummary({
  digitalSubtotal,
  physicalSubtotal,
}: SummaryInput) {
  const itemsSubtotal = digitalSubtotal + physicalSubtotal;

  // ARC Discount rule (example):
  // -$10 if subtotal >= $120, else -$0
  const arcDiscount = itemsSubtotal >= 120 ? 10 : 0;

  const total = Math.max(0, itemsSubtotal - arcDiscount);

  return (
    <aside className="bg-white text-black rounded-[10px] p-4 w-full lg:w-[420px]">
      <div className="border-b border-[#e5e5e5] pb-2 mb-2">
        <h3 className="text-lg font-semibold text-neutral-900">
          Order Summary
        </h3>
      </div>

      {/* Subtotals */}
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

      {/* Discounts */}
      <div className="mt-3 space-y-1 text-sm text-neutral-700">
        <div className="flex justify-between">
          <span>ARC Discount</span>
          <span className="font-medium text-neutral-900">
            {arcDiscount > 0 ? `-${money(arcDiscount)}` : money(0)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">Total</span>
          <span className="text-xl font-bold text-neutral-900">
            {money(total)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="mt-4 w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-[12px] font-medium transition"
        onClick={() => alert("Proceed to payment")}
      >
        Continue Payment
      </button>

      {/* Small note */}
      <p className="mt-2 text-xs text-neutral-500">
        Taxes and shipping calculated at checkout.
      </p>
    </aside>
  );
}
