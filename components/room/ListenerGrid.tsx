"use client";

import type { Participant } from "livekit-client";
import { ListenerTile } from "./ListenerTile";

interface ListenerGridProps {
  listeners: Participant[];
}

export function ListenerGrid({ listeners }: ListenerGridProps) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-4">
        Listeners
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {listeners.map((listener) => (
          <ListenerTile key={listener.identity} participant={listener} />
        ))}
      </div>
    </div>
  );
}
