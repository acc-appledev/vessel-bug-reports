import React, { useState, useEffect } from "react";
import { Bell, BellOff, Clock, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  getAtRiskHabits,
  snoozeReminder,
  isSnoozed,
} from "@/lib/habitReminders";

const SNOOZE_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
];

function PermissionBanner({ permission, onRequest }) {
  if (permission === "granted") return null;
  if (permission === "denied") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl bg-clay/10 border border-clay/20 px-4 py-3 text-sm text-clay">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>Notifications blocked. Enable them in your browser settings, then reload.</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-gold-soft border border-gold/20 px-4 py-3">
      <Bell className="w-4 h-4 mt-0.5 text-gold shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">Allow browser notifications</p>
        <p className="text-xs text-muted-foreground mt-0.5">Required to receive habit reminders even when the app is in the background.</p>
      </div>
      <Button size="sm" onClick={onRequest} className="bg-foreground text-background shrink-0">Allow</Button>
    </div>
  );
}

function TimeInput({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

function AtRiskList({ habits, logs }) {
  const [, rerender] = useState(0);
  const atRisk = getAtRiskHabits(habits, logs);

  if (atRisk.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-olive">
        <CheckCircle2 className="w-4 h-4" />
        No at-risk habits right now — you're on track!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">At-risk habits</div>
      {atRisk.map((h) => {
        const snoozed = isSnoozed(h.id);
        const skipPct = Math.round(h.skipRate * 100);
        return (
          <div key={h.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <div>
              <div className="text-sm font-medium">{h.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Skipped {skipPct}% of last 14 days</div>
            </div>
            <div className="flex items-center gap-1.5">
              {snoozed ? (
                <span className="text-xs text-muted-foreground italic">Snoozed</span>
              ) : (
                SNOOZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { snoozeReminder(h.id, opt.value); rerender((n) => n + 1); }}
                    className="text-[10px] px-2 py-1 rounded-md bg-background border border-border hover:border-foreground/30 transition"
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ReminderSettingsPanel({ habits, logs }) {
  const [settings, setSettings] = useState(getReminderSettings);
  const [permission, setPermission] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  useEffect(() => { saveReminderSettings(settings); }, [settings]);

  const handleRequest = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") setSettings((s) => ({ ...s, enabled: true }));
  };

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">Smart Reminders</div>
          <h2 className="font-serif text-2xl">Habit notifications</h2>
        </div>
        {/* Master toggle */}
        <button
          onClick={() => {
            if (!settings.enabled && permission !== "granted") {
              handleRequest();
            } else {
              toggle("enabled");
            }
          }}
          className={cn(
            "relative w-12 h-6 rounded-full transition-colors",
            settings.enabled && permission === "granted" ? "bg-gold" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
              settings.enabled && permission === "granted" ? "translate-x-6" : "translate-x-0"
            )}
          />
        </button>
      </div>

      <PermissionBanner permission={permission} onRequest={handleRequest} />

      {settings.enabled && permission === "granted" && (
        <>
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Morning reminder</span>
              <input
                type="checkbox"
                checked={settings.notifyMorning}
                onChange={() => toggle("notifyMorning")}
                className="accent-gold w-4 h-4"
              />
            </div>
            {settings.notifyMorning && (
              <TimeInput
                label="Send at"
                value={settings.morningTime}
                onChange={(v) => setSettings((s) => ({ ...s, morningTime: v }))}
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Evening nudge</span>
              <input
                type="checkbox"
                checked={settings.notifyEvening}
                onChange={() => toggle("notifyEvening")}
                className="accent-gold w-4 h-4"
              />
            </div>
            {settings.notifyEvening && (
              <TimeInput
                label="Send at"
                value={settings.eveningTime}
                onChange={(v) => setSettings((s) => ({ ...s, eveningTime: v }))}
              />
            )}
          </div>

          <div className="border-t border-border pt-4">
            <AtRiskList habits={habits} logs={logs} />
          </div>

          <p className="text-xs text-muted-foreground">
            Reminders are sent for habits you skip most often. Snooze any for 15–60 minutes.
          </p>
        </>
      )}
    </div>
  );
}