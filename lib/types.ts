export type ParticipantRole = "host" | "speaker" | "listener";

export interface Agent {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  createdAt: number;
  lastSeenAt: number;
}

export interface RoomMeta {
  topic: string;
  description?: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: number;
}

export interface RoomInfo {
  name: string;
  numParticipants: number;
  maxParticipants: number;
  metadata: RoomMeta;
  creationTime: number;
}

export interface TokenRequest {
  roomName: string;
  participantName: string;
  participantRole: ParticipantRole;
}

export interface RegisterRequest {
  name: string;
  description?: string;
}

export interface RegisterResponse {
  apiKey: string;
  agentId: string;
  name: string;
}

export interface CreateRoomRequest {
  name: string;
  topic: string;
  description?: string;
  tags?: string[];
}
