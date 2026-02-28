# SilverMoon

Silvermoon is an open-source personal AI life assistant built on top of an OpenClaw-style gateway/runtime architecture.

This MVP includes:
- Conversational Silvermoon agent
- Task, reminder, and memory skills
- SQLite persistence
- Cron-based reminder scheduling with `node-cron`
- Local avatar upload support
- CLI chat interface (`silvermoon start`)

## Architecture

`User → OpenClaw Gateway → Silvermoon Agent → LLM → Skills → Storage`

## Project structure

```text
silvermoon/
  core/
  skills/
  storage/
  cli/
  config/
  data/
  avatars/
```

Source code lives under `src/silvermoon/*` and compiles to `dist/`.

## Tech stack

- Node.js
- TypeScript
- SQLite (`better-sqlite3`)
- OpenAI API
- `node-cron`

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   # then set OPENAI_API_KEY
   ```
3. Build:
   ```bash
   npm run build
   ```
4. Run:
   ```bash
   npx silvermoon start
   # or
   npm run dev
   ```

## CLI usage

Inside chat mode:
- `add task Buy groceries`
- `list tasks`
- `complete task 1`
- `remind stand up | */30 * * * *`
- `list reminders`
- `remember that my favorite tea is oolong`
- `recall favorite tea`
- `/avatar upload /path/to/avatar.png`
- `/avatar list`
- `exit`

## Implemented components

### 1) Silvermoon Agent
- Routes natural language to skill handlers when matched.
- Falls back to OpenAI LLM responses for general conversation.

### 2) Skills
- `task_skill`
  - create task
  - list tasks
  - mark task complete
- `reminder_skill`
  - create reminder
  - schedule reminder with cron
  - notify user in CLI
- `memory_skill`
  - save memory
  - retrieve memories
- `calendar_skill`
  - optional stub for future external calendar integration

### 3) Storage
SQLite tables auto-created at startup:
- `tasks`
- `reminders`
- `memories`

### 4) Configuration
Environment variables:
- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional, default `gpt-4o-mini`)

### 5) Security and extensibility notes
- API keys stay in local `.env`.
- Data persists locally in `silvermoon/data/silvermoon.db`.
- Modular folder separation for easy skill extension.
- Calendar integration intentionally stubbed to keep MVP minimal.

## Future extensions
- Real OpenClaw runtime adapter integration points
- Better intent parsing / tool calling
- Notification plugins (email, push, desktop)
- Calendar providers (Google/Outlook)
