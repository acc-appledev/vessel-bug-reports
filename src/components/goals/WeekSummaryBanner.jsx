import React from "react";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, Target } from "lucide-react";

export default function WeekSummaryBanner({ goals }) {
  if (!goals.length) return null;

  const total = goals.length;
  const completed = goals.filter((g) => g.completed || g.progress >= g.target).length;
  const pct = Math.round((completed / total) * 100);

  const message =
    pct === 100 ? { text: "Perfect week. Every goal crushed.", icon: Trophy,    color: "text-gold",  bg: "bg-gold-soft border-gold/30"   } :
    pct >= 66   ? { text: "Strong week. Keep the momentum.",   icon: TrendingUp, color: "text-olive", bg: "bg-olive/10 border-olive/20"   } :
                  { text: "Week in progress. Stay the course.", icon: Target,    color: "text-clay",  bg: "bg-clay/10 border-clay/20"     };

  const Icon = message.icon;

  return (
    <div className={cn("rounded-2xl border px-5 py-4 flex items-center gap-4", message.bg)}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/30", )}>
        <Icon className={cn("w-5 h-5", message.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("font-semibold text-sm", message.color)}>{message.text}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{completed} of {total} goals complete this week</div>
      </div>
      <div className={cn("font-serif text-3xl font-semibold shrink-0", message.color)}>{pct}%</div>
    </div>
  );
}