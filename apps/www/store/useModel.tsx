import { create } from "zustand";


interface ModelStore {
    model: string,
    setModel: (model: string) => void
}
export const useModel = create<ModelStore>((set) => ({
    model: "",
    setModel: (model) => set({ model })
}))