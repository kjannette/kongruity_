import { query } from './index.js';

export const getAllNotes = async () => {
  const { rows } = await query(
    'SELECT id, text, x, y, author, color FROM notes ORDER BY id'
  );
  return rows;
};

export const getNoteById = async (id) => {
  const { rows } = await query(
    'SELECT id, text, x, y, author, color FROM notes WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

export const createNote = async (note) => {
  const { rows } = await query(
    `INSERT INTO notes (id, text, x, y, author, color)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, text, x, y, author, color`,
    [note.id, note.text, note.x ?? 0, note.y ?? 0, note.author, note.color ?? 'yellow']
  );
  return rows[0];
};

export const createNotes = async (notes) => {
  const values = [];
  const placeholders = [];

  notes.forEach((note, i) => {
    const offset = i * 6;
    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`
    );
    values.push(
      note.id,
      note.text,
      note.x ?? 0,
      note.y ?? 0,
      note.author,
      note.color ?? 'yellow'
    );
  });

  const { rows } = await query(
    `INSERT INTO notes (id, text, x, y, author, color)
     VALUES ${placeholders.join(', ')}
     RETURNING id, text, x, y, author, color`,
    values
  );
  return rows;
};
