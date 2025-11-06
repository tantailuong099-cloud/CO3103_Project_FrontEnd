"use client";

import { useState } from "react";
import AddressForm, { AddressFormValues } from "./AddressForm";

export default function AddressModal({
  initial,
  onClose,
  onSave,
}: {
  initial: AddressFormValues;
  onClose: () => void;
  onSave: (val: AddressFormValues) => void;
}) {
  const [form, setForm] = useState(initial);

  const update = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-black w-full max-w-md p-6 rounded-[12px] shadow-lg space-y-4 animate-fadein">
        <h2 className="text-lg font-semibold">Edit Address</h2>

        <AddressForm form={form} onChange={update} />

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="text-sm px-3 py-1 rounded border border-neutral-300 hover:bg-neutral-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#fe8c31] text-white px-4 py-2 rounded-[8px] hover:bg-[#ff9330]"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
