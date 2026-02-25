import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../db/index.js', () => ({
  query: mockQuery,
}));

import { getAllNotes, getNoteById, createNote, createNotes } from '../db/notes.dao.js';

const MOCK_ROWS = [
  { id: 'note_001', text: 'Login flow feels confusing', x: 193, y: 191, author: 'user_5', color: 'yellow' },
  { id: 'note_002', text: 'Login flow is broken on mobile', x: 214, y: 281, author: 'user_9', color: 'yellow' },
];

describe('notes.dao', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllNotes', () => {
    it('should return all notes ordered by id', async () => {
      mockQuery.mockResolvedValue({ rows: MOCK_ROWS });

      const result = await getAllNotes();

      expect(result).toEqual(MOCK_ROWS);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, text, x, y, author, color FROM notes ORDER BY id'
      );
    });

    it('should return an empty array when no notes exist', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await getAllNotes();

      expect(result).toEqual([]);
    });

    it('should propagate database errors', async () => {
      mockQuery.mockRejectedValue(new Error('connection refused'));

      await expect(getAllNotes()).rejects.toThrow('connection refused');
    });
  });

  describe('getNoteById', () => {
    it('should return a single note when found', async () => {
      mockQuery.mockResolvedValue({ rows: [MOCK_ROWS[0]] });

      const result = await getNoteById('note_001');

      expect(result).toEqual(MOCK_ROWS[0]);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, text, x, y, author, color FROM notes WHERE id = $1',
        ['note_001']
      );
    });

    it('should return null when note is not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await getNoteById('note_999');

      expect(result).toBeNull();
    });
  });

  describe('createNote', () => {
    it('should insert a note and return it', async () => {
      const input = { id: 'note_003', text: 'Export fails', x: 100, y: 200, author: 'user_1', color: 'blue' };
      mockQuery.mockResolvedValue({ rows: [input] });

      const result = await createNote(input);

      expect(result).toEqual(input);
      expect(mockQuery).toHaveBeenCalledOnce();
      const [sql, params] = mockQuery.mock.calls[0];
      expect(sql).toContain('INSERT INTO notes');
      expect(params).toEqual(['note_003', 'Export fails', 100, 200, 'user_1', 'blue']);
    });

    it('should use defaults for missing x, y, and color', async () => {
      const input = { id: 'note_004', text: 'Needs fixing', author: 'user_2' };
      mockQuery.mockResolvedValue({ rows: [{ ...input, x: 0, y: 0, color: 'yellow' }] });

      await createNote(input);

      const params = mockQuery.mock.calls[0][1];
      expect(params[2]).toBe(0);
      expect(params[3]).toBe(0);
      expect(params[5]).toBe('yellow');
    });
  });

  describe('createNotes', () => {
    it('should batch-insert multiple notes and return them', async () => {
      mockQuery.mockResolvedValue({ rows: MOCK_ROWS });

      const result = await createNotes(MOCK_ROWS);

      expect(result).toEqual(MOCK_ROWS);
      expect(mockQuery).toHaveBeenCalledOnce();
      const [sql, params] = mockQuery.mock.calls[0];
      expect(sql).toContain('INSERT INTO notes');
      expect(params).toHaveLength(12);
    });
  });
});
