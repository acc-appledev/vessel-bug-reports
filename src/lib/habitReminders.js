/**
 * Habit Reminder Engine
 * Analyses past logs to identify at-risk habits and schedules
 * browser notifications (with snooze support) entirely client-side.
 */

import { daysBack, todayStr } from "./dateHelpers";

const STORAGE_KEY = "vessel_reminders";
const SNOOZE_KEY  = "vessel_snooze";

// ─── persistence helpers ──────────────────────────────────────────────────────

export function getReminderSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || defaultSettings();
  } catch {
    return defaultSettings();
  }
}

export function saveReminderSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function defaultSettings() {
  return {
    enabled: false,           // master switch
    morningTime: "08:00",     // HH:MM
    eveningTime: "20:00",     // HH:MM for evening nudge
    notifyMorning: true,
    notifyEvening: true,
  };
}

// ─── snooze ──────────────────────────────────────────────────────────────────

export function snoozeReminder(habitId, minutes = 30) {
  const snoozes = getSnoozes();
  snoozes[habitId] = Date.now() + minutes * 60 * 1000;
  localStorage.setItem(SNOOZE_KEY, JSON.stringify(snoozes));
}

export function clearSnooze(habitId) {
  const snoozes = getSnoozes();
  delete snoozes[habitId];
  localStorage.setItem(SNOOZE_KEY, JSON.stringify(snoozes));
}

export function getSnoozes() {
  try {
    return JSON.parse(localStorage.getItem(SNOOZE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function isSnoozed(habitId) {
  const snoozes = getSnoozes();
  if (!snoozes[habitId]) return false;
  if (Date.now() < snoozes[habitId]) return true;
  clearSnooze(habitId);
  return false;
}

// ─── analysis ────────────────────────────────────────────────────────────────

/**
 * Returns habits most at risk of being skipped today, sorted by skip-rate desc.
 * "At risk" = not yet done today AND missed ≥ 40% of last 14 days.
 */
export function getAtRiskHabits(habits, logs) {
  const today = todayStr();
  const last14 = daysBack(14);
  const doneToday = new Set(
    logs.filter((l) => l.date === today && l.completed).map((l) => l.habit_id)
  );

  return habits
    .filter((h) => !doneToday.has(h.id))
    .map((h) => {
      const habitLogs = logs.filter((l) => l.habit_id === h.id && l.completed);
      const doneSet = new Set(habitLogs.map((l) => l.date));
      const completedLast14 = last14.filter((d) => doneSet.has(d)).length;
      const skipRate = 1 - completedLast14 / 14;
      return { ...h, skipRate, completedLast14 };
    })
    .filter((h) => h.skipRate >= 0.4)
    .sort((a, b) => b.skipRate - a.skipRate);
}

// ─── messages ────────────────────────────────────────────────────────────────

const messages = [
  (name) => `${name} is waiting. Don't break the chain today.`,
  (name) => `You've been skipping ${name}. Today is your comeback.`,
  (name) => `"Let us not grow weary of doing good." — Start ${name}.`,
  (name) => `${name} missed you. 5 minutes is all it takes.`,
  (name) => `Discipline or regret — your choice. Time for ${name}.`,
];

export function getReminderMessage(habit) {
  const fn = messages[Math.floor(Math.random() * messages.length)];
  return fn(habit.name);
}

// ─── browser notification ────────────────────────────────────────────────────

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

export function sendBrowserNotification(habit, onSnooze) {
  if (Notification.permission !== "granted") return;
  if (isSnoozed(habit.id)) return;

  const body = getReminderMessage(habit);
  const n = new Notification("Vessel — Habit Reminder", {
    body,
    icon: "/favicon.ico",
    tag: `vessel-habit-${habit.id}`,
    requireInteraction: true,
  });

  n.onclick = () => {
    window.focus();
    n.close();
  };
}

// ─── scheduler ───────────────────────────────────────────────────────────────

let schedulerInterval = null;

export function startReminderScheduler(habits, logs, settings) {
  stopReminderScheduler();
  if (!settings.enabled) return;

  // Check every 60 seconds whether it's time to fire a notification
  schedulerInterval = setInterval(() => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const shouldFire =
      (settings.notifyMorning && hhmm === settings.morningTime) ||
      (settings.notifyEvening && hhmm === settings.eveningTime);

    if (!shouldFire) return;

    const atRisk = getAtRiskHabits(habits, logs);
    atRisk.slice(0, 3).forEach((h) => sendBrowserNotification(h));
  }, 60_000);
}

export function stopReminderScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}