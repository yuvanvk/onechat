import { create } from "zustand";

interface ModelStore {
  modelId: string;
  modelName: string;
  setModel: (model: string) => void;
  setModelName: (name: string) => void;
}
export const useModel = create<ModelStore>((set) => ({
  modelId: "@cf/moonshotai/kimi-k2",
  modelName: "Kimi k2",
  setModel: (modelId) => set({ modelId }),
  setModelName: (name) => set({ modelName: name }),
}));
