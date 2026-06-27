import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Check } from "lucide-react";

const features = [
  "Daily habit tracking — body, mind & spirit",
  "Workout & weight logging with trends",
  "Prayer journal with answered prayer tracking",
  "Scripture library & daily declarations",
  "AI-powered journal prompts",
  "Weekly reports & consistency score",
  "Battle Mode — scripture for tough moments",
  "Accountability partner system",
];

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      alert("Payment checkout only works from the published app. Please open the app directly.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("createCheckoutSession", {
        return_url: window.location.origin + "/",
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError("Could not start checkout. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grain flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 animate-fade-up relative">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shadow-xl">
            <span className="font-serif text-4xl text-gold leading-none">V</span>
          </div>
          <h1 className="font-serif text-5xl tracking-tight">Vessel</h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60 font-medium">
            Body · Mind · Spirit
          </p>
        </div>

        {/* Pricing card */}
        <div className="rounded-3xl border border-border/60 bg-card shadow-[0_8px_60px_rgba(0,0,0,0.08)] p-8 space-y-6 text-left">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-soft text-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 border border-gold/20">
              <Sparkles className="w-3 h-3" /> 7-Day Free Trial
            </div>
            <div className="font-serif text-6xl tracking-tight">Free</div>
            <div className="text-muted-foreground text-sm">for 7 days, then <span className="text-foreground font-medium">$9.99/month</span> · cancel anytime</div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-gold-soft flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-gold" />
                </div>
                <span className="text-foreground/80">{f}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-gold to-gold/80 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:shadow-xl"
          >
            {loading ? "Redirecting…" : "Start My Free 7-Day Trial →"}
          </button>

          <p className="text-xs text-muted-foreground/70 text-center">
            No charge for 7 days · Secure payment via Stripe · Cancel anytime
          </p>
        </div>

        <button
          onClick={() => base44.auth.logout("/")}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}