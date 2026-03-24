/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for pdfjs-dist worker to resolve correctly
    config.resolve.alias["canvas"] = false;
    return config;
  },
};

export default nextConfig;
