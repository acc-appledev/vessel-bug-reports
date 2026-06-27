import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "../components/shared/SectionHeader";
import EmptyState from "../components/shared/EmptyState";
import JournalEntryCard from "../components/journal/JournalEntryCard";
import NewJournalDialog from "../components/journal/NewJournalDialog";
import { NotebookPen } from "lucide-react";

export default function Journal() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    (async () => {
      const e = await base44.entities.JournalEntry.list("-date", 100);
      setEntries(e);
    })();
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Mind"
        title="Renew your mind"
        subtitle="An unexamined life stays the same. Look back. Learn. Move forward."
        action={<NewJournalDialog onCreate={async (d) => { const r = await base44.entities.JournalEntry.create(d); setEntries([r, ...entries]); }} />}
      />

      {entries.length === 0 ? (
        <EmptyState icon={NotebookPen} title="The page is blank" description="Start today. One honest line is enough." />
      ) : (
        <div className="space-y-4">
          {entries.map((e) => (
            <JournalEntryCard
              key={e.id}
              entry={e}
              onDelete={async (entry) => {
                await base44.entities.JournalEntry.delete(entry.id);
                setEntries(entries.filter((x) => x.id !== entry.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}