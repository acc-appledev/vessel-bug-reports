import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { daysBack } from "@/lib/dateHelpers";
import SectionHeader from "@/components/shared/SectionHeader";
import CorrelationChart from "@/components/analytics/CorrelationChart";
import MilestoneTracker from "@/components/analytics/MilestoneTracker";
import HabitCategoryBreakdown from "@/components/analytics/HabitCategoryBreakdown";
import WeekdayHeatmap from "@/components/analytics/WeekdayHeatmap";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [weights, setWeights] = useState([]);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    (async () => {
      const [w, h, l, wo] = await Promise.all([
        base44.entities.WeightEntry.list("-date", 120),
        base44.entities.Habit.filter({ active: true }),
        base44.entities.HabitLog.list("-date", 1000),
        base44.entities.Workout.list("-date", 120),
      ]);
      setWeights(w);
      setHabits(h);
      setLogs(l);
      setWorkouts(wo);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-muted border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Advanced Analytics"
        title="Your progress, decoded."
        subtitle="Uncover patterns between your disciplines, weight, and long-term milestones."
      />

      <CorrelationChart weights={weights} logs={logs} habits={habits} />

      <MilestoneTracker weights={weights} workouts={workouts} logs={logs} habits={habits} />

      <div className="grid lg:grid-cols-2 gap-5">
        <HabitCategoryBreakdown habits={habits} logs={logs} />
        <WeekdayHeatmap logs={logs} habits={habits} />
      </div>
    </div>
  );
}