import React from "react";
import { Flame, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  const color =
    score >= 80 ? "text-gold" :
    score >= 50 ? "text-olive" :
    "text-clay";

  const label =
    score >= 90 ? "Elite" :
    score >= 75 ? "Strong" :
    score >= 50 ? "Building" :
    score >= 25 ? "Starting" :
    "Day One";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r={r} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
          {/* Fill */}
          <circle
            cx="60" cy="60" r={r}
            stroke="hsl(var(--gold))"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            className="transition-all duration-1000"
            style={{ opacity: score === 0 ? 0.2 : 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-serif text-4xl leading-none font-semibold", color)}>{score}</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">/ 100</span>
        </div>
      </div>
      <div className={cn("font-serif text-lg mt-2", color)}>{label}</div>
    </div>
  );
}

export default function ConsistencyScore({ score, streak, weekRate, monthRate }) {
  const stats = [
    { label: "Consistency streak", value: `${streak}d`, icon: Flame, color: "text-gold" },
    { label: "This week", value: `${weekRate}%`, icon: TrendingUp, color: "text-olive" },
    { label: "This month", value: `${monthRate}%`, icon: Award, color: "text-clay" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">
          Consistency Score
        </div>
        <h2 className="font-serif text-2xl mb-6">Your discipline at a glance</h2>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <ScoreRing score={score} />

          <div className="flex-1 w-full space-y-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className={cn("w-3.5 h-3.5", color)} />
                    {label}
                  </div>
                  <span className={cn("font-semibold tabular-nums", color)}>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      label.includes("streak") ? "bg-gold" :
                      label.includes("week") ? "bg-olive" : "bg-clay"
                    )}
                    style={{ width: value.endsWith("%") ? value : `${Math.min((parseInt(value) / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <p className="font-serif italic text-sm text-muted-foreground pt-2 leading-snug">
              {score >= 80
                ? "\"Well done, good and faithful servant.\""
                : score >= 50
                ? "\"Let us not grow weary of doing good.\""
                : "\"The race is long. Start with one step.\""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}