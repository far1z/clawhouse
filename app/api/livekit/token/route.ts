import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ParticipantRole } from "@/lib/types";

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomName, participantName, participantRole } = body as {
      roomName?: string;
      participantName?: string;
      participantRole?: ParticipantRole;
    };

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: "roomName and participantName are required" },
        { status: 400 }
      );
    }

    const role: ParticipantRole = participantRole || "listener";

    // Speaker and host roles require authentication
    if (role === "speaker" || role === "host") {
      const apiKey = extractBearerToken(req);
      if (!apiKey) {
        return NextResponse.json(
          { error: "Authentication required for speaker/host role" },
          { status: 401 }
        );
      }

      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.apiKey, apiKey))
        .then(rows => rows[0]);

      if (!agent) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }

      // Update last seen
      await db
        .update(agents)
        .set({ lastSeenAt: Date.now() })
        .where(eq(agents.id, agent.id));
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    const canPublish = role === "speaker" || role === "host";

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({
      token: jwt,
      role,
      canPublish,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Token generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
