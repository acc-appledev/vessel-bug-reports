import React from "react";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

function getGrade(score) {
  if (score >= 95) return { letter: "S", label: "Legendary", color: "text-gold", ring: "stroke-[hsl(var(--gold))]", quote: "\"Well done, good and faithful servant.\"" };
  if (score >= 85) return { letter: "A", label: "Elite", color: "text-gold", ring: "stroke-[hsl(var(--gold))]", quote: "\"The disciplined man conquers himself first.\"" };
  if (score >= 70) return { letter: "B", label: "Strong", color: "text-olive", ring: "stroke-[hsl(var(--olive))]", quote: "\"Press on. Every rep counts.\"" };
  if (score >= 55) return { letter: "C", label: "Building", color: "text-clay", ring: "stroke-[hsl(var(--clay))]", quote: "\"Let us not grow weary of doing good.\"" };
  if (score >= 35) return { letter: "D", label: "Struggling", color: "text-muted-foreground", ring: "stroke-muted-foreground", quote: "\"The race is not given to the swift alone.\"" };
  return { letter: "F", label: "Day One", color: "text-muted-foreground", ring: "stroke-muted-foreground", quote: "\"Every master was once a beginner.\"" };
}

export default function DisciplineGrade({ score, weekRate, workouts, streak }) {
  const grade = getGrade(score);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  const stats = [
    { label: "Habit Rate", value: `${weekRate}%` },
    { label: "Workouts", value: workouts },
    { label: "Best Streak", value: `${streak}d` },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden flex flex-col">
      <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1 flex items-center gap-1.5">
          <Shield className="w-3 h-3" /> Discipline Grade
        </div>
        <div className="text-sm text-muted-foreground mb-6">This week's performance</div>

        {/* Grade ring */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} stroke="hsl(var(--muted))" strokeWidth="7" fill="none" />
              <circle
                cx="60" cy="60" r={r}
                stroke="hsl(var(--gold))"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circ}`}
                className="transition-all duration-1000"
                style={{ opacity: score === 0 ? 0.2 : 1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-serif text-5xl font-semibold leading-none", grade.color)}>
                {grade.letter}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {grade.label}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center rounded-xl bg-secondary py-3">
              <div className="font-serif text-xl leading-none">{value}</div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        <p className="font-serif italic text-sm text-muted-foreground text-center leading-snug">
          {grade.quote}
        </p>
      </div>
    </div>
  );
}