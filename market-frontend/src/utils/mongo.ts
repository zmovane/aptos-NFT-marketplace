import { Db, MongoClient } from "mongodb";

const DBNAME_NFT_MARKET = "NFTMARKET";
const MONGODB_URL = process.env.MONGODB_URL ?? "mongodb://localhost:27017";

let client: MongoClient | null;
const dbs = new Map<string, Db>();

async function installDB(url: string): Promise<MongoClient> {
  const client = new MongoClient(url);
  await client.connect();
  console.info("Connected successfully to mongodb");
  return client;
}

export async function mongoDB(dbname: string): Promise<Db> {
  if (!client) {
    client = await installDB(MONGODB_URL);
  }
  if (!dbs.get(dbname)) {
    dbs.set(dbname, client.db(dbname));
  }
  return dbs.get(dbname)!;
}

export const marketDB = async () => mongoDB(DBNAME_NFT_MARKET);
