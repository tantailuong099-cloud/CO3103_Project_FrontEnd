"use client";

import AddressBox from "@/app/components/pages/checkout/AddressBox";
import OrderSummary from "@/app/components/pages/checkout/OrderSummary";
import PaymentMethods from "@/app/components/pages/checkout/PaymentMethods";
import AddressModal from "@/app/components/pages/checkout/AddressModal";
import { useEffect, useState } from "react";
import { AddressFormValues } from "@/app/components/pages/checkout/AddressForm";
import { api } from "@/app/services/api";

type UserDTO = {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address?: string; // ✅ Single string
};

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [address, setAddress] = useState<AddressFormValues | null>(null);
  const [openAddress, setOpenAddress] = useState(false);

  // ✅ Load checkout items
  useEffect(() => {
    const stored = localStorage.getItem("CHECKOUT_ITEMS");
    if (stored) setCheckoutItems(JSON.parse(stored));
  }, []);

    useEffect(() => {
      const loadUser = async () => {
        try {
          const user = await api.get<UserDTO>("/api/users/me");

          const fromDb: AddressFormValues = {
            name: user.name || "",
            phone: user.phoneNumber || "",
            email: user.email || "",
            address: user.address || "",
          };

          // 🔥 If there is a temp checkout address → use that instead
          const stored = localStorage.getItem("CHECKOUT_ADDRESS");
          const fromLocal = stored ? (JSON.parse(stored) as AddressFormValues) : null;

          setAddress(fromLocal ?? fromDb); // ✅ priority: temp edited > DB

          if (
            !(fromLocal?.phone || fromDb.phone) ||
            !(fromLocal?.address || fromDb.address)
          ) {
            setOpenAddress(true);
          } else {
            setOpenAddress(false);
          }
        } catch (err) {
          console.error("❌ Load user failed:", err);
        }
      };

      loadUser();
    }, []);


  // ✅ Totals calculation
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
        {/* ✅ Address always visible */}
        {address && (
          <AddressBox
            address={address}
            onEdit={() => setOpenAddress(true)} // ✅ always editable
          />
        )}

        <OrderSummary items={checkoutItems} />
      </div>

      <div className="w-full lg:w-[420px]">
        <PaymentMethods totals={totals} address={address} />
      </div>

      {/* ✅ Address Modal */}
      {openAddress && address && (
        <AddressModal
          initial={address}
          onClose={() => {
            // ❌ Prevent close if address empty
            if (!(address.phone) || !(address.address) ) {
              alert("⚠️ Please enter a valid phone number and address.");
              return;
            }
            setOpenAddress(false);
          }}
          onSave={(updated) => {
            setAddress(updated);
            setOpenAddress(false);
            localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(updated));
            console.log("✅ Checkout address saved:", updated);
          }}
        />
      )}
    </div>
  );
}
