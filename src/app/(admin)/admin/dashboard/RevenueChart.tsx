"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function RevenueChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(canvas, {
      type: "line",
      data: {
        labels: ["01", "02", "03", "04", "05"],
        datasets: [
          {
            label: "Tháng 04/2025",
            data: [1200000, 1800000, 3200000, 900000, 1600000],
            borderColor: "#4379EE",
            borderWidth: 1.5,
          },
          {
            label: "Tháng 03/2025",
            data: [1000000, 900000, 1200000, 1200000, 1400000],
            borderColor: "#EF3826",
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
        scales: {
          x: { title: { display: true, text: "Ngày" } },
          y: { title: { display: true, text: "Doanh thu (VND)" } },
        },
        maintainAspectRatio: false,
      },
    });
    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h2 className="font-bold text-[24px] text-gray-900">
          Biểu đồ doanh thu
        </h2>
        <input
          type="month"
          className="h-7 border border-gray-300 rounded px-4 text-xs font-semibold w-[170px]"
        />
      </div>
      <div className="h-[350px]">
        <canvas id="revenue-chart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
