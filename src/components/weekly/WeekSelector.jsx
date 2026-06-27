import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeekSelector({ weekOffset, onChange, weekLabel }) {
  return (
    <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
      <button
        onClick={() => onChange(weekOffset + 1)}
        disabled={weekOffset >= 8}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium px-2 min-w-[100px] text-center">{weekLabel}</span>
      <button
        onClick={() => onChange(weekOffset - 1)}
        disabled={weekOffset <= 0}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}