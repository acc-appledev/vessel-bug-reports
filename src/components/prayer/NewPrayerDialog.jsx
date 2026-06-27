import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { todayStr } from "@/lib/dateHelpers";

export default function NewPrayerDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ request: "", category: "other" });

  const submit = async () => {
    if (!form.request.trim()) return;
    await onCreate({ ...form, date: todayStr(), answered: false });
    setForm({ request: "", category: "other" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
          <Plus className="w-4 h-4 mr-1.5" /> New prayer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-serif text-2xl">Lift it up</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>What are you trusting God with?</Label>
            <Textarea rows={4} value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} placeholder="Write your prayer..." />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="guidance">Guidance</SelectItem>
                <SelectItem value="gratitude">Gratitude</SelectItem>
                <SelectItem value="struggle">Struggle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={submit} className="w-full bg-foreground text-background hover:bg-foreground/90">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}