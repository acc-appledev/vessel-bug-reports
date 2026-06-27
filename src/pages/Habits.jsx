import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import PullToRefresh from "../components/shared/PullToRefresh";
import SectionHeader from "../components/shared/SectionHeader";
import EmptyState from "../components/shared/EmptyState";
import HabitRow from "../components/habits/HabitRow";
import NewHabitDialog from "../components/habits/NewHabitDialog";
import ReminderSettingsPanel from "../components/habits/ReminderSettingsPanel";
import ReminderToast from "../components/habits/ReminderToast";
import { Flame } from "lucide-react";
import { todayStr, computeStreak } from "@/lib/dateHelpers";
import { startReminderScheduler, stopReminderScheduler, getReminderSettings } from "@/lib/habitReminders";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const today = todayStr();

  const load = useCallback(async () => {
    const [h, l] = await Promise.all([
      base44.entities.Habit.filter({ active: true }, "-created_date"),
      base44.entities.HabitLog.list("-date", 1000),
    ]);
    setHabits(h);
    setLogs(l);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Start/restart the background scheduler whenever habits or logs change
  useEffect(() => {
    if (!habits.length) return;
    const settings = getReminderSettings();
    startReminderScheduler(habits, logs, settings);
    return () => stopReminderScheduler();
  }, [habits, logs]);

  const createHabit = async (data) => {
    const h = await base44.entities.Habit.create(data);
    setHabits([h, ...habits]);
  };

  const toggleDate = async (habit, date) => {
    const existing = logs.find((l) => l.habit_id === habit.id && l.date === date);
    if (existing) {
      // Optimistic remove
      setLogs(logs.filter((l) => l.id !== existing.id));
      await base44.entities.HabitLog.delete(existing.id);
    } else {
      // Optimistic add with temp id
      const tempLog = { id: `temp-${habit.id}-${date}`, habit_id: habit.id, date, completed: true };
      setLogs([tempLog, ...logs]);
      const newLog = await base44.entities.HabitLog.create({ habit_id: habit.id, date, completed: true });
      setLogs((prev) => prev.map((l) => l.id === tempLog.id ? newLog : l));
    }
  };

  const removeHabit = async (habit) => {
    await base44.entities.Habit.update(habit.id, { active: false });
    setHabits(habits.filter((h) => h.id !== habit.id));
  };

  return (
  <PullToRefresh onRefresh={load}>
  <div>
    <ReminderToast habits={habits} logs={logs} />
    <SectionHeader
        eyebrow="Discipline"
        title="Build your rhythm"
        subtitle="Small, daily acts of obedience compound into a life of strength."
        action={<NewHabitDialog onCreate={createHabit} />}
      />

      <ReminderSettingsPanel habits={habits} logs={logs} />

      {habits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No disciplines yet"
          description="Start with one — prayer, workout, Scripture. Small wins, daily."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {habits.map((h) => {
            const dates = logs.filter((l) => l.habit_id === h.id && l.completed).map((l) => l.date);
            return (
              <HabitRow
                key={h.id}
                habit={h}
                logs={logs}
                streak={computeStreak(dates)}
                onToggleDate={toggleDate}
                onDelete={removeHabit}
                todayStr={today}
              />
            );
          })}
        </div>
      )}
    </div>
  </PullToRefresh>
  );
}