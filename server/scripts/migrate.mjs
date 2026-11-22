import { initDb } from '../src/init.js';
import { pool, query } from '../src/db.js';

await initDb();

const products = await query('select count(*)::int as n from products');
const categories = await query('select count(*)::int as n from categories');
console.log(`catalogue ready: ${products.rows[0].n} products, ${categories.rows[0].n} categories`);
await pool.end();
