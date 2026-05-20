import { create } from "zustand";

interface SidebarStore {
    open: boolean
    setOpen: (state: boolean) => void
}

export const useSidebar = create<SidebarStore>((set) => ({
    open: false,
    setOpen: (state) => set({ open: state })
}))