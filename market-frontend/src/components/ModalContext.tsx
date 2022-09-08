import { createContext } from "react";

export type ModalState = { walletModal: boolean };

export const ModalContext = createContext({
  modalState: {
    walletModal: false,
  },
  setModalState: (_: ModalState) => {},
});
