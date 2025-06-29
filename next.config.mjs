/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.teamviewer.com',
        port: '',
        pathname: '/resources/badges/**',
      },
    ],
  },
};

export default nextConfig; 