import { create } from "zustand";

type useSummaryStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useSummary = create<useSummaryStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
