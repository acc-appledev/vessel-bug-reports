import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeStreak, daysBack } from "@/lib/dateHelpers";

const categoryColor = {
  body: "bg-clay",
  mind: "bg-olive",
  spirit: "bg-gold",
};

const categoryText = {
  body: "text-clay",
  mind: "text-olive",
  spirit: "text-gold",
};

export default function HabitStreakBars({ habits, logs }) {
  const last30 = daysBack(30);

  const habitsWithStats = habits.map((h) => {
    const habitLogs = logs.filter((l) => l.habit_id === h.id && l.completed);
    const doneSet = new Set(habitLogs.map((l) => l.date));
    const streak = computeStreak(habitLogs.map((l) => l.date));
    const completedLast30 = last30.filter((d) => doneSet.has(d)).length;
    const rate = Math.round((completedLast30 / 30) * 100);
    return { ...h, streak, rate, doneSet };
  }).sort((a, b) => b.streak - a.streak);

  if (habitsWithStats.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">
        Habit Streaks
      </div>
      <h2 className="font-serif text-2xl mb-6">30-day discipline view</h2>

      <div className="space-y-5">
        {habitsWithStats.map((h) => (
          <div key={h.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] uppercase tracking-wider font-medium", categoryText[h.category] || "text-foreground")}>
                  {h.category}
                </span>
                <span className="text-sm font-medium">{h.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{h.rate}% last 30d</span>
                {h.streak > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gold font-medium">
                    <Flame className="w-3 h-3" />{h.streak}d
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", categoryColor[h.category] || "bg-foreground")}
                style={{ width: `${h.rate}%` }}
              />
            </div>

            {/* Mini dot grid — last 30 days */}
            <div className="flex gap-0.5 flex-wrap">
              {daysBack(30).map((d) => (
                <div
                  key={d}
                  title={d}
                  className={cn(
                    "w-3 h-3 rounded-sm transition-all",
                    h.doneSet.has(d)
                      ? categoryColor[h.category] || "bg-foreground"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}