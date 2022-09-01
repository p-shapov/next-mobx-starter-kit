/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    additionalData: '@import "src/shared/styles/global.scss";',
  },
};

module.exports = nextConfig;
