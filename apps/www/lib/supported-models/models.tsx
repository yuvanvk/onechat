import { Deepseek, Favourite, Google, Meta, Moonshot, OpenAI } from "@/components/icons";
import { JSX } from "react";

export type Capability = "vision" | "reasoning" | "image-gen" | "code";

export interface AIModel {
  id: string;
  displayName: string;
  description: string;
  isPremium: boolean;
  capabilities: Capability[];
}

export interface ModelProvider {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  models?: AIModel[];
  favourites?: string[];
}
export const SELECT_MODELS: ModelProvider[] = [
  {
    id: "favourites",
    icon: Favourite,
    favourites: [
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      "@cf/google/gemma-3-12b-it",
      "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
    ],
  },
  {
    id: "openai",
    icon: OpenAI,
    models: [
      {
        id: "@cf/openai/gpt-4o",
        displayName: "GPT-4o",
        description: "OpenAI's flagship multimodal model",
        isPremium: true,
        capabilities: ["vision", "code"],
      },
      {
        id: "@cf/openai/gpt-4o-mini",
        displayName: "GPT-4o mini",
        description: "Fast and affordable for everyday tasks",
        isPremium: true,
        capabilities: ["code"],
      },
    ],
  },
  {
    id: "google",
    icon: Google,
    models: [
      {
        id: "@cf/google/gemma-3-12b-it",
        displayName: "Gemma 3 12B",
        description: "Google's open model, strong at reasoning",
        isPremium: true,
        capabilities: ["reasoning", "code"],
      },
      {
        id: "@cf/google/gemma-3n-e4b-it",
        displayName: "Gemma 3n E4B",
        description: "Efficient multimodal model for edge devices",
        isPremium: true,
        capabilities: ["vision"],
      },
    ],
  },
  {
    id: "meta",
    icon: Meta,
    models: [
      {
        id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        displayName: "Llama 3.3 70B",
        description: "Meta's best open model, fast fp8 variant",
        isPremium: true,
        capabilities: ["code", "reasoning"],
      },
      {
        id: "@cf/meta/llama-3.1-8b-instruct",
        displayName: "Llama 3.1 8B",
        description: "Lightweight, great for simple tasks",
        isPremium: false, // ← only free model
        capabilities: ["code"],
      },
      {
        id: "@cf/meta/llama-2-7b-chat-fp16",
        displayName: "Llama 2 7B",
        description: "Original Llama 2 chat model",
        isPremium: false, // ← only free model
        capabilities: [],
      },
    ],
  },
  {
    id: "moonshot",
    icon: Moonshot,
    models: [
      {
        id: "@cf/moonshotai/kimi-k2",
        displayName: "Kimi K2",
        description: "Multimodal model for long-horizon coding and agents",
        isPremium: true,
        capabilities: ["vision", "reasoning", "code"],
      },
    ],
  },
  {
    id: "deepseek",
    icon: Deepseek,
    models: [
      {
        id: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
        displayName: "DeepSeek R1 Qwen 32B",
        description: "Reasoning model distilled from R1",
        isPremium: true,
        capabilities: ["reasoning", "code"],
      },
    ],
  },
];
