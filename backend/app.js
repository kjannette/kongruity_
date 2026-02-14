import express from 'express';
import cors from 'cors';
import router from './routes/notes.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1/notes', router);

app.use((req, res) => {
  res.status(404).json({ error: `Requested path is invalid or does not exist: ${req.method} ${req.originalUrl}` });
});

export default app;
