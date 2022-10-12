import {
  AptosAccount,
  WalletClient,
  HexString,
} from "@martiandao/aptos-web3-bip44.js";
import * as env from "dotenv";
env.config({ path: `.env.${process.env.NODE_ENV}.local` });

const {
  NEXT_PUBLIC_APTOS_NODE_URL: APTOS_NODE_URL,
  NEXT_PUBLIC_APTOS_FAUCET_URL: APTOS_FAUCET_URL,
  NEXT_PUBLIC_WALLET_PRIVATE_KEY: WALLET_PRIVATE_KEY,
  NEXT_PUBLIC_MARKET_COIN_TYPE: COIN_TYPE,
  NEXT_PUBLIC_MARKET_NAME: MARKET_NAME,
  NEXT_PUBLIC_MARKET_FEE_NUMERATOR: FEE_NUMERATOR,
  NEXT_PUBLIC_MARKET_INITIAL_FUND: INITIAL_FUND,
} = process.env;

async function main() {
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const account = new AptosAccount(
    HexString.ensure(WALLET_PRIVATE_KEY).toUint8Array()
  );
  const payload = {
    function: `${account.address()}::marketplace::create_market`,
    type_arguments: [COIN_TYPE],
    arguments: [
      MARKET_NAME,
      +FEE_NUMERATOR,
      `${account.address()}`,
      +INITIAL_FUND,
    ],
  };
  const transaction = await client.aptosClient.generateTransaction(
    account.address(),
    payload,
    { gas_unit_price: 100 }
  );
  const tx = await client.signAndSubmitTransaction(account, transaction);
  const result = await client.aptosClient.waitForTransactionWithResult(tx, {
    checkSuccess: true,
  });
  console.log(result);
  
  client.signTransaction
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
