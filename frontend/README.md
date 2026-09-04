# SewaPath — Frontend

A React (Vite) frontend for SewaPath, built to match the provided prototype
screens pixel-for-pixel where the backend supports it, and wired to the real
`backend` API in `bipesh369/sewapath`.

## What's new in this pass

Your screenshots show a citizen **application-tracking** experience —
reference numbers, a personal "My goals" timeline, a staff Applications
table with stats — that the original backend didn't have a model for. Since
the whole point was "api comes from backend" (not mocked data), I added a
proper `Application` resource to the backend (`backend/src/models/application.model.js`
+ controller + routes, following the exact same patterns as the existing
`Service`/`Office` resources) rather than fake it in the frontend. See
"New backend endpoints" below.

## Stack

- React 19 + React Router 7
- Tailwind CSS v4, theme in `src/index.css` matching the prototype's colors,
  fonts (Baloo 2 / Noto Sans / IBM Plex Mono), and dotted "trail" motif.
- Axios with a JWT auth interceptor.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

Run `../backend` alongside it (needs `JWT_SECRET`, `MONGODB_URI`, and CORS
already allows `http://localhost:5173`). To see the staff panel, log in with
a user whose `role` is `admin` in the database.

## New backend endpoints (Application)

| Method | Path | Who | What |
|---|---|---|---|
| POST | `/api/applications` | citizen | Start a goal for a service they're eligible for. Snapshots the service's journey steps + document count into a timeline and generates a reference like `MRP-2026-33170`. |
| GET | `/api/applications/me` | citizen | Their own goals, for the dashboard / "My goals". |
| GET | `/api/applications/:id` | owner or admin | Full timeline for one goal. |
| PATCH | `/api/applications/:id/delivery` | owner | Choose office vs. online for the "Choose how to complete this" step. |
| GET | `/api/applications` | admin | Every application, filterable by `status`, for the staff Applications table. |
| GET | `/api/applications/stats` | admin | The four summary cards (total this month, awaiting review, avg. processing time, completion rate). |
| PATCH | `/api/applications/:id/status` | admin | Move an application between `action_needed` / `needs_documents` / `in_review` / `completed`. |

## Pages

- **Public** — Home, Services (search/browse with category+delivery+jurisdiction
  filters), Service Details, Eligibility (branching questionnaire that
  mirrors the backend's evaluator exactly, then offers "Start this as a
  goal"), Journey (a generic, non-personalized preview of a service's steps
  for people who aren't logged in yet), Login/Register (with pending-goal
  resume: if you check eligibility, decide to start a goal, and aren't
  logged in, it picks up and creates the application right after you log
  in).
- **Citizen app** (`AppShell`) — Dashboard, Goals, Documents, Messages
  (notifications), Settings.
- **Application journey** (`/applications/:id`) — the personalized timeline
  from your screenshots: Goal confirmed → Eligibility verified → Document
  checklist ready → Choose how to complete this (pick an office or online)
  → the service's own journey steps → completion.
- **Staff panel** (`AppShell role="admin"`) — Applications (table + stats +
  status changes + CSV export), Services (CRUD), Offices (CRUD). I didn't
  build "Citizens" or "Reports" nav items from the screenshot — there's no
  backend support for listing all users or for broader analytics, and I'd
  rather leave those out than fake them.

## Notes on fidelity vs. honesty

A few deliberate deviations from the screenshots, all because they'd
otherwise require fabricating data:

- The Applications table's status dropdown doubles as the colored pill
  (click it to change status) rather than a separate read-only badge —
  slightly different interaction, same information.
- "Visits saved by pre-filling forms" on the dashboard shows the count of
  distinct offices tied to your applications' `chosenOffice`, since there's
  no real "form pre-fill" feature to count.
- Document checklists show counts (`3 of 3 confirmed`) rather than a
  per-document confirm toggle — the backend doesn't yet track individual
  document upload/confirmation state, only a total count captured when the
  goal was started.
