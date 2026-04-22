import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { createTeam, getTeams } from "#/lib/teamFunctions";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/_protected/dashboard")({
  loader: () => getTeams(),
  component: DashboardPage,
});

function DashboardPage() {
  const teams = Route.useLoaderData();
  const { user } = Route.useRouteContext();
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="page-wrap flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="island-kicker mb-1">Dashboard</p>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Welcome, {user.name}
            </h1>
          </div>
          <button
            className="button-ghost rounded-lg px-4 py-2 text-sm font-medium"
            onClick={async () => {
              await authClient.signOut();
              void router.navigate({ to: "/" });
            }}
          >
            Sign out
          </button>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Your Teams
          </h2>
          {teams.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No teams yet. Create your first team below.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <li key={team.id} className="island-shell rounded-xl p-5">
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {team.name}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {team.season}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="island-shell rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Create a Team
          </h2>
          <CreateTeamForm />
        </section>
      </div>
    </main>
  );
}

function CreateTeamForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const season = (form.elements.namedItem("season") as HTMLInputElement).value;

    try {
      await createTeam({ data: { name, season } });
      form.reset();
      void router.invalidate();
    } catch {
      setError("Failed to create team. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
      <div className="flex flex-1 flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Team name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. Williamstown u12 Girls"
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            background: "var(--bg-surface-strong)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label
          htmlFor="season"
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Season
        </label>
        <input
          id="season"
          name="season"
          type="text"
          required
          placeholder="e.g. 2026"
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            background: "var(--bg-surface-strong)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="button-cta rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create team"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
