import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import pg from 'pg';

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const file = process.argv[2];
if (!DATABASE_URL || !file) {
  console.error('usage: DATABASE_URL=... node scripts/restore.mjs backups/<file>.json.gz');
  process.exit(1);
}

const TABLES = [
  'categories',
  'products',
  'orders',
  'order_items',
  'order_events',
  'newsletter_subscribers',
  'contact_messages',
];

const records = gunzipSync(await readFile(file))
  .toString('utf8')
  .split('\n')
  .filter((line) => line.trim())
  .map((line) => JSON.parse(line));

const header = records.find((record) => !record.table);
const tables = records.filter((record) => record.table);

const client = new Client({ connectionString: DATABASE_URL, connectionTimeoutMillis: 15000 });
await client.connect();
console.log(`connected; restoring ${file} (taken ${header?.meta?.taken_at ?? 'unknown'})`);

await client.query('begin');
try {
  const types = await client.query(
    `select table_name, column_name, data_type
       from information_schema.columns
      where table_schema = 'public' and table_name = any($1)`,
    [TABLES],
  );
  const isArrayColumn = new Set(
    types.rows
      .filter((row) => row.data_type === 'ARRAY')
      .map((row) => `${row.table_name}.${row.column_name}`),
  );

  await client.query(`truncate ${TABLES.join(', ')} restart identity cascade`);
  for (const { table, rows } of tables) {
    if (!TABLES.includes(table)) throw new Error(`unknown table ${table}`);
    for (const row of rows) {
      const columns = Object.keys(row);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      const values = columns.map((column) => {
        const value = row[column];
        if (value === null || typeof value !== 'object') return value;
        if (Array.isArray(value) && isArrayColumn.has(`${table}.${column}`)) return value;
        return JSON.stringify(value);
      });
      await client.query(
        `insert into ${table} (${columns.join(', ')}) values (${placeholders})`,
        values,
      );
    }
    console.log(`restored ${table}: ${rows.length} rows`);
  }
  await client.query(
    `select setval('order_seq', coalesce((select max(substring(id from '[0-9]+$')::int) from orders), 1024) + 1, false)`,
  );
  await client.query('commit');
  console.log('restore complete');
} catch (error) {
  await client.query('rollback');
  throw error;
} finally {
  await client.end();
}
