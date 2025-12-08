"use client";

export default function AddressBox({ address, onEdit }: any) {
  const { name, phone, email, address: fullAddress } = address;

  return (
    <div className="bg-white rounded-[10px] p-4 flex items-start gap-3 border border-neutral-200">
      <img src="/icon/location_on.svg" alt="location" className="w-6 h-6" />

      <div className="flex-1">
        <p className="text-[#fa4d38] text-lg font-semibold">Delivering Address</p>

        <p className="text-sm font-medium text-neutral-800 mt-1">
          {name}, {phone}, {email}
        </p>

        <p className="text-sm text-neutral-600">
          {fullAddress || "---"}
        </p>
      </div>

      <button
        className="text-xs text-neutral-500 hover:text-neutral-700 transition"
        onClick={onEdit}
      >
        Change
      </button>
    </div>
  );
}
