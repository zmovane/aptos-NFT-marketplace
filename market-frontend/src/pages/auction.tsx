import { useState } from "react";
import { useRouter } from "next/router";
import { Card } from "../components/card";
import { useWallet } from "../hooks/useAptos";
import { excuteTransaction } from "../utils/aptos";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../config/constants";

export default function Auction() {
  const router = useRouter();
  const { creator, name, collection, uri, description } = router.query;
  const { address } = useWallet();
  const [price, updatePrice] = useState("");

  async function listNFTForSale() {
    const payload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::list_token`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
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
