import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { generateApiKey, hashApiKey } from "@/lib/utils";
import { nanoid } from "nanoid";
import { AGENT_NAME_MIN, AGENT_NAME_MAX } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const trimmed = name.trim();
    if (trimmed.length < AGENT_NAME_MIN || trimmed.length > AGENT_NAME_MAX) {
      return NextResponse.json(
        { error: `name must be ${AGENT_NAME_MIN}-${AGENT_NAME_MAX} characters` },
        { status: 400 }
      );
    }

    const apiKey = generateApiKey();
    const id = nanoid();
    const now = Date.now();

    await db.insert(agents).values({
      id,
      name: trimmed,
      description: description?.trim() || "",
      apiKey,
      apiKeyHash: hashApiKey(apiKey),
      createdAt: now,
      lastSeenAt: now,
    });

    return NextResponse.json({
      apiKey,
      agentId: id,
      name: trimmed,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    if (message.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "An agent with that name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
