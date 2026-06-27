import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";

const quickFires = [
  "Keep going! 🔥",
  "You got this! 💪",
  "Proud of you! 🙌",
  "Stay consistent! ⚔️",
  "Don't quit! 🏆",
];

export default function MessageThread({ partnershipId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const load = async () => {
    const msgs = await base44.entities.EncouragementMessage.filter(
      { partnership_id: partnershipId },
      "created_date",
      200
    );
    setMessages(msgs);
  };

  useEffect(() => {
    load();
    // Poll every 15 seconds for new messages
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [partnershipId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (msgText) => {
    const t = (msgText || text).trim();
    if (!t) return;
    setSending(true);
    const msg = await base44.entities.EncouragementMessage.create({
      partnership_id: partnershipId,
      sender_email: user.email,
      sender_name: user.full_name || user.email.split("@")[0],
      text: t,
    });
    setMessages((prev) => [...prev, msg]);
    setText("");
    setSending(false);
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return isToday(d) ? format(d, "h:mm a") : format(d, "MMM d, h:mm a");
  };

  return (
    <div className="rounded-2xl border border-border bg-card flex flex-col overflow-hidden" style={{ height: 420 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-0.5">Encouragement</div>
        <div className="font-serif text-xl">Send a word</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground pt-8 font-serif italic">
            Be the first to encourage. It goes a long way.
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.sender_email === user.email;
          return (
            <div key={m.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 space-y-1",
                isMe
                  ? "bg-foreground text-background rounded-br-sm"
                  : "bg-secondary text-foreground rounded-bl-sm"
              )}>
                {!isMe && (
                  <div className="text-[10px] font-medium text-muted-foreground">{m.sender_name}</div>
                )}
                <p className="text-sm leading-snug">{m.text}</p>
                <div className={cn("text-[10px]", isMe ? "text-background/50" : "text-muted-foreground")}>
                  {m.created_date ? formatTime(m.created_date) : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick fires */}
      <div className="px-4 py-2 flex gap-1.5 overflow-x-auto border-t border-border shrink-0">
        {quickFires.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border hover:border-gold hover:text-gold transition whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex gap-2 border-t border-border shrink-0">
        <Input
          placeholder="Send encouragement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          className="rounded-full bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-gold"
        />
        <Button
          size="icon"
          onClick={() => send()}
          disabled={sending || !text.trim()}
          className="rounded-full bg-foreground text-background hover:bg-foreground/90 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}