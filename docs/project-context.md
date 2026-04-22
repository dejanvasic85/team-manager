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

Players are data entries only — they do not log in or interact with the app.

---

## Version Roadmap

### Version 1 — Core Data Management

- Player contact details (player + parents/guardians)
- Player positions (multiple per player)
- Player skill assessments (e.g. Kicking, Duels, Engagement with levels like Developing/Competent/Proficient)
- Season management with squad selection
- Match management (lineup by position, score, result, goalscorers, focus areas, key takeaways)
- Training session management (date, tags, football problem, drill notes)
- Session plan library (manual entry, text-based)
- Calendar view for events per season
- Player stats aggregation (goals, GK appearances)

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

| Layer      | Choice                                    |
| ---------- | ----------------------------------------- |
| Framework  | TanStack Start (Vite+)                    |
| Hosting    | Cloudflare Workers                        |
| Database   | Neon (Postgres) via Cloudflare Hyperdrive |
| ORM        | Drizzle ORM                               |
| Auth       | Better Auth (email/password)              |
| Styling    | Tailwind CSS v4                           |
| Data       | TanStack Query + Router SSR Query         |
| Forms      | TanStack Form                             |
| Monitoring | Sentry                                    |
| Testing    | Vitest, Testing Library                   |

> **Note:** Local development currently uses SQLite via `better-sqlite3`. The production target is Neon Postgres via Cloudflare Hyperdrive. The migration to Neon is pending.

---

## Domain Entities

### Users

Managed by Better Auth. A user is any person who logs into the app. Their role and permissions are defined per team, not globally.

---

### Teams

A team is a group being coached (e.g. "Williamstown u12 Girls 2026"). Teams are the central organisational unit — players, seasons, and events all belong to a team. A team includes a season concept (e.g. "2026 season").

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
| David | Williamstown u12 Girls | owner     |
| David | Williamstown u10 Girls | owner     |
| Sam   | Williamstown u12 Girls | assistant |

---

### Players

Players belong to a team permanently. They carry contact details, positions, skill assessments, and accumulate stats over time.

**Key fields:**

- Name, avatar
- Positions (multiple — e.g. RW, CM, ST)
- Parent/guardian contacts (label + name + phone, e.g. "Dad — Tim — 0412 554 952")
- Skill assessments (flexible coach-defined skills with levels)

---

### Player Contacts

Parent/guardian contact info for a player. One player can have multiple contacts.

**Key fields:**

- Label (e.g. "Dad", "Mum")
- Name
- Phone number

---

### Player Skills

Coach-tracked skill assessments per player. Flexible — coaches define which skills matter for their team.

**Key fields:**

- Skill name (e.g. "Kicking", "RWB", "Duels", "Engagement")
- Level (e.g. "Developing", "Competent", "Proficient")

---

### Seasons

A season belongs to a team and represents a competitive year or period (e.g. "2026 Season"). Seasons contain matches and training sessions.

---

### Season Squad

The join between Players and a Season. Not every player on a team participates in every season — some may not return, or may not make the cut.

This table represents the selected squad for a given season.

---

### Events (Matches & Training)

Events belong to a team/season and appear on a calendar view. Events are either a **game** or a **training session**.

**Common fields:**

- Title, date, tags (e.g. ["shooting"] or ["season", "friendly"])
- Location
- Notes (markdown)

**Game-specific fields:**

- Opposition name
- Home score, opposition score
- Result (win | loss | draw)
- Starting lineup (players mapped to positions — GK, RB, CB, LB, CM, RW, LW, ST — with substitution notes)
- Focus areas (tactical notes for the team)
- Key takeaways (post-match reflections)

**Training-specific fields:**

- Football problem (what are we solving?)
- Drill notes (markdown)
- Session plan reference (optional)

---

### Event Lineup

Starting lineup for a game event. Maps players to positions with optional notes.

**Key fields:**

- Event, player, position (e.g. "GK", "CB", "CM")
- Notes (e.g. "second half" for substitutions)
- Sort order

---

### Player Stats

Per-event stats tracked for each player. Aggregated on the player list view.

**Key fields:**

- Event, player
- Goals scored
- GK appearance (boolean)

---

### Attendance

Tracks which players attended an event.

**Key fields:**

- Event, player
- Status (attending | absent | unknown)

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

A named, ordered collection of drills. Session plans can be marked as templates for reuse. They represent a coaching blueprint for a training session.

**Typical structure:**

- Football problem (what are we solving?)
- Warmup drill
- Main drill(s) with progressions
- Game format

---

### Session Plan Drills

The join between a Session Plan and its Drills, preserving order and role (warmup, main, game, etc.).

---

## Entity Relationship Summary

```
Users
  └── Team Members → Teams
                       ├── Players → Player Contacts
                       │           → Player Skills
                       │           → Season Squad → Seasons
                       │           → Player Stats
                       │           → Event Lineup
                       │           → Attendance
                       │
                       └── Events (Game | Training)
                              ├── Event Lineup → Players
                              ├── Player Stats → Players
                              ├── Attendance → Players
                              └── Session Plans → Session Plan Drills → Drills
```

---

## Key Screens (from existing Notion workflow)

1. **Team home** — team name + season, links to calendar and player list
2. **Player list** — table view with player name, GK appearances, goals
3. **Player detail** — name, positions (as tags), parent/guardian contacts, skill assessments with levels
4. **Calendar** — monthly view with event dots, filterable by season
5. **Training event** — date, tags, football problem, drill notes
6. **Game event** — date, tags, scores, result, starting lineup (by position with sub notes), focus areas, key takeaways

---

## Key Design Decisions

- **Multi-coach support:** Teams are shared entities. Multiple users can co-manage a team with role-based access.
- **Players are permanent:** Players belong to a team, not a season. Season Squad handles per-season inclusion.
- **Sessions are global:** Drills and session plans are not scoped to a team — they form a shared, platform-wide library.
- **AI-ready schema:** Drills include source and popularity fields from day one to support V2 AI features without schema changes.
- **Flexible skill tracking:** Coaches define which skills they assess — not a fixed set.
- **Events unify games and training:** A single calendar with a type discriminator, reducing UI complexity.
