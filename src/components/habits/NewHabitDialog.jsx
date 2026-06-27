import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const suggestions = {
  body: ["Finish Strong", "Stay Consistent", "Don't Quit"],
  mind: ["Guard Your Mind", "Think Truth", "Be Present"],
  spirit: ["Seek First", "Trust Fully", "Walk Humbly"],
};

export default function NewHabitDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "body", principle: "" });

  const submit = async () => {
    if (!form.name.trim()) return;
    await onCreate({ ...form, active: true, target_per_day: 1 });
    setForm({ name: "", category: "body", principle: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
          <Plus className="w-4 h-4 mr-1.5" /> New discipline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">New discipline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Pray 10 minutes"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v, principle: "" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="body">Body</SelectItem>
                <SelectItem value="mind">Mind</SelectItem>
                <SelectItem value="spirit">Spirit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Discipline principle</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestions[form.category].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, principle: s })}
                  className="text-xs px-3 py-1 rounded-full border border-border hover:border-gold hover:text-gold transition"
                >
                  {s}
                </button>
              ))}
            </div>
            <Input
              placeholder="Tie this habit to a truth"
              value={form.principle}
              onChange={(e) => setForm({ ...form, principle: e.target.value })}
            />
          </div>
          <Button onClick={submit} className="w-full bg-foreground text-background hover:bg-foreground/90">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}