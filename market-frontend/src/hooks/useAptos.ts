import { useEffect, useState } from "react";
import { MARKET_ADDRESS } from "../config/constants";
import { NFTItem } from "../types/item";
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

export function useListedItems(): {
  listedTokens: NFTItem[];
  loaded: boolean;
} {
  const [listedItems, updateListedItems] = useState<NFTItem[]>([]);
  const [loaded, updateLoaded] = useState(false);
  useEffect(() => {
    const fetchListedItems = async () => {
      const listTokenEvents = await walletClient.getEventStream(
        MARKET_ADDRESS!,
        `${MARKET_ADDRESS}::marketplace::MarketEvents`,
        "list_token_events"
      );
      const items: NFTItem[] = await Promise.all(
        listTokenEvents.map(async (event: any) => {
          const tokenId = event.data.token_id;
          const token = await walletClient.getToken(tokenId);
          const item: NFTItem = {
            id: event.data.offer_id,
            collection: token.collection,
            owner: MARKET_ADDRESS,
            creator: tokenId.token_data_id.creator,
            description: token.description,
            name: token.name,
            price: event.data.price,
            seller: tokenId.creator,
            type: "FixedPriceSale",
            uri: token.uri,
          };
          return item;
        })
      );
      updateListedItems(items);
      updateLoaded(true);
    };
    fetchListedItems();
  }, []);
  return { listedTokens: listedItems, loaded };
}

export function useTokens(address: string): {
  items: NFTItem[];
  loaded: boolean;
} {
  const [items, setItems] = useState<NFTItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getTokens = async () => {
      const tokenIds = await walletClient.getTokenIds(address, 100, 0);
      const tokens = await Promise.all(
        tokenIds.map(async (i) => {
          const token = await walletClient.getToken(i.data);
          token.creator = i.data.token_data_id.creator;
          return token;
        })
      );
      setLoaded(true);
      setItems(tokens);
    };
    if (address) {
      getTokens();
    }
  }, [address]);
  return { items, loaded };
}
