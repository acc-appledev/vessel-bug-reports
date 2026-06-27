import React from "react";
import { Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function TodayHabits({ habits, completedIds, onToggle }) {
  const pct = habits.length ? Math.round((completedIds.length / habits.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">
            Today's Disciplines
          </div>
          <div className="font-serif text-2xl">{completedIds.length} of {habits.length}</div>
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
            <circle
              cx="28" cy="28" r="24" stroke="hsl(var(--gold))" strokeWidth="4" fill="none"
              strokeDasharray={`${(pct / 100) * 150.8} 150.8`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">{pct}%</div>
        </div>
      </div>

      {habits.length === 0 ? (
        <Link to="/habits" className="block text-center py-6 text-sm text-muted-foreground hover:text-foreground">
          Set up your first discipline →
        </Link>
      ) : (
        <div className="space-y-2">
          {habits.map((h) => {
            const done = completedIds.includes(h.id);
            return (
              <button
                key={h.id}
                onClick={() => onToggle(h)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  done
                    ? "bg-gold-soft border-gold/30"
                    : "bg-background border-border hover:border-foreground/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                  done ? "bg-gold text-white" : "bg-secondary"
                )}>
                  {done ? <Check className="w-4 h-4" strokeWidth={3} /> : <Flame className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium", done && "line-through opacity-60")}>{h.name}</div>
                  {h.principle && (
                    <div className="text-[11px] text-muted-foreground italic">{h.principle}</div>
                  )}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{h.category}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}