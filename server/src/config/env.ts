import dotenv from 'dotenv';

dotenv.config();

function buildDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5432';
  const database = process.env.DB_NAME ?? 'obuv_db';
  const user = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? 'postgres';

  return `postgres://${user}:${password}@${host}:${port}/${database}`;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: buildDatabaseUrl(),
  jwtSecret: process.env.JWT_SECRET ?? 'dev_secret',
  imagesDir: process.env.IMAGES_DIR ?? '../client/public/uploads',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
};
