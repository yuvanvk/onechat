import { create } from "zustand";

interface ModelStore {
  modelId: string;
  modelName: string;
  setModel: (modelId: string) => void;
  setModelName: (name: string) => void;
}
export const useModel = create<ModelStore>((set) => ({
  modelId: "@cf/moonshotai/kimi-k2.6",
  modelName: "Kimi K2",
  setModel: (modelId) => set({ modelId }),
  setModelName: (name) => set({ modelName: name }),
}));
