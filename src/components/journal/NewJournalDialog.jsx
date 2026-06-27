import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Shuffle } from "lucide-react";
import MoodPicker from "./MoodPicker";
import { todayStr } from "@/lib/dateHelpers";

const prompts = [
  "What challenged you today?",
  "Where did you feel strongest?",
  "Where did you struggle?",
  "What is God teaching you?",
  "What are you grateful for right now?",
  "What lie did you believe today?",
  "What truth will you hold onto?",
  "What do you need to surrender?",
];

export default function NewJournalDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    mood: "steady", content: "", wins: "", struggles: "",
    prompt: prompts[Math.floor(Math.random() * prompts.length)],
  });

  const shuffle = () => setForm({ ...form, prompt: prompts[Math.floor(Math.random() * prompts.length)] });

  const submit = async () => {
    if (!form.content.trim()) return;
    await onCreate({ ...form, date: todayStr() });
    setForm({ mood: "steady", content: "", wins: "", struggles: "", prompt: prompts[Math.floor(Math.random() * prompts.length)] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
          <Plus className="w-4 h-4 mr-1.5" /> New entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl">Reflect</DialogTitle></DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label>How are you?</Label>
            <MoodPicker value={form.mood} onChange={(m) => setForm({ ...form, mood: m })} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Prompt</Label>
              <Button type="button" variant="ghost" size="sm" onClick={shuffle} className="h-7 text-xs">
                <Shuffle className="w-3 h-3 mr-1" />Shuffle
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-secondary px-3 py-2 font-serif italic text-foreground/80">
              {form.prompt}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Write freely</Label>
            <Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Let it out..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Wins</Label>
              <Textarea rows={2} value={form.wins} onChange={(e) => setForm({ ...form, wins: e.target.value })} placeholder="Where did you win?" />
            </div>
            <div className="space-y-2">
              <Label>Struggles</Label>
              <Textarea rows={2} value={form.struggles} onChange={(e) => setForm({ ...form, struggles: e.target.value })} placeholder="Where did you fall short?" />
            </div>
          </div>
          <Button onClick={submit} className="w-full bg-foreground text-background hover:bg-foreground/90">Save entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}