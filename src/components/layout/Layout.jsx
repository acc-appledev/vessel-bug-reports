import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { Swords, ChevronLeft } from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background grain">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-24 lg:pb-0" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
          {/* Mobile top bar */}
          <header className="lg:hidden sticky top-0 z-30 bg-background/75 backdrop-blur-2xl border-b border-border/40 shadow-[0_1px_12px_rgba(0,0,0,0.05)]" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <div className="flex items-center justify-between px-5 py-3.5">
              {isHome ? (
                <Link to="/" className="flex items-center gap-2.5 select-none">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shadow-sm">
                    <span className="font-serif text-lg text-gold leading-none">V</span>
                  </div>
                  <div>
                    <span className="font-serif text-xl tracking-tight leading-none">Vessel</span>
                    <div className="text-[8px] uppercase tracking-[0.2em] text-gold/60 font-medium">Body · Mind · Spirit</div>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground select-none"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <Link
                to="/battle"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-foreground to-foreground/85 text-background text-xs select-none shadow-md"
              >
                <Swords className="w-3.5 h-3.5 text-gold" />
                <span className="font-medium">Battle</span>
              </Link>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}