import React from "react";
import { cn } from "@/lib/utils";

const moods = [
  { value: "struggling", label: "Struggling", emoji: "🌧" },
  { value: "low", label: "Low", emoji: "☁️" },
  { value: "steady", label: "Steady", emoji: "⛅️" },
  { value: "strong", label: "Strong", emoji: "☀️" },
  { value: "victorious", label: "Victorious", emoji: "🔥" },
];

export default function MoodPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm border transition flex items-center gap-1.5",
            value === m.value
              ? "border-gold bg-gold-soft text-foreground"
              : "border-border hover:border-foreground/30"
          )}
        >
          <span>{m.emoji}</span>{m.label}
        </button>
      ))}
    </div>
  );
}

export { moods };