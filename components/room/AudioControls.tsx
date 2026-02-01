"use client";

import { useState, useCallback } from "react";
import {
  TrackToggle,
  DisconnectButton,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track, DataPacket_Kind } from "livekit-client";
import { Hand, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParticipantRole } from "@/lib/types";

interface AudioControlsProps {
  role: ParticipantRole;
}

export function AudioControls({ role }: AudioControlsProps) {
  const [handRaised, setHandRaised] = useState(false);
  const { localParticipant } = useLocalParticipant();

  const canPublish = role === "speaker" || role === "host";

  const toggleHand = useCallback(async () => {
    const next = !handRaised;
    setHandRaised(next);

    try {
      const data = JSON.stringify({ type: "hand-raise", raised: next });
      await localParticipant.publishData(
        new TextEncoder().encode(data),
        { reliable: true }
      );
    } catch {
      // Ignore data publish errors
    }
  }, [handRaised, localParticipant]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-elevated/90 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 px-4 py-4">
        {canPublish && (
          <TrackToggle
            source={Track.Source.Microphone}
            className="px-4 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-sm font-medium text-text-primary hover:border-coral/50 transition-all cursor-pointer"
          />
        )}

        <button
          onClick={toggleHand}
          className={cn(
            "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer",
            handRaised
              ? "bg-yellow/10 border-yellow/50 text-yellow"
              : "bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default"
          )}
        >
          <Hand size={16} className={handRaised ? "animate-bounce" : ""} />
        </button>

        <DisconnectButton className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
          <div className="flex items-center gap-1.5">
            <LogOut size={14} />
            Leave
          </div>
        </DisconnectButton>
      </div>
    </div>
  );
}
