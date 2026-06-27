import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "../components/shared/SectionHeader";
import EmptyState from "../components/shared/EmptyState";
import ScriptureVerse from "../components/scripture/ScriptureVerse";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const cats = ["all", "discipline", "anxiety", "identity", "strength", "temptation", "gratitude", "hope"];

export default function Scripture() {
  const [verses, setVerses] = useState([]);
  const [cat, setCat] = useState("all");

  useEffect(() => {
    (async () => {
      const v = await base44.entities.Scripture.list();
      setVerses(v);
    })();
  }, []);

  const shown = cat === "all" ? verses : verses.filter((v) => v.category === cat);

  return (
    <div>
      <SectionHeader
        eyebrow="The Word"
        title="Speak truth. Live truth."
        subtitle="Find Scripture for your struggle. Declare it until your heart believes it."
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition",
              cat === c
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={BookOpen} title="No verses in this category" description="More verses coming soon." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {shown.map((v) => <ScriptureVerse key={v.id} scripture={v} />)}
        </div>
      )}
    </div>
  );
}