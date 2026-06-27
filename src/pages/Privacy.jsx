import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background grain px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <span className="font-serif text-2xl text-gold leading-none">V</span>
            </div>
            <div>
              <div className="font-serif text-2xl leading-none">Vessel</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Body · Mind · Spirit</div>
            </div>
          </div>
          <h1 className="font-serif text-4xl tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vessel is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have. We do not sell your personal data.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">Information We Collect</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Account information</strong> — your name and email address provided at registration.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Usage data</strong> — habits, journal entries, prayer requests, fitness logs, and goals you create inside the app.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Preferences</strong> — app settings such as your daily reminder time.</span></li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">How We Use Your Information</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span>To provide and improve the Vessel app experience.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span>To send daily reminder emails at your chosen time, if enabled.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span>To generate personal progress reports and analytics within the app.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span>To facilitate accountability partnerships with other Vessel users you invite.</span></li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties. Your data is only shared in the following limited circumstances:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Accountability partners</strong> — habit streak and progress data you explicitly choose to share when linking with a partner.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Service providers</strong> — trusted infrastructure providers that host and operate Vessel, bound by confidentiality agreements.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Legal requirements</strong> — if required by law or to protect the rights and safety of our users.</span></li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely and transmitted over encrypted connections (HTTPS). We follow industry-standard practices to protect your information from unauthorized access.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">Your Rights</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Access</strong> — you can view all your data within the app at any time.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Deletion</strong> — you can delete your account and all associated data from the Account settings page.</span></li>
              <li className="flex gap-2"><span className="text-gold shrink-0">•</span><span><strong className="text-foreground">Opt-out</strong> — you can disable email reminders at any time in your Account settings.</span></li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this policy? Email us at{" "}
              <a href="mailto:support@vessel.app" className="text-gold underline underline-offset-2">
                support@vessel.app
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}