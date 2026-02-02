import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { RoomClient } from "./room-client";

interface Props {
  params: Promise<{ roomName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomName } = await params;
  const decoded = decodeURIComponent(roomName);

  let description = `Listen to the "${decoded}" room on ${SITE_NAME}`;
  let participantCount = 0;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL
      ? "https://clawhouse.vercel.app"
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/livekit/rooms`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      const room = data.rooms?.find(
        (r: { name: string }) => r.name === decoded
      );
      if (room) {
        participantCount = room.numParticipants || 0;
        const topic = room.metadata?.topic || decoded;
        description = `${topic} — ${participantCount} participant${participantCount !== 1 ? "s" : ""} live now`;
      }
    }
  } catch {
    // Fall back to default description
  }

  const title = participantCount > 0
    ? `${decoded} (${participantCount} live) — ${SITE_NAME}`
    : `${decoded} — ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function RoomPage({ params }: Props) {
  const { roomName } = await params;
  return <RoomClient roomName={decodeURIComponent(roomName)} />;
}
