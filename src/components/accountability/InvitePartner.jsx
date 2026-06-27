import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Clock } from "lucide-react";

export default function InvitePartner({ user, existingInvite, onInviteSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendInvite = async () => {
    if (!email.trim() || email.trim() === user.email) return;
    setLoading(true);
    const record = await base44.entities.AccountabilityPartner.create({
      inviter_email: user.email,
      partner_email: email.trim().toLowerCase(),
      status: "pending",
    });
    await base44.integrations.Core.SendEmail({
      to: email.trim(),
      subject: `${user.full_name || user.email} invited you to be their accountability partner on Vessel`,
      body: `Hey!\n\n${user.full_name || "Someone"} wants you to be their accountability partner on Vessel — an app to help build physical, spiritual, and mental discipline.\n\nSign up at the app and accept the invite to start tracking progress together.\n\nTrain your body. Renew your mind. Strengthen your spirit.`,
    });
    setLoading(false);
    setSent(true);
    onInviteSent(record);
  };

  if (existingInvite) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-gold-soft flex items-center justify-center">
          <Clock className="w-5 h-5 text-gold" />
        </div>
        <h3 className="font-serif text-xl">Invite pending</h3>
        <p className="text-sm text-muted-foreground">
          Waiting for <span className="font-medium text-foreground">{existingInvite.partner_email}</span> to join.
        </p>
        <p className="text-xs text-muted-foreground italic">They'll receive your shared dashboard once they sign up.</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold-soft/40 p-8 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-gold flex items-center justify-center">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-serif text-xl">Invite sent!</h3>
        <p className="text-sm text-muted-foreground">They'll get an email with a link to join. Once they sign up, your shared dashboard activates.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gold-soft flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-serif text-2xl">Invite your partner</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Iron sharpens iron. Bring someone into the journey.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Partner's email</Label>
          <Input
            type="email"
            placeholder="friend@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendInvite()}
          />
        </div>
        <Button
          onClick={sendInvite}
          disabled={loading || !email.trim()}
          className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full"
        >
          {loading ? "Sending..." : "Send invite"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        They'll receive an email invitation and a link to join Vessel.
      </p>
    </div>
  );
}