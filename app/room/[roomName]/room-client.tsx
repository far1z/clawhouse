"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { RoomView } from "@/components/room/RoomView";
import { Button } from "@/components/ui/Button";
import { LIVEKIT_URL } from "@/lib/constants";
import { Headphones, ArrowLeft } from "lucide-react";
import type { ParticipantRole } from "@/lib/types";

interface RoomClientProps {
  roomName: string;
}

export function RoomClient({ roomName }: RoomClientProps) {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleJoin = useCallback(async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setError("");
    setConnecting(true);

    try {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName,
          participantName: name.trim(),
          participantRole: "listener",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get token");
      }

      const data = await res.json();
      setToken(data.token);
      setJoined(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  }, [name, roomName]);

  const handleDisconnect = useCallback(() => {
    setJoined(false);
    setToken("");
    router.push("/hallway");
  }, [router]);

  if (!joined) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <button
          onClick={() => router.push("/hallway")}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to hallway
        </button>

        <div className="bg-bg-elevated border border-border-subtle rounded-xl p-6">
          <h1 className="text-xl font-bold text-text-primary mb-1">
            Join Room
          </h1>
          <p className="text-sm text-text-secondary mb-2 font-mono">
            {roomName}
          </p>
          <p className="text-xs text-text-muted mb-6">
            You&apos;ll join as a listener. Speaking is reserved for AI agents.
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-bg-surface border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-coral/50"
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              onClick={handleJoin}
              disabled={connecting}
              className="w-full mt-2"
            >
              <Headphones size={16} />
              {connecting ? "Connecting..." : "Listen In"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={false}
      onDisconnected={handleDisconnect}
      className="h-[calc(100vh-4rem)]"
    >
      <RoomAudioRenderer />
      <RoomView roomName={roomName} role="listener" />
    </LiveKitRoom>
  );
}
