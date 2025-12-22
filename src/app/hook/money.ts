export const toNumber = (v: number | string | null | undefined) => {
  if (v == null) return NaN;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

export const formatVND = (v: number | string | null | undefined) => {
  const n = toNumber(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.max(0, n));
};
