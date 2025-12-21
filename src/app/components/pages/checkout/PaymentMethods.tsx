"use client";
import { useState } from "react";
import Image from "next/image";
import { api } from "@/app/services/api";
import { AddressFormValues } from "@/app/components/pages/checkout/AddressForm";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

type PaymentMethod = "COD" | "ZALOPAY";

export default function PaymentPanel({
  totals,
  address,
}: {
  totals: { original: number; discount: number; subtotal: number };
  address: AddressFormValues | null;
}) {
  const [selected, setSelected] = useState<PaymentMethod>("MOMO");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      if (!address?.address || address.address.trim() === "") {
        alert("⚠️ Please enter shipping address!");
        setLoading(false);
        return;
      }

      if (!selected) {
        alert("⚠️ Please select a payment method before proceeding!");
        setLoading(false);
        return;
      }

      const stored = localStorage.getItem("CHECKOUT_ITEMS");
      if (!stored) {
        alert("⚠️ No items selected for checkout!");
        setLoading(false);
        return;
      }

      const selectedItems = JSON.parse(stored);
      const productIds = selectedItems.map((i: any) => i.id);
      const shippingAddress = address.address;

      // BƯỚC 1: Tạo đơn hàng
      const orderRes: any = await api.post("/api/order/checkout/partial", {
        productIds,
        shippingAddress,
        paymentMethod: selected,
      });

      const orderId = orderRes._id;

      // BƯỚC 2: Xử lý theo phương thức
      if (selected === "ZALOPAY") {
        const paymentRes: any = await api.post("/api/payment/zalopay", {
          orderId: orderId,
        });

        if (paymentRes.return_code === 1) {
          localStorage.removeItem("CHECKOUT_ITEMS");
          localStorage.removeItem("CHECKOUT_ADDRESS");
          window.location.href = paymentRes.order_url;
        } else {
          alert("ZaloPay Error: " + paymentRes.return_message);
        }
      } else {
        // ✅ NẾU LÀ THANH TOÁN SAU (COD)
        console.log("✅ Order created with COD:", orderId);
        localStorage.removeItem("CHECKOUT_ITEMS");
        localStorage.removeItem("CHECKOUT_ADDRESS");
        setShowSuccess(true); // Chỉ hiện Modal thành công, không redirect
      }
    } catch (err: any) {
      console.error("❌ Checkout error:", err);
      alert(`Checkout failed: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const baseBtn =
    "w-full py-3 px-4 rounded-xl border bg-[#1c1c1c] text-[#e5e5e5] transition flex items-center justify-between";
  const leftWrap = "flex items-center gap-3";

  return (
    <>
      <div className="bg-[#141414] rounded-2xl border border-[#2a2a2a] p-5 space-y-6">
        {/* Totals */}
        <div className="bg-[#1b1b1b] border border-[#2a2a2a] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-[#bdbdbd]">
            <span>Items total</span>
            <span className="text-white">{money(totals.original)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#bdbdbd]">Discount</span>
            <span className="text-[#7fe3a6]">−{money(totals.discount)}</span>
          </div>
          <div className="h-px bg-[#2a2a2a] my-2" />
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Total to Pay</span>
            <span className="text-white text-2xl font-extrabold">
              {money(totals.subtotal)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <h3 className="text-white text-lg font-semibold">Payment Method</h3>

        <div className="space-y-3">
          {/* ✅ NÚT THANH TOÁN SAU (COD) */}
          <button
            type="button"
            onClick={() => setSelected("COD")}
            className={[
              baseBtn,
              selected === "COD"
                ? "border-[#fe8c31] ring-1 ring-[#fe8c31]/40"
                : "border-[#3a3a3a]",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <Image src="/icon/cod.png" alt="COD" width={20} height={20} />
              </div>
              <span>Cash on Delivery / Pay Later</span>
            </span>
          </button>

          {/* ZaloPay */}
          <button
            type="button"
            onClick={() => setSelected("ZALOPAY")}
            className={[
              baseBtn,
              selected === "ZALOPAY"
                ? "border-[#fe8c31] ring-1 ring-[#fe8c31]/40"
                : "border-[#3a3a3a]",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <Image
                src="/icon/zalo.png"
                alt="ZaloPay"
                width={30}
                height={30}
              />
              <span>ZaloPay Wallet</span>
            </span>
          </button>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-[#fe8c31] hover:bg-[#ff9d4f] transition text-white w-full py-3 rounded-[12px] font-bold"
        >
          {loading
            ? "Processing..."
            : selected === "COD"
            ? "Complete Order"
            : "Pay with ZaloPay"}
        </button>
      </div>

      {/* ✅ SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-md text-center space-y-6 animate-fadeIn">
            <div className="w-24 h-24 mx-auto">
              <Image
                src="/icon/checked.png"
                width={96}
                height={96}
                alt="success"
              />
            </div>
            <h2 className="text-white text-xl font-bold">
              THANK YOU FOR ORDERING!
            </h2>
            <p className="text-[#bdbdbd] text-sm leading-relaxed">
              A confirmation email will be sent shortly.
            </p>
            <div className="flex gap-3 pt-4">
              <a
                href="/orders"
                className="flex-1 text-center py-3 rounded-xl bg-[#1c1c1c] border border-[#3a3a3a] text-white hover:border-[#fe8c31] transition"
              >
                View Order
              </a>
              <a
                href="/"
                className="flex-1 text-center py-3 rounded-xl bg-[#FA4D38] hover:bg-[#ff9d4f] text-white transition"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
