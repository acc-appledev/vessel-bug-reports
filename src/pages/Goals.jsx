import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { format, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import SectionHeader from "../components/shared/SectionHeader";
import EmptyState from "../components/shared/EmptyState";
import NewGoalDialog from "../components/goals/NewGoalDialog";
import GoalCard from "../components/goals/GoalCard";
import WeekSummaryBanner from "../components/goals/WeekSummaryBanner";
import { Target, ChevronLeft, ChevronRight } from "lucide-react";

function weekStart(offset = 0) {
  return format(
    startOfWeek(addWeeks(new Date(), offset), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
}

function weekLabel(offset) {
  const start = startOfWeek(addWeeks(new Date(), offset), { weekStartsOn: 1 });
  const end = endOfWeek(addWeeks(new Date(), offset), { weekStartsOn: 1 });
  if (offset === 0) return "This week";
  if (offset === -1) return "Last week";
  return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentWeekStart = weekStart(weekOffset);

  const load = async () => {
    setLoading(true);
    const [g, h, l] = await Promise.all([
      base44.entities.WeeklyGoal.filter({ week_start: currentWeekStart }),
      base44.entities.Habit.filter({ active: true }),
      base44.entities.HabitLog.list("-date", 500),
    ]);
    // For linked habits, auto-compute progress from logs this week
    const weekEnd = format(
      endOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    const enriched = g.map((goal) => {
      if (!goal.linked_habit_id) return goal;
      const count = l.filter(
        (log) =>
          log.habit_id === goal.linked_habit_id &&
          log.completed &&
          log.date >= currentWeekStart &&
          log.date <= weekEnd
      ).length;
      return { ...goal, progress: count, completed: count >= goal.target };
    });
    setGoals(enriched);
    setHabits(h);
    setHabitLogs(l);
    setLoading(false);
  };

  useEffect(() => { load(); }, [weekOffset]);

  const handleSave = async (data) => {
    const created = await base44.entities.WeeklyGoal.create({
      ...data,
      week_start: currentWeekStart,
      progress: 0,
      completed: false,
    });
    setGoals((prev) => [created, ...prev]);
  };

  const handleUpdateProgress = async (goal, newProgress, nowComplete) => {
    const updated = await base44.entities.WeeklyGoal.update(goal.id, {
      progress: newProgress,
      completed: nowComplete,
    });
    setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, progress: newProgress, completed: nowComplete } : g));
  };

  const handleDelete = async (goal) => {
    await base44.entities.WeeklyGoal.delete(goal.id);
    setGoals((prev) => prev.filter((g) => g.id !== goal.id));
  };

  const categoryOrder = ["body", "mind", "spirit", "other"];
  const sorted = [...goals].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Weekly Goals"
        title="Define your week"
        subtitle="Set specific, measurable targets and track them against real progress."
        action={weekOffset === 0 ? <NewGoalDialog habits={habits} onSave={handleSave} /> : null}
      />

      {/* Week navigator */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="font-medium text-sm">{weekLabel(weekOffset)}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {format(
              startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 }),
              "MMM d"
            )} –{" "}
            {format(
              endOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 }),
              "MMM d, yyyy"
            )}
          </div>
        </div>
        <button
          onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
          disabled={weekOffset === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary banner */}
      {goals.length > 0 && <WeekSummaryBanner goals={goals} />}

      {/* Goal grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3].map((n) => (
            <div key={n} className="h-36 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals this week"
          description={
            weekOffset === 0
              ? "Add a goal above to define what winning looks like this week."
              : "No goals were set for this week."
          }
          action={weekOffset === 0 ? <NewGoalDialog habits={habits} onSave={handleSave} /> : null}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onUpdateProgress={handleUpdateProgress}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}