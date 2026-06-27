import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { todayStr } from "@/lib/dateHelpers";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, ChevronRight, RotateCcw, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { moods } from "@/components/journal/MoodPicker";
import SentimentResult from "./SentimentResult";

// Generate a context-aware prompt using the user's real data
function buildPromptContext({ habitRate, bestHabit, worstHabit, mood }) {
  if (habitRate >= 80) {
    return [
      `You completed ${habitRate}% of your habits today. What drove that discipline?`,
      "You showed up strong today. What truth are you standing on?",
      `Your consistency is building. What is God reinforcing in you right now?`,
    ];
  }
  if (habitRate >= 50) {
    return [
      worstHabit ? `You missed "${worstHabit}" today. What got in the way?` : "Where did your day go sideways?",
      "What's one thing you'd do differently if today started over?",
      "What small win can you build on tomorrow?",
    ];
  }
  if (mood === "struggling" || mood === "low") {
    return [
      "You're in a hard place. What does God want you to hear right now?",
      "What lie are you believing that's slowing you down?",
      "Name the one thing you need most today — rest, grace, or a fresh start?",
    ];
  }
  return [
    "What is one discipline you want to recommit to tomorrow?",
    "What area of your life needs the most attention right now?",
    "What are you grateful for, even in the struggle?",
  ];
}

export default function DailyJournalWidget({ habitRate, bestHabit, worstHabit, todayEntry, onEntrySaved }) {
  const [step, setStep] = useState("prompt"); // prompt | write | sentiment | done
  const [selectedMood, setSelectedMood] = useState("steady");
  const [content, setContent] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [sentiment, setSentiment] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const prompts = buildPromptContext({ habitRate, bestHabit, worstHabit, mood: selectedMood });
  const currentPrompt = prompts[promptIdx % prompts.length];

  const analyzeAndSave = useCallback(async () => {
    if (!content.trim()) return;
    setAnalyzing(true);
    setStep("sentiment");

    // Sentiment analysis via LLM
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze the emotional tone and wellbeing of this journal entry. Return JSON only.

Journal entry: "${content}"

Respond with this exact JSON schema:
{
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "score": <number 1-10, where 1=deeply struggling, 10=thriving>,
  "emotions": [<up to 3 emotion words detected>],
  "wellbeing_note": "<one encouraging, grounding sentence for the user>",
  "follow_up": "<one reflective follow-up question>"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          sentiment: { type: "string" },
          score: { type: "number" },
          emotions: { type: "array", items: { type: "string" } },
          wellbeing_note: { type: "string" },
          follow_up: { type: "string" },
        },
      },
    });

    setSentiment(result);
    setAnalyzing(false);

    // Save entry
    setSaving(true);
    const saved = await base44.entities.JournalEntry.create({
      date: todayStr(),
      mood: selectedMood,
      prompt: currentPrompt,
      content,
    });
    setSaving(false);
    onEntrySaved?.(saved);
    setStep("done");
  }, [content, selectedMood, currentPrompt, onEntrySaved]);

  // If today's entry already exists
  if (todayEntry) {
    return <TodayEntryPreview entry={todayEntry} />;
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Daily Reflection
        </div>
        <h2 className="font-serif text-2xl">How is your soul today?</h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Mood */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your mood</div>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition flex items-center gap-1.5",
                  selectedMood === m.value
                    ? "border-gold bg-gold-soft text-foreground"
                    : "border-border hover:border-foreground/30"
                )}
              >
                <span>{m.emoji}</span>{m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Intelligent prompt */}
        {step === "prompt" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Today's prompt</div>
              <button
                onClick={() => setPromptIdx((i) => i + 1)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> New prompt
              </button>
            </div>
            <div className="rounded-xl bg-secondary border border-border px-4 py-3 font-serif italic text-lg leading-snug">
              {currentPrompt}
            </div>
            <Button
              onClick={() => setStep("write")}
              className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              Start writing <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Write */}
        {step === "write" && (
          <div className="space-y-3">
            <div className="rounded-xl bg-secondary border border-border px-4 py-3 font-serif italic text-sm text-foreground/70">
              {currentPrompt}
            </div>
            <Textarea
              rows={5}
              placeholder="Write freely. This is your space."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none"
              autoFocus
            />
            <Button
              onClick={analyzeAndSave}
              disabled={!content.trim() || analyzing || saving}
              className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              {analyzing || saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
              ) : (
                <><Send className="w-4 h-4" /> Save & analyze</>
              )}
            </Button>
          </div>
        )}

        {/* Sentiment result */}
        {(step === "sentiment" || step === "done") && (
          <SentimentResult sentiment={sentiment} analyzing={analyzing} content={content} />
        )}
      </div>
    </div>
  );
}

function TodayEntryPreview({ entry }) {
  const mood = moods.find((m) => m.value === entry.mood);
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-1 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" /> Today's Reflection
      </div>
      <div className="flex items-center gap-2 mt-3 mb-4">
        <span className="text-2xl">{mood?.emoji}</span>
        <span className="font-serif text-xl">{mood?.label}</span>
      </div>
      {entry.prompt && (
        <p className="font-serif italic text-sm text-muted-foreground mb-3">"{entry.prompt}"</p>
      )}
      <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">{entry.content}</p>
    </div>
  );
}