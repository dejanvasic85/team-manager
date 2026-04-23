import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(1),
  season: z.string().trim().min(1),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
