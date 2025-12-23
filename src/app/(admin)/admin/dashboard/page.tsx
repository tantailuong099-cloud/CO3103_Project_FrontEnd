"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/app/components/admin/card/DashboardCard";
import RevenueChart from "./RevenueChart";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ ĐÃ CẬP NHẬT: Hàm format tiền tệ sang VND
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    const fetchWithAuth = (url: string) => {
      return fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    const fetchStats = async () => {
      try {
        const [usersRes, ordersRes, revenueRes] = await Promise.all([
          fetchWithAuth("http://localhost:4000/api/users/count"),
          fetchWithAuth("http://localhost:4000/api/order/count"),
          fetchWithAuth("http://localhost:4000/api/order/revenue"),
        ]);

        if (!usersRes.ok || !ordersRes.ok || !revenueRes.ok) {
          throw new Error("Lỗi xác thực hoặc lỗi server");
        }

        const userData = await usersRes.json();
        const orderData = await ordersRes.json();
        const revenueData = await revenueRes.json();

        setStats({
          users:
            typeof userData === "number"
              ? userData
              : userData.count || userData.total || 0,
          orders:
            typeof orderData === "number"
              ? orderData
              : orderData.count || orderData.total || 0,
          revenue:
            typeof revenueData === "number"
              ? revenueData
              : revenueData.total || revenueData.revenue || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardData = [
    {
      src: "/icon/section-1-icon-1.svg",
      content: "Người dùng",
      data: loading ? "..." : stats.users,
    },
    {
      src: "/icon/section-1-icon-2.svg",
      content: "Đơn hàng",
      data: loading ? "..." : stats.orders,
    },
    {
      src: "/icon/section-1-icon-3.svg",
      content: "Doanh thu",
      data: loading ? "..." : formatCurrency(stats.revenue),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">Tổng Quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dashboardData.map((item, index) => (
          <DashboardCard
            key={index}
            src={item.src}
            content={item.content}
            data={item.data}
          />
        ))}
      </div>
      <RevenueChart />
    </div>
  );
}
