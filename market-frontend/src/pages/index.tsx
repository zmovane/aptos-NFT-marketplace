import { Offer } from "../types";
import { useOffers } from "../hooks";
import { useRouter } from "next/router";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../config/constants";
import { OfferCard } from "../components/OfferCard";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { TransactionPayload } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import { useContext } from "react";
import { ModalContext } from "../components/ModalContext";
import { Loading } from "../components/Loading";

export default function Home() {
  const router = useRouter();
  const { account, signAndSubmitTransaction } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);
  const { offers, loading } = useOffers();

  async function claimOffer(offer: Offer) {
    if (!account) {
      setModalState({ ...modalState, walletModal: true });
      return;
    }

    const payload: TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::buy_token`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        offer.token.creator,
        offer.token.collection,
        offer.token.name,
        `${offer.token.propertyVersion}`,
        `${offer.price}`,
        `${offer.id}`,
      ],
    };

    await signAndSubmitTransaction(payload);
    router.push("/dashboard");
  }

  return loading ? (
    <Loading />
  ) : !offers.length ? (
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
