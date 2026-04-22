import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "#/db";
import { teams } from "#/db/schema";
import { ensureSession } from "#/lib/authFunctions";

const createTeamSchema = z.object({
  name: z.string().min(1),
  season: z.string().min(1),
});

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
  const session = await ensureSession();
  return db.select().from(teams).where(eq(teams.ownerId, session.user.id));
});

export const createTeam = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createTeamSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession();
    const [team] = await db
      .insert(teams)
      .values({ name: data.name, season: data.season, ownerId: session.user.id })
      .returning();
    return team;
  });
