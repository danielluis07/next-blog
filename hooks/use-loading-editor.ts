import { create } from "zustand";

type useIsLoadingStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useIsLoading = create<useIsLoadingStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
