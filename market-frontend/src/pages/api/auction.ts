import { NextApiRequest, NextApiResponse } from "next";
import { marketDB } from "../../utils/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await marketDB();
  const collect = db.collection("auctions");
  const result = await collect.insertOne(req.body);
  if (result.acknowledged) {
    return res.status(200).json({});
  } else {
    return res.status(500).json({ message: "failed to list auction" });
  }
}
