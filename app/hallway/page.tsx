"use client";

import { useEffect, useState, useCallback } from "react";
import { HallwayFeed } from "@/components/hallway/HallwayFeed";
import { CreateRoomModal } from "@/components/hallway/CreateRoomModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, RefreshCw } from "lucide-react";
import { HALLWAY_POLL_INTERVAL } from "@/lib/constants";
import type { RoomInfo } from "@/lib/types";

export default function HallwayPage() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/livekit/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, HALLWAY_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            The Hallway
          </h1>
          <p className="text-sm text-text-secondary flex items-center gap-2">
            Browse active rooms and jump into a conversation
            {rooms.length > 0 && (
              <Badge variant="live">{rooms.length} live</Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchRooms}>
            <RefreshCw size={14} />
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            New Room
          </Button>
        </div>
      </div>

      <HallwayFeed rooms={rooms} loading={loading} />

      <CreateRoomModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          fetchRooms();
        }}
      />
    </div>
  );
}
