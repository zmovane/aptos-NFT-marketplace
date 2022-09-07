import { Offer } from "../types";
import { useOffers, useWallet } from "../hooks/useAptos";
import { excuteTransaction } from "../utils/aptos";
import { useRouter } from "next/router";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../config/constants";
import { OfferCard } from "../components/OfferCard";

export default function Home() {
  const router = useRouter();
  const { address } = useWallet();
  const { offers, loaded } = useOffers();

  async function claimOffer(offer: Offer) {
    const payload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::buy_token`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        offer.token.creator,
        offer.token.collection,
        offer.token.name,
        offer.token.propertyVersion,
        offer.price,
        offer.id,
      ],
    };
    await excuteTransaction(address, payload);
    router.push("/dashboard");
  }

  return loaded && !offers.length ? (
    <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
  ) : (
    <div className="p-6" style={{ maxWidth: "1600px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {offers.map((offer) => (
          <OfferCard data={offer} onClick={() => claimOffer(offer)} />
        ))}
      </div>
    </div>
  );
}
