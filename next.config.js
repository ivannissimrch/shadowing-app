/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stivannissim958926278595.blob.core.windows.net',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
