/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "...........",
        port: "",
        pathname: "/........",
      },
    ],
  },
  // output: "export"
};

export default nextConfig;
