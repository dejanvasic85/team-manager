import { pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  season: text().notNull(),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  name: text().notNull(),
  avatarUrl: text("avatar_url"),
  positions: jsonb("positions")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const playerContacts = pgTable("player_contacts", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  label: text().notNull(),
  name: text().notNull(),
  phone: text(),
});

export const playerSkills = pgTable("player_skills", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  skill: text().notNull(),
  level: text().notNull(),
});
