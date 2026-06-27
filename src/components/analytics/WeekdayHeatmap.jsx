import React, { useMemo } from "react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekdayHeatmap({ logs, habits }) {
  // Build a map of date → completion rate
  const heatData = useMemo(() => {
    const result = [];
    for (let i = 89; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      const done = logs.filter((l) => l.date === d && l.completed).length;
      const pct = habits.length ? Math.round((done / habits.length) * 100) : 0;
      result.push({ date: d, pct, dow: new Date(d).getDay() });
    }
    return result;
  }, [logs, habits]);

  // Per-weekday average
  const dowAverages = useMemo(() => {
    return Array.from({ length: 7 }, (_, dow) => {
      const dayEntries = heatData.filter((d) => d.dow === dow);
      const avg = dayEntries.length
        ? Math.round(dayEntries.reduce((s, d) => s + d.pct, 0) / dayEntries.length)
        : 0;
      return { dow, label: DAYS[dow], avg };
    });
  }, [heatData]);

  const getColor = (pct) => {
    if (pct === 0) return "bg-muted";
    if (pct < 30) return "bg-gold/20";
    if (pct < 60) return "bg-gold/45";
    if (pct < 85) return "bg-gold/70";
    return "bg-gold";
  };

  // Pad to start on Sunday
  const firstDow = heatData.length ? heatData[0].dow : 0;
  const padded = [...Array(firstDow).fill(null), ...heatData];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">Activity Heatmap</div>
      <h2 className="font-serif text-2xl mb-6">Discipline by day (90d)</h2>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-[10px] text-center uppercase tracking-wider text-muted-foreground">{d[0]}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) =>
              day === null ? (
                <div key={di} />
              ) : (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.pct}%`}
                  className={cn("aspect-square rounded-sm transition-all cursor-default", getColor(day.pct))}
                />
              )
            )}
          </div>
        ))}
      </div>

      {/* Weekday averages */}
      <div className="mt-5 pt-4 border-t border-border">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">Best days on average</div>
        <div className="grid grid-cols-7 gap-1">
          {dowAverages.map(({ dow, label, avg }) => (
            <div key={dow} className="text-center space-y-1.5">
              <div className="h-10 flex items-end justify-center">
                <div
                  className="w-full rounded-t-sm bg-gold/60 transition-all"
                  style={{ height: `${Math.max(4, avg)}%` }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground">{label[0]}</div>
              <div className="text-[10px] font-medium text-foreground">{avg}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {["bg-muted", "bg-gold/20", "bg-gold/45", "bg-gold/70", "bg-gold"].map((c) => (
          <div key={c} className={cn("w-4 h-4 rounded-sm", c)} />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  );
}