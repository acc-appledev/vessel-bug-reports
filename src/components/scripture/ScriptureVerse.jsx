import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ScriptureVerse({ scripture }) {
  const [declared, setDeclared] = useState(false);

  const handleDeclare = () => {
    setDeclared(true);
    setTimeout(() => setDeclared(false), 2400);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:border-gold/40 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium">{scripture.category}</span>
        <span className="text-xs text-muted-foreground">{scripture.reference}</span>
      </div>
      <p className="font-serif text-xl leading-snug mb-4">"{scripture.text}"</p>
      {scripture.declaration && (
        <div className="pt-4 border-t border-border">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Speak truth over yourself</div>
          <p className="font-serif italic text-lg text-foreground/90 mb-3">"{scripture.declaration}"</p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDeclare}
            className={cn(
              "rounded-full transition-all",
              declared && "bg-gold border-gold text-white"
            )}
          >
            <Sparkles className={cn("w-3.5 h-3.5 mr-1.5", declared && "animate-pulse")} />
            {declared ? "Amen." : "Declare"}
          </Button>
        </div>
      )}
    </div>
  );
}