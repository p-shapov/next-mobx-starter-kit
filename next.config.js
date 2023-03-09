const withSvgr = require('@newhighsco/next-plugin-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = withSvgr({
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    additionalData: `@import "~src/assets/styles/index.scss";`,
  },
  async redirects() {
    return [
      {
        source: '/sale',
        destination: '/sale/airdrop',
        has: [
          {
            type: 'cookie',
            key: 'connected',
            value: 'true',
          },
        ],
        permanent: false,
      },
      {
        source: '/sale',
        destination: '/',
        missing: [
          {
            type: 'cookie',
            key: 'connected',
            value: 'true',
          },
        ],
        permanent: false,
      },
      {
        source: '/sale/:slug',
        destination: '/',
        missing: [
          {
            type: 'cookie',
            key: 'connected',
            value: 'true',
          },
        ],
        permanent: false,
      },
    ];
  },
});

module.exports = nextConfig;
