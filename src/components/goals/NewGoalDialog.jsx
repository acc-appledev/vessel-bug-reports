import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "body",   label: "Body",   color: "text-clay"  },
  { value: "mind",   label: "Mind",   color: "text-olive" },
  { value: "spirit", label: "Spirit", color: "text-gold"  },
  { value: "other",  label: "Other",  color: "text-muted-foreground" },
];

const suggestions = [
  { title: "Hit the gym", target: 3, unit: "times", category: "body" },
  { title: "Read Scripture", target: 7, unit: "days", category: "spirit" },
  { title: "Read a book", target: 50, unit: "pages", category: "mind" },
  { title: "Run or walk", target: 4, unit: "times", category: "body" },
  { title: "Journal daily", target: 5, unit: "entries", category: "mind" },
  { title: "Pray intentionally", target: 7, unit: "times", category: "spirit" },
];

const blank = { title: "", category: "body", target: 1, unit: "times" };

export default function NewGoalDialog({ habits, onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSuggestion = (s) => setForm({ ...blank, ...s });

  const submit = async () => {
    if (!form.title.trim() || !form.target) return;
    await onSave({ ...form, target: Number(form.target) });
    setForm(blank);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full gap-1.5">
          <Plus className="w-4 h-4" /> Add goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Set a weekly goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">

          {/* Quick suggestions */}
          <div>
            <Label className="mb-2 block">Quick picks</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  onClick={() => handleSuggestion(s)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border border-border bg-secondary hover:bg-muted transition",
                    form.title === s.title && "border-gold bg-gold-soft"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Goal title</Label>
            <Input
              placeholder="e.g. Hit the gym 3 times"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Target</Label>
              <Input
                type="number"
                min={1}
                value={form.target}
                onChange={(e) => set("target", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                placeholder="times, pages, minutes…"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => set("category", c.value)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm border transition",
                    form.category === c.value
                      ? "border-gold bg-gold-soft text-foreground"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Link to habit (optional) */}
          {habits?.length > 0 && (
            <div className="space-y-2">
              <Label>Auto-track from habit <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Select
                value={form.linked_habit_id || ""}
                onValueChange={(v) => set("linked_habit_id", v === "__none__" ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None — I'll track manually" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None — I'll track manually</SelectItem>
                  {habits.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={submit} className="w-full bg-foreground text-background hover:bg-foreground/90">
            Save goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}