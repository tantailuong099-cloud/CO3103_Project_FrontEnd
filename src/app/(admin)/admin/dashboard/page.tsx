import DashboardCard from "@/app/components/admin/card/DashboardCard";
import RevenueChart from "./RevenueChart";

export default function Dashboard() {
  const dashboardData = [
    {
      src: "/icon/section-1-icon-1.svg",
      content: "Người dùng",
      data: 1200,
    },
    {
      src: "/icon/section-1-icon-2.svg",
      content: "Đơn hàng",
      data: 36,
    },
    {
      src: "/icon/section-1-icon-3.svg",
      content: "Doanh thu",
      data: 1200,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">Tổng Quan</h1>

      <div className="grid grid-cols-3 gap-8">
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
