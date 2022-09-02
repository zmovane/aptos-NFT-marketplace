import { WalletClient } from "@martiandao/aptos-web3-bip44.js";
import { APTOS_FAUCET_URL, APTOS_NODE_URL } from "../config/constants";

export async function excuteTransaction(
  address: string,
  payload: {
    type: string;
    function: string;
    type_arguments: any[];
    arguments: any[];
  }
) {
  const transaction = await (window as any).martian.generateTransaction(
    address,
    payload
  );
  return await (window as any).martian.signAndSubmitTransaction(transaction);
}

export const walletClient = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
