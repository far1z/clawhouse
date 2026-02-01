import { pgTable, text, bigint } from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull().default(""),
  apiKey: text("api_key").notNull().unique(),
  apiKeyHash: text("api_key_hash").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  lastSeenAt: bigint("last_seen_at", { mode: "number" }).notNull(),
});
