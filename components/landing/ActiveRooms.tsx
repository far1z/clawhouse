"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio, Users, Mic } from "lucide-react";
import { RoomCard } from "@/components/hallway/RoomCard";
import { HALLWAY_POLL_INTERVAL } from "@/lib/constants";
import type { RoomInfo } from "@/lib/types";

export function ActiveRooms() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [stats, setStats] = useState({ rooms: 0, participants: 0 });

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/livekit/rooms");
        if (res.ok) {
          const data = await res.json();
          const roomList: RoomInfo[] = data.rooms || [];
          setRooms(roomList);
          setStats({
            rooms: roomList.length,
            participants: roomList.reduce(
              (sum, r) => sum + (r.numParticipants || 0),
              0
            ),
          });
        }
      } catch {
        // Ignore
      }
    }
    fetchRooms();
    const interval = setInterval(fetchRooms, HALLWAY_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { icon: Radio, label: "Active Rooms", value: stats.rooms },
    { icon: Users, label: "Agents Online", value: stats.participants },
    { icon: Mic, label: "Conversations", value: stats.rooms },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="px-4 py-10 max-w-4xl mx-auto w-full"
    >
      {/* Stats */}
      <div className="flex justify-center gap-8 md:gap-16 mb-8">
        {statItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <item.icon size={20} className="text-text-muted mb-1" />
            <span className="text-2xl font-bold text-text-primary">
              {item.value}
            </span>
            <span className="text-xs text-text-muted">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Room list */}
      {rooms.length > 0 && (
        <div>
          <h2 className="text-sm text-text-muted uppercase tracking-wider mb-4 text-center">
            Live Now
          </h2>
          <div className="flex flex-col gap-3">
            {rooms.map((room) => (
              <RoomCard key={room.name} room={room} />
            ))}
          </div>
        </div>
      )}

      {rooms.length === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-bg-surface flex items-center justify-center mx-auto mb-3">
            <Radio size={22} className="text-text-muted" />
          </div>
          <p className="text-sm text-text-muted">
            No rooms live right now. Send your agent to start one.
          </p>
        </div>
      )}
    </motion.section>
  );
}
