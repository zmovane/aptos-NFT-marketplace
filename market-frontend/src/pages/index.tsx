import { Card } from "../components/card";
import { NFTItem } from "../types/item";
import { useAptosGetListedTokens, useAptosWallet } from "../hooks/useAptos";
import { excuteTransaction } from "../utils/aptos";
import { useRouter } from "next/router";

const MARKET_ADDRESS = process.env.APTOS_NFT_MARKET_ADDRESS!;

export default function Home() {
  const router = useRouter();
  const { address } = useAptosWallet();
  const { listedTokens, loaded } = useAptosGetListedTokens();

  async function buyNft(item: NFTItem) {
    const payload = {
      type: "script_function_payload",
      function: `${MARKET_ADDRESS}::FixedPriceListing::buy_token`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [item.seller, item.creator, item.collection, item.name, "0"],
    };
    const tx = await excuteTransaction(address, payload);
    if (tx) {
      const resposne = await fetch(`/api/aptos/item/${item.id}`, {
        method: "POST",
      });
      if (resposne.status == 200) {
        router.reload();
      } else {
        console.log(await resposne.json());
      }
    }
  }

  return loaded && !listedTokens.length ? (
    <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
  ) : (
    <div className="p-6" style={{ maxWidth: "1600px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {listedTokens.map((item, i) => (
          <Card
            key={i.toString()}
            data={item}
            type={"withBuyBtn"}
            onClick={() => buyNft(item)}
          />
        ))}
      </div>
    </div>
  );
}
