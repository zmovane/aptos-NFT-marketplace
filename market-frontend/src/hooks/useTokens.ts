import { AccountKeys } from "@manahippo/aptos-wallet-adapter";
import { useEffect, useState } from "react";
import { Token } from "../types";
import { walletClient } from "../utils/aptos";

export function useTokens(account: AccountKeys | null): {
  tokens: Token[];
  loading: boolean;
} {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTokens = async () => {
      const data = await walletClient.getTokenIds(
        account!.address!.toString(),
        100,
        0,
        0
      );
      const tokens = await Promise.all(
        data.tokenIds
          .filter((i) => i.difference != 0)
          .map(async (i) => {
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
      setLoading(false);
      setTokens(tokens);
    };
    if (account?.address) {
      getTokens();
    }
  }, [account]);
  return { tokens, loading };
}
