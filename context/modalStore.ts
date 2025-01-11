import { create } from "zustand";

export type ModalType = "create::category:modal" | "create::quiz:modal";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data?: Record<string, any>;
  onOpen: ({
    type,
    data,
  }: {
    type: ModalType;
    data?: Record<string, any>;
  }) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  view: "main",
  data: undefined,
  onOpen: ({ type, data }) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: undefined }),
}));
