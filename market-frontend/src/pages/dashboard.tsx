import { useTokens } from "../hooks";
import { useRouter } from "next/router";
import { ListCard } from "../components/ListCard";
import { useWallet } from "@manahippo/aptos-wallet-adapter";

export default function Dashboard() {
  const { account } = useWallet();
  const { tokens, loaded } = useTokens(account);
  const router = useRouter();
  return loaded && !tokens.length ? (
    <h2 className="text-2xl p-8">No NFTs owned</h2>
  ) : (
    <div>
      <div className="p-6">
        <h2 className="text-2xl py-2">Items owned</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {tokens.map((token, i) => (
            <ListCard
              key={i.toString()}
              data={token}
              onClick={() =>
                router.push(
                  `/make-offer?creator=${token.creator}&name=${token.name}&collection=${token.collection}&description=${token.description}&uri=${token.uri}`
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
