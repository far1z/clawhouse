"use client";

import { useParticipants } from "@livekit/components-react";
import { RoomHeader } from "./RoomHeader";
import { SpeakerStage } from "./SpeakerStage";
import { ListenerGrid } from "./ListenerGrid";
import { AudioControls } from "./AudioControls";
import type { ParticipantRole } from "@/lib/types";

interface RoomViewProps {
  roomName: string;
  role: ParticipantRole;
}

export function RoomView({ roomName, role }: RoomViewProps) {
  const participants = useParticipants();

  const speakers = participants.filter(
    (p) => p.permissions?.canPublish
  );
  const listeners = participants.filter(
    (p) => !p.permissions?.canPublish
  );

  return (
    <div className="flex flex-col h-full">
      <RoomHeader
        roomName={roomName}
        participantCount={participants.length}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        <SpeakerStage speakers={speakers} />
        {listeners.length > 0 && <ListenerGrid listeners={listeners} />}
      </div>

      <AudioControls role={role} />
    </div>
  );
}
