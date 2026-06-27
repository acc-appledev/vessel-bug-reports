import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "../components/shared/SectionHeader";
import EmptyState from "../components/shared/EmptyState";
import PrayerCard from "../components/prayer/PrayerCard";
import NewPrayerDialog from "../components/prayer/NewPrayerDialog";
import StatTile from "../components/dashboard/StatTile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandHeart } from "lucide-react";

export default function Prayer() {
  const [prayers, setPrayers] = useState([]);
  const [tab, setTab] = useState("active");

  const load = async () => {
    const p = await base44.entities.Prayer.list("-date", 200);
    setPrayers(p);
  };

  useEffect(() => { load(); }, []);

  const active = prayers.filter((p) => !p.answered);
  const answered = prayers.filter((p) => p.answered);
  const shown = tab === "active" ? active : answered;

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Spirit"
        title="Prayer is a battlefield"
        subtitle="Bring every burden. Watch Him move. Remember what He's done."
        action={<NewPrayerDialog onCreate={(d) => {
          const temp = { id: `temp-p-${Date.now()}`, answered: false, ...d };
          setPrayers([temp, ...prayers]);
          base44.entities.Prayer.create(d).then((r) =>
            setPrayers((prev) => prev.map((x) => x.id === temp.id ? r : x))
          );
        }} />}
      />

      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        <StatTile label="Active" value={active.length} sub="Holding onto" accent />
        <StatTile label="Answered" value={answered.length} sub="Faithful God" />
        <StatTile label="Total" value={prayers.length} sub="Lifted up" />
      </div>

      <div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="active">Active · {active.length}</TabsTrigger>
            <TabsTrigger value="answered">Answered · {answered.length}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {shown.length === 0 ? (
            <EmptyState
              icon={HandHeart}
              title={tab === "active" ? "Nothing to lift up?" : "No answered prayers logged"}
              description={tab === "active" ? "Bring Him what's heavy." : "Remember what He's done. Write them down."}
            />
          ) : (
            <div className="space-y-3">
              {shown.map((p) => (
                <PrayerCard
                  key={p.id}
                  prayer={p}
                  onAnswer={(prayer, updates) => {
                    setPrayers((prev) => prev.map((x) => x.id === prayer.id ? { ...x, ...updates } : x));
                    base44.entities.Prayer.update(prayer.id, updates).then((r) =>
                      setPrayers((prev) => prev.map((x) => x.id === prayer.id ? { ...x, ...r } : x))
                    );
                  }}
                  onDelete={(prayer) => {
                    setPrayers((prev) => prev.filter((x) => x.id !== prayer.id));
                    base44.entities.Prayer.delete(prayer.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}