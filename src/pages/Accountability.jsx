import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "../components/shared/SectionHeader";
import InvitePartner from "../components/accountability/InvitePartner";
import IncomingInvite from "../components/accountability/IncomingInvite";
import PartnerStreakCard from "../components/accountability/PartnerStreakCard";
import MessageThread from "../components/accountability/MessageThread";
import { todayStr, computeStreak, daysBack } from "@/lib/dateHelpers";

export default function Accountability() {
  const [user, setUser] = useState(null);
  const [partnership, setPartnership] = useState(null); // active partnership
  const [pendingOutgoing, setPendingOutgoing] = useState(null); // invite I sent
  const [pendingIncoming, setPendingIncoming] = useState(null); // invite for me
  const [loading, setLoading] = useState(true);

  // My data
  const [myHabits, setMyHabits] = useState([]);
  const [myLogs, setMyLogs] = useState([]);

  // Partner data (fetched via shared logs filtered by partner email recorded in habits/logs)
  const [partnerHabits, setPartnerHabits] = useState([]);
  const [partnerLogs, setPartnerLogs] = useState([]);

  const today = todayStr();

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      if (!me) return;
      setUser(me);

      // Load all partnerships involving me
      const [outgoing, incoming] = await Promise.all([
        base44.entities.AccountabilityPartner.filter({ inviter_email: me.email }),
        base44.entities.AccountabilityPartner.filter({ partner_email: me.email }),
      ]);

      const activeOut = outgoing.find((p) => p.status === "active");
      const activeIn = incoming.find((p) => p.status === "active");
      const active = activeOut || activeIn;

      if (active) {
        setPartnership(active);
        // Load my habits and logs
        const [h, l] = await Promise.all([
          base44.entities.Habit.filter({ active: true }),
          base44.entities.HabitLog.list("-date", 1000),
        ]);
        setMyHabits(h);
        // My own logs are those created_by me
        setMyLogs(l.filter((log) => log.created_by === me.email));

        // Load partner data
        const partnerEmail = active.inviter_email === me.email ? active.partner_email : active.inviter_email;
        // Fetch all habits by partner (created_by partner email)
        const [ph, pl] = await Promise.all([
          base44.entities.Habit.filter({ active: true }),
          base44.entities.HabitLog.list("-date", 1000),
        ]);
        // Filter by created_by partner
        setPartnerHabits(ph.filter((h) => h.created_by === partnerEmail));
        setPartnerLogs(pl.filter((l) => l.created_by === partnerEmail));
      } else {
        // Check pending
        const pendingOut = outgoing.find((p) => p.status === "pending");
        const pendingIn = incoming.find((p) => p.status === "pending");
        setPendingOutgoing(pendingOut || null);
        setPendingIncoming(pendingIn || null);

        // Still load my own data
        const [h, l] = await Promise.all([
          base44.entities.Habit.filter({ active: true }),
          base44.entities.HabitLog.list("-date", 1000),
        ]);
        setMyHabits(h);
        setMyLogs(l.filter((log) => log.created_by === me.email));
      }
      setLoading(false);
    })();
  }, []);

  // Compute stats for a given set of habits + logs
  const computeStats = (habits, logs) => {
    const bestStreak = habits.reduce((max, h) => {
      const dates = logs.filter((l) => l.habit_id === h.id && l.completed).map((l) => l.date);
      return Math.max(max, computeStreak(dates));
    }, 0);
    const todayDone = logs.filter((l) => l.date === today && l.completed).length;
    const todayTotal = habits.length;
    return { bestStreak, todayDone, todayTotal };
  };

  const myStats = computeStats(myHabits, myLogs);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-muted border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Accountability"
        title="Iron sharpens iron"
        subtitle="A partner in discipline is a partner in growth. Invite someone into your journey."
      />

      {/* No partnership yet */}
      {!partnership && (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            {pendingIncoming && (
              <IncomingInvite
                invite={pendingIncoming}
                onAccept={(updated) => {
                  setPartnership(updated);
                  setPendingIncoming(null);
                }}
                onDecline={() => setPendingIncoming(null)}
              />
            )}
            <InvitePartner
              user={user}
              existingInvite={pendingOutgoing}
              onInviteSent={(record) => setPendingOutgoing(record)}
            />
          </div>

          {/* My preview card even without a partner */}
          <div className="space-y-4">
            <PartnerStreakCard
              label="Your progress"
              email={user?.email}
              habits={myHabits}
              logs={myLogs}
              bestStreak={myStats.bestStreak}
              todayDone={myStats.todayDone}
              todayTotal={myStats.todayTotal}
              isYou
            />
            <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2 opacity-60">
              <p className="font-serif text-xl">Partner's progress</p>
              <p className="text-sm text-muted-foreground">Appears once they accept your invite.</p>
            </div>
          </div>
        </div>
      )}

      {/* Active partnership */}
      {partnership && user && (() => {
        const partnerEmail = partnership.inviter_email === user.email
          ? partnership.partner_email
          : partnership.inviter_email;
        const partnerStats = computeStats(partnerHabits, partnerLogs);

        return (
          <div className="space-y-8">
            {/* Side-by-side streak cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <PartnerStreakCard
                label="You"
                email={user.email}
                habits={myHabits}
                logs={myLogs}
                bestStreak={myStats.bestStreak}
                todayDone={myStats.todayDone}
                todayTotal={myStats.todayTotal}
                isYou
              />
              <PartnerStreakCard
                label="Partner"
                email={partnerEmail}
                habits={partnerHabits}
                logs={partnerLogs}
                bestStreak={partnerStats.bestStreak}
                todayDone={partnerStats.todayDone}
                todayTotal={partnerStats.todayTotal}
                isYou={false}
              />
            </div>

            {/* Messaging */}
            <MessageThread partnershipId={partnership.id} user={user} />
          </div>
        );
      })()}
    </div>
  );
}