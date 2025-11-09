/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'shared.akamai.steamstatic.com' },
      { protocol: 'https', hostname: 'cdn.akamai.steamstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }
    ],
    // hoặc dùng "domains": ['res.cloudinary.com', 'shared.akamai.steamstatic.com', 'cdn.akamai.steamstatic.com']
  },
};

export default nextConfig;
