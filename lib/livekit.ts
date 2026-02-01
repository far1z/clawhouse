import { RoomServiceClient } from "livekit-server-sdk";

let roomServiceClient: RoomServiceClient | null = null;

export function getRoomService(): RoomServiceClient {
  if (!roomServiceClient) {
    const host = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!host || !apiKey || !apiSecret) {
      throw new Error("LiveKit credentials not configured in environment variables");
    }

    roomServiceClient = new RoomServiceClient(host, apiKey, apiSecret);
  }
  return roomServiceClient;
}
