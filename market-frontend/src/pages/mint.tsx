import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { nftStorage } from "../utils/nftstorage";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import {
  createCollectionPayload,
  createTokenPayload,
  walletClient,
} from "../utils/aptos";

export default function Mint() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const [base64image, setBase64image] = useState("");
  const [formInput, updateFormInput] = useState<{
    collection: string;
    name: string;
    description: string;
    file: File | null;
  }>({
    collection: "",
    name: "",
    description: "",
    file: null,
  });

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    updateFormInput({ ...formInput, file: file });
    const reader = new FileReader();
    reader.onload = function (event) {
      setBase64image(event.target!.result!.toString());
    };
    reader.readAsDataURL(file);
  }

  async function createCollection(address: string, collection: string) {
    try {
      await walletClient.getCollection(address, collection);
    } catch (e) {
      await signAndSubmitTransaction(
        createCollectionPayload(
          collection,
          "_1200_dollars_per_hour",
          "https://github.com/amovane/aptos-NFT-marketplace"
        )
      );
    }
  }

  async function mintNFT() {
    const { collection, name, description, file } = formInput;
    if (!account || !collection || !name || !description || !file) return;
    setLoading(true);
    try {
      const address = account!.address!.toString();
      const token = await nftStorage.upload(file, name, description);
      const image = await nftStorage.getImageURL(token.url);

      await createCollection(address, collection);
      await signAndSubmitTransaction(
        createTokenPayload(collection, name, description, image, address)
      );
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.log("Error create NFT: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Collection Name"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, collection: e.target.value })
          }
        />
        <input
          placeholder="Token Name"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Token Description"
          className="mt-2 p-4 textarea textarea-primary input-lg w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {base64image && (
          <img className="rounded mt-4" width="350" src={base64image} />
        )}
        <button
          onClick={mintNFT}
          className={
            (loading ? "loading " : "") +
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
