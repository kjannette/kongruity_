# Database — kongruity backend

PostgreSQL database layer for the kongruity backend. All database modules live in this directory.

## Prerequisites

- PostgreSQL v14 or later
- The `DATABASE_URL` environment variable set in `backend/.env`

## Configuration

### Environment variable

The connection pool reads a single env var:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/kongruity
```

This is loaded via `dotenv` from `backend/.env` (git-ignored). The pool is created once in `index.js` and shared across the application.

### Connection pool (`index.js`)

| Export      | Description                                      |
|-------------|--------------------------------------------------|
| `query`     | Execute a parameterized SQL statement             |
| `getPool`   | Return the underlying `pg.Pool` instance          |
| `close`     | Gracefully shut down the pool (`pool.end()`)      |
| `default`   | The pool itself (default export)                  |

## Schema

### `notes` table

Created by the migration in `migrate.js`. The DDL is idempotent (`CREATE TABLE IF NOT EXISTS`).

| Column        | Type           | Constraints / Defaults       |
|---------------|----------------|------------------------------|
| `id`          | `VARCHAR(64)`  | `PRIMARY KEY`                |
| `text`        | `TEXT`         | `NOT NULL`                   |
| `x`           | `INTEGER`      | `DEFAULT 0`                  |
| `y`           | `INTEGER`      | `DEFAULT 0`                  |
| `author`      | `VARCHAR(128)` |                              |
| `color`       | `VARCHAR(32)`  | `DEFAULT 'yellow'`           |
| `source_meta` | `JSONB`        | `DEFAULT '{}'`               |
| `created_at`  | `TIMESTAMPTZ`  | `DEFAULT NOW()`              |
| `updated_at`  | `TIMESTAMPTZ`  | `DEFAULT NOW()`              |

## npm scripts

Run these from the `backend/` directory.

### Migrate

Creates the `notes` table (safe to re-run):

```bash
npm run db:migrate
```

### Seed

Inserts 50 sample sticky notes. Uses `ON CONFLICT (id) DO NOTHING`, so re-running is safe and will not duplicate data:

```bash
npm run db:seed
```

## Data access layer (`notes.dao.js`)

| Function                  | Description                                                        |
|---------------------------|--------------------------------------------------------------------|
| `getAllNotes()`           | Returns all notes ordered by `id`                                   |
| `getNoteById(id)`        | Returns a single note by primary key, or `null` if not found        |
| `createNote(note)`       | Inserts one note and returns the created row                        |
| `createNotes(notes)`     | Bulk-inserts an array of notes in a single query and returns rows   |

All functions return plain objects with columns: `id`, `text`, `x`, `y`, `author`, `color`.

## File overview

```
db/
├── index.js         # Connection pool and query helper
├── migrate.js       # Table creation (run via npm run db:migrate)
├── notes.dao.js     # Data access functions for the notes table
├── seed.js          # Sample data seeder (run via npm run db:seed)
└── README.md        # This file
```

## Useful psql commands

Connect to the database:

```bash
psql kongruity
```

Quick checks:

```sql
-- Row count
SELECT count(*) FROM notes;

-- Preview data
SELECT id, text, color FROM notes LIMIT 10;

-- Full schema info
\d notes

-- Drop and re-seed (destructive)
TRUNCATE notes;
```

Then re-seed:

```bash
npm run db:seed
```

## Resetting the database

To start completely fresh:

```bash
dropdb kongruity
createdb kongruity
cd backend
npm run db:migrate
npm run db:seed
```
