import { models } from "../model-pricing-seed";

export class Model {
  private static readonly CHAR_PER_TOKEN = 4;
  private static readonly ESTIMATED_OUTPUT_TOKENS = 1000;

  static estimateInputTokens(content: string): number {
    return content.length / Model.CHAR_PER_TOKEN;
  }

  static estimateOutputTokens() {
    return Model.ESTIMATED_OUTPUT_TOKENS;
  }

  static getModel(modelId: string) {
    const model = models.find((m) => m.id === modelId);
    return model;
  }
}
