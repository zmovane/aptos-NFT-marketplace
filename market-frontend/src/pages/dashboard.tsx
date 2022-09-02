import { Card } from "../components/card";
import { useTokens, useWallet } from "../hooks/useAptos";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { address } = useWallet();
  const { items, loaded } = useTokens(address);
  const router = useRouter();
  return loaded && !items.length ? (
    <h2 className="text-2xl p-8">No NFTs owned</h2>
  ) : (
    <div>
      <div className="p-6">
        <h2 className="text-2xl py-2">Items owned</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {items.map((item, i) => (
            <Card
              key={i.toString()}
              data={item}
              onClick={() =>
                router.push(
                  `/auction?creator=${item.creator}&name=${item.name}&collection=${item.collection}&description=${item.description}&uri=${item.uri}`
                )
              }
              type={"withListBtn"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
