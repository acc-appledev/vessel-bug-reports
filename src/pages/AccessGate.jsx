import React from "react";
import { base44 } from "@/api/base44Client";
import { Lock } from "lucide-react";

export default function AccessGate() {
  return (
    <div className="min-h-screen bg-background grain flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-up">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center">
            <span className="font-serif text-3xl text-gold leading-none">V</span>
          </div>
          <h1 className="font-serif text-4xl tracking-tight">Vessel</h1>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Body · Mind · Spirit
          </p>
        </div>

        {/* Gate card */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold-soft flex items-center justify-center">
            <Lock className="w-5 h-5 text-gold" />
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-2xl">Access Restricted</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Log in to your account to access Vessel, or sign up and subscribe to get started.
            </p>
          </div>

          <div className="border-t border-border pt-5 space-y-3">
            <button
              onClick={() => base44.auth.redirectToLogin()}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-gold text-white text-sm font-medium hover:bg-gold/90 transition-colors"
            >
              Log in to Vessel
            </button>
            <p className="text-xs text-muted-foreground text-center">
              New here? Log in and subscribe to get started.
            </p>
          </div>
        </div>

        {/* Sign out + Privacy */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => base44.auth.logout()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
          <span className="text-muted-foreground/40 text-xs">·</span>
          <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}