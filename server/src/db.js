import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://shes:shes@localhost:5434/shes_stylish',
  max: process.env.VERCEL ? 2 : 10,
});

pool.on('error', (error) => {
  console.error('idle postgres client error:', error.message);
});

export const query = (text, params) => pool.query(text, params);

export async function waitForDb(attempts = 30, delayMs = 1000) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await query('select 1');
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
