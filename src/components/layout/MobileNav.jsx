import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Flame, Dumbbell, HandHeart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Today", icon: Home },
  { to: "/habits", label: "Habits", icon: Flame },
  { to: "/fitness", label: "Body", icon: Dumbbell },
  { to: "/prayer", label: "Prayer", icon: HandHeart },
  { to: "/account", label: "Account", icon: UserCircle },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTap = (to) => {
    if (location.pathname === to) {
      // Already on this tab — reset to root
      navigate(to, { replace: true });
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-2xl border-t border-border/50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => handleTap(to)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all select-none",
                active ? "text-foreground" : "text-muted-foreground/70"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                active ? "bg-foreground shadow-md" : "bg-transparent"
              )}>
                <Icon className={cn("w-4 h-4 transition-colors", active ? "text-gold" : "text-muted-foreground")} />
              </div>
              <span className={cn("text-[9px] font-medium tracking-wider uppercase", active ? "text-gold" : "")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}