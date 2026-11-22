# She's Stylish

Luxury womenswear boutique for Lagos — a mobile-first shopping app for the denim and leather line.

**Live:** [shes-stylish.vercel.app](https://shes-stylish.vercel.app)

## Highlights

- Animated splash built around the gold SS monogram, a welcome screen and a three-act campaign where each model walks out of the previous screen into the next.
- Full shopping flow: shop, categories, collections, product pages with size and colour selection, wishlist, bag, promo codes, three-step checkout, confirmation, order tracking and returns.
- Details, saved addresses, preferences, notifications, search, size guide and support.
- Store admin, unlocked with the store key, showing live revenue, the fulfilment queue and status advancement.
- Dockerised Postgres + Node commerce API — checkout writes orders to it, tracking and the admin queue read from it. See [Backend](#backend).
- Bag, wishlist and saved details live on the device; orders live in the API.

## Categories

Jeans and Leather Skirt · Jeans and Leather Trouser · Barrel Pants · Aso Oke Barrel Pants · Adire and Aso Oke Skirt · Knit Tops · Blazer Jacket · Corporate Dresses · Skirts · Accessories.

Jeans and Leather Skirt is live with 22 pieces; the other lines open as they arrive.

## Stack

React 19 · TypeScript · Vite 7 · React Router 7 · Framer Motion · Cormorant Garamond / Inter (Fontsource).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
```

The dev server proxies `/api` to the local API on `127.0.0.1:4010`. Set `VITE_API_URL` to point the storefront at another API host.

## Structure

```
public/assets/     logo lockup, campaign models and product imagery
src/pages/         route screens (splash, ads, home, shop, product, checkout, account, admin)
src/components/    shared chrome, icons and product card
src/lib/           catalogue data, reducer store and the API client
src/styles.css     design system
src/extra.css      motion and newer screen styles
server/            Express API, schema, catalogue seed and smoke tests
docker-compose.yml Postgres 17 + API stack for local development
```

## Routes

| Route | Screen |
| --- | --- |
| `/` · `/welcome` · `/ads` | Intro and campaign sequence |
| `/home` · `/shop` · `/shop/category/:name` · `/collection/:id` | Discovery |
| `/product/:id` · `/wishlist` · `/bag` | Shopping |
| `/checkout` · `/confirmation/:id` | Checkout |
| `/orders` · `/track/:id` · `/return/:id` | Orders and returns |
| `/profile` · `/login` · `/search` · `/admin` | Details and admin |

Promo code: `STYLISH10` (10% off). Prices in Naira. Payment is collected on delivery.

## Backend

Postgres 17 and an Express 5 API run in Docker:

```bash
docker compose up -d --build
docker compose exec -e API_URL=http://127.0.0.1:4000 api node test/smoke.mjs
```

The API is published on <http://localhost:4010>; health at `/health`. The catalogue is seeded from `server/data/catalog.json`, which is exported from the single catalogue source:

```bash
node server/scripts/export-catalog.mjs   # src/lib/data.ts → server/data/catalog.json
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/categories` | Catalogue categories |
| GET | `/api/products?category=&q=&sort=` | Browse / search, sort by price or newest |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/collections` | Edits with product counts |
| POST | `/api/orders` | Server-priced order with promo, delivery and tracking |
| GET | `/api/orders/:id` · `/api/track/:identifier` | Order record and tracking timeline |
| GET | `/api/admin/orders` | Fulfilment queue (`x-admin-key`) |
| PATCH | `/api/admin/orders/:id/status` | Advance status (`x-admin-key`) |
| POST | `/api/contact` | Contact and return requests |
| POST | `/api/newsletter` | Email capture |

The admin key comes from `ADMIN_KEY` (default `dev-admin-key`). Set it in the environment for anything beyond local development, and set the same value when unlocking `/admin`.

## Hosted API

Production runs against a Neon Postgres database. The API is deployed as a Vercel function from `server/`:

- API project: `shes-stylish-api` (root directory `server`, region `lhr1`) — `https://shes-stylish-api.vercel.app/api`
- Database: Neon project `shes-stylish` (eu-west-2), pooled connection string stored as `DATABASE_URL` on the API project
- Store key: the `ADMIN_KEY` set on the API project, also kept in `.secrets/admin-key.txt` (gitignored)

Provision a fresh database with `cd server && DATABASE_URL=... node scripts/migrate.mjs`; the schema and catalogue are idempotent, so re-running only adds or updates.

## Deploy

The storefront deploys to Vercel as a static SPA with a catch-all rewrite to `index.html` (`vercel.json`). `VITE_API_URL` is set on the Vercel project to the hosted API above, so it is baked in at build time. `main` is production; `staging` is the integration branch.
