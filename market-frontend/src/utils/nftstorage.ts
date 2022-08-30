import { NFTStorage } from "nft.storage";
import * as fs from "fs/promises";
import mime from "mime";
import path from "path";

const nftStorageClient = new NFTStorage({
  token: process.env.NFT_STORAGE_KEY!,
});

export function setIPFSGateway(ipfsURl: string) {
  if (ipfsURl.startsWith("ipfs:"))
    return (
      "https://nftstorage.link/ipfs/" +
      new URL(ipfsURl).pathname.replace(/^\/\//, "")
    );
  return ipfsURl;
}

export async function uploadNFT(
  file: string | File,
  name: string,
  description: string
) {
  const image = await fileFromPath(file);
  return await nftStorageClient.store({ image, name, description });
}

async function fileFromPath(file: string | File) {
  if (file instanceof File) return file;
  const content = await fs.readFile(file);
  const type = mime.getType(file)!;
  return new File([content], path.basename(file), { type });
}
