"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { api } from "@/app/services/api"; // Đảm bảo import đúng đường dẫn

// Interface cho dữ liệu User từ API
interface UserData {
  name: string;
  role: string;
  avatar: string;
}

export default function Header({ notifications = 6 }) {
  // State lưu thông tin user, set mặc định ban đầu
  const [userInfo, setUserInfo] = useState<UserData>({
    name: "Admin",
    role: "Loading...",
    avatar: "/assets/images/avatar.jpg", // Ảnh placeholder mặc định
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Gọi API lấy thông tin user hiện tại
        const data = await api.get<any>("/api/users/me");

        // Cập nhật state với dữ liệu từ API
        setUserInfo({
          name: data.name || "Admin",
          role: data.role || "User",
          // Nếu API trả về null/undefined cho avatar thì dùng ảnh mặc định
          avatar: data.avatar || "/assets/images/avatar.jpg",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-white border-b border-gray-200 z-[9999] flex ">
      {/* Logo */}
      <div className="w-[260px] flex items-center justify-center">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 text-lg font-semibold uppercase"
        >
          <span className="rounded bg-gradient-to-br from-[#ff6f61] to-[#ff914d] px-3 py-1 text-sm tracking-widest text-black">
            ARC
          </span>
          <span className="hidden text-sm tracking-[0.32em] text-black sm:block">
            Game Store
          </span>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex-1 flex justify-end items-center gap-10 mr-10">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <div
            className="w-[30px] h-[30px] bg-gradient-to-br from-[#ff6f61] to-[#ff914d]"
            style={{
              WebkitMaskImage: "url(/icon/notifications.png)",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: "url(/icon/notifications.png)",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
          <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[12px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
            {notifications}
          </span>
        </div>

        {/* Account */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-gray-200">
            <Image
              src={userInfo.avatar}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="44px"
              // Thêm onError để fallback nếu link ảnh chết (optional)
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/assets/images/avatar.jpg";
              }}
            />
          </div>
          <div>
            <div className="font-bold text-[14px] text-gray-800">
              {userInfo.name}
            </div>
            <div className="font-semibold text-[12px] text-gray-600">
              {userInfo.role}
            </div>
          </div>
        </div>

        {/* Menu Button (mobile) */}
        <button className="hidden md:hidden text-xl">
          <FaBars />
        </button>
      </div>
    </header>
  );
}
