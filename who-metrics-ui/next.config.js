/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  basePath: '/sbv-world-health-org-metrics',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
