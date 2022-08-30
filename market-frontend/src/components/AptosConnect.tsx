import { useAptosWallet } from "../hooks/useAptos";

export function AptosConnect() {
  const { address } = useAptosWallet();
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
