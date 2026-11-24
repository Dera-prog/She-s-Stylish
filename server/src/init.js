import { readFile } from 'node:fs/promises';
import { query, waitForDb } from './db.js';

const catalog = JSON.parse(
  await readFile(new URL('../data/catalog.json', import.meta.url), 'utf8'),
);

const orderSteps = {
  placed: 'Your pieces are reserved.',
  processing: 'Payment confirmed. We are preparing your pieces.',
  shipped: 'Handed to our delivery partner.',
  out: 'With your rider across Lagos.',
  delivered: 'Signed for, with care.',
};

export const STATUSES = Object.keys(orderSteps);
export const STATUS_NOTES = orderSteps;

export async function initDb() {
  await waitForDb();
  const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
  await query(schema);
  await seedCatalog();
}

export async function seedCatalog() {
  const categories = catalog.categories.filter((category) => category.name !== 'All pieces');
  for (const [index, category] of categories.entries()) {
    await query(
      `insert into categories (name, note, image, position)
       values ($1, $2, $3, $4)
       on conflict (name) do update
         set note = excluded.note, image = excluded.image, position = excluded.position`,
      [category.name, category.note, category.image ?? '', index],
    );
  }

  const keptCategories = categories.map((category) => category.name);
  const stale = await query(
    `delete from categories c
     where not (c.name = any($1::text[]))
       and not exists (select 1 from products p where p.category = c.name)`,
    [keptCategories],
  );
  if (stale.rowCount) console.log(`pruned ${stale.rowCount} retired categories`);

  for (const product of catalog.products) {    await query(
      `insert into products
         (id, name, price, category, sub, image, badge,
          description, fabric, care, collection, model, colours, sizes)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14)
       on conflict (id) do update set
         name = excluded.name,
         price = excluded.price,
         category = excluded.category,
         sub = excluded.sub,
         image = excluded.image,
         badge = excluded.badge,
         description = excluded.description,
         fabric = excluded.fabric,
         care = excluded.care,
         collection = excluded.collection,
         model = excluded.model,
         colours = excluded.colours,
         sizes = excluded.sizes`,
      [
        product.id,
        product.name,
        product.price,
        product.category,
        product.sub,
        product.image,
        product.badge ?? null,
        product.desc,
        product.fabric,
        product.care,
        product.collection,
        product.model ?? null,
        JSON.stringify(product.colours),
        product.sizes,
      ],
    );
  }

  const kept = catalog.products.map((product) => product.id);
  const pruned = await query('delete from products where not (id = any($1::text[]))', [kept]);
  if (pruned.rowCount) console.log(`pruned ${pruned.rowCount} discontinued products`);

  const { rows } = await query('select count(*)::int as count from products');
  console.log(`catalogue ready: ${rows[0].count} products, ${categories.length} categories`);
}
