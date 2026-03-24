import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { optionalAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { apiRoutes } from './routes/index.js';

export const app = express();

const allowedOrigins = env.clientOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  }),
);
app.use(express.json());
app.use(optionalAuth);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);
