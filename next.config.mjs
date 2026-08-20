/** @type {import('next').NextConfig} */
if (process.env.VERCEL) {
  // Prevent NextAuth from crashing during Vercel builds if NEXTAUTH_URL is missing
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL || 'accessflow-demo.vercel.app'}`;
}

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
