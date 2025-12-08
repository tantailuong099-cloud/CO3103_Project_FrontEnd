"use client";
import { useQueryFilters } from "@/app/hook/useQueryFilters";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface AppliedBarProps {
  linktocreate: string;
  trigger?: number;
  onApplyAction?: (action: string) => void;
}

export default function AppliedBar({
  linktocreate,
  trigger = 0,
  onApplyAction,
}: AppliedBarProps) {
  const statusRef = useRef<HTMLDivElement | null>(null);
  const [boxHeight, setBoxHeight] = useState<number | null>(null);

  // State lưu hành động được chọn
  const [action, setAction] = useState("");

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

  // --- Logic Search ---
  const { getFilter, setFilters } = useQueryFilters();
  const [localSearch, setLocalSearch] = useState(getFilter("keyword"));

  useEffect(() => {
    setLocalSearch(getFilter("keyword"));
  }, [getFilter("keyword")]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== getFilter("keyword")) {
        setFilters({ keyword: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters, getFilter]);

  // --- Handle Apply ---
  const handleApplyClick = () => {
    if (!action) {
      alert("Vui lòng chọn hành động!");
      return;
    }
    if (onApplyAction) {
      onApplyAction(action);
    }
  };

  return (
    <div className="mb-[30px]">
      <div className="flex flex-wrap gap-y-[15px] gap-x-[20px] items-start">
        {/* ACTION BOX */}

        {trigger != 3 && (
          <div
            ref={statusRef}
            className="flex border border-[#D5D5D5] bg-white rounded-[14px] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-[23.75px] border-r border-[#D5D5D5]">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="font-bold text-[14px] text-gray-700 outline-none border-0 cursor-pointer bg-transparent min-w-[120px]"
              >
                <option value="">-- Hành động --</option>
                {/* CHỈ GIỮ LẠI TÙY CHỌN XÓA */}
                <option value="delete">Xóa</option>
              </select>
            </div>
            <div className="flex items-center gap-3 px-6 py-[23.75px]">
              <button
                onClick={handleApplyClick}
                className="font-semibold text-[#EA0234] cursor-pointer bg-transparent border-0 hover:text-red-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="flex items-center bg-white border border-[#E2E2E2] rounded-[14px] px-6 gap-4 w-[366px] h-[64px]">
          <FaMagnifyingGlass className="text-[20px] text-black" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="flex-1 border-0 outline-none font-bold text-[14px] text-black"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Buttons */}
        {trigger == 0 && (
          <>
            <Link
              href={linktocreate}
              className="bg-[#ff6f61] text-white font-bold text-[14px] border-0 px-7 rounded-[14px] cursor-pointer flex items-center justify-center"
              style={{ height: boxHeight ? `${boxHeight}px` : "auto" }}
            >
              + Tạo mới
            </Link>

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
