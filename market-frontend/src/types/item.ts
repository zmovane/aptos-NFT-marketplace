export type AuctionType = "FixedPriceSale" | "EnglishAuction" | "DucthAuction";

export interface NFTItem {
  id?: string;
  collection?: string;
  owner?: string;
  creator?: string;
  description: string;
  isListing: boolean;
  name: string;
  price?: string;
  seller?: string;
  type?: AuctionType;
  image: string;
  uri: string;
}
