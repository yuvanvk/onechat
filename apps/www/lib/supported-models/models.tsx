import {
  Anthropic,
  DeepSeek,
  Favourite,
  Flux,
  Gemini,
  Kimi,
  Meta,
  MistralAI,
  OpenAI,
  Qwen,
  Recraft,
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
      {
        id: "openai/gpt-5.5",
        displayName: "GPT-5.5",
        description:
          "OpenAI's most capable flagship model with advanced reasoning and multimodal understanding.",
        free: false,
        capabilities: ["text", "vision", "reasoning", "coding"],
      },
      {
        id: "openai/gpt-5.5-pro",
        displayName: "GPT-5.5 Pro",
        description:
          "Enhanced GPT-5.5 with deeper reasoning, built-in tools, and stateful context management.",
        free: false,
        capabilities: ["text", "vision", "reasoning", "coding"],
      },
      {
        id: "openai/gpt-5.4",
        displayName: "GPT-5.4",
        description:
          "OpenAI's flagship model with strong coding, reasoning, and multimodal capabilities.",
        free: false,
        capabilities: ["text", "vision", "coding"],
      },
      {
        id: "openai/gpt-5.4-pro",
        displayName: "GPT-5.4 Pro",
        description:
          "GPT-5.4 with built-in tools, improved reasoning, and stateful context for complex workflows.",
        free: false,
        capabilities: ["text", "vision", "coding"],
      },
      {
        id: "openai/gpt-5.4-mini",
        displayName: "GPT-5.4 Mini",
        description:
          "Smaller, faster, and cost-efficient version of GPT-5.4 optimized for lightweight tasks.",
        free: false,
        capabilities: ["text", "coding"],
      },
      {
        id: "openai/gpt-5.4-nano",
        displayName: "GPT-5.4 Nano",
        description:
          "OpenAI's smallest and fastest model, optimized for edge and low-latency use cases.",
        free: false,
        capabilities: ["text"],
      },
      {
        id: "openai/gpt-5",
        displayName: "GPT-5",
        description:
          "OpenAI's model excelling at coding, writing, and reasoning across diverse tasks.",
        free: false,
        capabilities: ["text", "vision", "reasoning", "coding"],
      },
      {
        id: "openai/gpt-4.1",
        displayName: "GPT-4.1",
        description:
          "OpenAI's flagship GPT model for complex tasks with a one million token context window.",
        free: false,
        capabilities: ["text", "vision", "coding"],
      },
      {
        id: "openai/gpt-4.1-mini",
        displayName: "GPT-4.1 Mini",
        description:
          "Fast and affordable version of GPT-4.1 with a million-token context window.",
        free: false,
        capabilities: ["text", "vision"],
      },
      {
        id: "openai/gpt-4o",
        displayName: "GPT-4o",
        description:
          "Omni model combining text, vision, and audio understanding in real time.",
        free: false,
        capabilities: ["text", "vision"],
      },
      {
        id: "openai/gpt-4o-mini",
        displayName: "GPT-4o Mini",
        description:
          "Lightweight GPT-4o variant optimized for speed and cost-efficiency.",
        free: false,
        capabilities: ["text", "vision"],
      },
      {
        id: "openai/o4-mini",
        displayName: "o4 Mini",
        description:
          "Fast, lightweight reasoning model optimized for multi-step problem solving at lower cost.",
        free: false,
        capabilities: ["text", "reasoning"],
      },
      {
        id: "openai/o3",
        displayName: "o3",
        description:
          "OpenAI's most powerful reasoning model for science, math, and complex coding tasks.",
        free: false,
        capabilities: ["text", "reasoning", "coding"],
      },
      {
        id: "openai/gpt-image-1.5",
        displayName: "GPT Image 1.5",
        description:
          "OpenAI's image generation model that creates and edits images from text prompt.",
        free: false,
        capabilities: ["image-gen"],
      },
    ],
  },
  {
    id: "google",
    icon: Gemini,
    models: [
      {
        id: "google/gemini-3.1-pro",
        displayName: "Gemini 3.1 Pro",
        description:
          "Google's most intelligent Gemini model with improved reasoning and a 1M token context window.",
        free: false,
        capabilities: ["text", "vision", "reasoning", "multilingual"],
      },
      {
        id: "google/gemini-3-flash",
        displayName: "Gemini 3 Flash",
        description:
          "Google's fast multimodal model with frontier intelligence, superior search, and grounding.",
        free: false,
        capabilities: ["text", "vision", "multilingual"],
      },
      {
        id: "google/gemini-3.1-flash-lite",
        displayName: "Gemini 3.1 Flash Lite",
        description:
          "Google's lightest and most cost-efficient Gemini model for high-throughput tasks.",
        free: false,
        capabilities: ["text", "multilingual"],
      },
      {
        id: "google/gemini-2.5-pro",
        displayName: "Gemini 2.5 Pro",
        description:
          "Google's most capable Gemini 2.5 model with strong reasoning, thinking support, and 1M context.",
        free: false,
        capabilities: ["text", "vision", "reasoning", "multilingual"],
      },
      {
        id: "google/gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        description:
          "Google's fast multimodal Gemini 2.5 model with strong reasoning and a 1M token context window.",
        free: false,
        capabilities: ["text", "vision", "multilingual"],
      },
      {
        id: "google/gemini-2.5-flash-lite",
        displayName: "Gemini 2.5 Flash Lite",
        description:
          "Google's lightest and most cost-efficient Gemini 2.5 model for high-throughput tasks.",
        free: false,
        capabilities: ["text", "multilingual"],
      },
      {
        id: "@cf/google/gemma-4-26b-a4b-it",
        displayName: "Gemma 4 26B",
        description:
          "Google's most intelligent family of open models, built from Gemini 3 research for maximum intelligence-per-parameter.",
        free: false,
        capabilities: ["text", "vision"],
      },
      {
        id: "google/imagen-4",
        displayName: "Imagen 4",
        description:
          "Google's latest image generation model producing high-quality, photorealistic images from text prompts.",
        free: false,
        capabilities: ["image-gen"],
      },
    ],
  },
  {
    id: "anthropic",
    icon: Anthropic,
    models: [
      {
        id: "anthropic/claude-haiku-4.5",
        displayName: "Claude Haiku 4.5",
        description:
          "Anthropic's fastest and most compact Claude model, delivering quick responses at the lowest cost.",
        free: false,
        capabilities: ["text", "coding"],
      },
      {
        id: "anthropic/claude-sonnet-4.5",
        displayName: "Claude Sonnet 4.5",
        description:
          "Anthropic's best coding model to date with significant improvements across the entire development lifecycle.",
        free: false,
        capabilities: ["text", "vision", "coding", "reasoning"],
      },
      {
        id: "anthropic/claude-opus-4.8",
        displayName: "Claude Opus 4.8",
        description:
          "Anthropic's most capable model with adaptive thinking, step-change agentic coding, and 1M token context.",
        free: false,
        capabilities: ["text", "vision", "coding", "reasoning"],
      },
    ],
  },
  {
    id: "meta",
    icon: Meta,
    models: [
      {
        id: "@cf/meta/llama-4-scout-17b-16e-instruct",
        displayName: "Llama 4 Scout",
        description:
          "Meta's 17B natively multimodal model with 16 experts, optimized for vision and agentic tasks.",
        free: true,
        capabilities: ["text", "vision", "multilingual"],
      },
      {
        id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        displayName: "Llama 3.3 70B Fast",
        description:
          "Llama 3.3 70B quantized to FP8 precision for faster inference with minimal quality tradeoff.",
        free: false,
        capabilities: ["text", "multilingual"],
      },
      {
        id: "@cf/meta/llama-3.2-11b-vision-instruct",
        displayName: "Llama 3.2 11B Vision",
        description:
          "Llama 3.2 vision model optimized for visual recognition, image reasoning, and captioning.",
        free: true,
        capabilities: ["text", "vision"],
      },
    ],
  },
  {
    id: "Moonshot AI",
    icon: Kimi,
    models: [
      {
        id: "@cf/moonshotai/kimi-k2.6",
        displayName: "Kimi K2",
        description:
          "Moonshot AI's frontier MoE model with 1T parameters, excelling at long-horizon coding and agentic tasks.",
        free: false,
        capabilities: ["vision", "reasoning", "coding"],
      },
    ],
  },
  {
    id: "xAI",
    icon: xAI,
    models: [
      {
        id: "xai/grok-4.3",
        displayName: "Grok 4.3",
        description:
          "xAI's Grok 4.3 with 1M token context, strong agentic tool calling, and minimal hallucinations.",
        free: false,
        capabilities: ["text", "vision", "reasoning"],
      },
      {
        id: "xai/grok-4.20-multi-agent-0309",
        displayName: "Grok 4.20 Multi Agent",
        description:
          "xAI's multi-agent Grok model with 2M context, enabling parallel deep research across agents.",
        free: false,
        capabilities: ["text", "reasoning", "multi-agent"],
      },
      {
        id: "xai/grok-4.20-0309-reasoning",
        displayName: "Grok 4.20 Reasoning",
        description:
          "xAI's extended thinking model that works through complex problems with a visible reasoning trace.",
        free: false,
        capabilities: ["text", "reasoning"],
      },
      {
        id: "xai/grok-4.20-0309-non-reasoning",
        displayName: "Grok 4.20",
        description:
          "xAI's fast Grok 4.20 model with 2M context, skipping thinking trace for single-pass responses.",
        free: false,
        capabilities: ["text"],
      },
    ],
  },
  {
    id: "mistral",
    icon: MistralAI,
    models: [
      {
        id: "@cf/mistralai/mistral-small-3.1-24b-instruct",
        displayName: "Mistral Small 3.1 24B",
        description:
          "24B instruction-tuned variant of Mistral Small 3.1 with vision support and strong multilingual performance.",
        free: true,
        capabilities: ["text", "vision", "multilingual"],
      },
      {
        id: "@cf/mistral/mistral-7b-instruct-v0.2-lora",
        displayName: "Mistral 7B",
        description:
          "Mistral's efficient 7B instruction-tuned model, great for everyday text tasks.",
        free: true,
        capabilities: ["text"],
      },
    ],
  },
  {
    id: "qwen",
    icon: Qwen,
    models: [
      {
        id: "alibaba/qwen3-max",
        displayName: "Qwen3 Max",
        description:
          "Alibaba's Qwen 3 Max with strong coding, reasoning, and multilingual capabilities.",
        free: false,
        capabilities: ["text", "reasoning", "multilingual"],
      },
      {
        id: "alibaba/qwen3.5-397b-a17b",
        displayName: "Qwen3.5 397B",
        description:
          "Alibaba's Qwen 3.5 with 397B parameters and 17B active, offering superior reasoning and multilingual support.",
        free: false,
        capabilities: ["text", "reasoning", "coding", "multilingual"],
      },
      {
        id: "@cf/qwen/qwq-32b",
        displayName: "Qwen 32b",
        description:
          "QwQ is the reasoning model of the Qwen series. Compared with conventional instruction-tuned models, QwQ, which is capable of thinking and reasoning",
        free: false,
        capabilities: ["text"],
      },
      {
        id: "@cf/qwen/qwen3-30b-a3b-fp8",
        displayName: "Qwen 30b",
        description:
          "Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense and mixture-of-experts (MoE) models",
        free: true,
        capabilities: ["text"],
      },
      {
        id: "@cf/qwen/qwen2.5-coder-32b-instruct",
        displayName: "Qwen 2.5 Coder 32b Instruct",
        description:
          "Qwen2.5-Coder is the latest series of Code-Specific Qwen large language models (formerly known as CodeQwen). ",
        free: false,
        capabilities: ["text", "coding"],
      },
    ],
  },
  {
    id: "deepseek",
    icon: DeepSeek,
    models: [
      {
        id: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
        displayName: "DeepSeek R1 Distill Qwen 32b",
        description:
          "DeepSeek-R1-Distill-Qwen-32B is a model distilled from DeepSeek-R1 based on Qwen2.5. It outperforms OpenAI-o1-mini across various benchmarks, achieving new state-of-the-art results for dense models.",
        free: true,
        capabilities: ["text", "reasoning", "coding"],
      },
    ],
  },
  {
    id: "recraft",
    icon: Recraft,
    models: [
      {
        id: "recraft/recraftv4-pro",
        displayName: "Recraft V4 Pro",
        description:
          "Recraft V4 Pro generates high-resolution, art-directed images at 2048px+ with strong composition, text rendering, and design taste. Built for print and production work.",
        free: false,
        capabilities: ["image-gen"],
      },
      {
        id: "recraft/recraftv4-vector",
        displayName: "Recraft V4 Vector",
        description:
          "Generate production-ready SVG vector graphics from text prompts with clean geometry, structured layers, and editable paths.",
        free: false,
        capabilities: ["image-gen"],
      },
    ],
  },
  {
    id: "black-forest-labs",
    icon: Flux,
    models: [
      {
        id: "@cf/black-forest-labs/flux-2-klein-9b",
        displayName: "Flux-2 Klein 9B",
        description:
          "FLUX.2 [klein] 9B is an ultra-fast, distilled image model with enhanced quality. It unifies image generation and editing in a single model, delivering state-of-the-art quality enabling interactive workflows, real-time previews, and latency-critical applications.",
        free: false,
        capabilities: ["image-gen"],
      },
      {
        id: "@cf/black-forest-labs/flux-1-schnell",
        displayName: "Flux-1 Schnell",
        description:
          "FLUX.1 [schnell] is a 12 billion parameter rectified flow transformer capable of generating images from text descriptions.",
        free: true,
        capabilities: ["image-gen"],
      },
    ],
  },
];
