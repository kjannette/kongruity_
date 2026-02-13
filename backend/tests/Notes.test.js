import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

vi.mock('../services/clustering.service.js', () => ({
  clusterNotes: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}));

import { clusterNotes } from '../services/clustering.service.js';
import { readFile } from 'fs/promises';

const MOCK_NOTES = [
  { id: 'note_001', text: 'Login flow feels confusing', x: 193, y: 191, author: 'user_5', color: 'yellow' },
  { id: 'note_002', text: 'Login flow is broken on mobile', x: 214, y: 281, author: 'user_9', color: 'yellow' },
  { id: 'note_003', text: 'Export takes too long', x: 798, y: 211, author: 'user_2', color: 'green' },
];

const MOCK_CLUSTERS = [
  { label: 'Login Issues', noteIds: ['note_001', 'note_002'] },
  { label: 'Export Problems', noteIds: ['note_003'] },
];

describe('GET /v1/notes', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and an array of notes', async () => {
    readFile.mockResolvedValue(JSON.stringify(MOCK_NOTES));

    const res = await request(app).get('/v1/notes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(MOCK_NOTES);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return notes with expected properties', async () => {
    readFile.mockResolvedValue(JSON.stringify(MOCK_NOTES));

    const res = await request(app).get('/v1/notes');
    const note = res.body[0];

    expect(note).toHaveProperty('id');
    expect(note).toHaveProperty('text');
    expect(note).toHaveProperty('x');
    expect(note).toHaveProperty('y');
    expect(note).toHaveProperty('author');
    expect(note).toHaveProperty('color');
  });

  it('should return 500 when the data file cannot be read', async () => {
    readFile.mockRejectedValue(new Error('ENOENT: file not found'));

    const res = await request(app).get('/v1/notes');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Failed to load notes');
  });

  it('should return 500 when data file is invalid JSON', async () => {
    readFile.mockResolvedValue('{ this is not valid json }');

    const res = await request(app).get('/v1/notes');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /v1/notes/cluster', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and clustered results', async () => {
    readFile.mockResolvedValue(JSON.stringify(MOCK_NOTES));
    clusterNotes.mockResolvedValue(MOCK_CLUSTERS);

    const res = await request(app).post('/v1/notes/cluster');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(MOCK_CLUSTERS);
  });

  it('should return clusters with the expected shape (label, noteIds)', async () => {
    readFile.mockResolvedValue(JSON.stringify(MOCK_NOTES));
    clusterNotes.mockResolvedValue(MOCK_CLUSTERS);

    const res = await request(app).post('/v1/notes/cluster');
    const cluster = res.body[0];

    expect(cluster).toHaveProperty('label');
    expect(cluster).toHaveProperty('noteIds');
    expect(typeof cluster.label).toBe('string');
    expect(Array.isArray(cluster.noteIds)).toBe(true);
  });

  it('should pass the loaded notes to clusterNotes', async () => {
    readFile.mockResolvedValue(JSON.stringify(MOCK_NOTES));
    clusterNotes.mockResolvedValue(MOCK_CLUSTERS);

    await request(app).post('/v1/notes/cluster');

    expect(clusterNotes).toHaveBeenCalledOnce();
    expect(clusterNotes).toHaveBeenCalledWith(MOCK_NOTES);
  });

  it('should return 500 when clusterNotes (API call) fails', async () => {
    readFile.mockResolvedValue(JSON.stringify(MOCK_NOTES));
    clusterNotes.mockRejectedValue(new Error('LLM API error'));

    const res = await request(app).post('/v1/notes/cluster');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/^Clustering failed/);
  });

  it('should return 500 when the data file cannot be read', async () => {
    readFile.mockRejectedValue(new Error('ENOENT: file not found'));

    const res = await request(app).post('/v1/notes/cluster');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});