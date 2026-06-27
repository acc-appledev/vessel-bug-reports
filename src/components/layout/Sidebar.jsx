import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Flame, Dumbbell, BookOpen, HandHeart, NotebookPen, Swords, Users, BarChart2, CalendarCheck, Target, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Today", icon: Home },
  { to: "/habits", label: "Habits", icon: Flame },
  { to: "/fitness", label: "Fitness", icon: Dumbbell },
  { to: "/prayer", label: "Prayer", icon: HandHeart },
  { to: "/scripture", label: "Scripture", icon: BookOpen },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/accountability", label: "Accountability", icon: Users },
  { to: "/goals", label: "Weekly Goals", icon: Target },
  { to: "/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/weekly", label: "Weekly Report", icon: CalendarCheck },
  { to: "/account", label: "My Account", icon: UserCircle },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/60 bg-sidebar min-h-screen sticky top-0 shadow-[1px_0_20px_rgba(0,0,0,0.04)]">
      {/* Logo */}
      <div className="px-7 pt-8 pb-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shadow-md">
            <span className="font-serif text-2xl text-gold leading-none">V</span>
          </div>
          <div>
            <div className="font-serif text-2xl leading-none tracking-tight">Vessel</div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-gold/70 font-medium mt-1">Body · Mind · Spirit</div>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all select-none group",
                active
                  ? "bg-gradient-to-r from-foreground to-foreground/90 text-background shadow-md"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-gold" : "group-hover:text-gold/70")} />
              <span className={cn("font-medium", active ? "" : "font-normal")}>{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Battle Mode CTA */}
      <div className="p-4">
        <Link
          to="/battle"
          className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 text-background p-5 hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gold/25 blur-2xl group-hover:bg-gold/40 transition-all duration-500" />
          <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-gold/10 blur-xl" />
          <div className="relative flex items-center gap-2 mb-2">
            <Swords className="w-4 h-4 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Battle Mode</span>
          </div>
          <p className="relative text-sm text-background/75 leading-snug">Struggling right now? Tap here for strength.</p>
        </Link>
      </div>

      {/* Footer quote */}
      <div className="px-6 py-5 border-t border-border/50">
        <p className="font-serif italic text-xs text-muted-foreground/70 leading-relaxed">
          "Train your body. Renew your mind. Strengthen your spirit."
        </p>
      </div>
    </aside>
  );
}