import { create } from "zustand";

type useNewCategoryStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewCategory = create<useNewCategoryStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
