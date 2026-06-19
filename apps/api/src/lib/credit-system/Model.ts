import { Db } from "./Db";

type _Model = {
  id: string;
  modelId: string;
  provider: string;
  inputRateUSD: number;
  outputRateUSD: number;
  imageRateUSD: number | null;
  tier: "free" | "pro";
  usecase: "text" | "image";
  isActive: boolean;
};

export class Model {
  private static readonly CHAR_PER_TOKEN = 4;
  private static readonly ESTIMATED_OUTPUT_TOKENS = 1000;
  private static cache: Record<string, _Model> | null = null;

  static async warmCache() {
    const db = Db.get();
    const modelsInDb = await db.query.model.findMany({ 
      columns: {
        id: true,
        modelId: true,
        provider: true,
        imageRateUSD: true,
        inputRateUSD: true,
        outputRateUSD: true,
        isActive: true,
        tier: true,
        usecase: true,
      }
    })

    Model.cache = {}
    for (const model of modelsInDb) {
      Model.cache[model.modelId] = model
    }
  }

  static estimateInputTokens(content: string): number {
    return content.length / Model.CHAR_PER_TOKEN;
  }

  static estimateOutputTokens(): number {
    return Model.ESTIMATED_OUTPUT_TOKENS;
  }

  static getModel(modelId: string): _Model {
    const model = Model.cache![modelId]
    if(!model) {
      throw new Error(`Unable to find model`)
    }
    return model;
    
  }
}
