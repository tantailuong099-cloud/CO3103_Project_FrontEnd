"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export default function RevenueChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("2025-12");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/order", {
          method: "GET",
          credentials: "include", // <--- THÊM DÒNG NÀY
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // Nếu 401/403 thì có thể redirect về login
          console.error("Unauthorized");
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // ... (Phần logic xử lý biểu đồ giữ nguyên như câu trả lời trước) ...

  // Để code ngắn gọn, tôi chỉ viết lại phần useEffect vẽ chart (đã bao gồm logic)
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas || orders.length === 0) return;

    const getRevenueByDay = (monthYear: string) => {
      const daysInMonth = new Date(
        parseInt(monthYear.split("-")[0]),
        parseInt(monthYear.split("-")[1]),
        0
      ).getDate();
      const revenueArray = new Array(daysInMonth).fill(0);

      orders.forEach((order) => {
        if (order.status === "cancelled") return;
        const orderDate = new Date(order.createdAt);
        const orderMonthYear = orderDate.toISOString().slice(0, 7);
        if (orderMonthYear === monthYear) {
          const day = orderDate.getDate();
          revenueArray[day - 1] += order.totalPrice;
        }
      });
      return revenueArray;
    };

    const currentMonthData = getRevenueByDay(selectedMonth);
    const [year, month] = selectedMonth.split("-").map(Number);
    const prevDate = new Date(year, month - 2);
    const prevMonthString = prevDate.toISOString().slice(0, 7);
    const prevMonthData = getRevenueByDay(prevMonthString);

    const labels = currentMonthData.map((_, index) =>
      (index + 1).toString().padStart(2, "0")
    );

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Tháng ${selectedMonth}`,
            data: currentMonthData,
            borderColor: "#4379EE",
            backgroundColor: "rgba(67, 121, 238, 0.1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          {
            label: `Tháng ${prevMonthString}`,
            data: prevMonthData,
            borderColor: "#EF3826",
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
        scales: {
          x: {
            title: { display: true, text: "Ngày" },
            grid: { display: false },
          },
          y: { title: { display: true, text: "Doanh thu" }, beginAtZero: true },
        },
        maintainAspectRatio: false,
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [orders, selectedMonth]);

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h2 className="font-bold text-[24px] text-gray-900">
          Biểu đồ doanh thu
        </h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="h-9 border border-gray-300 rounded px-4 text-sm font-semibold w-[200px] cursor-pointer"
        />
      </div>
      <div className="h-[350px]">
        <canvas id="revenue-chart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
