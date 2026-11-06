import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cookmate-api' });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
