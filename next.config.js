/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    additionalData: `@import "~src/shared/styles/index.scss";`,
  },
};

module.exports = nextConfig;
