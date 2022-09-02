import { useWallet } from "../hooks/useAptos";

export function AptosConnect() {
  const { address } = useWallet();
  return address ? (
    <button
      className="btn btn-primary w-48"
      style={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        display: "inline",
      }}
    >
      {address}
    </button>
  ) : (
    <>
      <button
        className="btn btn-primary w-48"
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          display: "inline",
        }}
      >
        Connect wallet
      </button>
    </>
  );
}
