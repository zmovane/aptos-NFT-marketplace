import { useEffect, useState } from "react";
import { Offer, Token } from "../types";
import { walletClient } from "../utils/aptos";

export function useWallet(): { address: string } {
  const [address, setAddress] = useState("");
  useEffect(() => {
    const connectAptosWallet = async () => {
      const { address } = await (window as any).martian.connect();
      if (address) {
        setAddress(address);
      }
    };
    if ("martian" in window) {
      connectAptosWallet();
    } else {
      window.open("https://www.martianwallet.xyz/", "_blank");
    }
  }, []);
  return { address };
}

export function useOffers(): {
  offers: Offer[];
  loaded: boolean;
} {
  const [offers, updateOffers] = useState<Offer[]>([]);
  const [loaded, updateLoaded] = useState(false);
  useEffect(() => {
    const fetchOffers = async () => {
      const response = await fetch("/api/offers");
      const offers = (await response.json()).map((i: any) => i as Offer);
      console.log(offers)

      updateOffers(offers);
      updateLoaded(true);
    };
    fetchOffers();
  }, []);
  return { offers, loaded };
}

export function useTokens(address: string): {
  tokens: Token[];
  loaded: boolean;
} {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getTokens = async () => {
      const tokenIds = await walletClient.getTokenIds(address, 100, 0);
      const tokens = await Promise.all(
        tokenIds.map(async (i) => {
          const token = await walletClient.getToken(i.data);

          return {
            propertyVersion: i.data.property_version,
            creator: i.data.token_data_id.creator,
            collection: token.collection,
            name: token.name,
            description: token.description,
            uri: token.uri,
            maximum: token.maximum,
            supply: token.supply,
          };
        })
      );
      setLoaded(true);
      setTokens(tokens);
    };
    if (address) {
      getTokens();
    }
  }, [address]);
  return { tokens, loaded };
}
