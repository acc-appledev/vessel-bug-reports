import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { format, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { daysBack, computeStreak } from "@/lib/dateHelpers";
import SectionHeader from "@/components/shared/SectionHeader";
import DisciplineGrade from "@/components/weekly/DisciplineGrade";
import WeeklyHabitBreakdown from "@/components/weekly/WeeklyHabitBreakdown";
import WeightFluctuation from "@/components/weekly/WeightFluctuation";
import WeeklyHighlights from "@/components/weekly/WeeklyHighlights";
import WeekSelector from "@/components/weekly/WeekSelector";

function getWeekDays(offsetWeeks = 0) {
  const ref = subWeeks(new Date(), offsetWeeks);
  const start = startOfWeek(ref, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return format(d, "yyyy-MM-dd");
  });
}

export default function WeeklyReport() {
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [weights, setWeights] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const [me, h, l, w, wo] = await Promise.all([
        base44.auth.me().catch(() => null),
        base44.entities.Habit.filter({ active: true }),
        base44.entities.HabitLog.list("-date", 500),
        base44.entities.WeightEntry.list("-date", 60),
        base44.entities.Workout.list("-date", 60),
      ]);
      setUser(me);
      setHabits(h);
      setLogs(l);
      setWeights(w);
      setWorkouts(wo);
      setLoading(false);
    })();
  }, []);

  const weekDays = getWeekDays(weekOffset);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  // Filter to current selected week
  const weekLogs = logs.filter((l) => weekDays.includes(l.date) && l.completed);
  const weekWeights = weights.filter((w) => weekDays.includes(w.date)).sort((a, b) => new Date(a.date) - new Date(b.date));
  const weekWorkouts = workouts.filter((w) => weekDays.includes(w.date));

  // Per-habit completion data
  const habitData = habits.map((h) => {
    const done = weekLogs.filter((l) => l.habit_id === h.id).length;
    return { ...h, done, rate: Math.round((done / 7) * 100) };
  });

  // Overall weekly rate
  const possible = habits.length * 7;
  const done = weekLogs.length;
  const weekRate = possible ? Math.round((done / possible) * 100) : 0;

  // Per-day completion pct
  const dailyData = weekDays.map((d) => {
    const dayDone = weekLogs.filter((l) => l.date === d).length;
    const pct = habits.length ? Math.round((dayDone / habits.length) * 100) : 0;
    return { date: d, label: format(new Date(d), "EEE"), pct, done: dayDone };
  });

  // Weight change this week
  const weightChange = weekWeights.length >= 2
    ? +(weekWeights[weekWeights.length - 1].weight - weekWeights[0].weight).toFixed(1)
    : null;

  // Best day
  const bestDay = [...dailyData].sort((a, b) => b.pct - a.pct)[0];

  // Streak going into this week
  const bestStreak = habits.reduce((max, h) => {
    const dates = logs.filter((l) => l.habit_id === h.id && l.completed).map((l) => l.date);
    return Math.max(max, computeStreak(dates));
  }, 0);

  // Discipline Grade
  const gradeScore = weekRate;

  const weekLabel = weekOffset === 0
    ? "This Week"
    : weekOffset === 1
    ? "Last Week"
    : `Week of ${format(new Date(weekStart), "MMM d")}`;

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
        eyebrow="Weekly Report"
        title="Your week in review."
        subtitle={`${format(new Date(weekStart), "MMMM d")} – ${format(new Date(weekEnd), "MMMM d, yyyy")}`}
        action={<WeekSelector weekOffset={weekOffset} onChange={setWeekOffset} weekLabel={weekLabel} />}
      />

      {/* Grade + Highlights row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <DisciplineGrade score={gradeScore} weekRate={weekRate} workouts={weekWorkouts.length} streak={bestStreak} />
        <div className="lg:col-span-2">
          <WeeklyHighlights
            weekRate={weekRate}
            bestDay={bestDay}
            habitData={habitData}
            weightChange={weightChange}
            weekWorkouts={weekWorkouts}
            userName={user?.full_name?.split(" ")[0]}
          />
        </div>
      </div>

      <WeeklyHabitBreakdown habits={habitData} dailyData={dailyData} />

      <WeightFluctuation weekWeights={weekWeights} weightChange={weightChange} allWeights={weights} />
    </div>
  );
}