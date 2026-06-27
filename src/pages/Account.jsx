import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "../components/shared/SectionHeader";
import { LogOut, Trash2, User, Mail, Shield, CreditCard } from "lucide-react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setReminderTime(u?.reminder_time || "09:00");
    }).catch(() => {});
  }, []);

  const handleSaveReminder = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ reminder_time: reminderTime });
      setUser(prev => ({ ...prev, reminder_time: reminderTime }));
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await base44.functions.invoke("createPortalSession", {
        return_url: window.location.href,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Portal error:", err.message);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.entities.User.delete(user.id);
      base44.auth.logout();
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-10 max-w-lg">
      <SectionHeader
        eyebrow="Account"
        title="My Account"
        subtitle="Manage your profile and preferences."
      />

      {/* Profile Info */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl">Profile</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-gold-soft flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-gold" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Name</div>
              <div className="font-medium">{user?.full_name || "—"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-gold-soft flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gold" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
              <div className="font-medium">{user?.email || "—"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-gold-soft flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-gold" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</div>
              <div className="font-medium capitalize">{user?.role || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl">Daily Reminders</h2>
        <p className="text-sm text-muted-foreground">Get a daily email reminder at your chosen time to complete your habits and journal.</p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Reminder Time (24-hour)
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
          </div>
          <button
            onClick={handleSaveReminder}
            disabled={saving || reminderTime === user?.reminder_time}
            className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Help */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h2 className="font-serif text-xl">Help & Support</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Need help or have a question? Reach out at{" "}
          <a
            href="mailto:support@vessel.app"
            className="text-gold underline underline-offset-2"
          >
            support@vessel.app
          </a>
        </p>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h2 className="font-serif text-xl">Account Actions</h2>
        {user?.subscription_status === 'active' && (
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            {portalLoading ? "Loading…" : "Manage Billing & Subscription"}
          </button>
        )}
        <button
          onClick={() => base44.auth.logout("/")}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-xl mb-2">Delete Account?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently remove your account and all data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm"
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}