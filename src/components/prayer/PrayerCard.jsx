import React, { useState } from "react";
import { Check, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { daysSince, todayStr } from "@/lib/dateHelpers";

export default function PrayerCard({ prayer, onAnswer, onDelete }) {
  const [answering, setAnswering] = useState(false);
  const [note, setNote] = useState("");
  const days = daysSince(prayer.date);

  const save = async () => {
    await onAnswer(prayer, { answered: true, answered_note: note, answered_date: todayStr() });
    setAnswering(false);
  };

  return (
    <div className={cn(
      "rounded-2xl border p-5 transition",
      prayer.answered ? "bg-gold-soft/40 border-gold/30" : "bg-card border-border"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          prayer.answered ? "bg-gold text-white" : "bg-secondary"
        )}>
          {prayer.answered ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{prayer.category}</span>
            <span className="text-[10px] text-muted-foreground">· {days === 0 ? "today" : `${days}d ago`}</span>
          </div>
          <p className="font-serif text-lg leading-snug">{prayer.request}</p>
          {prayer.answered && prayer.answered_note && (
            <div className="mt-3 pt-3 border-t border-gold/20">
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold mb-1">Answered</div>
              <p className="text-sm text-foreground/80 italic">"{prayer.answered_note}"</p>
            </div>
          )}
          {answering && (
            <div className="mt-3 space-y-2">
              <Textarea placeholder="How did God answer?" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="flex gap-2">
                <Button size="sm" onClick={save} className="bg-gold hover:bg-gold/90 text-white">Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setAnswering(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {!prayer.answered && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold" onClick={() => setAnswering(true)}>
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(prayer)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}