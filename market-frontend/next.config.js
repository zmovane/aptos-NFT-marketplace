/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "ipfs.infura.io",
      "nftstorage.link",
      "aptoslabs.com",
      "miro.medium.com",
      "www.gitbook.com",
    ],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
