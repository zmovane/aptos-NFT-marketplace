import { AccountKeys } from "@manahippo/aptos-wallet-adapter";
import { useEffect, useState } from "react";
import { Offer, Token } from "../types";
import { walletClient } from "../utils/aptos";

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
      updateOffers(offers);
      updateLoaded(true);
    };
    fetchOffers();
  }, []);
  return { offers, loaded };
}

export function useTokens(account: AccountKeys | null): {
  tokens: Token[];
  loaded: boolean;
} {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getTokens = async () => {
      const tokenIds = await walletClient.getTokenIds(
        account!.address!.toString(),
        100,
        0
      );
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
    if (account?.address) {
      getTokens();
    }
  }, [account]);
  return { tokens, loaded };
}
