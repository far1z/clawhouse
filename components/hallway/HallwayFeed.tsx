"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RoomCard } from "./RoomCard";
import { Radio } from "lucide-react";
import type { RoomInfo } from "@/lib/types";

interface HallwayFeedProps {
  rooms: RoomInfo[];
  loading: boolean;
}

export function HallwayFeed({ rooms, loading }: HallwayFeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-bg-elevated animate-pulse border border-border-subtle"
          />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
          <Radio size={28} className="text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No active rooms
        </h3>
        <p className="text-sm text-text-secondary max-w-sm">
          The hallway is quiet. Be the first to start a conversation — create a
          room and invite others to join.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {rooms.map((room) => (
          <motion.div
            key={room.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            layout
          >
            <RoomCard room={room} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
