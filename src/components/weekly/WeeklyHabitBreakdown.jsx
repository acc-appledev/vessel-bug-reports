import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const categoryColor = { body: "bg-clay", mind: "bg-olive", spirit: "bg-gold" };
const categoryText  = { body: "text-clay", mind: "text-olive", spirit: "text-gold" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      <div className="font-medium mb-1">{label}</div>
      <div className="text-muted-foreground">{payload[0].value}% completion</div>
    </div>
  );
};

export default function WeeklyHabitBreakdown({ habits, dailyData }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">Habit Breakdown</div>
      <h2 className="font-serif text-2xl mb-7">Day-by-day completion</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Daily bar chart */}
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Daily completion %</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pct" radius={[5, 5, 0, 0]} maxBarSize={36}>
                  {dailyData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.pct >= 80 ? "hsl(var(--gold))" : d.pct >= 50 ? "hsl(var(--olive))" : "hsl(var(--muted-foreground) / 0.4)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-habit progress bars */}
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Per habit (7 days)</div>
          {habits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No habits tracked yet.</p>
          ) : (
            <div className="space-y-4">
              {habits.map((h) => (
                <div key={h.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] uppercase tracking-wider font-medium", categoryText[h.category] || "text-foreground")}>
                        {h.category}
                      </span>
                      <span className="text-sm font-medium truncate max-w-[140px]">{h.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{h.done}/7</span>
                      {h.rate === 100 && <Check className="w-3.5 h-3.5 text-gold" strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", categoryColor[h.category] || "bg-foreground")}
                      style={{ width: `${h.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}