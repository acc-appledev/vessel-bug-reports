import React from "react";
import { TrendingUp, TrendingDown, Star, Zap, Dumbbell, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Highlight({ icon: Icon, color, title, body }) {
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-xl border", color.border)}>
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", color.bg)}>
        <Icon className={cn("w-4 h-4", color.icon)} />
      </div>
      <div>
        <div className="text-xs font-semibold text-foreground mb-0.5">{title}</div>
        <div className="text-xs text-muted-foreground leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

export default function WeeklyHighlights({ weekRate, bestDay, habitData, weightChange, weekWorkouts, userName }) {
  const highlights = [];

  // Overall performance
  if (weekRate >= 80) {
    highlights.push({ icon: Star, color: { bg: "bg-gold-soft", icon: "text-gold", border: "border-gold/20" }, title: "Outstanding week", body: `You hit ${weekRate}% of your habits. That's elite-level discipline${userName ? `, ${userName}` : ""}.` });
  } else if (weekRate >= 50) {
    highlights.push({ icon: TrendingUp, color: { bg: "bg-secondary", icon: "text-olive", border: "border-border" }, title: "Solid progress", body: `${weekRate}% completion rate. You're building momentum — keep pushing through.` });
  } else {
    highlights.push({ icon: AlertCircle, color: { bg: "bg-secondary", icon: "text-muted-foreground", border: "border-border" }, title: "Room to grow", body: `${weekRate}% this week. Every day is a fresh start. What's one habit you can lock in tomorrow?` });
  }

  // Best day
  if (bestDay && bestDay.pct > 0) {
    highlights.push({ icon: Zap, color: { bg: "bg-gold-soft", icon: "text-gold", border: "border-gold/20" }, title: `Best day: ${bestDay.label}`, body: `You completed ${bestDay.pct}% of your disciplines — your strongest showing of the week.` });
  }

  // Top habit
  const topHabit = [...habitData].sort((a, b) => b.rate - a.rate)[0];
  if (topHabit && topHabit.rate > 0) {
    highlights.push({ icon: TrendingUp, color: { bg: "bg-secondary", icon: "text-olive", border: "border-border" }, title: `Top habit: ${topHabit.name}`, body: `${topHabit.done}/7 days completed (${topHabit.rate}%). Your most consistent discipline this week.` });
  }

  // Weight
  if (weightChange !== null) {
    const isDown = weightChange < 0;
    const isUp = weightChange > 0;
    highlights.push({
      icon: isDown ? TrendingDown : TrendingUp,
      color: isDown
        ? { bg: "bg-secondary", icon: "text-olive", border: "border-border" }
        : { bg: "bg-secondary", icon: "text-clay", border: "border-border" },
      title: isDown ? `Weight down ${Math.abs(weightChange)} lbs` : isUp ? `Weight up ${weightChange} lbs` : "Weight steady",
      body: isDown ? "Progress in the right direction. Your consistency is paying off." : isUp ? "Stay the course — one week doesn't define the journey." : "Stable weight this week. Your body is responding to the work.",
    });
  }

  // Workouts
  if (weekWorkouts.length > 0) {
    highlights.push({ icon: Dumbbell, color: { bg: "bg-secondary", icon: "text-clay", border: "border-border" }, title: `${weekWorkouts.length} workout${weekWorkouts.length > 1 ? "s" : ""} this week`, body: weekWorkouts.map((w) => w.title).slice(0, 2).join(" · ") + (weekWorkouts.length > 2 ? ` +${weekWorkouts.length - 2} more` : "") });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">Highlights</div>
      <h2 className="font-serif text-2xl mb-5">What stood out</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {highlights.map((h, i) => (
          <Highlight key={i} {...h} />
        ))}
      </div>
    </div>
  );
}