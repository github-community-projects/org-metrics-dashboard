/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  basePath:
    process.env.NODE_ENV === "development"
      ? ""
      : "/sbv-world-health-org-metrics",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
