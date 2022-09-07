import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { data: offers, error } = await supabase
    .from("offers")
    .select("id,buyer,seller,price,status,createAt,updateAt,token:tokens(*)")
    .eq("status", "ongoing");
  if (error) {
    return res.status(500).json(error);
  } else {
    return res.status(200).json(offers);
  }
}
