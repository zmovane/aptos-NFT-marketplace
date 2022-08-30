import { useState } from "react";
import { useRouter } from "next/router";
import { Card } from "../components/card";
import { useAptosWallet } from "../hooks/useAptos";
import { useIPFSImage } from "../hooks/useIPFS";
import { excuteTransaction } from "../utils/aptos";

const NFTMarketAddress = process.env.APTOS_NFT_MARKET_ADDRESS;
export default function AptosAuction() {
  const router = useRouter();
  const { creator, name, collection, uri, description } = router.query;
  const { address } = useAptosWallet();
  const image = useIPFSImage(uri);
  const [price, updatePrice] = useState("");

  async function listNFTForSale() {
    const listTokenPayload = {
      type: "script_function_payload",
      function: `${NFTMarketAddress}::FixedPriceListing::list_token`,
      type_arguments: [],
      arguments: [creator, collection, name, price, "0"],
    };
    const tx = await excuteTransaction(address, listTokenPayload);
    if (tx) {
      await fetch("/api/aptos/auction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx,
          seller: address,
          creator,
          collection,
          name,
          description,
          price: price,
          isListing: true,
          uri,
          type: "FixedPriceSale",
        }),
      });
      router.push("/aptos-market");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {image && (
        <div className="w-1/5 my-8">
          <Card
            key={`${collection}/${name}`}
            data={{ name, collection, image: image }}
            type={"noraml"}
            onClick={undefined}
          />
        </div>
      )}

      <div className="w-1/4 flex flex-col pb-12">
        <input
          type="number"
          placeholder="Asset Price in Eth"
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
