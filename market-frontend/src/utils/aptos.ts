import { WalletClient } from "@martiandao/aptos-web3-bip44.js";
import { APTOS_FAUCET_URL, APTOS_NODE_URL } from "../config/constants";

const MAX_U64_BIG_INT: bigint = BigInt(2 ** 64) - BigInt(1);

export function createCollectionPayload(
  name: string,
  description: string,
  uri: string
) {
  return {
    type: "entry_function_payload",
    function: "0x3::token::create_collection_script",
    type_arguments: [],
    arguments: [
      name,
      description,
      uri,
      MAX_U64_BIG_INT.toString(),
      [false, false, false],
    ],
  };
}

export function createTokenPayload(
  collection: string,
  name: string,
  description: string,
  uri: string,
  royaltyPayee: string
) {
  return {
    type: "entry_function_payload",
    function: "0x3::token::create_token_script",
    type_arguments: [],
    arguments: [
      collection,
      name,
      description,
      "1",
      MAX_U64_BIG_INT.toString(),
      uri,
      royaltyPayee,
      "100",
      "0",
      [false, false, false, false, false],
      [],
      [],
      [],
    ],
  };
}

export const walletClient = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
