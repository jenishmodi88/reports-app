# ReportLens

A role-gated report management platform built with **Next.js 16 App Router**, **TypeScript**, and **SCSS Modules** — featuring server-side search & sort, AI-powered report summaries.

---

## Features

- **Report listing** at `/reports` with search, sort, category filter, status filter, and pagination — all resolved via API, not client-side filtering
- **Report detail view** at `/reports/[id]` with full content, engagement metrics, and an AI summary panel
- **REST API** at `/api/reports` and `/api/reports/[id]` with query parameter support
- **AI summary generation** via `/api/ai-summary` — mocked with realistic delay, with loading, error, and retry states
- **Role-based access control** enforced in both Next.js middleware and API route handlers
- **SCSS Modules** for all styling — no Tailwind, no CSS-in-JS
- **Reusable components**: `ReportCard`, `Navbar`, `AISummaryPanel`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | SCSS Modules + CSS custom properties |
| Fonts | DM Serif Display, DM Sans, JetBrains Mono |
| Auth | Cookie-based token + Next.js middleware |
| Data | Mock JSON (no database required) |
| React | React 19 |
| AI Helper | Claude |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9+

### Installation

```bash
# Clone or extract the project
cd reports-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.
---

## Project Structure

```
reports-app/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, global styles)
│   ├── page.tsx                    # Home / login page
│   ├── page.module.scss
│   ├── api/
│   │   ├── reports/
│   │   │   ├── route.ts            # GET /api/reports
│   │   │   └── [id]/route.ts       # GET /api/reports/[id]
│   │   └── ai-summary/
│   │       └── route.ts            # POST /api/ai-summary
│   ├── reports/
│   │   ├── page.tsx                # /reports (server component)
│   │   ├── ReportsClient.tsx       # Search/sort/filter UI (client)
│   │   ├── reports.module.scss
│   │   └── [id]/
│   │       ├── page.tsx            # /reports/[id] (server component)
│   │       ├── ReportDetailClient.tsx
│   │       └── reportDetail.module.scss
│   └── unauthorized/
│       ├── page.tsx                # 403 page
│       └── unauthorized.module.scss
├── components/
│   ├── ReportCard.tsx              # Reusable report card
│   ├── ReportCard.module.scss
│   ├── Navbar.tsx                  # Sticky navigation bar
│   ├── Navbar.module.scss
│   ├── AISummaryPanel.tsx          # AI generation panel
│   └── AISummaryPanel.module.scss
├── lib/
│   ├── mockData.ts                 # 8 mock reports across 5 categories
│   ├── reports.ts                  # Search, sort, filter, paginate logic
│   └── auth.ts                     # Role definitions and token helpers
├── styles/
│   └── globals.scss                # CSS custom properties + resets
├── types/
│   └── index.ts                    # Shared TypeScript types
└── middleware.ts                   # Route protection
```

---

## Authentication & Roles

The app uses a simple cookie-based token system for demo purposes. On the home page, select one of three roles to sign in:

| Role | Token | Access |
|---|---|---|
| **Admin** | `admin-token` | All reports (published, draft, archived) + `/admin/*` routes |
| **Analyst** | `analyst-token` | All reports including drafts, can download |
| **Viewer** | `viewer-token` | Published reports only, no status filter |

Role enforcement happens at two layers:

1. **Middleware** (`middleware.ts`) — intercepts requests to `/reports/*` and redirects unauthenticated users to the login page
2. **API routes** — re-verify the token on every request; viewers have `status: published` enforced server-side regardless of query params

---

## API Reference

### GET /api/reports

Returns a paginated, filtered list of reports.

**Query Parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | `""` | Searches title, author, tags, summary |
| `sort` | string | `createdAt` | Field to sort by (`createdAt`, `updatedAt`, `title`, `category`) |
| `order` | `asc` or `desc` | `desc` | Sort direction |

**Response**

```json
{
  "data": [...],
}
```

**Authentication**: Requires `auth-token` cookie or `x-auth-token` header.

---

### GET /api/reports/[id]

Returns a single report by ID.

**Response**: A single `Report` object, or `404` if not found.

Viewers receive `403 Forbidden` when requesting a draft report.

---

### POST /api/ai-summary

Generates an AI summary for a report. Simulates a 1.5–2.5s processing delay.

**Request Body**

```json
{ "reportId": "1" }
```

**Response**

```json
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "sentiment": "positive",
  "readingTime": 4
}
```

---

