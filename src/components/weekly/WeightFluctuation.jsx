import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      <div className="text-muted-foreground mb-1">{label}</div>
      <div className="font-semibold">{payload[0].value} lbs</div>
    </div>
  );
};

export default function WeightFluctuation({ weekWeights, weightChange, allWeights }) {
  // Show last 30 days for context, highlight this week
  const chartData = [...allWeights]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-20)
    .map((w) => ({ date: format(new Date(w.date), "MMM d"), weight: w.weight, rawDate: w.date }));

  const avgWeight = weekWeights.length
    ? +(weekWeights.reduce((s, w) => s + w.weight, 0) / weekWeights.length).toFixed(1)
    : null;

  const changeIcon = weightChange === null ? Minus : weightChange < 0 ? TrendingDown : TrendingUp;
  const changeColor = weightChange === null ? "text-muted-foreground" : weightChange < 0 ? "text-olive" : "text-clay";
  const ChangeIcon = changeIcon;

  if (allWeights.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Weight</div>
        <p className="text-sm text-muted-foreground">No weight entries yet. Log your weight on the Fitness page.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-1">Weight</div>
          <h2 className="font-serif text-2xl">Fluctuation this week</h2>
        </div>

        <div className="flex items-center gap-4">
          {avgWeight && (
            <div className="text-center">
              <div className="font-serif text-2xl">{avgWeight}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Week avg</div>
            </div>
          )}
          {weightChange !== null && (
            <div className={cn("flex items-center gap-1.5 text-sm font-medium", changeColor)}>
              <ChangeIcon className="w-4 h-4" />
              {weightChange > 0 ? "+" : ""}{weightChange} lbs
            </div>
          )}
          {weekWeights.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No entries this week</p>
          )}
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--clay))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--clay))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} interval={2} />
            <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
            <Tooltip content={<CustomTooltip />} />
            {avgWeight && (
              <ReferenceLine y={avgWeight} stroke="hsl(var(--gold))" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Week avg", fontSize: 10, fill: "hsl(var(--gold))" }} />
            )}
            <Area
              type="monotone"
              dataKey="weight"
              stroke="hsl(var(--clay))"
              strokeWidth={2.5}
              fill="url(#weightGrad)"
              dot={{ fill: "hsl(var(--clay))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}