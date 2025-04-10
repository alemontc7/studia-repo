import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
  // Aquí puedes poner otras opciones de tu NextConfig
};

export default nextConfig;
