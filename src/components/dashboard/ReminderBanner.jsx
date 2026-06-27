import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Clock, X } from "lucide-react";
import { todayStr } from "@/lib/dateHelpers";

export default function ReminderBanner() {
  const [show, setShow] = useState(false);
  const [habits, setHabits] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [journalEntry, setJournalEntry] = useState(null);

  useEffect(() => {
    const load = async () => {
      const today = todayStr();
      const [h, logs, entries] = await Promise.all([
        base44.entities.Habit.filter({ active: true }),
        base44.entities.HabitLog.list("-date", 500),
        base44.entities.JournalEntry.list("-date", 1),
      ]);
      
      setHabits(h);
      setTodayLogs(logs.filter(l => l.date === today && l.completed));
      setJournalEntry(entries.find(e => e.date === today) || null);
    };
    
    load();
  }, []);

  if (!habits.length) return null;

  const incompletedCount = habits.length - todayLogs.length;
  const hasJournal = journalEntry !== null;
  const shouldShow = (incompletedCount > 0 || !hasJournal);

  if (!shouldShow || !show) return null;

  return (
    <div className="relative mb-6 rounded-2xl border border-gold/30 bg-gold-soft p-5 flex items-start justify-between gap-4 animate-fade-up">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground mb-1">Time to reflect</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {incompletedCount > 0 && <span>{incompletedCount} habit{incompletedCount > 1 ? 's' : ''} pending. </span>}
            {!hasJournal && <span>Your journal is waiting.</span>}
          </p>
        </div>
      </div>
      <button
        onClick={() => setShow(false)}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}