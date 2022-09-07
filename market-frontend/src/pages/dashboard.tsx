import { useTokens, useWallet } from "../hooks/useAptos";
import { useRouter } from "next/router";
import { ListCard } from "../components/ListCard";

export default function Dashboard() {
  const { address } = useWallet();
  const { tokens, loaded } = useTokens(address);
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
                  `/auction?creator=${token.creator}&name=${token.name}&collection=${token.collection}&description=${token.description}&uri=${token.uri}`
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
