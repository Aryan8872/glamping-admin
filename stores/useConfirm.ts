import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  message: string;
  resolve?: (value: boolean) => void; // Promise resolver

  confirm: (message: string) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirm = create<ConfirmState>((set, get) => ({
  isOpen: false,
  message: "",
  resolve: undefined,

  confirm: (message: string) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        message,
        resolve,
      });
    });
  },

  handleConfirm: () => {
    const { resolve } = get();
    resolve?.(true);
    set({ isOpen: false });
  },

  handleCancel: () => {
    const { resolve } = get();
    resolve?.(false);
    set({ isOpen: false });
  },
}));
