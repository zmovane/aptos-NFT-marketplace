import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useContext, useEffect } from "react";
import { KEY_CONNECTED_WALLET } from "../config/constants";
import { ModalContext } from "./ModalContext";
import { WalletModal } from "./WalletModal";

export function AptosConnect() {
  const { account, connect } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);

  useEffect(() => {
    const connectedWallet = localStorage.getItem(KEY_CONNECTED_WALLET);
    if (connectedWallet) {
      connect(connectedWallet);
    }
  }, []);

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
