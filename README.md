# She's Stylish

Luxury womenswear boutique for Lagos — a mobile-first shopping app built from the product PRD and Figma design.

**Live:** [shes-stylish.vercel.app](https://shes-stylish.vercel.app)

## Highlights

- Animated splash built around the gold SS monogram, welcome and a three-act campaign intro where each model walks out of the previous screen into the next.
- Full shopping flow: shop, categories, collections, product pages with size/colour selection, wishlist, bag, promo codes, three-step checkout, confirmation, order tracking and returns.
- Account area: profile, saved addresses, preferences, notifications, auth (login / create account / guest), search, size guide, support.
- Demo store admin with live revenue, order queue and status advancement.
- Dockerised Postgres + Node commerce API (catalogue, orders, tracking, admin status, newsletter) developed in WSL Ubuntu — see [Backend](#backend-docker--wsl-ubuntu).
- Storefront state persisted to `localStorage`; seeded demo cart/wishlist and a signed-in demo customer.

## Categories

Jeans and Leather Skirt · Jeans and Leather Trouser · Barrel Pants · Aso Oke Barrel Pants · Adire and Aso Oke Skirt · Knit Tops · Blazer Jacket · Corporate Dresses · Skirts · Accessories.

31 pieces in the catalogue.

## Stack

React 19 · TypeScript · Vite 7 · React Router 7 · Framer Motion · Cormorant Garamond / Inter (Fontsource).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
```

## Structure

```
public/assets/     logo lockup, campaign models and product imagery
src/pages/         route screens (splash, ads, home, shop, product, checkout, account, admin)
src/components/    shared chrome, icons and product card
src/lib/           catalogue data and the reducer-backed store
src/styles.css     design system
src/extra.css      motion and newer screen styles
server/            Express API, schema, seed exporter and smoke tests
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
| `/profile` · `/login` · `/search` · `/admin` | Account and admin |

Promo code: `STYLISH10` (10% off). Prices in Naira. Paystack is represented by a demo payment step — no card is charged.

## Backend (Docker · WSL Ubuntu)

Postgres 17 and an Express 5 API run in Docker. From the repo root, inside WSL Ubuntu:

```bash
docker compose up -d --build
docker compose exec -e API_URL=http://127.0.0.1:4000 api node test/smoke.mjs
```

The API is published on <http://localhost:4010>; health at `/health`. Seeded from `server/data/catalog.json`, which is exported from the single catalogue source:

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
| PATCH | `/api/admin/orders/:id/status` | Advance status (`x-admin-key`, default `dev-admin-key`) |
| POST | `/api/newsletter` | Email capture |

The deployed storefront keeps its demo state in `localStorage`; the API is the operations layer for order intake, tracking and the admin queue.

## Deploy

The storefront deploys to Vercel as a static SPA with a catch-all rewrite to `index.html` (`vercel.json`). `main` is production; `staging` is the integration branch.
