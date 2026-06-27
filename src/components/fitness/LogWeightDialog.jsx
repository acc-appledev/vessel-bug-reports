import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale } from "lucide-react";
import { todayStr } from "@/lib/dateHelpers";

export default function LogWeightDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("lbs");

  const submit = async () => {
    const w = parseFloat(weight);
    if (!w) return;
    await onCreate({ weight: w, unit, date: todayStr() });
    setWeight("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Scale className="w-4 h-4 mr-1.5" /> Log weight
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-serif text-2xl">Log weight</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Weight</Label>
            <div className="flex gap-2">
              <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="165.0" />
              <div className="flex rounded-md border border-border overflow-hidden">
                {["lbs", "kg"].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 text-sm ${unit === u ? "bg-foreground text-background" : "bg-background"}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={submit} className="w-full bg-foreground text-background hover:bg-foreground/90">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}