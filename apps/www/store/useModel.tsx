import {
  AIModel,
  ModelProvider,
  SELECT_MODELS,
} from "@/lib/supported-models/models";
import { toast } from "sonner";
import { create } from "zustand";

interface ModelStore {
  modelId: string;
  modelName: string;
  setModel: (modelId: string) => void;
  setModelName: (name: string) => void;
  supportedModels: ModelProvider[];
  addToFavourites: (model: AIModel) => Promise<void>;
  removeFromFavourites: (favouriteId: string) => Promise<void>;
  fetch: () => Promise<void>;
}
export const useModel = create<ModelStore>((set, get) => ({
  supportedModels: SELECT_MODELS,
  modelId: "@cf/moonshotai/kimi-k2.6",
  modelName: "Kimi K2",
  setModel: (modelId) => set({ modelId }),
  setModelName: (name) => set({ modelName: name }),
  addToFavourites: async (model) => {
    const response = await fetch("http://localhost:8787/api/v1/ai/favourite", {
      method: "POST",
      body: JSON.stringify({
        modelId: model.id,
        displayName: model.displayName,
        description: model.description,
        capabilites: model.capabilities,
      }),
    });

    if (!response.ok) {
      toast.error("Something went wrong.");
      return
    }
    const json = await response.json();
    toast.success(json.message);
    set({
      supportedModels: get().supportedModels.map((provider) =>
        provider.id === "favourites"
          ? { ...provider, favourites: [...(provider.favourites ?? []), model] }
          : provider,
      ),
    });
  },
  removeFromFavourites: async (id) => {
    const response = await fetch(`http://localhost:8787/api/v1/ai/favourite/delete/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Something went wrong.");
      return
    }
    const json = await response.json();
    toast.success(json.message);

    set({ supportedModels: get().supportedModels.map((provider) =>
        provider.id === "favourites"
          ? { ...provider, favourites: provider.favourites?.filter((model => model.id !== id)) }
          : provider,
      )})
  },
  fetch: async () => {
    const response = await fetch("http://localhost:8787/api/v1/ai/favourite");
    const json = await response.json();

    if(!response.ok) {
      toast.error("Something went wrong")
      return;
    }

    set({ supportedModels: get().supportedModels.map((provider) =>
        provider.id === "favourites"
          ? { ...provider, favourites: json.data.favourites }
          : provider,
      )})
  }
}));
