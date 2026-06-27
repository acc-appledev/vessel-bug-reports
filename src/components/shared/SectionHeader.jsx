import React from "react";

export default function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 animate-fade-up">
      <div>
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-medium mb-3">
            {eyebrow}
          </div>
        )}
        <h1 className="font-serif text-4xl lg:text-5xl leading-[1.05] tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-3 max-w-xl text-sm lg:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}