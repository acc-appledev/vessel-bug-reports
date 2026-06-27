import React, { useMemo } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { daysBack } from "@/lib/dateHelpers";
import { cn } from "@/lib/utils";

const CATEGORY_META = {
  body:   { label: "Body",   color: "text-clay",  bg: "bg-clay"  },
  mind:   { label: "Mind",   color: "text-olive", bg: "bg-olive" },
  spirit: { label: "Spirit", color: "text-gold",  bg: "bg-gold"  },
};

export default function HabitCategoryBreakdown({ habits, logs }) {
  const last30 = useMemo(() => daysBack(30), []);

  const categoryData = useMemo(() => {
    const cats = ["body", "mind", "spirit"];
    return cats.map((cat) => {
      const catHabits = habits.filter((h) => h.category === cat);
      if (!catHabits.length) return { category: cat, score: 0, completed: 0, total: 0 };
      const possible = catHabits.length * 30;
      const done = logs.filter((l) => last30.includes(l.date) && l.completed && catHabits.some((h) => h.id === l.habit_id)).length;
      return {
        category: CATEGORY_META[cat]?.label || cat,
        score: possible ? Math.round((done / possible) * 100) : 0,
        completed: done,
        total: possible,
      };
    });
  }, [habits, logs, last30]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
        <div className="font-medium">{d.category}</div>
        <div className="text-muted-foreground">{d.completed} completions · {d.score}%</div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">Breakdown</div>
      <h2 className="font-serif text-2xl mb-6">Body · Mind · Spirit (30d)</h2>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={categoryData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="category" fontSize={12} stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Completion"
              dataKey="score"
              stroke="hsl(var(--gold))"
              fill="hsl(var(--gold))"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ fill: "hsl(var(--gold))", r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {categoryData.map((c) => {
          const cat = c.category.toLowerCase();
          const meta = CATEGORY_META[cat] || { color: "text-foreground", bg: "bg-foreground" };
          return (
            <div key={c.category} className="text-center">
              <div className={cn("text-2xl font-serif", meta.color)}>{c.score}%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}