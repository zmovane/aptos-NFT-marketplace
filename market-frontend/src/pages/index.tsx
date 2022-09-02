import { Card } from "../components/card";
import { NFTItem } from "../types/item";
import { useListedItems, useWallet } from "../hooks/useAptos";
import { excuteTransaction } from "../utils/aptos";
import { useRouter } from "next/router";
import { NFT_MARKET_ADDRESS, NFT_MARKET_NAME } from "../config/constants";

export default function Home() {
  const router = useRouter();
  const { address } = useWallet();
  const { listedTokens, loaded } = useListedItems();

  async function buyItem(item: NFTItem) {
    const payload = {
      type: "entry_function_payload",
      function: `${NFT_MARKET_ADDRESS}::marketplace::buy_token`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        NFT_MARKET_ADDRESS,
        NFT_MARKET_NAME,
        item.creator,
        item.collection,
        item.name,
        0,
        +item.price!,
      ],
    };
    await excuteTransaction(address, payload);
    router.push("/dashboard");
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
            onClick={() => buyItem(item)}
          />
        ))}
      </div>
    </div>
  );
}
