import React from "react";
import { cn } from "@/lib/utils";
import { Flame, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { daysBack } from "@/lib/dateHelpers";

export default function HabitRow({ habit, logs, streak, onToggleDate, onDelete, todayStr }) {
  const last7 = daysBack(7);
  const doneSet = new Set(logs.filter((l) => l.habit_id === habit.id && l.completed).map((l) => l.date));

  const categoryColor = {
    body: "text-clay",
    mind: "text-olive",
    spirit: "text-gold",
  }[habit.category] || "text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-[10px] uppercase tracking-[0.22em] font-medium", categoryColor)}>
              {habit.category}
            </span>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gold">
                <Flame className="w-3 h-3" />{streak}d streak
              </span>
            )}
          </div>
          <div className="font-serif text-xl leading-tight">{habit.name}</div>
          {habit.principle && (
            <div className="text-xs text-muted-foreground italic mt-1">"{habit.principle}"</div>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(habit)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        {last7.map((d) => {
          const done = doneSet.has(d);
          const isToday = d === todayStr;
          return (
            <button
              key={d}
              onClick={() => onToggleDate(habit, d)}
              className={cn(
                "flex-1 h-10 rounded-lg border transition-all flex items-center justify-center",
                done
                  ? "bg-gold border-gold text-white"
                  : "bg-background border-border hover:border-foreground/30",
                isToday && !done && "ring-2 ring-gold/40"
              )}
              aria-label={d}
            >
              {done && <Check className="w-4 h-4" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2 px-0.5">
        {last7.map((d) => (
          <div key={d} className="flex-1 text-center text-[9px] uppercase tracking-wider text-muted-foreground">
            {new Date(d).toLocaleDateString("en", { weekday: "short" })[0]}
          </div>
        ))}
      </div>
    </div>
  );
}