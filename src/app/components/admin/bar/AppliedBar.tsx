"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface AppliedBarProps {
  linktocreate: string;
  trigger?: number; // Mặc định là optional
}

export default function AppliedBar({
  linktocreate,
  trigger = 0, // Đặt giá trị mặc định là false
}: AppliedBarProps) {
  const statusRef = useRef<HTMLDivElement | null>(null);
  const [boxHeight, setBoxHeight] = useState<number | null>(null);

  // 📏 Lấy chiều cao thực tế của ô "Hành động" sau khi render
  useEffect(() => {
    if (statusRef.current) {
      setBoxHeight(statusRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (statusRef.current) {
        setBoxHeight(statusRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mb-[30px]">
      <div className="flex flex-wrap gap-y-[15px] gap-x-[20px] items-start">
        <div
          ref={statusRef}
          className="flex border border-[#D5D5D5] bg-white rounded-[14px] overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-[23.75px] border-r border-[#D5D5D5]">
            <select className="font-bold text-[14px] text-gray-700 outline-none border-0 cursor-pointer bg-transparent">
              <option>-- Hành động --</option>
              <option>Hoạt động</option>
              <option>Dừng hoạt động</option>
              <option>Xóa</option>
            </select>
          </div>

          <div className="flex items-center gap-3 px-6 py-[23.75px]">
            <button className="font-semibold text-[#EA0234] cursor-pointer bg-transparent border-0">
              Áp dụng
            </button>
          </div>
        </div>

        {/* 🔍 Ô Tìm kiếm */}
        <div
          className="flex items-center bg-white border border-[#E2E2E2] rounded-[14px] px-6 gap-4 w-[366px]"
          style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
        >
          <FaMagnifyingGlass className="text-[20px] text-black" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 border-0 outline-none font-bold text-[14px] text-black placeholder:text-[#979797]"
          />
        </div>

        {/* Logic: Nếu trigger là false (hoặc undefined) thì mới hiển thị 2 nút này */}
        {trigger == 0 && (
          <>
            {/* ➕ Nút Tạo mới */}
            <Link
              href={linktocreate}
              className="bg-[#ff6f61] text-white font-bold text-[14px] border-0 px-7 rounded-[14px] cursor-pointer flex items-center justify-center"
              style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
            >
              + Tạo mới
            </Link>

            {/* 🗑️ Nút Thùng rác */}
            <Link
              href={"/admin/products/trash"}
              className="bg-[#EF382633] text-[#EF3826] font-bold text-[14px] border-0 px-7 rounded-[14px] cursor-pointer flex items-center justify-center"
              style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
            >
              Thùng rác
            </Link>
          </>
        )}

        {trigger == 1 && (
          <>
            {/* ➕ Nút Tạo mới */}
            <Link
              href={linktocreate}
              className="bg-[#ff6f61] text-white font-bold text-[14px] border-0 px-7 rounded-[14px] cursor-pointer flex items-center justify-center"
              style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
            >
              + Tạo mới
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
