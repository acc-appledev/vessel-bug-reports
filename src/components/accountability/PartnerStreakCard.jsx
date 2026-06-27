import React from "react";
import { Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysBack } from "@/lib/dateHelpers";

function MiniHabitGrid({ habit, logs }) {
  const last7 = daysBack(7);
  const doneSet = new Set(
    logs.filter((l) => l.habit_id === habit.id && l.completed).map((l) => l.date)
  );
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium truncate">{habit.name}</div>
      <div className="flex gap-1">
        {last7.map((d) => (
          <div
            key={d}
            className={cn(
              "flex-1 h-5 rounded",
              doneSet.has(d) ? "bg-gold" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function PartnerStreakCard({ label, email, habits, logs, bestStreak, todayDone, todayTotal, isYou }) {
  const pct = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0;

  return (
    <div className={cn(
      "rounded-2xl border p-6 space-y-5",
      isYou ? "bg-card border-gold/30" : "bg-card border-border"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] font-medium mb-1" style={{ color: isYou ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))" }}>
            {label}
          </div>
          <div className="font-serif text-xl leading-tight truncate max-w-[180px]">
            {email}
          </div>
        </div>
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
            <circle
              cx="28" cy="28" r="24"
              stroke={isYou ? "hsl(var(--gold))" : "hsl(var(--olive))"}
              strokeWidth="4" fill="none"
              strokeDasharray={`${(pct / 100) * 150.8} 150.8`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
            {pct}%
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-gold" />
          <span className="font-semibold">{bestStreak}d</span>
          <span className="text-muted-foreground text-xs">best streak</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-olive" />
          <span className="font-semibold">{todayDone}/{todayTotal}</span>
          <span className="text-muted-foreground text-xs">today</span>
        </div>
      </div>

      {/* 7-day habit grid */}
      {habits.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">Last 7 days</div>
          {habits.slice(0, 4).map((h) => (
            <MiniHabitGrid key={h.id} habit={h} logs={logs} />
          ))}
          {habits.length > 4 && (
            <div className="text-xs text-muted-foreground">+{habits.length - 4} more habits</div>
          )}
        </div>
      )}
    </div>
  );
}