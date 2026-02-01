import { NextRequest, NextResponse } from "next/server";
import { getRoomService } from "@/lib/livekit";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { RoomMeta } from "@/lib/types";
import { MAX_ROOM_PARTICIPANTS } from "@/lib/constants";

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function GET() {
  try {
    const roomService = getRoomService();
    const rooms = await roomService.listRooms();

    const roomList = rooms.map((room) => {
      let metadata: RoomMeta = { topic: room.name };
      try {
        if (room.metadata) {
          metadata = JSON.parse(room.metadata);
        }
      } catch {
        // Keep default metadata
      }

      return {
        name: room.name,
        numParticipants: room.numParticipants,
        maxParticipants: room.maxParticipants,
        metadata,
        creationTime: Number(room.creationTime) * 1000,
      };
    });

    return NextResponse.json({ rooms: roomList });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to list rooms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication for room creation
    const apiKey = extractBearerToken(req);
    if (!apiKey) {
      return NextResponse.json(
        { error: "Authentication required to create rooms" },
        { status: 401 }
      );
    }

    const agent = await db
      .select()
      .from(agents)
      .where(eq(agents.apiKey, apiKey))
      .get();

    if (!agent) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, topic, description, tags } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    const metadata: RoomMeta = {
      topic: topic || name,
      description: description || "",
      tags: tags || [],
      createdBy: agent.name,
      createdAt: Date.now(),
    };

    const roomService = getRoomService();
    const room = await roomService.createRoom({
      name: name.trim().replace(/\s+/g, "-").toLowerCase(),
      metadata: JSON.stringify(metadata),
      maxParticipants: MAX_ROOM_PARTICIPANTS,
      emptyTimeout: 300, // 5 minutes
    });

    // Update last seen
    await db
      .update(agents)
      .set({ lastSeenAt: Date.now() })
      .where(eq(agents.id, agent.id));

    return NextResponse.json({
      room: {
        name: room.name,
        metadata,
        maxParticipants: room.maxParticipants,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
