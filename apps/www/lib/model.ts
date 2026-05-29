import { IconType } from "react-icons";
import { Meta, Gemini, xAI, Anthropic, OpenAI, MistralAI, Qwen, DeepSeek } from "@/components/icons";

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
      id: "google/gemma-4-26b-a4b-it",
      displayName: "Gemma 4 26B",
      icon: Gemini,
      free: false,
      capabilities: ["text", "vision"],
    },
  ],
  meta: [
    {
      id: "meta-llama/llama-4-maverick",
      displayName: "Llama 4 Maverick",
      icon: Meta,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "meta-llama/llama-4-scout-17b-16e-instruct",
      displayName: "Llama 4 Scout",
      icon: Meta,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct",
      displayName: "Llama 3.3 70B",
      icon: Meta,
      free: false,
      capabilities: ["text", "multilingual"],
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct-fp8-fast",
      displayName: "Llama 3.3 70B Fast",
      icon: Meta,
      free: false,
      capabilities: ["text", "multilingual"],
    },
    {
      id: "meta-llama/llama-3.2-11b-vision-instruct",
      displayName: "Llama 3.2 11B Vision",
      icon: Meta,
      free: false,
      capabilities: ["text", "vision"],
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct:free",
      displayName: "Llama 3.3 70B Free",
      icon: Meta,
      free: true,
      capabilities: ["text", "multilingual"],
    },
  ],
  mistral: [
    {
      id: "mistralai/mistral-large",
      displayName: "Mistral Large",
      icon: MistralAI,
      free: false,
      capabilities: ["text", "multilingual"],
    },
    {
      id: "mistralai/mistral-small-3.1",
      displayName: "Mistral Small 3.1",
      icon: MistralAI,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "mistralai/codestral-2501",
      displayName: "Codestral",
      icon: MistralAI,
      free: false,
      capabilities: ["text", "coding"],
    },
    {
      id: "mistralai/mistral-small-3.1-24b-instruct",
      displayName: "Mistral Small 3.1 24B",
      icon: MistralAI,
      free: false,
      capabilities: ["text", "vision", "multilingual"],
    },
    {
      id: "mistralai/mistral-7b-instruct:free",
      displayName: "Mistral 7B Free",
      icon: MistralAI,
      free: true,
      capabilities: ["text"],
    },
  ],
  xai: [
    {
      id: "x-ai/grok-4.3",
      displayName: "Grok 4.3",
      icon: xAI,
      free: false,
      capabilities: ["text", "vision", "reasoning"],
    },
    {
      id: "x-ai/grok-4.20-multi-agent-0309",
      displayName: "Grok 4.20 Multi Agent",
      icon: xAI,
      free: false,
      capabilities: ["text", "reasoning", "multi-agent"],
    },
    {
      id: "x-ai/grok-4.20-0309-reasoning",
      displayName: "Grok 4.20 Reasoning",
      icon: xAI,
      free: false,
      capabilities: ["text", "reasoning"],
    },
    {
      id: "x-ai/grok-4.20-0309-non-reasoning",
      displayName: "Grok 4.20",
      icon: xAI,
      free: false,
      capabilities: ["text"],
    },
    {
      id: "x-ai/grok-3",
      displayName: "Grok 3",
      icon: xAI,
      free: false,
      capabilities: ["text", "reasoning"],
    },
    {
      id: "x-ai/grok-3-mini",
      displayName: "Grok 3 Mini",
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
      id: "deepseek/deepseek-r1:free",
      displayName: "DeepSeek R1 Free",
      icon: DeepSeek,
      free: true,
      capabilities: ["text", "reasoning", "coding"],
    },
    {
      id: "deepseek/deepseek-chat-v3-0324:free",
      displayName: "DeepSeek V3 Free",
      icon: DeepSeek,
      free: true,
      capabilities: ["text", "coding"],
    },
  ],
  qwen: [
    {
      id: "qwen/qwen3-235b-a22b",
      displayName: "Qwen3 235B",
      icon: Qwen,
      free: false,
      capabilities: ["text", "reasoning", "coding", "multilingual"],
    },
    {
      id: "qwen/qwen3-max",
      displayName: "Qwen3 Max",
      icon: Qwen,
      free: false,
      capabilities: ["text", "reasoning", "multilingual"],
    },
    {
      id: "qwen/qwen3.5-397b-a17b",
      displayName: "Qwen3.5 397B",
      icon: Qwen,
      free: false,
      capabilities: ["text", "reasoning", "coding", "multilingual"],
    },
    {
      id: "qwen/qwen3-235b-a22b:free",
      displayName: "Qwen3 235B Free",
      icon: Qwen,
      free: true,
      capabilities: ["text", "reasoning", "coding", "multilingual"],
    },
    {
      id: "qwen/qwen3-30b-a3b:free",
      displayName: "Qwen3 30B Free",
      icon: Qwen,
      free: true,
      capabilities: ["text", "multilingual"],
    },
  ],
};
