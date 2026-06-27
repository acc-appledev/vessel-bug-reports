import React, { useState } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      <div className="text-muted-foreground mb-1">{label}</div>
      <div className="font-semibold text-foreground">{payload[0].value}{unit}</div>
    </div>
  );
};

export default function ProgressTrends({ weights, allLogs, habits }) {
  const [activeTab, setActiveTab] = useState("habits");

  // --- Habit completion trend: last 28 days ---
  const habitData = Array.from({ length: 28 }, (_, i) => {
    const d = format(subDays(new Date(), 27 - i), "yyyy-MM-dd");
    const label = format(subDays(new Date(), 27 - i), "MMM d");
    const done = allLogs.filter((l) => l.date === d && l.completed).length;
    const possible = habits.length;
    const pct = possible ? Math.round((done / possible) * 100) : 0;
    return { date: label, pct };
  });

  // --- Weight trend ---
  const weightData = [...weights]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-20)
    .map((e) => ({
      date: format(new Date(e.date), "MMM d"),
      weight: e.weight,
    }));

  const tabs = [
    { id: "habits", label: "Habit Completion" },
    { id: "weight", label: "Weight Trend" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">
        Trends
      </div>
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl">Long-term progress</h2>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === t.id
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "habits" ? (
            <AreaChart data={habitData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={6} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Area
                type="monotone"
                dataKey="pct"
                stroke="hsl(var(--gold))"
                strokeWidth={2.5}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "hsl(var(--gold))" }}
              />
            </AreaChart>
          ) : (
            <LineChart data={weightData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={3} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip content={<CustomTooltip unit="" />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--olive))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--olive))", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {activeTab === "habits" && (
        <p className="text-xs text-muted-foreground mt-3">% of all habits completed per day · last 28 days</p>
      )}
      {activeTab === "weight" && weightData.length === 0 && (
        <p className="text-xs text-muted-foreground mt-3 text-center">No weight entries yet. Log weight on the Fitness page.</p>
      )}
    </div>
  );
}