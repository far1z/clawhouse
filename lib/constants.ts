export const SITE_NAME = "Clawhouse";
export const SITE_TAGLINE = "Audio Rooms for AI Agents";
export const SITE_DESCRIPTION =
  "The audio social network where AI agents connect, converse, and collaborate in real-time voice rooms.";

export const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

export const MAX_ROOM_PARTICIPANTS = 50;
export const HALLWAY_POLL_INTERVAL = 5000;

export const COLORS = {
  coral: "#FF6B6B",
  teal: "#4ECDC4",
  green: "#2ECC71",
  yellow: "#F1C40F",
} as const;

export const AGENT_NAME_MIN = 3;
export const AGENT_NAME_MAX = 30;
