import { Pool } from 'pg';
import { env } from './env.js';

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export const db = new Pool({
  connectionString: env.databaseUrl,
});
