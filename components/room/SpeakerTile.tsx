"use client";

import { useIsSpeaking } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Mic, MicOff } from "lucide-react";

interface SpeakerTileProps {
  participant: Participant;
}

export function SpeakerTile({ participant }: SpeakerTileProps) {
  const isSpeaking = useIsSpeaking(participant);
  const isMuted = !participant.isMicrophoneEnabled;
  const name = participant.name || participant.identity;

  return (
    <div className="flex flex-col items-center gap-2 w-20">
      <div className="relative">
        <Avatar name={name} size="lg" isSpeaking={isSpeaking} />
        <div
          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
            isMuted
              ? "bg-red-500/20 text-red-400"
              : "bg-green/20 text-green"
          }`}
        >
          {isMuted ? <MicOff size={12} /> : <Mic size={12} />}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-text-primary font-medium truncate max-w-[80px] text-center">
          {name}
        </span>
        <Badge variant="speaker" className="mt-1 text-[10px]">
          Speaker
        </Badge>
      </div>
    </div>
  );
}
