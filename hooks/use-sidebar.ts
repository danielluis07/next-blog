import { create } from "zustand";

type useOpenSidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenSidebar = create<useOpenSidebarStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
