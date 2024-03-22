/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'json'],
  basePath:
    process.env.NODE_ENV === 'development'
      ? ''
      : '/sbv-world-health-org-metrics',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
