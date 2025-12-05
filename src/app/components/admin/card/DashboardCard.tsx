"use client";
import Image from "next/image";

interface DashboardCardProp {
  src: string;
  content: string;
  data: number;
}

export default function DashboardCard(props: DashboardCardProp) {
  const { src, content, data } = props;
  return (
    <div className="bg-white rounded-xl p-7 flex items-center justify-center gap-5 shadow-sm">
      <div className="w-14">
        <Image src={src} alt="User Icon" width={60} height={60} />
      </div>

      <div>
        <div className="font-semibold text-base text-gray-700">{content}</div>
        <div className="font-bold text-2xl text-gray-900">{data}</div>
      </div>
    </div>
  );
}
