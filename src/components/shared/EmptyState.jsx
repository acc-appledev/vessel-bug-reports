import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-border rounded-2xl bg-card/40">
      {Icon && (
        <div className="w-12 h-12 mx-auto rounded-full bg-gold-soft flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-gold" />
        </div>
      )}
      <h3 className="font-serif text-xl mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}