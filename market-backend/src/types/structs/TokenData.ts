export interface TokenData {
  /** Unique name within this creator's account for this Token's collection */
  collection: string;

  /** Description of Token */
  description: string;

  /** Name of Token */
  name: string;

  /** Optional maximum number of this Token */
  maximum?: string;

  /** Total number of this type of Token */
  supply: string;

  /** URL for additional information / media */
  uri: string;
}
