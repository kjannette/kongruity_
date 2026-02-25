import 'dotenv/config';
import { query, close } from './index.js';

const up = `
CREATE TABLE IF NOT EXISTS notes (
  id          VARCHAR(64) PRIMARY KEY,
  text        TEXT NOT NULL,
  x           INTEGER DEFAULT 0,
  y           INTEGER DEFAULT 0,
  author      VARCHAR(128),
  color       VARCHAR(32) DEFAULT 'yellow',
  source_meta JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
`;

const run = async () => {
  try {
    await query(up);
    console.log('Migration complete — notes table ready.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await close();
  }
};

run();
