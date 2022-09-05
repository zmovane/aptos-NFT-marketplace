import { TokenId } from "@martiandao/aptos-web3-bip44.js";
import { MarketId } from "../structs";

export interface ListTokenEventData {
  market_id: MarketId;
  price: string;
  token_id: TokenId;
  seller: string;
  timestamp: string;
  offer_id: string;
}
