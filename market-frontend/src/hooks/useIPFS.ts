import axios from "axios";
import { useEffect, useState } from "react";
import { setIPFSGateway } from "../utils/nftstorage";

export function useIPFSImage(uri: string | string[] | undefined) {
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    const fetch = async () => {
      if (uri) {
        const meta = await axios.get(setIPFSGateway(uri as string));
        setImage(setIPFSGateway(meta.data.image));
      }
    };
    fetch();
  }, [uri]);
  return image;
}
