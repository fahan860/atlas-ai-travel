# AtlasTrip AI — Morocco-Focused AI Travel Planner

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)

AtlasTrip AI is a Morocco-focused AI travel planning web app. Users can chat with an AI assistant (with streaming responses), plan and save trips, generate itineraries, and explore flights, hotels, and packages — powered by a Supabase backend (Auth, Postgres with RLS, and Edge Functions).

---

## Table of Contents

- [Key Features](#key-features)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Edge Functions / API](#edge-functions--api)
- [Getting Started](#getting-started)
- [Security Notes](#security-notes)
- [Known Limitations](#known-limitations)
- [Project Structure](#project-structure)

---

## Key Features

- **AI travel assistant chat** with streaming responses
- **Trip planner** with full CRUD — create, save, update, delete trips
- **AI itinerary generation** saved back to the trip
- **AI-assisted travel tools** via Supabase Edge Functions:
  - Flight search
  - Hotel / riad recommendations
  - Weather guidance
- **User authentication** — email/password sign up & sign in, password reset flow
- **Saved data per user** protected with Row Level Security (RLS):
  - Conversations + messages
  - Trips + generated itineraries

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — Discover Morocco |
| `/chat` | AI travel assistant (streaming chat) |
| `/planner` | Trip planner — save and generate itineraries |
| `/flights` | AI-assisted flight search |
| `/hotels` | AI-assisted hotel / riad search |
| `/packages` | Curated travel packages |
| `/auth` | Login / Signup |
| `/reset-password` | Password reset flow |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui (Radix UI), Framer Motion |
| Routing | React Router v6 |
| Data fetching | TanStack React Query |
| Backend | Supabase (Auth + Postgres + Edge Functions) |
| Database | Postgres with Row Level Security |
| AI Layer | Supabase Edge Functions (provider abstracted server-side) |

---

## Architecture

```
┌─────────────────────────────┐
│        React SPA            │
│  React Router + React Query │
│  shadcn/ui + Tailwind CSS   │
└──────────────┬──────────────┘
               │ HTTPS
┌──────────────▼──────────────┐
│         Supabase            │
│  ┌────────────────────────┐ │
│  │  Auth (email/password) │ │
│  ├────────────────────────┤ │
│  │  Postgres + RLS        │ │
│  │  conversations         │ │
│  │  messages              │ │
│  │  trips                 │ │
│  ├────────────────────────┤ │
│  │  Edge Functions        │ │
│  │  chat                  │ │
│  │  flights-agent         │ │
│  │  hotels-agent          │ │
│  │  weather-agent         │ │
│  │  itinerary-agent       │ │
│  └────────────────────────┘ │
└─────────────────────────────┘
```

**Key flows:**

- **Auth** — `AuthContext` wraps the app, manages user/session, exposes `signOut`
- **Chat** — frontend streams responses from `/functions/v1/chat`
- **Planner** — trips saved to Postgres via React Query hooks; itinerary generated via `/functions/v1/itinerary-agent`
- **RLS** — all Postgres queries are scoped to `auth.uid() = user_id`

---

## Data Model

| Table | Description |
|---|---|
| `conversations` | Chat sessions per user |
| `messages` | Messages linked to a conversation |
| `trips` | Saved trips with dates, budget, and optional itinerary payload |

All tables have RLS policies — users can only read and write their own rows.

---

## Edge Functions / API

The frontend calls Supabase Edge Functions at:

```
{VITE_SUPABASE_URL}/functions/v1/<function-name>
```

| Function | Description |
|---|---|
| `chat` | Streaming AI chat endpoint |
| `flights-agent` | AI-assisted flight search |
| `hotels-agent` | AI-assisted hotel / riad search |
| `weather-agent` | Weather guidance for Morocco destinations |
| `itinerary-agent` | AI itinerary generation for saved trips |

> The AI provider (OpenAI / Gemini / etc.) is handled **server-side** inside Edge Functions. No LLM keys are exposed to the client.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project with migrations applied and Edge Functions deployed

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
VITE_SUPABASE_PROJECT_ID=<your-project-ref>
```

### Install & Run

```bash
npm install
npm run dev
```

Dev server runs on **http://localhost:8080**

### Supabase Setup

**Apply database migrations:**

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

**Deploy Edge Functions:**

```bash
supabase functions deploy chat
supabase functions deploy flights-agent
supabase functions deploy hotels-agent
supabase functions deploy weather-agent
supabase functions deploy itinerary-agent
```

**Set AI provider secrets (inside Edge Functions):**

```bash
supabase secrets set YOUR_AI_API_KEY="..."
```

---

## Security Notes

- `.env` is **not committed** — use `.env.local` for local development
- AI provider API keys live **only** in Supabase Edge Function secrets (never client-side)
- All database access is protected by **Row Level Security** policies
- See `.env.example` for required variable names

---

## Known Limitations

- The **Packages page** currently uses mock/static data (not backed by a live inventory)
- The AI provider is abstracted behind Edge Functions and is not documented in this repo
- No map integration yet (route visualization, points of interest)

---

## Project Structure

```
atlas-ai-travel/
├── index.html
├── vite.config.ts
├── package.json
├── .env.example               # Variable names only — copy to .env.local
├── src/
│   ├── App.tsx                # Routes + providers
│   ├── main.tsx               # App bootstrap
│   ├── pages/                 # Home, Chat, Planner, Flights, Hotels, Packages, Auth
│   ├── components/            # Header, Footer + shadcn/ui components
│   ├── contexts/              # AuthContext (Supabase session)
│   ├── hooks/                 # React Query hooks — trips, conversations
│   ├── integrations/supabase/ # Supabase client + generated DB types
│   └── lib/                   # Edge Function clients (agentClient, streamChat)
└── supabase/
    ├── migrations/            # Postgres schema + RLS policies
    └── functions/             # AI agent Edge Functions (chat, *-agent)
```

---

> **Portfolio note (PFA / internship):** AtlasTrip AI demonstrates a complete full-stack workflow — modern React architecture (TypeScript + Router + React Query), production-grade Supabase usage (Auth + Postgres + RLS), and a secure AI integration pattern through Edge Functions with no client-side LLM secrets.
