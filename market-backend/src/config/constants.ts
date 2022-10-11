import env from "dotenv";
env.config();
export const { APTOS_NODE_URL, MARKET_ADDRESS, APTOS_FAUCET_URL } = process.env;
