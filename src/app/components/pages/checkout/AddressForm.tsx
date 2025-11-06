"use client";

import { ChangeEvent, FocusEvent } from "react";

export type AddressFormValues = {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
};

export type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>;

export default function AddressForm({
  form,
  onChange,
  onBlur,
  errors,
  disabled,
  readOnly,
}: {
  form: AddressFormValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  errors?: AddressFormErrors;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const base =
    "w-full rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] px-4 py-3 text-white placeholder:text-[#8a8a8a] outline-none transition";
  const focus = "focus:border-[#fe8c31] focus:ring-4 focus:ring-[#fe8c31]/15";
  const invalid = "aria-[invalid=true]:border-[#ff5a5a] aria-[invalid=true]:ring-[#ff5a5a]/20";
  const labelCls = "text-sm text-[#cfcfcf] font-medium";
  const hintCls = "mt-1 text-xs text-[#9e9e9e]";
  const errCls = "mt-1 text-xs text-[#ff9aa0]";

  const field = ({
    label,
    name,
    type = "text",
    placeholder,
    autoComplete,
    inputMode,
    pattern,
  }: {
    label: string;
    name: keyof AddressFormValues;
    type?: string;
    placeholder: string;
    autoComplete?: string;
    inputMode?: "text" | "email" | "tel" | "numeric";
    pattern?: string;
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
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          pattern={pattern}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `${name}-error` : undefined}
          className={`${base} ${focus} ${invalid} ${err ? "border-[#ff5a5a]" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
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
      {field({
        label: "Full Name",
        name: "name",
        placeholder: "Nguyen Van An",
        autoComplete: "name",
      })}
      {field({
        label: "Phone Number",
        name: "phone",
        placeholder: "091234567",
        autoComplete: "tel",
        inputMode: "tel",
        pattern: "^[0-9+()\\-\\s]{6,}$",
      })}
      {field({
        label: "Email",
        name: "email",
        placeholder: "vanan@gmail.com",
        type: "email",
        autoComplete: "email",
        inputMode: "email",
      })}
      <div className="md:col-span-2">
        {field({
          label: "Street Address",
          name: "street",
          placeholder: "123 ABC street",
          autoComplete: "address-line1",
        })}
      </div>
      {field({
        label: "City",
        name: "city",
        placeholder: "HCM City",
        autoComplete: "address-level2",
      })}
    </div>
  );
}
