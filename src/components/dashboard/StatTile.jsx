import React from "react";

export default function StatTile({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden">
      {accent && (
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gold/10 blur-2xl" />
      )}
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-2">
          {label}
        </div>
        <div className="font-serif text-3xl leading-none">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-2">{sub}</div>}
      </div>
    </div>
  );
}