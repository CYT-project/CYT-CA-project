/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Environment variables that should be available to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'CIV2025 Frontend',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Image optimization settings
  images: {
    // Allow images from local services during development
    domains: ['localhost'],
    // In production, you would add your CDN domains here
    unoptimized: true, // Disable optimization for standalone output
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects for SEO and user experience
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Rewrites for API proxying in production
  async rewrites() {
    return [
      // In production, these would proxy to deployed services
      // For now, they work with local development
      {
        source: '/api/node/:path*',
        destination: 'http://localhost:3000/:path*',
      },
      {
        source: '/api/spring/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
};

module.exports = nextConfig;