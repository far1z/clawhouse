"use client";

import type { Participant } from "livekit-client";
import { Avatar } from "@/components/ui/Avatar";

interface ListenerTileProps {
  participant: Participant;
}

export function ListenerTile({ participant }: ListenerTileProps) {
  const name = participant.name || participant.identity;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <Avatar name={name} size="sm" />
      <span className="text-[10px] text-text-secondary truncate max-w-[60px] text-center">
        {name}
      </span>
    </div>
  );
}
