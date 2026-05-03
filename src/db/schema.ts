import { pgTable, serial, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: text().notNull(),
    season: text().notNull(),
    ownerId: text("owner_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    ownerIdx: index("teams_owner_id_idx").on(t.ownerId),
  }),
);

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  name: text().notNull(),
  avatarUrl: text("avatar_url"),
  positions: jsonb("positions")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const playerContacts = pgTable("player_contacts", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  label: text().notNull(),
  name: text().notNull(),
  phone: text(),
});

export const playerSkills = pgTable("player_skills", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  skill: text().notNull(),
  level: text().notNull(),
});
