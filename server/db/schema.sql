CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY,
  note TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INT NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL REFERENCES categories(name) ON UPDATE CASCADE,
  sub TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL,
  badge TEXT,
  description TEXT NOT NULL DEFAULT '',
  fabric TEXT NOT NULL DEFAULT '',
  care TEXT NOT NULL DEFAULT '',
  collection TEXT NOT NULL DEFAULT '',
  model TEXT,
  colours JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes TEXT[] NOT NULL DEFAULT '{}'
);

-- Ratings live only in product_reviews; drop the old seeded columns.
ALTER TABLE products DROP COLUMN IF EXISTS rating, DROP COLUMN IF EXISTS reviews;

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE SEQUENCE IF NOT EXISTS order_seq START WITH 1025;

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'placed'
    CHECK (status IN ('placed', 'processing', 'shipped', 'out', 'delivered')),
  method TEXT NOT NULL DEFAULT 'standard' CHECK (method IN ('standard', 'express')),
  subtotal INT NOT NULL CHECK (subtotal >= 0),
  discount INT NOT NULL DEFAULT 0 CHECK (discount >= 0),
  delivery INT NOT NULL DEFAULT 0 CHECK (delivery >= 0),
  total INT NOT NULL CHECK (total >= 0),
  promo TEXT,
  tracking TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL DEFAULT '',
  customer JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  colour TEXT NOT NULL,
  qty INT NOT NULL CHECK (qty > 0 AND qty <= 9),
  price INT NOT NULL CHECK (price >= 0),
  PRIMARY KEY (order_id, product_id, size, colour)
);

CREATE TABLE IF NOT EXISTS order_events (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_events_order_idx ON order_events (order_id, created_at);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_reviews_one_per_buyer
  ON product_reviews (product_id, lower(email));

CREATE INDEX IF NOT EXISTS product_reviews_product_idx
  ON product_reviews (product_id, created_at DESC);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
