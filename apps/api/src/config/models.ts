export const SUPPORTED_MODELS = {
    openai: [
      { id: "openai/gpt-4.1",                    displayName: "GPT-4.1",           icon: "openai",     free: false },
      { id: "openai/gpt-4.1-mini",               displayName: "GPT-4.1 Mini",      icon: "openai",     free: false },
      { id: "openai/gpt-4o",                     displayName: "GPT-4o",            icon: "openai",     free: false },
      { id: "openai/gpt-4o-mini",               displayName: "GPT-4o Mini",       icon: "openai",     free: false },
      { id: "openai/o3",                         displayName: "o3",                icon: "openai",     free: false },
      { id: "openai/o4-mini",                    displayName: "o4 Mini",           icon: "openai",     free: false },
    ],
    anthropic: [
      { id: "anthropic/claude-opus-4-5",         displayName: "Claude Opus 4",     icon: "anthropic",  free: false },
      { id: "anthropic/claude-sonnet-4-5",       displayName: "Claude Sonnet 4",   icon: "anthropic",  free: false },
      { id: "anthropic/claude-haiku-3-5",        displayName: "Claude Haiku 3.5",  icon: "anthropic",  free: false },
    ],
    google: [
      { id: "google/gemini-2.5-pro",             displayName: "Gemini 2.5 Pro",    icon: "google",     free: false },
      { id: "google/gemini-2.5-flash",           displayName: "Gemini 2.5 Flash",  icon: "google",     free: false },
      { id: "google/gemini-2.0-flash-001",       displayName: "Gemini 2.0 Flash",  icon: "google",     free: false },
      { id: "google/gemini-2.0-flash-exp:free",  displayName: "Gemini 2.0 Flash",  icon: "google",     free: true  },
    ],
    meta: [
      { id: "meta-llama/llama-4-maverick",       displayName: "Llama 4 Maverick",  icon: "meta",       free: false },
      { id: "meta-llama/llama-4-scout",          displayName: "Llama 4 Scout",     icon: "meta",       free: false },
      { id: "meta-llama/llama-3.3-70b-instruct", displayName: "Llama 3.3 70B",     icon: "meta",       free: false },
      { id: "meta-llama/llama-3.3-70b-instruct:free", displayName: "Llama 3.3 70B", icon: "meta",     free: true  },
    ],
    mistral: [
      { id: "mistralai/mistral-large",           displayName: "Mistral Large",     icon: "mistral",    free: false },
      { id: "mistralai/mistral-small-3.1",       displayName: "Mistral Small 3.1", icon: "mistral",    free: false },
      { id: "mistralai/codestral-2501",          displayName: "Codestral",         icon: "mistral",    free: false },
      { id: "mistralai/mistral-7b-instruct:free", displayName: "Mistral 7B",       icon: "mistral",    free: true  },
    ],
    xai: [
      { id: "x-ai/grok-3",                      displayName: "Grok 3",            icon: "xai",        free: false },
      { id: "x-ai/grok-3-mini",                 displayName: "Grok 3 Mini",       icon: "xai",        free: false },
    ],
    deepseek: [
      { id: "deepseek/deepseek-r1",              displayName: "DeepSeek R1",       icon: "deepseek",   free: false },
      { id: "deepseek/deepseek-chat-v3-0324",    displayName: "DeepSeek V3",       icon: "deepseek",   free: false },
      { id: "deepseek/deepseek-r1:free",         displayName: "DeepSeek R1",       icon: "deepseek",   free: true  },
      { id: "deepseek/deepseek-chat-v3-0324:free", displayName: "DeepSeek V3",     icon: "deepseek",   free: true  },
    ],
    qwen: [
      { id: "qwen/qwen3-235b-a22b",             displayName: "Qwen3 235B",        icon: "qwen",       free: false },
      { id: "qwen/qwen3-235b-a22b:free",        displayName: "Qwen3 235B",        icon: "qwen",       free: true  },
      { id: "qwen/qwen3-30b-a3b:free",          displayName: "Qwen3 30B",         icon: "qwen",       free: true  },
    ],
    baidu: [
      { id: "baidu/cobuddy:free",               displayName: "CoBuddy",           icon: "baidu",      free: true  },
    ],
  };
  