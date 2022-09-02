import {
  AptosAccount,
  WalletClient,
  HexString,
} from "@martiandao/aptos-web3-bip44.js";
import * as env from "dotenv";
env.config({ path: `.env.${process.env.NODE_ENV}`.local });

const feeNumerator = 10;
const {
  NEXT_PUBLIC_APTOS_NODE_URL: aptosNodeURL,
  NEXT_PUBLIC_APTOS_FAUCET_URL: aptosFaucetURL,
  NEXT_PUBLIC_WALLET_PRIVATE_KEY: walletPrivateKey,
  NEXT_PUBLIC_NFT_MARKET_NAME: marketName,
} = process.env;

async function main() {
  const client = new WalletClient(aptosNodeURL, aptosFaucetURL);
  const account = new AptosAccount(
    HexString.ensure(walletPrivateKey).toUint8Array()
  );
  const payload = {
    function: `${account.address()}::marketplace::create_market`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [marketName, feeNumerator, `${account.address()}`, 10000],
  };
  const transaction = await client.aptosClient.generateTransaction(
    account.address(),
    payload
  );
  const tx = await client.signAndSubmitTransaction(account, transaction);
  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
