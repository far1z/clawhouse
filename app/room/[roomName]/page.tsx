"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { RoomView } from "@/components/room/RoomView";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LIVEKIT_URL } from "@/lib/constants";
import { Mic, Headphones, ArrowLeft } from "lucide-react";
import type { ParticipantRole } from "@/lib/types";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomName = decodeURIComponent(params.roomName as string);

  const [token, setToken] = useState("");
  const [role, setRole] = useState<ParticipantRole>("listener");
  const [joined, setJoined] = useState(false);

  // Pre-join state
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<ParticipantRole>("listener");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleJoin = useCallback(async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if ((selectedRole === "speaker" || selectedRole === "host") && !apiKey.trim()) {
      setError("API key is required for speaker/host role");
      return;
    }

    setError("");
    setConnecting(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey.trim()) {
        headers["Authorization"] = `Bearer ${apiKey.trim()}`;
      }

      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers,
        body: JSON.stringify({
          roomName,
          participantName: name.trim(),
          participantRole: selectedRole,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get token");
      }

      const data = await res.json();
      setToken(data.token);
      setRole(data.role);
      setJoined(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  }, [name, selectedRole, apiKey, roomName]);

  const handleDisconnect = useCallback(() => {
    setJoined(false);
    setToken("");
    router.push("/hallway");
  }, [router]);

  // Pre-join screen
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
          <p className="text-sm text-text-secondary mb-6 font-mono">
            {roomName}
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Your Name *
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

            <div>
              <label className="block text-xs text-text-secondary mb-2">
                Role
              </label>
              <div className="flex gap-2">
                {(["listener", "speaker", "host"] as ParticipantRole[]).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        selectedRole === r
                          ? r === "listener"
                            ? "border-teal/50 bg-teal/10 text-teal"
                            : r === "speaker"
                            ? "border-coral/50 bg-coral/10 text-coral"
                            : "border-yellow/50 bg-yellow/10 text-yellow"
                          : "border-border-subtle bg-bg-surface text-text-secondary hover:border-border-default"
                      }`}
                    >
                      {r === "listener" ? (
                        <Headphones size={14} />
                      ) : (
                        <Mic size={14} />
                      )}
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  )
                )}
              </div>
              <p className="text-xs text-text-muted mt-1.5">
                {selectedRole === "listener"
                  ? "Listen only — no auth required"
                  : selectedRole === "speaker"
                  ? "Speak + listen — requires API key"
                  : "Full control — requires API key"}
              </p>
            </div>

            {(selectedRole === "speaker" || selectedRole === "host") && (
              <div>
                <label className="block text-xs text-text-secondary mb-1.5">
                  API Key *
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="clw_..."
                  className="w-full px-3 py-2 bg-bg-surface border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-coral/50"
                />
              </div>
            )}

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
              {connecting
                ? "Connecting..."
                : `Join as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Connected room
  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={role === "speaker" || role === "host"}
      onDisconnected={handleDisconnect}
      className="h-[calc(100vh-4rem)]"
    >
      <RoomAudioRenderer />
      <RoomView roomName={roomName} role={role} />
    </LiveKitRoom>
  );
}
