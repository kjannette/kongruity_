import 'dotenv/config';
import { readFile } from 'fs/promises';
import { query, close } from './index.js';

const NOTES_PATH = new URL('../data/notes.json', import.meta.url);

const run = async () => {
  try {
    const raw = await readFile(NOTES_PATH, 'utf-8');
    const notes = JSON.parse(raw);

    const insertQuery = `
      INSERT INTO notes (id, text, x, y, author, color)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `;

    let inserted = 0;
    for (const note of notes) {
      const result = await query(insertQuery, [
        note.id,
        note.text,
        note.x,
        note.y,
        note.author,
        note.color,
      ]);
      inserted += result.rowCount;
    }

    console.log(`Seed complete — ${inserted} notes inserted (${notes.length - inserted} already existed).`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await close();
  }
};

run();
