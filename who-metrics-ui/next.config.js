/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'json'],
  basePath:
    process.env.NODE_ENV === "development"
      ? ""
      : "/sbv-world-health-org-metrics",
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  }
};

module.exports = nextConfig
