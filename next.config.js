/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    additionalData: `@import "~src/lib/styles/index.scss";`,
  },
};

module.exports = nextConfig;
