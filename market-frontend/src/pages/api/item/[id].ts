import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { marketDB } from "../../../utils/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const db = await marketDB();
  const collect = db.collection("auctions");
  const result = await collect.updateOne(
    {
      _id: new ObjectId(id as string),
    },
    { $set: { isListing: false } }
  );
  if (result.acknowledged && result.modifiedCount > 0) {
    return res.status(200).json({});
  } else {
    return res.status(404);
  }
}
