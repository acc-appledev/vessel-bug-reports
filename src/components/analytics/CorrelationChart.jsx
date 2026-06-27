import React, { useMemo, useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 text-xs shadow-xl space-y-1.5">
      <div className="text-muted-foreground font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-foreground">{p.name}:</span>
          <span className="font-semibold">{p.value}{p.name === "Habit Rate" ? "%" : ""}</span>
        </div>
      ))}
    </div>
  );
};

export default function CorrelationChart({ weights, logs, habits }) {
  const [window, setWindow] = useState(30);

  const data = useMemo(() => {
    const weightMap = {};
    weights.forEach((w) => { weightMap[w.date] = w.weight; });

    const days = Array.from({ length: window }, (_, i) =>
      format(subDays(new Date(), window - 1 - i), "yyyy-MM-dd")
    );

    return days.map((d) => {
      const label = format(new Date(d), "MMM d");
      const weight = weightMap[d] ?? null;
      const done = logs.filter((l) => l.date === d && l.completed).length;
      const possible = habits.length;
      const habitRate = possible ? Math.round((done / possible) * 100) : 0;
      return { date: label, weight, habitRate };
    }).filter((d) => d.weight !== null || d.habitRate > 0);
  }, [weights, logs, habits, window]);

  // Simple correlation insight
  const insight = useMemo(() => {
    const paired = data.filter((d) => d.weight !== null);
    if (paired.length < 4) return null;
    const avgHabit = paired.reduce((s, d) => s + d.habitRate, 0) / paired.length;
    const avgWeight = paired.reduce((s, d) => s + d.weight, 0) / paired.length;
    let num = 0, denA = 0, denB = 0;
    paired.forEach((d) => {
      const ha = d.habitRate - avgHabit;
      const wa = d.weight - avgWeight;
      num += ha * wa;
      denA += ha * ha;
      denB += wa * wa;
    });
    const r = denA && denB ? num / Math.sqrt(denA * denB) : 0;
    return r;
  }, [data]);

  const insightText = insight === null ? null
    : insight < -0.3 ? { label: "Strong negative correlation — higher discipline = lower weight", icon: TrendingDown, color: "text-olive" }
    : insight > 0.3 ? { label: "Positive correlation — habits and weight are rising together", icon: TrendingUp, color: "text-clay" }
    : { label: "Weak correlation — keep building your data history", icon: Minus, color: "text-muted-foreground" };

  const windows = [14, 30, 60, 90];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">
            Correlation Analysis
          </div>
          <h2 className="font-serif text-2xl">Weight vs. Habit Completion</h2>
          {insightText && (
            <div className={`flex items-center gap-1.5 mt-2 text-xs ${insightText.color}`}>
              <insightText.icon className="w-3.5 h-3.5" />
              {insightText.label}
            </div>
          )}
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1 self-start sm:self-auto">
          {windows.map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                window === w
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

      {data.length < 3 ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Log weight entries and complete habits over several days to see correlations.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} interval={Math.floor(data.length / 6)} />
              <YAxis yAxisId="habit" domain={[0, 100]} fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="weight" orientation="right" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} domain={["dataMin - 3", "dataMax + 3"]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar yAxisId="habit" dataKey="habitRate" name="Habit Rate" fill="url(#habitGrad)" radius={[3, 3, 0, 0]} maxBarSize={18} />
              <Line yAxisId="weight" dataKey="weight" name="Weight" stroke="hsl(var(--clay))" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}