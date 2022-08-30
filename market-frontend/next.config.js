/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io", "nftstorage.link"],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  env: {
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    APTOS_NFT_MARKET_ADDRESS: process.env.APTOS_NFT_MARKET_ADDRESS,
    APTOS_NODE_URL: process.env.APTOS_NODE_URL,
    APTOS_FAUCET_URL: process.env.APTOS_FAUCET_URL,
  },
};

module.exports = nextConfig;
