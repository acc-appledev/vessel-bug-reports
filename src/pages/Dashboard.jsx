import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import PullToRefresh from "../components/shared/PullToRefresh";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Swords, ArrowRight } from "lucide-react";
import ScriptureCard from "../components/dashboard/ScriptureCard";
import TodayHabits from "../components/dashboard/TodayHabits";
import StatTile from "../components/dashboard/StatTile";
import MorningPrompt from "../components/dashboard/MorningPrompt";
import ConsistencyScore from "../components/dashboard/ConsistencyScore";
import HabitStreakBars from "../components/dashboard/HabitStreakBars";
import ProgressTrends from "../components/dashboard/ProgressTrends";
import DailyJournalWidget from "../components/dashboard/DailyJournalWidget";
import ReminderBanner from "../components/dashboard/ReminderBanner";
import TodaysWord from "../components/dashboard/TodaysWord";
import { todayStr, daysBack, computeStreak } from "@/lib/dateHelpers";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [scripture, setScripture] = useState(null);
  const [weightCount, setWeightCount] = useState(0);
  const [prayerCount, setPrayerCount] = useState(0);
  const [allWeights, setAllWeights] = useState([]);
  const [todayJournalEntry, setTodayJournalEntry] = useState(null);

  const today = todayStr();

  const load = useCallback(async () => {
    const me = await base44.auth.me().catch(() => null);
      setUser(me);

      const [h, logs, scriptures, weights, prayers, journalEntries] = await Promise.all([
        base44.entities.Habit.filter({ active: true }),
        base44.entities.HabitLog.list("-date", 500),
        base44.entities.Scripture.list(),
        base44.entities.WeightEntry.list("-date", 60),
        base44.entities.Prayer.list("-date", 50),
        base44.entities.JournalEntry.list("-date", 10),
      ]);
      setHabits(h);
      setAllLogs(logs);
      setTodayLogs(logs.filter((l) => l.date === today && l.completed));
      if (scriptures.length > 0) {
        const idx = new Date().getDate() % scriptures.length;
        setScripture(scriptures[idx]);
      }
      setAllWeights(weights);
      setWeightCount(weights[0]?.weight || 0);
      setPrayerCount(prayers.filter((p) => !p.answered).length);
      const todayEntry = journalEntries.find((e) => e.date === today);
      setTodayJournalEntry(todayEntry || null);
  }, [today]);

  const toggleHabit = async (habit) => {
    const existing = todayLogs.find((l) => l.habit_id === habit.id);
    if (existing) {
      // Optimistic remove
      setTodayLogs(todayLogs.filter((l) => l.id !== existing.id));
      setAllLogs(allLogs.filter((l) => l.id !== existing.id));
      await base44.entities.HabitLog.delete(existing.id);
    } else {
      // Optimistic add with temp id
      const tempLog = { id: `temp-${habit.id}`, habit_id: habit.id, date: today, completed: true };
      setTodayLogs([...todayLogs, tempLog]);
      setAllLogs([tempLog, ...allLogs]);
      const newLog = await base44.entities.HabitLog.create({ habit_id: habit.id, date: today, completed: true });
      setTodayLogs((prev) => prev.map((l) => l.id === tempLog.id ? newLog : l));
      setAllLogs((prev) => prev.map((l) => l.id === tempLog.id ? newLog : l));
    }
  };

  // Overall 7-day consistency across all habits
  const last7 = daysBack(7);
  const possible7 = habits.length * 7;
  const done7 = allLogs.filter((l) => last7.includes(l.date) && l.completed).length;
  const consistency = possible7 ? Math.round((done7 / possible7) * 100) : 0;

  // 30-day rate
  const last30 = daysBack(30);
  const possible30 = habits.length * 30;
  const done30 = allLogs.filter((l) => last30.includes(l.date) && l.completed).length;
  const monthRate = possible30 ? Math.round((done30 / possible30) * 100) : 0;

  // Best streak across habits
  const bestStreak = habits.reduce((max, h) => {
    const dates = allLogs.filter((l) => l.habit_id === h.id && l.completed).map((l) => l.date);
    return Math.max(max, computeStreak(dates));
  }, 0);

  // Consistency streak: days in a row where ALL habits were completed
  const consistencyStreak = (() => {
    if (!habits.length) return 0;
    let streak = 0;
    const days = daysBack(90);
    for (let i = days.length - 1; i >= 0; i--) {
      const d = days[i];
      const doneThat = allLogs.filter((l) => l.date === d && l.completed).length;
      if (doneThat >= habits.length) streak++;
      else break;
    }
    return streak;
  })();

  // Consistency Score: weighted blend (streak 40%, week 40%, month 20%), capped 0-100
  const consistencyScore = habits.length === 0 ? 0 : Math.min(100, Math.round(
    (Math.min(consistencyStreak, 30) / 30) * 40 +
    consistency * 0.4 +
    monthRate * 0.2
  ));

  const completedIds = todayLogs.map((l) => l.habit_id);

  // Context for intelligent journal prompts
  const todayHabitRate = habits.length ? Math.round((completedIds.length / habits.length) * 100) : 0;
  const habitsByCompletion = habits.map((h) => ({
    ...h,
    done: allLogs.filter((l) => l.habit_id === h.id && l.date === today && l.completed).length,
  }));
  const bestHabit = habitsByCompletion.find((h) => h.done > 0)?.name || null;
  const worstHabit = habitsByCompletion.find((h) => h.done === 0)?.name || null;
  const greeting = (() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <PullToRefresh onRefresh={load}>
    <div className="space-y-10">
      <ReminderBanner />

      <div className="animate-fade-up">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-3">
          {format(new Date(), "EEEE · MMMM d")}
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight leading-[1.05]">
          {greeting}{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}.
        </h1>
        <p className="text-muted-foreground mt-3 text-sm lg:text-base">
          Train your body. Renew your mind. Strengthen your spirit.
        </p>
      </div>

      <TodaysWord />

      {scripture && <ScriptureCard scripture={scripture} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatTile label="Best Streak" value={`${bestStreak}d`} sub="Keep going" accent />
        <StatTile label="7-Day Rate" value={`${consistency}%`} sub="Consistency" />
        <StatTile label="Weight" value={weightCount ? weightCount : "—"} sub="Last logged" />
        <StatTile label="Prayers" value={prayerCount} sub="Active requests" />
      </div>

      {/* Progress section */}
      {habits.length > 0 && (
        <div className="space-y-4 lg:space-y-5 animate-fade-up">
          <ConsistencyScore
            score={consistencyScore}
            streak={consistencyStreak}
            weekRate={consistency}
            monthRate={monthRate}
          />
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-5">
            <ProgressTrends weights={allWeights} allLogs={allLogs} habits={habits} />
            <HabitStreakBars habits={habits} logs={allLogs} />
          </div>
        </div>
      )}

      <DailyJournalWidget
        habitRate={todayHabitRate}
        bestHabit={bestHabit}
        worstHabit={worstHabit}
        todayEntry={todayJournalEntry}
        onEntrySaved={(entry) => setTodayJournalEntry(entry)}
      />

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <TodayHabits habits={habits} completedIds={completedIds} onToggle={toggleHabit} />
        <div className="space-y-4">
          <MorningPrompt />
          <Link
            to="/battle"
            className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/95 text-background p-6"
          >
            <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-gold/15 blur-3xl group-hover:bg-gold/25 transition" />
            <div className="relative flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <Swords className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">Battle Mode</div>
                <p className="font-serif text-2xl leading-tight mb-2">Struggling right now?</p>
                <p className="text-sm text-background/70 mb-3">Scripture. Encouragement. One next step.</p>
                <div className="inline-flex items-center gap-1.5 text-sm text-gold">
                  I need help <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </PullToRefresh>
  );
}