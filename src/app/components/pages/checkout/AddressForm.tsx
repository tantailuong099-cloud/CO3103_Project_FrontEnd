"use client";

import { ChangeEvent, FocusEvent } from "react";

export type AddressFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string; // ✅ single string
};

export type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>;

export default function AddressForm({
  form,
  onChange,
  onBlur,
  errors,
  disabled,
}: {
  form: AddressFormValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  errors?: AddressFormErrors;
  disabled?: boolean;
}) {
  const base =
    "w-full rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] px-4 py-3 text-white placeholder:text-[#8a8a8a] outline-none transition";
  const focus = "focus:border-[#fe8c31] focus:ring-4 focus:ring-[#fe8c31]/15";
  const invalid =
    "aria-[invalid=true]:border-[#ff5a5a] aria-[invalid=true]:ring-[#ff5a5a]/20";
  const labelCls = "text-sm text-[#cfcfcf] font-medium";
  const errCls = "mt-1 text-xs text-[#ff9aa0]";

  // ✅ Field helper (cho phép set readOnly riêng từng field)
  const field = ({
    label,
    name,
    type = "text",
    placeholder,
    autoComplete,
    inputMode,
    pattern,
    readOnly = false,
  }: {
    label: string;
    name: keyof AddressFormValues;
    type?: string;
    placeholder: string;
    autoComplete?: string;
    inputMode?: "text" | "email" | "tel" | "numeric";
    pattern?: string;
    readOnly?: boolean;
  }) => {
    const err = errors?.[name];

    return (
      <div className="space-y-1.5">
        <label htmlFor={name} className={labelCls}>
          {label}
        </label>

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name] as string}
          onChange={readOnly ? undefined : onChange} // ✅ không cho change nếu readOnly
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          pattern={pattern}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `${name}-error` : undefined}
          className={`${base} ${focus} ${invalid}
            ${err ? "border-[#ff5a5a]" : ""}
            ${readOnly ? "opacity-60 cursor-not-allowed" : ""}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          `}
        />

        {err && (
          <p id={`${name}-error`} className={errCls}>
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 🔒 KHÔNG CHO SỬA */}
      {field({
        label: "Full Name",
        name: "name",
        placeholder: "Nguyen Van An",
        autoComplete: "name",
        readOnly: true,
      })}

      {/* 🔒 KHÔNG CHO SỬA */}
      {field({
        label: "Phone Number",
        name: "phone",
        placeholder: "091234567",
        autoComplete: "tel",
        inputMode: "tel",
        pattern: "^[0-9+()\\-\\s]{6,}$",
        readOnly: true,
      })}

      {/* 🔒 KHÔNG CHO SỬA */}
      {field({
        label: "Email",
        name: "email",
        placeholder: "vanan@gmail.com",
        type: "email",
        autoComplete: "email",
        inputMode: "email",
        readOnly: true,
      })}

      {/* ✅ CHỈ ADDRESS ĐƯỢC PHÉP SỬA */}
      <div className="md:col-span-2">
        {field({
          label: "Delivery Address",
          name: "address",
          placeholder: "123 ABC Street, Ward 5, District 10, HCM City",
          autoComplete: "street-address",
          readOnly: false, // ✅ MỞ KHÓA
        })}
      </div>
    </div>
  );
}
