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
  // Lấy tháng hiện tại làm mặc định (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/order", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
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

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas || orders.length === 0) return;

    const getRevenueByDay = (monthYear: string) => {
      const yearStr = monthYear.split("-")[0];
      const monthStr = monthYear.split("-")[1];

      const daysInMonth = new Date(
        parseInt(yearStr),
        parseInt(monthStr),
        0
      ).getDate();

      const revenueArray = new Array(daysInMonth).fill(0);

      orders.forEach((order) => {
        // ✅ CHỈ LẤY NHỮNG ORDER CÓ STATUS LÀ PAID
        if (order.status !== "paid") return;

        const orderDate = new Date(order.createdAt);
        const orderMonthYear = orderDate.toISOString().slice(0, 7);

        if (orderMonthYear === monthYear) {
          const day = orderDate.getDate();
          // Đảm bảo không vượt quá mảng (phòng trường hợp múi giờ nhảy ngày)
          if (day <= daysInMonth) {
            revenueArray[day - 1] += order.totalPrice;
          }
        }
      });
      return revenueArray;
    };

    const currentMonthData = getRevenueByDay(selectedMonth);

    // Tính toán tháng trước đó để so sánh
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
            label: `Doanh thu tháng ${selectedMonth}`,
            data: currentMonthData,
            borderColor: "#4379EE",
            backgroundColor: "rgba(67, 121, 238, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#4379EE",
          },
          {
            label: `Doanh thu tháng trước (${prevMonthString})`,
            data: prevMonthData,
            borderColor: "#A0A0A0",
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
            pointRadius: 0, // Ẩn điểm cho tháng trước để đỡ rối
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (context) => {
                // Lấy giá trị y, nếu null thì mặc định là 0
                const value = context.parsed.y ?? 0;
                return `Doanh thu: $${value.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Ngày trong tháng" },
            grid: { display: false },
          },
          y: {
            title: { display: true, text: "Doanh thu ($)" },
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
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
        <div>
          <h2 className="font-bold text-[24px] text-gray-900">
            Báo cáo Doanh thu Thực tế
          </h2>
          <p className="text-gray-500 text-sm">
            Chỉ bao gồm các đơn hàng đã thanh toán thành công.
          </p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="h-10 border border-gray-300 rounded-lg px-4 text-sm font-semibold w-[200px] cursor-pointer hover:border-blue-500 transition-colors"
        />
      </div>
      <div className="h-[400px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
