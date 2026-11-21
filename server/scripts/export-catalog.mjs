import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const data = await import('../../src/lib/data.ts');

const catalog = {
  generatedAt: new Date().toISOString(),
  categories: data.categories,
  collections: data.collections,
  products: data.products,
  ads: data.ads,
};

const outDir = fileURLToPath(new URL('../data/', import.meta.url));
await mkdir(outDir, { recursive: true });
const outFile = fileURLToPath(new URL('../data/catalog.json', import.meta.url));
await writeFile(outFile, `${JSON.stringify(catalog, null, 2)}\n`);

console.log(
  `catalog.json: ${catalog.products.length} products, ${catalog.categories.length} category rows`,
);
