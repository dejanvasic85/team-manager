# Football Coaching App — Project Context

## The Idea

A web application designed to be an **assistant coach in your pocket**. It helps football (soccer) coaches plan training sessions, manage match data, track players, and organise seasons — primarily used off-field during commutes, pre-match preparation, and post-game reflection.

The long-term vision is an AI-powered coaching assistant that:

- Learns from match results and identified weaknesses
- Proactively suggests session plans tailored to the team's needs
- Builds a shared, ranked drill library that improves over time based on coach usage

---

## Target Users

Coaches, assistant coaches, and team managers of youth football teams. The app is designed to be shared across multiple people managing the same team, each with their own role and access level.

---

## Version Roadmap

### Version 1 — Core Data Management

- Player contact details (player + parents)
- Player progress notes by date
- Season management with squad selection
- Match management (lineup, score, best player, notes, focus areas)
- Training session library (manual entry, text + images)
- Session plans built from drills

### Version 2 — AI Features

- AI-generated session plans based on recent match weaknesses
- Coach discusses team progress with an AI assistant
- Swipe-based session plan selection from AI-generated options
- Drill library used as the AI's knowledge base
- Popular drills ranked higher and recommended to other coaches

### Version 3 — Native

- Progressive Web App (PWA)

---

## Tech Stack

| Layer     | Choice                                         |
| --------- | ---------------------------------------------- |
| Framework | TanStack Start (Vite+)                         |
| Hosting   | Cloudflare Workers                             |
| Database  | Neon (Postgres) via Cloudflare Hyperdrive      |
| ORM       | Drizzle ORM                                    |
| Auth      | Better Auth 1.5+ with `better-auth-cloudflare` |

**Key constraint:** A single Drizzle D1 instance per request must be instantiated at the top of the middleware chain to avoid 503 errors.

---

## Domain Entities

### Users

Managed by Better Auth. A user is any person who logs into the app. Their role and permissions are defined per team, not globally.

---

### Teams

A team is a group being coached (e.g. "Williamstown u11 Girls"). Teams are the central organisational unit — players, seasons, and matches all belong to a team.

---

### Team Members

The join between a User and a Team, with a role. A user can belong to multiple teams with different roles.

**Roles:**

- `owner` — created the team, full permissions
- `assistant` — assistant coach, read/write access
- `manager` — team manager, scoped access

**Example:**

| User  | Team                   | Role      |
| ----- | ---------------------- | --------- |
| David | Williamstown u11 Girls | owner     |
| David | Williamstown u10 Girls | owner     |
| Sam   | Williamstown u11 Girls | assistant |

---

### Players

Players belong to a team permanently. They carry contact details for themselves and their parents, and accumulate progress notes over time.

**Key fields:**

- Name
- Position(s)
- Parent/guardian contacts (mum, dad)
- Progress notes (dated)

---

### Seasons

A season belongs to a team and represents a competitive year or period (e.g. "2025 Season"). Seasons contain matches and training sessions.

---

### Season Squad

The join between Players and a Season. Not every player on a team participates in every season — some may not return, or may not make the cut.

This table represents the selected squad for a given season.

---

### Matches

A match belongs to a season and captures all data for a single fixture.

**Key fields:**

- Opposition name
- Round / type (friendly, round 1, etc.)
- Date and location
- Our score / opposition score
- Starting lineup (players + positions)
- Players absent (with reason)
- Goalscorers
- Player of the match
- Focus areas (what to work on)
- Key takeaways (positives + negatives)

---

### Drills

The global drill library. Drills are reusable across all teams and session plans. In Version 2, drills will also be AI-generated.

**Key fields:**

- Title
- Description
- Coaching points
- Tags (e.g. defending, pressing, passing, finishing)
- Images
- Source (`curated` | `ai_generated` | `coach_created`)
- Usage/popularity count

---

### Session Plans

A named, ordered collection of drills. Session plans are global (not tied to a team or season) and represent a reusable coaching blueprint.

**Typical structure:**

- Football problem (what are we solving?)
- Warmup drill
- Main drill(s) with progressions
- Game format

---

### Session Plan Drills

The join between a Session Plan and its Drills, preserving order and role (warmup, main, game, etc.).

---

### Training Sessions

A record of a session plan being delivered on a specific date, linked to a season. This is the calendar entry — what was actually run, and when.

---

## Entity Relationship Summary

```
Users
  └── Team Members → Teams
                       ├── Players → Season Squad → Seasons
                       │                               └── Matches
                       └── Training Sessions → Session Plans → Session Plan Drills → Drills
```

---

## Key Design Decisions

- **Multi-coach support:** Teams are shared entities. Multiple users can co-manage a team with role-based access.
- **Players are permanent:** Players belong to a team, not a season. Season Squad handles per-season inclusion.
- **Sessions are global:** Drills and session plans are not scoped to a team — they form a shared, platform-wide library.
- **AI-ready schema:** Drills include source and popularity fields from day one to support V2 AI features without schema changes.
- **D1 SQLite constraints:** No interactive transactions — Better Auth uses D1's `batch()` API for atomicity.
