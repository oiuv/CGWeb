/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // 输出模式，适配IIS部署
  output: 'standalone',
  // 禁用X-Powered-By头
  poweredByHeader: false,
};

module.exports = nextConfig;
