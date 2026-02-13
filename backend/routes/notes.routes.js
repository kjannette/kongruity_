import { Router } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { clusterNotes } from '../services/clustering.service.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'notes.json');

const loadNotes = async () => {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
};

router.get('/', async (req, res) => {
  try {
    const notes = await loadNotes();
    res.json(notes);
  } catch (err) {
    console.error(`Error loading notes: ${err}`)
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

router.post('/cluster', async (req, res) => {
  try {
    const notes = await loadNotes();
    const clusters = await clusterNotes(notes);
    res.json(clusters);
  } catch (err) {
    console.error(`Clustering failed: ${err}` )
    res.status(500).json({ error: `Clustering failed: ${err}` });
  }
});

export default router;
