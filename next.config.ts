import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.lemonsqueezy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.lemonsqueezy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.lemonsqueezy.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
