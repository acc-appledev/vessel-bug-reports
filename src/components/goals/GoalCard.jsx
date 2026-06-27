import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Minus, Plus, Trash2, Zap } from "lucide-react";
import confetti from "canvas-confetti";

const categoryStyle = {
  body:   { bar: "bg-clay",  text: "text-clay",  bg: "bg-clay/10"  },
  mind:   { bar: "bg-olive", text: "text-olive", bg: "bg-olive/10" },
  spirit: { bar: "bg-gold",  text: "text-gold",  bg: "bg-gold-soft" },
  other:  { bar: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-secondary" },
};

function fireConfetti() {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#C9A84C", "#8B7355", "#6B7C5A"] });
}

export default function GoalCard({ goal, onUpdateProgress, onDelete }) {
  const [loading, setLoading] = useState(false);
  const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
  const isComplete = goal.completed || goal.progress >= goal.target;
  const style = categoryStyle[goal.category] || categoryStyle.other;

  const adjust = async (delta) => {
    const next = Math.max(0, (goal.progress || 0) + delta);
    const nowComplete = next >= goal.target;
    setLoading(true);
    await onUpdateProgress(goal, next, nowComplete);
    setLoading(false);
    if (nowComplete && !goal.completed) fireConfetti();
  };

  return (
    <div className={cn(
      "rounded-2xl border bg-card p-5 relative overflow-hidden transition-all",
      isComplete ? "border-gold/40 bg-gold-soft/30" : "border-border"
    )}>
      {/* Completed shimmer */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
        </div>
      )}

      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className={cn("text-[10px] uppercase tracking-widest font-medium mb-1", style.text)}>
              {goal.category}
            </div>
            <div className={cn("font-medium leading-snug", isComplete && "line-through text-muted-foreground")}>
              {goal.title}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isComplete && <Zap className="w-4 h-4 text-gold" />}
            <button
              onClick={() => onDelete(goal)}
              className="text-muted-foreground hover:text-destructive transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", style.bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{goal.progress || 0} / {goal.target} {goal.unit}</span>
            <span className={cn("font-medium", isComplete ? "text-gold" : "")}>
              {isComplete ? "Complete ✓" : `${pct}%`}
            </span>
          </div>
        </div>

        {/* Manual counter — hide if auto-tracked */}
        {!goal.linked_habit_id && !isComplete && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => adjust(-1)}
              disabled={loading || (goal.progress || 0) <= 0}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition disabled:opacity-30"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-semibold tabular-nums w-8 text-center">{goal.progress || 0}</span>
            <button
              onClick={() => adjust(1)}
              disabled={loading}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-muted-foreground ml-1">of {goal.target} {goal.unit}</span>
          </div>
        )}

        {goal.linked_habit_id && (
          <p className="text-xs text-muted-foreground italic">Auto-tracked from habit logs</p>
        )}
      </div>
    </div>
  );
}