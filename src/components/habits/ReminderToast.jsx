import React, { useEffect, useState } from "react";
import { Bell, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAtRiskHabits,
  getReminderSettings,
  getReminderMessage,
  snoozeReminder,
  isSnoozed,
  sendBrowserNotification,
} from "@/lib/habitReminders";

const SNOOZE_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hr",   value: 60 },
];

/**
 * Floating in-app reminder toast.
 * Shows the highest-risk un-snoozed habit as a gentle nudge.
 * Fires once on mount (if settings are enabled) and every 30 min thereafter.
 */
export default function ReminderToast({ habits, logs }) {
  const [visible, setVisible] = useState(false);
  const [habit, setHabit] = useState(null);
  const [message, setMessage] = useState("");
  const [, tick] = useState(0);

  const pickHabit = () => {
    const settings = getReminderSettings();
    if (!settings.enabled) return null;
    const atRisk = getAtRiskHabits(habits, logs).filter((h) => !isSnoozed(h.id));
    return atRisk[0] || null;
  };

  const show = () => {
    const h = pickHabit();
    if (!h) return;
    setHabit(h);
    setMessage(getReminderMessage(h));
    setVisible(true);
    sendBrowserNotification(h);
  };

  useEffect(() => {
    if (!habits.length) return;
    // Show 3 seconds after mount
    const t = setTimeout(show, 3000);
    // Re-check every 30 minutes
    const iv = setInterval(show, 30 * 60 * 1000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [habits, logs]);

  const handleSnooze = (minutes) => {
    if (!habit) return;
    snoozeReminder(habit.id, minutes);
    setVisible(false);
    tick((n) => n + 1);
  };

  if (!visible || !habit) return null;

  return (
    <div className={cn(
      "fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 w-80 max-w-[calc(100vw-2rem)]",
      "rounded-2xl border border-border bg-card shadow-2xl animate-fade-up"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-gold">
          <Bell className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.18em] font-medium">Habit Reminder</span>
        </div>
        <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 pb-3">
        <p className="font-serif text-base leading-snug">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Skipped {Math.round(habit.skipRate * 100)}% of the last 14 days
        </p>
      </div>

      {/* Snooze */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground mr-1">Snooze:</span>
        {SNOOZE_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => handleSnooze(o.value)}
            className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary hover:bg-muted transition"
          >
            {o.label}
          </button>
        ))}
        <button
          onClick={() => setVisible(false)}
          className="ml-auto text-xs px-2.5 py-1 rounded-full bg-foreground text-background hover:bg-foreground/90 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}