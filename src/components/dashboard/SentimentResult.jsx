import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Heart, Smile, Meh, CloudRain, Blend } from "lucide-react";

const sentimentConfig = {
  positive: { icon: Smile,    color: "text-olive",           bg: "bg-olive/10",   label: "Positive"  },
  neutral:  { icon: Meh,      color: "text-muted-foreground", bg: "bg-secondary",  label: "Neutral"   },
  negative: { icon: CloudRain, color: "text-clay",            bg: "bg-clay/10",    label: "Struggling"},
  mixed:    { icon: Blend,    color: "text-gold",             bg: "bg-gold-soft",  label: "Mixed"     },
};

function ScoreBar({ score }) {
  const pct = ((score - 1) / 9) * 100;
  const color =
    score >= 7 ? "bg-olive" :
    score >= 4 ? "bg-gold"  :
    "bg-clay";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Wellbeing score</span>
        <span className="font-semibold text-foreground">{score} / 10</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SentimentResult({ sentiment, analyzing, content }) {
  if (analyzing) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
        <p className="text-sm">Reading between the lines…</p>
      </div>
    );
  }

  if (!sentiment) return null;

  const cfg = sentimentConfig[sentiment.sentiment] || sentimentConfig.neutral;
  const Icon = cfg.icon;

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Sentiment badge + score */}
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
          <Icon className={cn("w-5 h-5", cfg.color)} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Emotional tone</div>
          <div className={cn("font-medium text-sm", cfg.color)}>{cfg.label}</div>
        </div>
        {sentiment.emotions?.length > 0 && (
          <div className="flex gap-1.5 ml-auto flex-wrap justify-end">
            {sentiment.emotions.map((e) => (
              <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border capitalize">
                {e}
              </span>
            ))}
          </div>
        )}
      </div>

      {sentiment.score && <ScoreBar score={sentiment.score} />}

      {sentiment.wellbeing_note && (
        <div className={cn("rounded-xl px-4 py-3 border", cfg.bg, "border-border")}>
          <div className="flex items-start gap-2">
            <Heart className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", cfg.color)} />
            <p className="font-serif italic text-sm leading-relaxed">{sentiment.wellbeing_note}</p>
          </div>
        </div>
      )}

      {sentiment.follow_up && (
        <div className="rounded-xl bg-secondary border border-border px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Follow-up reflection</div>
          <p className="font-serif italic text-sm text-foreground/80">{sentiment.follow_up}</p>
        </div>
      )}
    </div>
  );
}