import { NextApiRequest, NextApiResponse } from "next";
import { marketDB } from "../../utils/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await marketDB();
  const collect = db.collection("auctions");
  const result = await collect
    .find({
      isListing: true,
    })
    .toArray();
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(500);
  }
}
