import { create } from "zustand";

type useNewCategoryStore = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useIsEditorLoading = create<useNewCategoryStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
