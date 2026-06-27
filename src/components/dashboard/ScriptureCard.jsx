import React from "react";
import { BookOpen } from "lucide-react";

export default function ScriptureCard({ scripture }) {
  if (!scripture) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 lg:p-10">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute right-8 bottom-8 opacity-10">
        <BookOpen className="w-24 h-24 text-gold" strokeWidth={1} />
      </div>
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-4">
          Today's Word · {scripture.category}
        </div>
        <p className="font-serif text-2xl lg:text-3xl leading-tight mb-5 max-w-2xl">
          "{scripture.text}"
        </p>
        <div className="text-sm text-background/70 tracking-wide">— {scripture.reference}</div>
        {scripture.declaration && (
          <div className="mt-6 pt-6 border-t border-background/10 max-w-2xl">
            <div className="text-[10px] uppercase tracking-[0.22em] text-background/60 mb-2">Declare</div>
            <p className="font-serif italic text-lg text-gold/90">"{scripture.declaration}"</p>
          </div>
        )}
      </div>
    </div>
  );
}