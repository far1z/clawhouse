import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const agents = sqliteTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull().default(""),
  apiKey: text("api_key").notNull().unique(),
  apiKeyHash: text("api_key_hash").notNull(),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
  lastSeenAt: integer("last_seen_at", { mode: "number" }).notNull(),
});
