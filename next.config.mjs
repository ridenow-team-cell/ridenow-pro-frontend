/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://ridenow-pro-api.onrender.com/api/v1/:path*",
      },
    ]
  },
}

export default nextConfig
