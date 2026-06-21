"use client";

import { authClient } from "@/lib/better-auth/auth-client";
import { useChatStore } from "@/store/useChat";
import { Sparkles, BookOpen, Code2, GraduationCap } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  {
    label: "Create",
    icon: Sparkles,
    suggestions: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    label: "Explore",
    icon: BookOpen,
    suggestions: [
      "Are black holes real?",
      "What caused the fall of the Roman Empire?",
      "Explain the theory of relativity in simple terms",
      "What are the most mysterious places on Earth?",
    ],
  },
  {
    label: "Code",
    icon: Code2,
    suggestions: [
      "How do I debounce a function in JavaScript?",
      "Explain the difference between TCP and UDP",
      "Write a binary search algorithm in TypeScript",
      "What are the best practices for REST API design?",
    ],
  },
  {
    label: "Learn",
    icon: GraduationCap,
    suggestions: [
      "How does AI work?",
      "How many Rs are in the word \"strawberry\"?",
      "What is the meaning of life?",
      "Explain quantum computing like I'm 10",
    ],
  },
];

interface WelcomeScreenProps {

  onSuggestionClick?: (text: string) => void;
}

export const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const suggestions = CATEGORIES[activeCategory].suggestions;
  const session = authClient.useSession();
  const username = session.data?.user.name
  const { setPendingInput } = useChatStore();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col gap-8 w-full max-w-2xl px-4 pointer-events-auto">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          How can I help you {username} ?
        </h1>

        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(({ label, icon: Icon }, idx) => (
            <button
              key={label}
              onClick={() => setActiveCategory(idx)}
              className={`flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === idx
                  ? "bg-muted text-primary border border-muted-foreground/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Suggestions */}
        <div className="flex flex-col divide-y divide-border">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setPendingInput(suggestion)
                onSuggestionClick?.(suggestion)
              }}
              className="text-left py-3.5 text-[15px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};