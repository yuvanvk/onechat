import {
  Anthropic,
  Favourite,
  Gemini,
  Kimi,
  Meta,
  MistralAI,
  OpenAI,
  Qwen,
  xAI,
} from "@/components/icons";

export type ModelCapability =
  | "text"
  | "vision"
  | "reasoning"
  | "coding"
  | "image-gen"
  | "multilingual"
  | "multi-agent";

export interface AIModel {
  id: string;
  displayName: string;
  description: string;
  free: boolean;
  capabilities: ModelCapability[];
}

export interface ModelProvider {
  id: string;
  icon: any;
  models?: AIModel[];
  favourites?: AIModel[];
}
export const SELECT_MODELS: ModelProvider[] = [
  {
    id: "favourites",
    icon: Favourite,
    favourites: [],
  },
  {
    id: "openai",
    icon: OpenAI,
    models: [
      { id: "openai/gpt-5.5", displayName: "GPT-5.5", description: "OpenAI's most capable flagship model with advanced reasoning and multimodal understanding.", free: false, capabilities: ["text", "vision", "reasoning", "coding"] },
      { id: "openai/gpt-5.5-pro", displayName: "GPT-5.5 Pro", description: "Enhanced GPT-5.5 with deeper reasoning, built-in tools, and stateful context management.", free: false, capabilities: ["text", "vision", "reasoning", "coding"] },
      { id: "openai/gpt-5.4", displayName: "GPT-5.4", description: "OpenAI's flagship model with strong coding, reasoning, and multimodal capabilities.", free: false, capabilities: ["text", "vision", "coding"] },
      { id: "openai/gpt-5.4-pro", displayName: "GPT-5.4 Pro", description: "GPT-5.4 with built-in tools, improved reasoning, and stateful context for complex workflows.", free: false, capabilities: ["text", "vision", "coding"] },
      { id: "openai/gpt-5.4-mini", displayName: "GPT-5.4 Mini", description: "Smaller, faster, and cost-efficient version of GPT-5.4 optimized for lightweight tasks.", free: false, capabilities: ["text", "coding"] },
      { id: "openai/gpt-5.4-nano", displayName: "GPT-5.4 Nano", description: "OpenAI's smallest and fastest model, optimized for edge and low-latency use cases.", free: false, capabilities: ["text"] },
      { id: "openai/gpt-5", displayName: "GPT-5", description: "OpenAI's model excelling at coding, writing, and reasoning across diverse tasks.", free: false, capabilities: ["text", "vision", "reasoning", "coding"] },
      { id: "openai/gpt-4.1", displayName: "GPT-4.1", description: "OpenAI's flagship GPT model for complex tasks with a one million token context window.", free: false, capabilities: ["text", "vision", "coding"] },
      { id: "openai/gpt-4.1-mini", displayName: "GPT-4.1 Mini", description: "Fast and affordable version of GPT-4.1 with a million-token context window.", free: false, capabilities: ["text", "vision"] },
      { id: "openai/gpt-4o", displayName: "GPT-4o", description: "Omni model combining text, vision, and audio understanding in real time.", free: false, capabilities: ["text", "vision"] },
      { id: "openai/gpt-4o-mini", displayName: "GPT-4o Mini", description: "Lightweight GPT-4o variant optimized for speed and cost-efficiency.", free: false, capabilities: ["text", "vision"] },
      { id: "openai/o4-mini", displayName: "o4 Mini", description: "Fast, lightweight reasoning model optimized for multi-step problem solving at lower cost.", free: false, capabilities: ["text", "reasoning"] },
      { id: "openai/o3", displayName: "o3", description: "OpenAI's most powerful reasoning model for science, math, and complex coding tasks.", free: false, capabilities: ["text", "reasoning", "coding"] },
    ],
  },
  {
    id: "google",
    icon: Gemini,
    models: [
      { id: "google/gemini-3.1-pro", displayName: "Gemini 3.1 Pro", description: "Google's most intelligent Gemini model with improved reasoning and a 1M token context window.", free: false, capabilities: ["text", "vision", "reasoning", "multilingual"] },
      { id: "google/gemini-3-flash", displayName: "Gemini 3 Flash", description: "Google's fast multimodal model with frontier intelligence, superior search, and grounding.", free: false, capabilities: ["text", "vision", "multilingual"] },
      { id: "google/gemini-3.1-flash-lite", displayName: "Gemini 3.1 Flash Lite", description: "Google's lightest and most cost-efficient Gemini model for high-throughput tasks.", free: false, capabilities: ["text", "multilingual"] },
      { id: "google/gemini-2.5-pro", displayName: "Gemini 2.5 Pro", description: "Google's most capable Gemini 2.5 model with strong reasoning, thinking support, and 1M context.", free: false, capabilities: ["text", "vision", "reasoning", "multilingual"] },
      { id: "google/gemini-2.5-flash", displayName: "Gemini 2.5 Flash", description: "Google's fast multimodal Gemini 2.5 model with strong reasoning and a 1M token context window.", free: false, capabilities: ["text", "vision", "multilingual"] },
      { id: "google/gemini-2.5-flash-lite", displayName: "Gemini 2.5 Flash Lite", description: "Google's lightest and most cost-efficient Gemini 2.5 model for high-throughput tasks.", free: false, capabilities: ["text", "multilingual"] },
      { id: "google/gemma-4-26b-a4b-it", displayName: "Gemma 4 26B", description: "Google's most intelligent family of open models, built from Gemini 3 research for maximum intelligence-per-parameter.", free: false, capabilities: ["text", "vision"] },
    ],
  },
  {
    id: "anthropic",
    icon: Anthropic,
    models: [
      { id: "anthropic/claude-haiku-4.5", displayName: "Claude Haiku 4.5", description: "Anthropic's fastest and most compact Claude model, delivering quick responses at the lowest cost.", free: true, capabilities: ["text", "coding"] },
      { id: "anthropic/claude-sonnet-4.5", displayName: "Claude Sonnet 4.5", description: "Anthropic's best coding model to date with significant improvements across the entire development lifecycle.", free: false, capabilities: ["text", "vision", "coding", "reasoning"] },
      { id: "anthropic/claude-opus-4.8", displayName: "Claude Opus 4.8", description: "Anthropic's most capable model with adaptive thinking, step-change agentic coding, and 1M token context.", free: false, capabilities: ["text", "vision", "coding", "reasoning"] },
    ],
  },
  {
    id: "meta",
    icon: Meta,
    models: [
      { id: "meta-llama/llama-4-maverick", displayName: "Llama 4 Maverick", description: "Meta's multimodal Llama 4 model with mixture-of-experts architecture and strong reasoning.", free: false, capabilities: ["text", "vision", "multilingual"] },
      { id: "meta-llama/llama-4-scout-17b-16e-instruct", displayName: "Llama 4 Scout", description: "Meta's 17B natively multimodal model with 16 experts, optimized for vision and agentic tasks.", free: false, capabilities: ["text", "vision", "multilingual"] },
      { id: "meta-llama/llama-3.3-70b-instruct", displayName: "Llama 3.3 70B", description: "Meta's instruction-tuned 70B model delivering strong multilingual dialogue and agentic retrieval.", free: false, capabilities: ["text", "multilingual"] },
      { id: "meta-llama/llama-3.3-70b-instruct-fp8-fast", displayName: "Llama 3.3 70B Fast", description: "Llama 3.3 70B quantized to FP8 precision for faster inference with minimal quality tradeoff.", free: false, capabilities: ["text", "multilingual"] },
      { id: "meta-llama/llama-3.2-11b-vision-instruct", displayName: "Llama 3.2 11B Vision", description: "Llama 3.2 vision model optimized for visual recognition, image reasoning, and captioning.", free: false, capabilities: ["text", "vision"] },
      { id: "meta-llama/llama-3.3-70b-instruct:free", displayName: "Llama 3.3 70B Free", description: "Free tier access to Meta's Llama 3.3 70B instruction-tuned model.", free: true, capabilities: ["text", "multilingual"] },
    ],
  },
  {
    id: "kimi",
    icon: Kimi,
    models: [
      { id: "@cf/moonshotai/kimi-k2", displayName: "Kimi K2", description: "Moonshot AI's frontier MoE model with 1T parameters, excelling at long-horizon coding and agentic tasks.", free: true, capabilities: ["vision", "reasoning", "coding"] },
    ],
  },
  {
    id: "xAI",
    icon: xAI,
    models: [
      { id: "x-ai/grok-4.3", displayName: "Grok 4.3", description: "xAI's Grok 4.3 with 1M token context, strong agentic tool calling, and minimal hallucinations.", free: false, capabilities: ["text", "vision", "reasoning"] },
      { id: "x-ai/grok-4.20-multi-agent-0309", displayName: "Grok 4.20 Multi Agent", description: "xAI's multi-agent Grok model with 2M context, enabling parallel deep research across agents.", free: false, capabilities: ["text", "reasoning", "multi-agent"] },
      { id: "x-ai/grok-4.20-0309-reasoning", displayName: "Grok 4.20 Reasoning", description: "xAI's extended thinking model that works through complex problems with a visible reasoning trace.", free: false, capabilities: ["text", "reasoning"] },
      { id: "x-ai/grok-4.20-0309-non-reasoning", displayName: "Grok 4.20", description: "xAI's fast Grok 4.20 model with 2M context, skipping thinking trace for single-pass responses.", free: false, capabilities: ["text"] },
      { id: "x-ai/grok-3", displayName: "Grok 3", description: "xAI's flagship model trained on the Colossus supercluster, excelling at reasoning and analysis.", free: false, capabilities: ["text", "reasoning"] },
      { id: "x-ai/grok-3-mini", displayName: "Grok 3 Mini", description: "Lightweight and efficient Grok 3 model for fast, everyday tasks.", free: false, capabilities: ["text"] },
    ],
  },
  {
    id: "mistral",
    icon: MistralAI,
    models: [
      { id: "mistralai/mistral-large", displayName: "Mistral Large", description: "Mistral's top-tier model for complex reasoning, multilingual tasks, and nuanced instruction following.", free: false, capabilities: ["text", "multilingual"] },
      { id: "mistralai/mistral-small-3.1", displayName: "Mistral Small 3.1", description: "Mistral Small 3.1 adds state-of-the-art vision understanding and long context to the efficient Small 3 base.", free: false, capabilities: ["text", "vision", "multilingual"] },
      { id: "mistralai/codestral-2501", displayName: "Codestral", description: "Mistral's dedicated code model trained on 80+ programming languages, optimized for code generation and completion.", free: false, capabilities: ["text", "coding"] },
      { id: "mistralai/mistral-small-3.1-24b-instruct", displayName: "Mistral Small 3.1 24B", description: "24B instruction-tuned variant of Mistral Small 3.1 with vision support and strong multilingual performance.", free: false, capabilities: ["text", "vision", "multilingual"] },
      { id: "mistralai/mistral-7b-instruct:free", displayName: "Mistral 7B Free", description: "Free access to Mistral's efficient 7B instruction-tuned model, great for everyday text tasks.", free: true, capabilities: ["text"] },
    ],
  },
  {
    id: "qwen",
    icon: Qwen,
    models: [
      { id: "qwen/qwen3-235b-a22b", displayName: "Qwen3 235B", description: "Alibaba's flagship 235B MoE model with 22B active parameters, strong coding and multilingual reasoning.", free: false, capabilities: ["text", "reasoning", "coding", "multilingual"] },
      { id: "qwen/qwen3-max", displayName: "Qwen3 Max", description: "Alibaba's Qwen 3 Max with strong coding, reasoning, and multilingual capabilities.", free: false, capabilities: ["text", "reasoning", "multilingual"] },
      { id: "qwen/qwen3.5-397b-a17b", displayName: "Qwen3.5 397B", description: "Alibaba's Qwen 3.5 with 397B parameters and 17B active, offering superior reasoning and multilingual support.", free: false, capabilities: ["text", "reasoning", "coding", "multilingual"] },
      { id: "qwen/qwen3-235b-a22b:free", displayName: "Qwen3 235B Free", description: "Free tier access to Alibaba's Qwen3 235B MoE model.", free: true, capabilities: ["text", "reasoning", "coding", "multilingual"] },
      { id: "qwen/qwen3-30b-a3b:free", displayName: "Qwen3 30B Free", description: "Free tier access to Alibaba's compact Qwen3 30B model for everyday multilingual tasks.", free: true, capabilities: ["text", "multilingual"] },
    ],
  },

];