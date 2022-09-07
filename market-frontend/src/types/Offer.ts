import { Token } from "./Token";

export type Status = "ongoing" | "finished" | "revoked";

export interface Offer {
  id: number;
  seller: string;
  buyer?: string;
  price: number;
  status: Status;
  createAt: Date;
  updateAt?: Date;
  token: Token;
}
