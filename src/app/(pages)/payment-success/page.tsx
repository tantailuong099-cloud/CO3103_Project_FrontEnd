// app/payment-success/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="bg-[#141414] border border-[#2a2a2a] p-10 rounded-3xl max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <Image src="/icon/checked.png" width={60} height={60} alt="success" />
        </div>
        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
        <p className="text-[#bdbdbd]">
          Your payment has been processed. We will start preparing your order
          immediately.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="bg-[#fe8c31] text-white py-3 rounded-xl font-medium"
          >
            View My Orders
          </Link>
          <Link href="/" className="text-[#bdbdbd] hover:text-white transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
