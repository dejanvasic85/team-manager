import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const teams = sqliteTable("teams", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  season: text().notNull(),
  ownerId: text("owner_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const players = sqliteTable("players", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  teamId: integer("team_id", { mode: "number" }).notNull(),
  name: text().notNull(),
  avatarUrl: text("avatar_url"),
  positions: text({ mode: "json" }).$type<string[]>().default([]),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const playerContacts = sqliteTable("player_contacts", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  playerId: integer("player_id", { mode: "number" }).notNull(),
  label: text().notNull(),
  name: text().notNull(),
  phone: text(),
});

export const playerSkills = sqliteTable("player_skills", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  playerId: integer("player_id", { mode: "number" }).notNull(),
  skill: text().notNull(),
  level: text().notNull(),
});
