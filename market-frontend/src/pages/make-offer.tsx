import { useState } from "react";
import { useRouter } from "next/router";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../config/constants";
import { TokenCard } from "../components/TokenCard";
import { Token } from "../types";
import { useWallet } from "@manahippo/aptos-wallet-adapter";

export default function MakeOffer() {
  const router = useRouter();
  const { creator, name, collection, uri, description } = router.query;
  const { signAndSubmitTransaction } = useWallet();
  const [price, updatePrice] = useState("");

  async function makeOffer() {
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
    await signAndSubmitTransaction(payload);
    router.push("/");
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-1/5 my-8">
        <TokenCard data={{ name, collection, uri, description } as Token} />
      </div>
      <div className="w-1/4 flex flex-col pb-12">
        <input
          type="number"
          placeholder="Asset Price in APT"
          className="mt-2 p-4 input input-bordered input-primary w-full"
          onChange={(e) => updatePrice(e.target.value)}
        />
        <button
          onClick={makeOffer}
          className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
