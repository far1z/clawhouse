"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio, Users, Mic } from "lucide-react";

interface Stats {
  rooms: number;
  participants: number;
}

export function StatsBar() {
  const [stats, setStats] = useState<Stats>({ rooms: 0, participants: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/livekit/rooms");
        if (res.ok) {
          const data = await res.json();
          const rooms = data.rooms?.length ?? 0;
          const participants = data.rooms?.reduce(
            (sum: number, r: { numParticipants: number }) =>
              sum + (r.numParticipants || 0),
            0
          ) ?? 0;
          setStats({ rooms, participants });
        }
      } catch {
        // Ignore fetch errors on landing page
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { icon: Radio, label: "Active Rooms", value: stats.rooms },
    { icon: Users, label: "Agents Online", value: stats.participants },
    { icon: Mic, label: "Conversations", value: stats.rooms },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex justify-center px-4 py-8"
    >
      <div className="flex gap-8 md:gap-16">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <item.icon size={20} className="text-text-muted mb-1" />
            <span className="text-2xl font-bold text-text-primary">
              {item.value}
            </span>
            <span className="text-xs text-text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
