# She's Stylish

Luxury womenswear boutique for Lagos — a mobile-first shopping app built from the product PRD and Figma design.

**Live:** [shes-stylish.vercel.app](https://shes-stylish.vercel.app)

## Highlights

- Animated splash, welcome and a three-act campaign intro where each model walks out of the previous screen into the next.
- Full shopping flow: shop, categories, collections, product pages with size/colour selection, wishlist, bag, promo codes, three-step checkout, confirmation, order tracking and returns.
- Account area: profile, saved addresses, preferences, notifications, auth (login / create account / guest), search, size guide, support.
- Demo store admin with live revenue, order queue and status advancement.
- State persisted to `localStorage`; seeded demo cart/wishlist and a signed-in demo customer.

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
public/assets/     logo, campaign models and product imagery
src/pages/         route screens (splash, ads, home, shop, product, checkout, account, admin)
src/components/    shared chrome, icons and product card
src/lib/           catalogue data and the reducer-backed store
src/styles.css     design system
src/extra.css      motion and newer screen styles
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

## Deploy

Deployed to Vercel as a static SPA with a catch-all rewrite to `index.html` (`vercel.json`).
