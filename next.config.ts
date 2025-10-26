import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
        port: "",
        pathname: "/**", // Cho phép tất cả các đường dẫn ảnh từ host này
      },
      // ... bạn có thể thêm các host khác ở đây
    ],
  },
};

export default nextConfig;
