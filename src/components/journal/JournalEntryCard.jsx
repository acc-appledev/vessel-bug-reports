import React from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moods } from "./MoodPicker";

export default function JournalEntryCard({ entry, onDelete }) {
  const mood = moods.find((m) => m.value === entry.mood) || moods[2];
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mood.emoji}</span>
          <div>
            <div className="text-sm font-medium">{mood.label}</div>
            <div className="text-xs text-muted-foreground">{format(new Date(entry.date), "EEEE · MMM d")}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(entry)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {entry.prompt && (
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1">{entry.prompt}</div>
      )}
      <p className="font-serif text-lg leading-snug whitespace-pre-wrap">{entry.content}</p>
      {(entry.wins || entry.struggles) && (
        <div className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
          {entry.wins && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold mb-1">Wins</div>
              <p className="text-sm text-foreground/80">{entry.wins}</p>
            </div>
          )}
          {entry.struggles && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-clay mb-1">Struggles</div>
              <p className="text-sm text-foreground/80">{entry.struggles}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}