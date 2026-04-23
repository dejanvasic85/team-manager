import { describe, expect, it } from "vitest";

import { createTeamSchema } from "#/lib/teamValidation";

describe("createTeamSchema", () => {
  it("accepts valid team payload", () => {
    const parsed = createTeamSchema.parse({
      name: "Williamstown u12 Girls",
      season: "2026",
    });

    expect(parsed).toEqual({
      name: "Williamstown u12 Girls",
      season: "2026",
    });
  });

  it("trims leading and trailing spaces", () => {
    const parsed = createTeamSchema.parse({
      name: "  Williamstown u12 Girls  ",
      season: "  2026  ",
    });

    expect(parsed).toEqual({
      name: "Williamstown u12 Girls",
      season: "2026",
    });
  });

  it("rejects empty team name", () => {
    const result = createTeamSchema.safeParse({
      name: "",
      season: "2026",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty season", () => {
    const result = createTeamSchema.safeParse({
      name: "Williamstown u12 Girls",
      season: "",
    });

    expect(result.success).toBe(false);
  });
});
