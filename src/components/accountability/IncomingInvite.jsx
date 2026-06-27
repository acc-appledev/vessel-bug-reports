import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { UserCheck, X, ShieldCheck } from "lucide-react";

export default function IncomingInvite({ invite, onAccept, onDecline }) {
  const [loading, setLoading] = useState(false);

  const accept = async () => {
    setLoading(true);
    const updated = await base44.entities.AccountabilityPartner.update(invite.id, { status: "active" });
    onAccept(updated);
    setLoading(false);
  };

  const decline = async () => {
    setLoading(true);
    await base44.entities.AccountabilityPartner.update(invite.id, { status: "declined" });
    onDecline();
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-gold/40 bg-gold-soft/30 p-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gold flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">Accountability invite</div>
          <h3 className="font-serif text-2xl">You've been invited</h3>
        </div>
      </div>

      <p className="text-sm text-foreground/80">
        <span className="font-semibold">{invite.inviter_email}</span> wants you to be their accountability partner.
        You'll see each other's habit streaks and can send encouragement.
      </p>

      <div className="flex gap-3">
        <Button
          onClick={accept}
          disabled={loading}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full"
        >
          <UserCheck className="w-4 h-4 mr-1.5" />
          Accept
        </Button>
        <Button
          onClick={decline}
          disabled={loading}
          variant="outline"
          className="flex-1 rounded-full"
        >
          <X className="w-4 h-4 mr-1.5" />
          Decline
        </Button>
      </div>
    </div>
  );
}