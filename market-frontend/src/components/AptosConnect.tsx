import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { WalletModal } from "./WalletModal";

export function AptosConnect() {
  const { account } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);

  return (
    <>
      {account?.address ? (
        <button
          className="btn btn-primary w-48"
          onClick={() => setModalState({ ...modalState, walletModal: true })}
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "inline",
          }}
        >
          {account!.address!.toString()!}
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => setModalState({ ...modalState, walletModal: true })}
        >
          Connect wallet
        </button>
      )}
      <WalletModal />
    </>
  );
}
