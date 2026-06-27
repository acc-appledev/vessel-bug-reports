import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swords, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const battles = [
  {
    id: "lazy",
    label: "I don't feel like working out",
    scripture: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
    action: "Start with 5 minutes. Don't quit.",
    encouragement: "Feelings lie. Your body is a temple — move it in worship.",
  },
  {
    id: "tempted",
    label: "I'm being tempted",
    scripture: "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out.",
    reference: "1 Corinthians 10:13",
    action: "Walk away. Call someone. Open the Word.",
    encouragement: "There is always a way out. Look for it. Take it.",
  },
  {
    id: "discouraged",
    label: "I feel like quitting",
    scripture: "Let us not grow weary of doing good, for in due season we will reap, if we do not give up.",
    reference: "Galatians 6:9",
    action: "Take one small step forward. Just one.",
    encouragement: "The harvest is coming. Don't stop now.",
  },
  {
    id: "anxious",
    label: "I'm anxious",
    scripture: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    action: "Breathe slowly for 60 seconds. Then pray one sentence.",
    encouragement: "Anxiety loses its grip when you name it before Him.",
  },
  {
    id: "insecure",
    label: "I don't feel enough",
    scripture: "I praise you because I am fearfully and wonderfully made.",
    reference: "Psalm 139:14",
    action: "Declare: 'I am chosen. I am loved. I am enough in Him.'",
    encouragement: "Your identity isn't performance. It's His.",
  },
  {
    id: "angry",
    label: "I'm angry",
    scripture: "In your anger do not sin: Do not let the sun go down while you are still angry.",
    reference: "Ephesians 4:26",
    action: "Pause. Write it down before you say it out loud.",
    encouragement: "Anger isn't the enemy. Acting from it is.",
  },
];

export default function BattleMode() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-2xl animate-fade-up">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <X className="w-4 h-4" /> close
          </button>

          <div className="rounded-3xl bg-foreground text-background p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative space-y-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-3">Scripture</div>
                <p className="font-serif text-3xl lg:text-4xl leading-tight">"{selected.scripture}"</p>
                <p className="text-sm text-background/60 mt-4 tracking-wide">— {selected.reference}</p>
              </div>

              <div className="h-px bg-background/10" />

              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-3">Truth</div>
                <p className="font-serif italic text-xl text-background/90">{selected.encouragement}</p>
              </div>

              <div className="h-px bg-background/10" />

              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-3">One next step</div>
                <p className="font-serif text-2xl text-gold">{selected.action}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => navigate("/journal")}
                  className="bg-gold hover:bg-gold/90 text-white rounded-full"
                >
                  Journal this <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/prayer")}
                  className="rounded-full bg-transparent border-background/20 text-background hover:bg-background/10 hover:text-background"
                >
                  Pray through it
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10 animate-fade-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-foreground flex items-center justify-center mb-6">
          <Swords className="w-7 h-7 text-gold" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-3">Battle Mode</div>
        <h1 className="font-serif text-4xl lg:text-5xl leading-tight tracking-tight">What are you fighting?</h1>
        <p className="text-muted-foreground mt-4 text-sm lg:text-base max-w-md mx-auto">
          You don't have to figure this out alone. Name it. Let the Word answer.
        </p>
      </div>

      <div className="space-y-3">
        {battles.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setSelected(b)}
            className={cn(
              "w-full text-left p-5 rounded-2xl border border-border bg-card hover:border-gold/50 hover:bg-gold-soft/30 transition-all group flex items-center justify-between animate-fade-up"
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="font-serif text-xl">{b.label}</span>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}