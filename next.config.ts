/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // no domain whitelist, no optimization
  },
};

export default nextConfig;
