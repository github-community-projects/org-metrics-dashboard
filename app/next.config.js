/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'json'],
  basePath: '/sbv-world-health-org-metrics-staging',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
