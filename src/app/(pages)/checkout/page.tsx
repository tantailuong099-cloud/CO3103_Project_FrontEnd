"use client";
import AddressBox from "@/app/components/pages/checkout/AddressBox";
import OrderSummary from "@/app/components/pages/checkout/OrderSummary";
import PaymentMethods from "@/app/components/pages/checkout/PaymentMethods";

import { useEffect, useState } from "react";



export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("CHECKOUT_ITEMS");
    if (stored) {
      setCheckoutItems(JSON.parse(stored));
    }
  }, []); 
  

  const totals = checkoutItems.reduce(
    (acc, it) => {
      const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
      const rowSubtotal = finalUnit * it.quantity;
      acc.subtotal += rowSubtotal;
      acc.discount += (it.discount ?? 0) * it.quantity;
      acc.original += it.price * it.quantity;
      return acc;
    },
    { original: 0, discount: 0, subtotal: 0 }
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-6 py-10 max-w-6xl mx-auto">
      <div className="flex-1 space-y-6">
        <AddressBox
          name="Nguyen Van An"
          phone="091234567"
          email="vanan@gmail.com"
          street="123 ABC street"
          city="HCM City"
        />
        <OrderSummary items={checkoutItems} />
      </div>

      <div className="w-full lg:w-[420px]">
        <PaymentMethods totals={totals} />
      </div>
    </div>
  );
}
