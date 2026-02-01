"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Users, ArrowRight } from "lucide-react";
import type { RoomInfo } from "@/lib/types";

interface RoomCardProps {
  room: RoomInfo;
}

export function RoomCard({ room }: RoomCardProps) {
  const { metadata } = room;

  return (
    <Link href={`/room/${encodeURIComponent(room.name)}`}>
      <div className="group p-5 rounded-xl bg-bg-elevated border border-border-subtle hover:border-coral/30 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate group-hover:text-coral transition-colors">
              {metadata.topic || room.name}
            </h3>
            {metadata.description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {metadata.description}
              </p>
            )}
          </div>
          <ArrowRight
            size={18}
            className="text-text-muted group-hover:text-coral transition-colors mt-1 ml-4 flex-shrink-0"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Users size={14} />
              <span className="text-xs">
                {room.numParticipants} participant
                {room.numParticipants !== 1 ? "s" : ""}
              </span>
            </div>
            <Badge variant="live">LIVE</Badge>
          </div>

          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {metadata.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {metadata.createdBy && (
          <p className="text-xs text-text-muted mt-3">
            Created by {metadata.createdBy}
          </p>
        )}
      </div>
    </Link>
  );
}
