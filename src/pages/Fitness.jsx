import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import SectionHeader from "../components/shared/SectionHeader";
import EmptyState from "../components/shared/EmptyState";
import WeightChart from "../components/fitness/WeightChart";
import LogWeightDialog from "../components/fitness/LogWeightDialog";
import LogWorkoutDialog from "../components/fitness/LogWorkoutDialog";
import StatTile from "../components/dashboard/StatTile";
import { Dumbbell, Flame, Clock } from "lucide-react";

export default function Fitness() {
  const [weights, setWeights] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const load = async () => {
    const [w, wk] = await Promise.all([
      base44.entities.WeightEntry.list("-date", 200),
      base44.entities.Workout.list("-date", 50),
    ]);
    setWeights(w);
    setWorkouts(wk);
  };

  useEffect(() => { load(); }, []);

  const latest = weights[0];
  const first = weights[weights.length - 1];
  const change = latest && first ? (latest.weight - first.weight).toFixed(1) : null;
  const totalMins = workouts.reduce((s, w) => s + (w.duration_minutes || 0), 0);

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Body"
        title="Train with purpose"
        subtitle="Your body is a temple. Build it with consistency, not comparison."
        action={
          <div className="flex gap-2">
            <LogWeightDialog onCreate={(d) => {
              const temp = { id: `temp-w-${Date.now()}`, ...d };
              setWeights([temp, ...weights]);
              base44.entities.WeightEntry.create(d).then((r) =>
                setWeights((prev) => prev.map((e) => e.id === temp.id ? r : e))
              );
            }} />
            <LogWorkoutDialog onCreate={(d) => {
              const temp = { id: `temp-wk-${Date.now()}`, ...d };
              setWorkouts([temp, ...workouts]);
              base44.entities.Workout.create(d).then((r) =>
                setWorkouts((prev) => prev.map((e) => e.id === temp.id ? r : e))
              );
            }} />
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatTile label="Current" value={latest ? `${latest.weight}${latest.unit}` : "—"} sub={latest ? format(new Date(latest.date), "MMM d") : "No data"} accent />
        <StatTile label="Change" value={change !== null ? `${change > 0 ? "+" : ""}${change}` : "—"} sub={`${weights.length} entries`} />
        <StatTile label="Workouts" value={workouts.length} sub="Total logged" />
        <StatTile label="Time" value={`${totalMins}m`} sub="Training time" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">Weight Journey</div>
          <div className="text-xs text-muted-foreground">{weights.length} entries</div>
        </div>
        <WeightChart entries={weights} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Recent workouts</h2>
        </div>
        {workouts.length === 0 ? (
          <EmptyState icon={Dumbbell} title="No workouts yet" description="Finish strong. Stay consistent. Don't quit." />
        ) : (
          <div className="space-y-3">
            {workouts.slice(0, 10).map((w) => (
              <div key={w.id} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gold-soft flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{w.title}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="uppercase tracking-wider">{w.type}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration_minutes}m</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{w.intensity}</span>
                    {w.principle && <span className="italic text-gold">"{w.principle}"</span>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{format(new Date(w.date), "MMM d")}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}