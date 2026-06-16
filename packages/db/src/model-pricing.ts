// Strategy: fair to users, targets ~$10k/month margin
//
// Markup tiers applied:
//   free tier CF models  → 1.20x  (loss leaders, build loyalty)
//   cheap pro  (<$3/M)   → 1.35x  (high volume, thin margin)
//   mid pro    ($3–$8/M) → 1.50x  (bread and butter revenue)
//   upper pro  ($8–$20M) → 1.60x–1.75x
//   flagship   (>$20/M)  → 1.90x  (power users, price insensitive)

// Credit formula (use this everywhere):
//   raw_cost     = (inputTokens / 1_000_000 * inputRateUSD)
//                + (outputTokens / 1_000_000 * outputRateUSD)
//   credits      = Math.max(1, Math.ceil(raw_cost / CREDIT_VALUE))
//

export const CREDIT_VALUE = 0.0001; // 1 credit = $0.0001 USD

export interface ModelRate {
  modelId: string;
  provider:
    | "openai"
    | "anthropic"
    | "google"
    | "meta"
    | "mistralai"
    | "xai"
    | "deepseek"
    | "alibaba"
    | "moonshotai"
    | "recraft"
    | "black-forest-labs";
  rawInputRateUSD: number;
  rawOutputRateUSD: number;
  inputRateUSD: number;
  outputRateUSD: number;
  imageRateUSD?: number;
  markupMultiplier: number;
  minTier: "free" | "pro";
  usecase: "text" | "image";
}

export const modelRates: ModelRate[] = [
  {
    modelId: "openai/gpt-5.5",
    provider: "openai",
    rawInputRateUSD: 5.0,
    rawOutputRateUSD: 30.0,
    inputRateUSD: 9.5,        
    outputRateUSD: 57.0,      
    markupMultiplier: 1.90,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-5.5-pro",
    provider: "openai",
    rawInputRateUSD: 30.0,
    rawOutputRateUSD: 180.0,
    inputRateUSD: 57.0,       
    outputRateUSD: 342.0,     
    markupMultiplier: 1.90,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-5.4",
    provider: "openai",
    rawInputRateUSD: 2.5,
    rawOutputRateUSD: 15.0,
    inputRateUSD: 4.38,       
    outputRateUSD: 26.25,     
    markupMultiplier: 1.75,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-5.4-pro",
    provider: "openai",
    rawInputRateUSD: 30.0,
    rawOutputRateUSD: 180.0,
    inputRateUSD: 57.0,       
    outputRateUSD: 342.0,     
    markupMultiplier: 1.90,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-5.4-mini",
    provider: "openai",
    rawInputRateUSD: 0.75,
    rawOutputRateUSD: 4.5,
    inputRateUSD: 1.01,       
    outputRateUSD: 6.08,      
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-5.4-nano",
    provider: "openai",
    rawInputRateUSD: 0.2,
    rawOutputRateUSD: 1.25,
    inputRateUSD: 0.27,       
    outputRateUSD: 1.69,      
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-5",
    provider: "openai",
    rawInputRateUSD: 1.25,
    rawOutputRateUSD: 10.0,
    inputRateUSD: 2.0,        
    outputRateUSD: 16.0,      
    markupMultiplier: 1.60,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-4.1",
    provider: "openai",
    rawInputRateUSD: 2.0,
    rawOutputRateUSD: 8.0,
    inputRateUSD: 3.0,        
    outputRateUSD: 12.0,      
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-4.1-mini",
    provider: "openai",
    rawInputRateUSD: 0.4,
    rawOutputRateUSD: 1.6,
    inputRateUSD: 0.54,       // 0.4 * 1.35
    outputRateUSD: 2.16,      // 1.6 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-4o",
    provider: "openai",
    rawInputRateUSD: 2.5,
    rawOutputRateUSD: 10.0,
    inputRateUSD: 3.75,       // 2.5 * 1.50
    outputRateUSD: 15.0,      // 10.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/gpt-4o-mini",
    provider: "openai",
    rawInputRateUSD: 0.15,
    rawOutputRateUSD: 0.6,
    inputRateUSD: 0.2,        // 0.15 * 1.35
    outputRateUSD: 0.81,      // 0.6 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/o4-mini",
    provider: "openai",
    rawInputRateUSD: 1.1,
    rawOutputRateUSD: 4.4,
    inputRateUSD: 1.49,       // 1.1 * 1.35
    outputRateUSD: 5.94,      // 4.4 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "openai/o3",
    provider: "openai",
    rawInputRateUSD: 2.0,
    rawOutputRateUSD: 8.0,
    inputRateUSD: 3.0,        // 2.0 * 1.50
    outputRateUSD: 12.0,      // 8.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // ANTHROPIC
  // ─────────────────────────────────────────

  {
    modelId: "anthropic/claude-haiku-4.5",
    provider: "anthropic",
    rawInputRateUSD: 1.0,
    rawOutputRateUSD: 5.0,
    inputRateUSD: 1.35,       // 1.0 * 1.35
    outputRateUSD: 6.75,      // 5.0 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "anthropic/claude-sonnet-4.5",
    provider: "anthropic",
    rawInputRateUSD: 3.0,
    rawOutputRateUSD: 15.0,
    inputRateUSD: 4.5,        // 3.0 * 1.50
    outputRateUSD: 22.5,      // 15.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "anthropic/claude-opus-4.8",
    provider: "anthropic",
    rawInputRateUSD: 5.0,
    rawOutputRateUSD: 25.0,
    inputRateUSD: 8.75,       // 5.0 * 1.75
    outputRateUSD: 43.75,     // 25.0 * 1.75
    markupMultiplier: 1.75,
    minTier: "pro",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // GOOGLE
  // ─────────────────────────────────────────

  {
    modelId: "google/gemini-3.1-pro",
    provider: "google",
    rawInputRateUSD: 2.0,
    rawOutputRateUSD: 12.0,
    inputRateUSD: 3.2,        // 2.0 * 1.60
    outputRateUSD: 19.2,      // 12.0 * 1.60
    markupMultiplier: 1.60,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "google/gemini-3-flash",
    provider: "google",
    rawInputRateUSD: 0.5,
    rawOutputRateUSD: 3.0,
    inputRateUSD: 0.68,       // 0.5 * 1.35
    outputRateUSD: 4.05,      // 3.0 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "google/gemini-3.1-flash-lite",
    provider: "google",
    rawInputRateUSD: 0.25,
    rawOutputRateUSD: 1.5,
    inputRateUSD: 0.34,       // 0.25 * 1.35
    outputRateUSD: 2.03,      // 1.5 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "google/gemini-2.5-pro",
    provider: "google",
    rawInputRateUSD: 1.25,
    rawOutputRateUSD: 10.0,
    inputRateUSD: 2.0,        // 1.25 * 1.60
    outputRateUSD: 16.0,      // 10.0 * 1.60
    markupMultiplier: 1.60,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "google/gemini-2.5-flash",
    provider: "google",
    rawInputRateUSD: 0.3,
    rawOutputRateUSD: 2.5,
    inputRateUSD: 0.41,       // 0.3 * 1.35
    outputRateUSD: 3.38,      // 2.5 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "google/gemini-2.5-flash-lite",
    provider: "google",
    rawInputRateUSD: 0.1,
    rawOutputRateUSD: 0.4,
    inputRateUSD: 0.14,       // 0.1 * 1.35
    outputRateUSD: 0.54,      // 0.4 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "@cf/google/gemma-4-26b-a4b-it",
    provider: "google",
    rawInputRateUSD: 0.1,
    rawOutputRateUSD: 0.3,
    inputRateUSD: 0.12,       // 0.1 * 1.20
    outputRateUSD: 0.36,      // 0.3 * 1.20
    markupMultiplier: 1.20,
    minTier: "free",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // META
  // ─────────────────────────────────────────

  {
    modelId: "@cf/meta/llama-4-scout-17b-16e-instruct",
    provider: "meta",
    rawInputRateUSD: 0.27,
    rawOutputRateUSD: 0.85,
    inputRateUSD: 0.32,       // 0.27 * 1.20
    outputRateUSD: 1.02,      // 0.85 * 1.20
    markupMultiplier: 1.20,
    minTier: "free",
    usecase: "text",
  },
  {
    modelId: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    provider: "meta",
    rawInputRateUSD: 0.29,
    rawOutputRateUSD: 2.25,
    inputRateUSD: 0.39,       // 0.29 * 1.35
    outputRateUSD: 3.04,      // 2.25 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "@cf/meta/llama-3.2-11b-vision-instruct",
    provider: "meta",
    rawInputRateUSD: 0.049,
    rawOutputRateUSD: 0.68,
    inputRateUSD: 0.059,      // 0.049 * 1.20
    outputRateUSD: 0.816,     // 0.68 * 1.20
    markupMultiplier: 1.20,
    minTier: "free",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // MISTRAL
  // ─────────────────────────────────────────

  {
    modelId: "@cf/mistralai/mistral-small-3.1-24b-instruct",
    provider: "mistralai",
    rawInputRateUSD: 0.35,
    rawOutputRateUSD: 0.56,
    inputRateUSD: 0.42,       // 0.35 * 1.20
    outputRateUSD: 0.67,      // 0.56 * 1.20
    markupMultiplier: 1.20,
    minTier: "free",
    usecase: "text",
  },
  {
    modelId: "@cf/mistral/mistral-7b-instruct-v0.2-lora",
    provider: "mistralai",
    rawInputRateUSD: 0.4,
    rawOutputRateUSD: 0.5,
    inputRateUSD: 0.48,       // 0.4 * 1.20
    outputRateUSD: 0.6,       // 0.5 * 1.20
    markupMultiplier: 1.20,
    minTier: "free",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // XAI
  // ─────────────────────────────────────────

  {
    modelId: "xai/grok-4.3",
    provider: "xai",
    rawInputRateUSD: 1.25,
    rawOutputRateUSD: 2.5,
    inputRateUSD: 1.69,       // 1.25 * 1.35
    outputRateUSD: 3.38,      // 2.5 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "xai/grok-4.20-multi-agent-0309",
    provider: "xai",
    rawInputRateUSD: 2.0,
    rawOutputRateUSD: 6.0,
    inputRateUSD: 3.0,        // 2.0 * 1.50
    outputRateUSD: 9.0,       // 6.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "xai/grok-4.20-0309-reasoning",
    provider: "xai",
    rawInputRateUSD: 2.0,
    rawOutputRateUSD: 6.0,
    inputRateUSD: 3.0,        // 2.0 * 1.50
    outputRateUSD: 9.0,       // 6.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "xai/grok-4.20-0309-non-reasoning",
    provider: "xai",
    rawInputRateUSD: 2.0,
    rawOutputRateUSD: 6.0,
    inputRateUSD: 3.0,        // 2.0 * 1.50
    outputRateUSD: 9.0,       // 6.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // DEEPSEEK
  // ─────────────────────────────────────────

  {
    modelId: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
    provider: "deepseek",
    rawInputRateUSD: 0.5,
    rawOutputRateUSD: 4.88,
    inputRateUSD: 0.68,       // 0.5 * 1.35
    outputRateUSD: 6.59,      // 4.88 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // ALIBABA / QWEN
  // ─────────────────────────────────────────

  {
    modelId: "alibaba/qwen3-max",
    provider: "alibaba",
    rawInputRateUSD: 1.2,
    rawOutputRateUSD: 6.0,
    inputRateUSD: 1.8,        // 1.2 * 1.50
    outputRateUSD: 9.0,       // 6.0 * 1.50
    markupMultiplier: 1.50,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "alibaba/qwen3.5-397b-a17b",
    provider: "alibaba",
    rawInputRateUSD: 0.6,
    rawOutputRateUSD: 3.6,
    inputRateUSD: 0.81,       // 0.6 * 1.35
    outputRateUSD: 4.86,      // 3.6 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "@cf/qwen/qwq-32b",
    provider: "alibaba",
    rawInputRateUSD: 0.66,
    rawOutputRateUSD: 1.0,
    inputRateUSD: 0.89,       // 0.66 * 1.35
    outputRateUSD: 1.35,      // 1.0 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },
  {
    modelId: "@cf/qwen/qwen3-30b-a3b-fp8",
    provider: "alibaba",
    rawInputRateUSD: 0.051,
    rawOutputRateUSD: 0.34,
    inputRateUSD: 0.061,      // 0.051 * 1.20
    outputRateUSD: 0.408,     // 0.34 * 1.20
    markupMultiplier: 1.20,
    minTier: "free",
    usecase: "text",
  },
  {
    modelId: "@cf/qwen/qwen2.5-coder-32b-instruct",
    provider: "alibaba",
    rawInputRateUSD: 0.66,
    rawOutputRateUSD: 1.0,
    inputRateUSD: 0.89,       // 0.66 * 1.35
    outputRateUSD: 1.35,      // 1.0 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // MOONSHOT
  // ─────────────────────────────────────────

  {
    modelId: "@cf/moonshotai/kimi-k2.6",
    provider: "moonshotai",
    rawInputRateUSD: 0.95,
    rawOutputRateUSD: 4.0,
    inputRateUSD: 1.28,       // 0.95 * 1.35
    outputRateUSD: 5.4,       // 4.0 * 1.35
    markupMultiplier: 1.35,
    minTier: "pro",
    usecase: "text",
  },

  // ─────────────────────────────────────────
  // IMAGE GENERATION MODELS
  // ─────────────────────────────────────────

  {
    modelId: "openai/gpt-image-1.5",
    provider: "openai",
    rawInputRateUSD: 0,
    rawOutputRateUSD: 0,
    inputRateUSD: 0,
    outputRateUSD: 0,
    imageRateUSD: 0.04,
    markupMultiplier: 1.0,
    minTier: "pro",
    usecase: "image",
  },
  {
    modelId: "google/imagen-4",
    provider: "google",
    rawInputRateUSD: 0,
    rawOutputRateUSD: 0,
    inputRateUSD: 0,
    outputRateUSD: 0,
    imageRateUSD: 0.04,
    markupMultiplier: 1.0,
    minTier: "pro",
    usecase: "image",
  },
  {
    modelId: "recraft/recraftv4-pro",
    provider: "recraft",
    rawInputRateUSD: 0,
    rawOutputRateUSD: 0,
    inputRateUSD: 0,
    outputRateUSD: 0,
    imageRateUSD: 0.04,
    markupMultiplier: 1.0,
    minTier: "pro",
    usecase: "image",
  },
  {
    modelId: "recraft/recraftv4-vector",
    provider: "recraft",
    rawInputRateUSD: 0,
    rawOutputRateUSD: 0,
    inputRateUSD: 0,
    outputRateUSD: 0,
    imageRateUSD: 0.04,
    markupMultiplier: 1.0,
    minTier: "pro",
    usecase: "image",
  },
  {
    modelId: "black-forest-labs/flux-2-pro-preview",
    provider: "black-forest-labs",
    rawInputRateUSD: 0,
    rawOutputRateUSD: 0,
    inputRateUSD: 0,
    outputRateUSD: 0,
    imageRateUSD: 0.05,
    markupMultiplier: 1.0,
    minTier: "pro",
    usecase: "image",
  },
  {
    modelId: "@cf/black-forest-labs/flux-1-schnell",
    provider: "black-forest-labs",
    rawInputRateUSD: 0,
    rawOutputRateUSD: 0,
    inputRateUSD: 0,
    outputRateUSD: 0,
    imageRateUSD: 0.01,
    markupMultiplier: 1.0,
    minTier: "free",
    usecase: "image",
  },
];

// ─────────────────────────────────────────────────────────────
// CREDIT CALCULATION UTILITY
// Use this function everywhere you deduct credits
// ─────────────────────────────────────────────────────────────

export function calculateCredits(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const model = modelRates.find((m) => m.modelId === modelId);
  if (!model) throw new Error(`Unknown modelId: ${modelId}`);

  const rawCost =
    (inputTokens / 1_000_000) * model.inputRateUSD +
    (outputTokens / 1_000_000) * model.outputRateUSD;

  return Math.max(1, Math.ceil(rawCost / CREDIT_VALUE));
}

export function calculateImageCredits(modelId: string): number {
  const model = modelRates.find((m) => m.modelId === modelId);
  if (!model) throw new Error(`Unknown modelId: ${modelId}`);
  if (!model.imageRateUSD) throw new Error(`Model ${modelId} has no image rate configured`);

  return Math.max(1, Math.ceil(model.imageRateUSD / CREDIT_VALUE));
}

// ─────────────────────────────────────────────────────────────
// YOUR MARGIN CALCULATOR (for your own tracking, never expose)
// ─────────────────────────────────────────────────────────────

export function calculateMargin(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): { providerCostUSD: number; revenueUSD: number; marginUSD: number } {
  const model = modelRates.find((m) => m.modelId === modelId);
  if (!model) throw new Error(`Unknown modelId: ${modelId}`);

  const providerCostUSD =
    (inputTokens / 1_000_000) * model.rawInputRateUSD +
    (outputTokens / 1_000_000) * model.rawOutputRateUSD;

  const credits = calculateCredits(modelId, inputTokens, outputTokens);
  const revenueUSD = credits * CREDIT_VALUE;
  const marginUSD = revenueUSD - providerCostUSD;

  return { providerCostUSD, revenueUSD, marginUSD };
}