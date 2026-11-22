import { mkdir, readdir, stat, unlink } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { join } from 'node:path';
import pg from 'pg';

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
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

const KEEP = Number(process.env.BACKUP_KEEP ?? 14);
const dir = process.env.BACKUP_DIR ?? 'backups';
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const file = join(dir, `shes-stylish-${stamp}.json.gz`);

await mkdir(dir, { recursive: true });

const client = new Client({ connectionString: DATABASE_URL, connectionTimeoutMillis: 15000 });
await client.connect();

const gzip = createGzip({ level: 9 });
const out = createWriteStream(file);
gzip.pipe(out);

const write = (value) =>
  new Promise((resolve, reject) => {
    if (gzip.write(value)) return resolve();
    gzip.once('drain', resolve);
    gzip.once('error', reject);
  });

await write(
  JSON.stringify({ meta: { taken_at: new Date().toISOString(), tables: TABLES } }) + '\n',
);

const counts = {};
for (const table of TABLES) {
  const { rows } = await client.query(`select * from ${table}`);
  counts[table] = rows.length;
  await write(JSON.stringify({ table, rows }) + '\n');
}
await client.end();

await new Promise((resolve, reject) => {
  out.once('close', resolve);
  out.once('error', reject);
  gzip.end();
});

const saved = await stat(file);
console.log(`backup written: ${file} (${(saved.size / 1024).toFixed(1)} KB)`);
console.log(TABLES.map((t) => `${t}=${counts[t]}`).join(' '));

const files = (await readdir(dir))
  .filter((name) => name.startsWith('shes-stylish-') && name.endsWith('.json.gz'))
  .sort();
const stale = files.slice(0, Math.max(0, files.length - KEEP));
for (const name of stale) await unlink(join(dir, name));
console.log(`keeping ${files.length - stale.length} of ${files.length} backups (limit ${KEEP})`);
