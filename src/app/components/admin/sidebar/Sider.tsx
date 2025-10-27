"use client";
import Link from "next/link";
import {
  FaGaugeHigh,
  FaTableCellsLarge,
  FaTableList,
  FaListCheck,
  FaUser,
  FaUserGroup,
  FaGear,
  FaUserGear,
  FaPowerOff,
} from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { api } from "@/app/services/api";

export default function Sider() {
  const pathname = usePathname(); // Lấy URL hiện tại

  const mainMenu = [
    { icon: <FaGaugeHigh />, label: "Tổng quan", href: "/admin/dashboard" },
    {
      icon: <FaTableCellsLarge />,
      label: "Quản lý danh mục",
      href: "/admin/categories",
    },
    {
      icon: <FaTableList />,
      label: "Quản lý sản phẩm",
      href: "/admin/products",
    },
    { icon: <FaListCheck />, label: "Quản lý đơn hàng", href: "/admin/orders" },
    { icon: <FaUser />, label: "Quản lý người dùng", href: "/admin/users" },
    {
      icon: <FaUserGroup />,
      label: "Thông tin liên hệ",
      href: "/admin/contacts",
    },
  ];

  const settingsMenu = [
    { icon: <FaGear />, label: "Cài đặt chung", href: "/admin/settings" },
    {
      icon: <FaUserGear />,
      label: "Thông tin cá nhân",
      href: "/admin/profile",
    },
    { icon: <FaPowerOff />, label: "Đăng xuất", href: "/logout", logout: true },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

     try {
      // Gọi API logout (qua service axios)
      await api.post("/api/auth/logout");

      // Sau khi logout, reload hoặc redirect
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/admin/login"; // fallback
    }
    window.location.reload();
  };

  return (
    <nav className="bg-white border-r border-gray-200 w-[260px] h-[calc(100vh-70px)] fixed top-[70px] left-0 overflow-y-auto">
      {/* Scrollbar nhỏ */}
      <style jsx>{`
        nav::-webkit-scrollbar {
          width: 3px;
        }
        nav::-webkit-scrollbar-thumb {
          background-color: #ddd;
        }
      `}</style>

      {/* Menu chính */}
      <ul className="list-none my-[11px] p-0">
        {mainMenu.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md ml-6 mr-2 font-semibold text-[14px] relative transition-all
                ${
                  isActive
                    ? "bg-[#ff6f61] text-white before:content-[''] before:block before:w-[4.5px] before:h-full before:rounded-r-md before:bg-[#ff6f61] before:absolute before:top-0 before:-left-6"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-[16px] w-[16px]">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <hr className="my-4 border-gray-200" />

      {/* Menu cài đặt */}
      <ul className="list-none my-[11px] p-0">
        {settingsMenu.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md ml-6 mr-2 font-semibold text-[14px] relative transition-all
                  ${
                    isActive
                      ? "bg-[#ff6f61] text-white before:content-[''] before:block before:w-[4.5px] before:h-full before:rounded-r-md before:bg-[#ff6f61] before:absolute before:top-0 before:-left-6"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${item.logout ? "!text-[#F93C65] hover:bg-red-50" : ""}`}
                onClick={item.logout ? handleLogout : undefined}
              >
                <span className="text-[16px] w-[16px]">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
