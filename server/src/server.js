import { initDb } from './init.js';
import { createApp } from './app.js';
import { pool } from './db.js';

const port = Number(process.env.PORT ?? 4000);

await initDb();

const app = createApp();
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`She's Stylish API listening on :${port}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  });
}
