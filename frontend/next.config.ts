import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Todas las peticiones a /api/*
        destination: 'https://studia-api-production.vercel.app/api/:path*' // Se redirigen a tu backend
      },
    ];
  },
  async headers() {
    return [
      {
        // Esto es opcional y depende de tus necesidades
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://studia-production.vercel.app',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
        ],
      },
    ]
  },
};
export default nextConfig;
