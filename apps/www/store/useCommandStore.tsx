import { create } from "zustand";

interface CommandStore {
  open: boolean;
  setOpen: (state: boolean) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  open: false,
  setOpen: (state) => set({ open: state }),
}));
