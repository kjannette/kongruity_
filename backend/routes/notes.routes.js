import { Router } from 'express';
import { getAllNotes } from '../db/notes.dao.js';
import { clusterNotes } from '../services/clustering.service.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (err) {
    console.error(`Error loading notes: ${err}`);
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

router.post('/cluster', async (req, res) => {
  try {
    const notes = await getAllNotes();
    const result = await clusterNotes(notes);
    res.json(result);
  } catch (err) {
    console.error(`Clustering failed: ${err}`);
    res.status(500).json({ error: 'Clustering failed' });
  }
});

export default router;
