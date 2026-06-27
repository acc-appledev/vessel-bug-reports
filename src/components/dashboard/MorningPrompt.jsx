import React from "react";
import { Sunrise } from "lucide-react";

const prompts = [
  "What are you trusting God with today?",
  "What battle do you need help fighting?",
  "Where do you need strength today?",
  "What will you not quit on today?",
  "Where is God calling you to be disciplined?",
];

export default function MorningPrompt() {
  const prompt = prompts[new Date().getDate() % prompts.length];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gold-soft flex items-center justify-center shrink-0">
        <Sunrise className="w-5 h-5 text-gold" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-2">Morning Prompt</div>
        <p className="font-serif text-xl leading-snug">{prompt}</p>
      </div>
    </div>
  );
}