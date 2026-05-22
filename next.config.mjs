/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? "https://ridenow-pro-api.onrender.com/api/v1"}/:path*`,
      },
    ]
  },
}

export default nextConfig
