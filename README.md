# Mission Control

A task management and team organization dashboard for the Terminator AI assistant.

## Overview

Mission Control is a Next.js web application that provides:

- **Task Board** — Kanban-style task management for tracking work
- **Calendar** — Schedule of automated tasks and cron jobs
- **Team** — Organizational structure of Terminator and sub-agents

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** localStorage (can migrate to Convex)
- **Deployment:** Local development server

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
cd task-board

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access

- Local: http://localhost:3000
- Network: http://[YOUR_IP_ADDRESS]:3000

## Features

### Tasks

- Kanban board with 3 columns: To Do, In Progress, Done
- Assign tasks to Ammar or Terminator
- Priority levels (low/medium/high)
- Task statistics per assignee
- LocalStorage persistence

### Calendar

- Today's schedule view with timeline
- Weekly calendar view
- Active/paused task status
- Shows all scheduled cron jobs

### Team

- Organizational hierarchy with Terminator as lead
- Sub-agents: Developer, Research, Content, Trading, Design
- Performance tracking (tasks completed, success rate)
- Fire underperforming agents 🔥

## Project Structure

```
task-board/
├── src/
│   └── app/
│       ├── page.tsx         # Tasks page + sidebar
│       ├── calendar/
│       │   └── page.tsx    # Calendar view
│       └── team/
│           └── page.tsx     # Team org chart
├── public/
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

## Environment

- Runs locally on Mac mini
- Data stored in browser localStorage
- Can be accessed from other devices on network

## Owner

Built for Ammar by Terminator AI 🤖

## License

MIT
