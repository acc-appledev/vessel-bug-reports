import React, { useMemo, useState } from "react";
import { Trophy, Dumbbell, Flame, Scale, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeStreak, daysBack } from "@/lib/dateHelpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MILESTONE_STORAGE_KEY = "vessel_milestones";

const defaultMilestones = [
  { id: "streak_7", type: "streak", label: "7-Day Habit Streak", target: 7, icon: "flame", unit: "days" },
  { id: "streak_30", type: "streak", label: "30-Day Streak", target: 30, icon: "flame", unit: "days" },
  { id: "workouts_10", type: "workouts", label: "10 Workouts Logged", target: 10, icon: "dumbbell", unit: "sessions" },
  { id: "workouts_50", type: "workouts", label: "50 Workouts Logged", target: 50, icon: "dumbbell", unit: "sessions" },
];

const IconMap = { flame: Flame, dumbbell: Dumbbell, scale: Scale, trophy: Trophy };

function MilestoneCard({ milestone, current }) {
  const pct = Math.min(100, Math.round((current / milestone.target) * 100));
  const done = pct >= 100;
  const Icon = IconMap[milestone.icon] || Trophy;

  return (
    <div className={cn(
      "rounded-2xl border p-5 relative overflow-hidden transition-all",
      done ? "border-gold/50 bg-gold-soft/40" : "border-border bg-card"
    )}>
      {done && <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gold/20 blur-2xl" />}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            done ? "bg-gold text-white" : "bg-secondary"
          )}>
            {done ? <Check className="w-5 h-5" strokeWidth={3} /> : <Icon className="w-4 h-4 text-muted-foreground" />}
          </div>
          {done && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">Achieved</span>
          )}
        </div>
        <div className="font-medium text-sm mb-1">{milestone.label}</div>
        <div className="text-xs text-muted-foreground mb-3">
          {Math.min(current, milestone.target)} / {milestone.target} {milestone.unit}
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", done ? "bg-gold" : "bg-foreground/40")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground mt-1.5 text-right">{pct}%</div>
      </div>
    </div>
  );
}

export default function MilestoneTracker({ weights, workouts, logs, habits }) {
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MILESTONE_STORAGE_KEY) || "[]"); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", target: "", type: "workouts", unit: "sessions" });

  const allMilestones = [...defaultMilestones, ...custom];

  const bestStreak = useMemo(() => habits.reduce((max, h) => {
    const dates = logs.filter((l) => l.habit_id === h.id && l.completed).map((l) => l.date);
    return Math.max(max, computeStreak(dates));
  }, 0), [habits, logs]);

  const currents = useMemo(() => ({
    streak: bestStreak,
    workouts: workouts.length,
    weight_loss: (() => {
      if (weights.length < 2) return 0;
      const sorted = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
      return Math.max(0, +(sorted[0].weight - sorted[sorted.length - 1].weight).toFixed(1));
    })(),
    habit_days: (() => {
      const last30 = new Set(daysBack(30));
      const days = new Set(logs.filter((l) => l.completed && last30.has(l.date)).map((l) => l.date));
      return days.size;
    })(),
    custom_workouts: workouts.length,
  }), [bestStreak, workouts, weights, logs]);

  const getCurrent = (m) => {
    if (m.type === "streak") return currents.streak;
    if (m.type === "workouts") return currents.workouts;
    if (m.type === "weight_loss") return currents.weight_loss;
    if (m.type === "habit_days") return currents.habit_days;
    return 0;
  };

  const addCustom = () => {
    if (!form.label || !form.target) return;
    const newM = { ...form, id: `custom_${Date.now()}`, target: parseInt(form.target), icon: "trophy" };
    const updated = [...custom, newM];
    setCustom(updated);
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(updated));
    setForm({ label: "", target: "", type: "workouts", unit: "sessions" });
    setOpen(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">Milestones</div>
          <h2 className="font-serif text-2xl">Long-term fitness goals</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Custom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif text-2xl">Add Milestone</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Goal label</Label>
                <Input placeholder="e.g. Complete 100 workouts" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Target number</Label>
                  <Input type="number" placeholder="100" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input placeholder="sessions / days / lbs" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2 flex-wrap">
                  {["workouts", "streak", "weight_loss", "habit_days"].map((t) => (
                    <button key={t} onClick={() => setForm({ ...form, type: t })}
                      className={cn("px-3 py-1.5 text-xs rounded-full border transition",
                        form.type === t ? "border-gold text-gold bg-gold-soft" : "border-border hover:border-foreground/30"
                      )}>
                      {t.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={addCustom} className="w-full bg-foreground text-background hover:bg-foreground/90">Save milestone</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allMilestones.map((m) => (
          <MilestoneCard key={m.id} milestone={m} current={getCurrent(m)} />
        ))}
      </div>
    </div>
  );
}