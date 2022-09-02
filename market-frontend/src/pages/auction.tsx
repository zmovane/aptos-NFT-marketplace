import { useState } from "react";
import { useRouter } from "next/router";
import { Card } from "../components/card";
import { useWallet } from "../hooks/useAptos";
import { excuteTransaction } from "../utils/aptos";

export default function Auction() {
  const router = useRouter();
  const { creator, name, collection, uri, description } = router.query;
  const { address } = useWallet();
  const [price, updatePrice] = useState("");

  const marketName = process.env.NFT_MARKET_NAME!;
  const marketAddress = process.env.NFT_MARKET_ADDRESS!.toLowerCase();

  async function listNFTForSale() {
    const payload = {
      type: "entry_function_payload",
      function: `${marketAddress}::marketplace::list_token`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        marketAddress,
        marketName,
        creator,
        collection,
        name,
        0,
        +price,
      ],
    };
    await excuteTransaction(address, payload);
    router.push("/");
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-1/5 my-8">
        <Card
          key={`${collection}/${name}`}
          data={{ name, collection, uri, description }}
          type={"noraml"}
          onClick={undefined}
        />
      </div>
      <div className="w-1/4 flex flex-col pb-12">
        <input
          type="number"
          placeholder="Asset Price in APT"
          className="mt-2 p-4 input input-bordered input-primary w-full"
          onChange={(e) => updatePrice(e.target.value)}
        />
        <button
          onClick={listNFTForSale}
          className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
