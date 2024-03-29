const withSvgr = require('@newhighsco/next-plugin-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = withSvgr({
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    additionalData: `@import "~src/assets/styles/index.scss";`,
  },
});

module.exports = nextConfig;
