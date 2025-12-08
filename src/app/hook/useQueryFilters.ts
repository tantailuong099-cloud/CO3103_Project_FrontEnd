"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function useQueryFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Hàm này nhận vào 1 object các thay đổi, ví dụ: { status: 'active', keyword: 'abc' }
  // Nó sẽ merge với các params cũ trên URL
  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset về trang 1 nếu có thay đổi filter (trừ khi chỉ đổi page)
      if (!updates.page) {
        params.delete("page");
      }

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, replace, searchParams]
  );

  // Hàm lấy giá trị hiện tại
  const getFilter = (key: string) => searchParams.get(key) || "";

  return {
    getFilter,
    setFilters,
    isPending, // Có thể dùng để hiện loading bar
    searchParams, // Trả về raw params nếu cần
  };
}
