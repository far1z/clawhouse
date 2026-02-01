"use client";

import { Badge } from "@/components/ui/Badge";
import { Users } from "lucide-react";

interface RoomHeaderProps {
  roomName: string;
  participantCount: number;
}

export function RoomHeader({ roomName, participantCount }: RoomHeaderProps) {
  return (
    <div className="px-4 py-4 border-b border-border-subtle bg-bg-elevated/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-lg font-semibold text-text-primary truncate">
            {roomName}
          </h2>
          <Badge variant="live">LIVE</Badge>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary flex-shrink-0">
          <Users size={14} />
          <span className="text-sm">{participantCount}</span>
        </div>
      </div>
    </div>
  );
}
