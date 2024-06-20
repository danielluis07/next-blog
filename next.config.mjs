/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "ca-times.brightspotcdn.com",
      },
      {
        protocol: "https",
        hostname: "media.gettyimages.com",
      },
    ],
  },
};

export default nextConfig;
