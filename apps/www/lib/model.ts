import { IconType } from "react-icons";
import {
  Meta,
  Gemini,
  xAI,
  Anthropic,
  OpenAI,
  MistralAI,
  Qwen,
  DeepSeek,
  Kimi,
} from "@/components/icons";

export type ModelCapability =
  | "text"
  | "vision"
  | "reasoning"
  | "coding"
  | "image-gen"
  | "multilingual"
  | "multi-agent";

export interface Model {
  id: string;
  displayName: string;
  icon: IconType;
  free: boolean;
  capabilities: ModelCapability[];
}

export const SUPPORTED_MODELS: Record<string, Model[]> = {
  openai: [
    {
      id: "openai/gpt-5.5",
      displayName: "GPT-5.5",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision", "reasoning", "coding"],
    },
    {
      id: "openai/gpt-5.5-pro",
      displayName: "GPT-5.5 Pro",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision", "reasoning", "coding"],
    },
    {
      id: "openai/gpt-5.4",
      displayName: "GPT-5.4",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision", "coding"],
    },
    {
      id: "openai/gpt-5.4-pro",
      displayName: "GPT-5.4 Pro",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision", "coding"],
    },
    {
      id: "openai/gpt-5.4-mini",
      displayName: "GPT-5.4 Mini",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "coding"],
    },
    {
      id: "openai/gpt-5.4-nano",
      displayName: "GPT-5.4 Nano",
      icon: OpenAI,
      free: false,
      capabilities: ["text"],
    },
    {
      id: "openai/gpt-5",
      displayName: "GPT-5",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision", "reasoning", "coding"],
    },
    {
      id: "openai/gpt-4.1",
      displayName: "GPT-4.1",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision", "coding"],
    },
    {
      id: "openai/gpt-4.1-mini",
      displayName: "GPT-4.1 Mini",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision"],
    },
    {
      id: "openai/gpt-4o",
      displayName: "GPT-4o",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision"],
    },
    {
      id: "openai/gpt-4o-mini",
      displayName: "GPT-4o Mini",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "vision"],
    },
    {
      id: "openai/o4-mini",
      displayName: "o4 Mini",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "reasoning"],
    },
    {
      id: "openai/o3",
      displayName: "o3",
      icon: OpenAI,
      free: false,
      capabilities: ["text", "reasoning", "coding"],
    },
    {
      id: "openai/gpt-image-1.5",
      displayName: "GPT Image 1.5",
      icon: OpenAI,
      free: false,
      capabilities: ["image-gen"]
    }
  ],
  anthropic: [
    {
      id: "anthropic/claude-haiku-4.5",
      displayName: "Claude Haiku 4.5",
      icon: Anthropic,
      free: true,
      capabilities: ["text", "coding"],
    },
    {
      id: "anthropic/claude-sonnet-4.5",
      displayName: "Claude Sonnet 4.5",
      icon: Anthropic,
      free: false,
      capabilities: ["text", "vision", "coding", "reasoning"],
    },
    {
      id: "anthropic/claude-opus-4.8",
      displayName: "Claude Opus 4.8",
      icon: Anthropic,
      free: false,
      capabilities: ["text", "vision", "coding", "reasoning"],
    },
  ],
  google: [
    {
      id: "google/gemini-3.1-pro",
      displayName: "Gemini 3.1 Pro",
      icon: Gemini,
      free: false,
      capabilities: ["text", "vision", "reasoning", "multilingual"],
    },
    {
      id: "google/gemini-3-flash",
      displayName: "Gemini 3 Flash",
      icon: Gemini,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "google/gemini-3.1-flash-lite",
      displayName: "Gemini 3.1 Flash Lite",
      icon: Gemini,
      free: false,
      capabilities: ["text", "multilingual"],
    },
    {
      id: "google/gemini-2.5-pro",
      displayName: "Gemini 2.5 Pro",
      icon: Gemini,
      free: false,
      capabilities: ["text", "vision", "reasoning", "multilingual"],
    },
    {
      id: "google/gemini-2.5-flash",
      displayName: "Gemini 2.5 Flash",
      icon: Gemini,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "google/gemini-2.5-flash-lite",
      displayName: "Gemini 2.5 Flash Lite",
      icon: Gemini,
      free: false,
      capabilities: ["text", "multilingual"],
    },
    {
      id: "@cf/google/gemma-4-26b-a4b-it",
      displayName: "Gemma 4 26B",
      icon: Gemini,
      free: false,
      capabilities: ["text", "vision"],
    },
    {
      id: "google/imagen-4",
      displayName: "Imagen 4",
      icon: Gemini,
      free: false,
      capabilities: ["image-gen"]
    }
  ],
  meta: [
    {
      id: "@cf/meta/llama-4-scout-17b-16e-instruct",
      displayName: "Llama 4 Scout",
      icon: Meta,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      displayName: "Llama 3.3 70B",
      icon: Meta,
      free: false,
      capabilities: ["text", "multilingual"],
    },
    {
      id: "@cf/meta/llama-3.2-11b-vision-instruct",
      displayName: "Llama 3.2 11B Vision",
      icon: Meta,
      free: false,
      capabilities: ["text", "vision"],
    },
  ],
  mistral: [
    {
      id: "@cf/mistralai/mistral-small-3.1-24b-instruct",
      displayName: "Mistral Small 3.1",
      icon: MistralAI,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "@cf/mistral/mistral-7b-instruct-v0.2-lora",
      displayName: "Mistral 7B Instruct lora",
      icon: MistralAI,
      free: true,
      capabilities: ["text"],
    },
  ],
  xai: [
    {
      id: "xai/grok-4.3",
      displayName: "Grok 4.3",
      icon: xAI,
      free: false,
      capabilities: ["text", "vision", "reasoning"],
    },
    {
      id: "xai/grok-4.20-multi-agent-0309",
      displayName: "Grok 4.20 Multi Agent",
      icon: xAI,
      free: false,
      capabilities: ["text", "reasoning", "multi-agent"],
    },
    {
      id: "xai/grok-4.20-0309-reasoning",
      displayName: "Grok 4.20 Reasoning",
      icon: xAI,
      free: false,
      capabilities: ["text", "reasoning"],
    },
    {
      id: "xai/grok-4.20-0309-non-reasoning",
      displayName: "Grok 4.20",
      icon: xAI,
      free: false,
      capabilities: ["text"],
    },
  ],
  deepseek: [
    {
      id: "deepseek/deepseek-r1",
      displayName: "DeepSeek R1",
      icon: DeepSeek,
      free: false,
      capabilities: ["text", "reasoning", "coding"],
    },
    {
      id: "deepseek/deepseek-chat-v3-0324",
      displayName: "DeepSeek V3",
      icon: DeepSeek,
      free: false,
      capabilities: ["text", "coding"],
    },
    {
      id: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
      displayName: "DeepSeek R1 Distill Qwen 32b",
      icon: DeepSeek,
      free: true,
      capabilities: ["text", "reasoning", "coding"],
    },
  ],
  qwen: [
    {
      id: "alibaba/qwen3-max",
      displayName: "Qwen3 Max",
      icon: Qwen,
      free: false,
      capabilities: ["text", "reasoning", "multilingual"],
    },
    {
      id: "alibaba/qwen3.5-397b-a17b",
      displayName: "Qwen3.5 397B",
      icon: Qwen,
      free: false,
      capabilities: ["text", "reasoning", "coding", "multilingual"],
    },
    {
      id: "@cf/qwen/qwq-32b",
      displayName: "Qwen 32b",
      icon: Qwen,
      free: false,
      capabilities: ["text"],
    },
    {
      id: "@cf/qwen/qwen3-30b-a3b-fp8",
      displayName: "Qwen 30b",
      icon: Qwen,
      free: true,
      capabilities: ["text"],
    },
    {
      id: "@cf/qwen/qwen2.5-coder-32b-instruct",
      displayName: "Qwen 2.5 Coder 32b Instruct",
      icon: Qwen,
      free: false,
      capabilities: ["text", "coding"],
    },
  ],
  moonshot: [
    {
      id: "@cf/moonshotai/kimi-k2.6",
      displayName: "Kimi k2.6",
      icon: Kimi,
      free: false,
      capabilities: ["text", "multi-agent"],
    },
  ],
};
