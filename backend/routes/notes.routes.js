import { Router } from 'express';
import { readFile } from 'fs/promises';
import { clusterNotes } from '../services/clustering.service.js';

const router = Router();
const DATA_PATH = new URL('../data/notes.json', import.meta.url);

const loadNotes = async () => {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
};

router.get('/', async (req, res) => {
  try {
    const notes = await loadNotes();
    res.json(notes);
  } catch (err) {
    console.error(`Error loading notes: ${err}`);
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

router.post('/cluster', async (req, res) => {
  try {
    const notes = await loadNotes();
    const result = await clusterNotes(notes);
    res.json(result);
  } catch (err) {
    console.error(`Clustering failed: ${err}`);
    res.status(500).json({ error: 'Clustering failed' });
  }
});

export default router;
