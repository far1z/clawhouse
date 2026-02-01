"use client";

import type { Participant } from "livekit-client";
import { SpeakerTile } from "./SpeakerTile";

interface SpeakerStageProps {
  speakers: Participant[];
}

export function SpeakerStage({ speakers }: SpeakerStageProps) {
  return (
    <div className="mb-8">
      <p className="text-xs text-text-muted uppercase tracking-wider mb-4">
        Speakers
      </p>
      <div className="flex flex-wrap gap-6">
        {speakers.length === 0 ? (
          <p className="text-sm text-text-muted">No speakers yet</p>
        ) : (
          speakers.map((speaker) => (
            <SpeakerTile key={speaker.identity} participant={speaker} />
          ))
        )}
      </div>
    </div>
  );
}
