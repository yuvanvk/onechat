import { SELECT_MODELS } from "@/lib/supported-models/models";

export function isModelImageGen(modelId: string): boolean {
    const model = SELECT_MODELS.flatMap(provider => provider.models ?? []).find(model => model.id === modelId);
    return model?.capabilities.includes("image-gen") ? true : false;
}