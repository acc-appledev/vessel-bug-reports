import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { todayStr } from "@/lib/dateHelpers";

const principles = ["Finish Strong", "Stay Consistent", "Don't Quit", "One More Rep", "Outwork Yesterday"];

export default function LogWorkoutDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", type: "strength", duration_minutes: 30, intensity: "moderate",
    notes: "", principle: "Stay Consistent",
  });

  const submit = async () => {
    if (!form.title.trim()) return;
    await onCreate({ ...form, date: todayStr() });
    setForm({ title: "", type: "strength", duration_minutes: 30, intensity: "moderate", notes: "", principle: "Stay Consistent" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
          <Plus className="w-4 h-4 mr-1.5" /> Log workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl">Log workout</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Workout</Label>
            <Input placeholder="Upper body · Push day" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Intensity</Label>
              <Select value={form.intensity} onValueChange={(v) => setForm({ ...form, intensity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration (min)</Label>
            <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label>Principle</Label>
            <div className="flex flex-wrap gap-1.5">
              {principles.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, principle: p })}
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    form.principle === p ? "border-gold text-gold bg-gold-soft" : "border-border hover:border-foreground/30"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="How did it go?" />
          </div>
          <Button onClick={submit} className="w-full bg-foreground text-background hover:bg-foreground/90">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}