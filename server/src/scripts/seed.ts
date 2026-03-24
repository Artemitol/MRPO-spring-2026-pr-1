import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readSql(fileName: string): Promise<string> {
  const filePath = path.resolve(__dirname, '../../sql', fileName);
  return readFile(filePath, 'utf8');
}

async function run(): Promise<void> {
  const shouldReset = process.argv.includes('--reset');

  const schemaSql = await readSql('01_schema.sql');
  const seedSql = await readSql('02_seed.sql');

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    if (shouldReset) {
      await client.query('DROP SCHEMA IF EXISTS public CASCADE');
      await client.query('CREATE SCHEMA public');
      await client.query('GRANT ALL ON SCHEMA public TO postgres');
      await client.query('GRANT ALL ON SCHEMA public TO public');
      await client.query(schemaSql);
    } else {
      let schemaExists = true;
      try {
        await client.query('SELECT 1 FROM role_type LIMIT 1');
      } catch {
        schemaExists = false;
      }

      if (!schemaExists) {
        await client.query(schemaSql);
      } else {
        await client.query(
          'TRUNCATE TABLE order_item, shop_order, product, app_user, order_status, category, manufacturer, supplier, role_type RESTART IDENTITY CASCADE',
        );
      }
    }

    await client.query(seedSql);
    await client.query('COMMIT');

    console.info(
      shouldReset
        ? 'Database reset + seed completed successfully.'
        : 'Database seed completed successfully.',
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database seed failed.', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.end();
  }
}

void run();
