import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import { STATUSES, STATUS_NOTES } from './init.js';

const DELIVERY = { standard: 3500, express: 7500 };
const PROMO_CODE = 'STYLISH10';
const ADMIN_KEY = process.env.ADMIN_KEY ?? 'dev-admin-key';

const rowToProduct = (row) => ({
  id: row.id,
  name: row.name,
  price: row.price,
  category: row.category,
  sub: row.sub,
  image: row.image,
  ...(row.badge ? { badge: row.badge } : {}),
  rating: Number(row.rating),
  reviews: row.reviews,
  desc: row.description,
  fabric: row.fabric,
  care: row.care,
  collection: row.collection,
  ...(row.model ? { model: row.model } : {}),
  colours: row.colours,
  sizes: row.sizes,
});

async function loadOrder(identifier) {
  const { rows } = await query(
    'select * from orders where id = $1 or tracking = $1 limit 1',
    [identifier],
  );
  const order = rows[0];
  if (!order) return null;

  const [items, events] = await Promise.all([
    query(
      'select product_id, name, size, colour, qty, price from order_items where order_id = $1 order by name',
      [order.id],
    ),
    query(
      'select status, note, created_at from order_events where order_id = $1 order by id',
      [order.id],
    ),
  ]);

  return {
    id: order.id,
    date: order.created_at.toISOString(),
    status: order.status,
    method: order.method,
    subtotal: order.subtotal,
    discount: order.discount,
    delivery: order.delivery,
    total: order.total,
    promo: order.promo,
    tracking: order.tracking,
    address: order.address,
    customer: order.customer,
    lines: items.rows.map((line) => ({
      id: line.product_id,
      name: line.name,
      size: line.size,
      colour: line.colour,
      qty: line.qty,
      price: line.price,
    })),
    events: events.rows.map((event) => ({
      status: event.status,
      note: event.note,
      at: event.created_at.toISOString(),
    })),
  };
}

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', async (_req, res) => {
    const { rows } = await query('select count(*)::int as products from products');
    res.json({ ok: true, service: 'shes-stylish-api', products: rows[0].products });
  });

  app.get('/api/categories', async (_req, res) => {
    const { rows } = await query(
      'select name, note, image from categories order by position, name',
    );
    res.json(rows);
  });

  app.get('/api/products', async (req, res) => {
    const { category, q, sort = 'curated' } = req.query;
    const filters = [];
    const values = [];

    if (category) {
      values.push(String(category));
      filters.push(`category = $${values.length}`);
    }
    if (q) {
      values.push(`%${String(q).trim()}%`);
      filters.push(
        `(name ilike $${values.length} or description ilike $${values.length} or sub ilike $${values.length})`,
      );
    }

    const orderBy = {
      'price-low': 'price asc',
      'price-high': 'price desc',
      newest: "case when badge = 'NEW' then 0 else 1 end, name asc",
      curated: 'name asc',
    }[String(sort)] ?? 'name asc';

    const where = filters.length ? `where ${filters.join(' and ')}` : '';
    const { rows } = await query(
      `select * from products ${where} order by ${orderBy} limit 100`,
      values,
    );
    res.json(rows.map(rowToProduct));
  });

  app.get('/api/products/:id', async (req, res) => {
    const { rows } = await query('select * from products where id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'product_not_found' });
    res.json(rowToProduct(rows[0]));
  });

  app.get('/api/collections', async (_req, res) => {
    const { rows } = await query(
      `select collection as name, count(*)::int as count
       from products where collection <> '' group by collection order by collection`,
    );
    res.json(rows);
  });

  app.get('/api/orders/:id', async (req, res) => {
    const order = await loadOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'order_not_found' });
    res.json(order);
  });

  app.get('/api/track/:identifier', async (req, res) => {
    const order = await loadOrder(req.params.identifier);
    if (!order) return res.status(404).json({ error: 'tracking_not_found' });
    res.json({
      id: order.id,
      status: order.status,
      tracking: order.tracking,
      total: order.total,
      method: order.method,
      events: order.events,
      timeline: STATUSES.map((status) => ({ status, note: STATUS_NOTES[status] })),
    });
  });

  app.post('/api/orders', async (req, res) => {
    const { items, method = 'standard', promo = null, address, customer = {} } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items_required' });
    }
    if (!['standard', 'express'].includes(method)) {
      return res.status(400).json({ error: 'invalid_method' });
    }
    if (typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ error: 'address_required' });
    }

    const lines = [];
    for (const item of items) {
      if (
        !item ||
        typeof item.id !== 'string' ||
        typeof item.size !== 'string' ||
        typeof item.colour !== 'string' ||
        !Number.isInteger(item.qty) ||
        item.qty < 1 ||
        item.qty > 9
      ) {
        return res.status(400).json({ error: 'invalid_item', item });
      }
      lines.push(item);
    }

    const ids = [...new Set(lines.map((line) => line.id))];
    const { rows: products } = await query(
      'select id, name, price from products where id = any($1::text[])',
      [ids],
    );
    const catalogue = new Map(products.map((product) => [product.id, product]));
    const missing = ids.filter((id) => !catalogue.has(id));
    if (missing.length) {
      return res.status(400).json({ error: 'unknown_product', ids: missing });
    }

    const subtotal = lines.reduce(
      (sum, line) => sum + catalogue.get(line.id).price * line.qty,
      0,
    );
    const discount = promo === PROMO_CODE ? Math.round(subtotal * 0.1) : 0;
    const delivery = DELIVERY[method];
    const total = subtotal - discount + delivery;

    const { rows: seqRows } = await query("select nextval('order_seq')::int as n");
    const number = seqRows[0].n;
    const id = `SS-${number}`;
    const tracking = `NG-${number}-4821`;

    await query(
      `insert into orders
         (id, status, method, subtotal, discount, delivery, total, promo, tracking, address, customer)
       values ($1, 'processing', $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)`,
      [
        id,
        method,
        subtotal,
        discount,
        delivery,
        total,
        promo,
        tracking,
        address.trim(),
        JSON.stringify(customer),
      ],
    );

    for (const line of lines) {
      const product = catalogue.get(line.id);
      await query(
        `insert into order_items (order_id, product_id, name, size, colour, qty, price)
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [id, product.id, product.name, line.size, line.colour, line.qty, product.price],
      );
    }

    for (const status of ['placed', 'processing']) {
      await query(
        'insert into order_events (order_id, status, note) values ($1, $2, $3)',
        [id, status, STATUS_NOTES[status]],
      );
    }

    res.status(201).json(await loadOrder(id));
  });

  app.get('/api/admin/orders', async (req, res) => {
    if (req.get('x-admin-key') !== ADMIN_KEY) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const { rows } = await query(
      `select o.id, o.created_at, o.status, o.method, o.total, o.address,
              coalesce(sum(i.qty), 0)::int as pieces
       from orders o
       left join order_items i on i.order_id = o.id
       group by o.id
       order by o.created_at desc
       limit 100`,
    );
    res.json(
      rows.map((row) => ({
        id: row.id,
        date: row.created_at.toISOString(),
        status: row.status,
        method: row.method,
        total: row.total,
        address: row.address,
        pieces: row.pieces,
      })),
    );
  });

  app.patch('/api/admin/orders/:id/status', async (req, res) => {
    if (req.get('x-admin-key') !== ADMIN_KEY) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const { status } = req.body ?? {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'invalid_status', allowed: STATUSES });
    }

    const { rows } = await query('select status from orders where id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'order_not_found' });
    if (rows[0].status === status) {
      return res.json(await loadOrder(req.params.id));
    }

    await query('update orders set status = $1 where id = $2', [status, req.params.id]);
    await query(
      'insert into order_events (order_id, status, note) values ($1, $2, $3)',
      [req.params.id, status, STATUS_NOTES[status]],
    );
    res.json(await loadOrder(req.params.id));
  });

  app.post('/api/newsletter', async (req, res) => {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'invalid_email' });
    }
    await query(
      'insert into newsletter_subscribers (email) values ($1) on conflict (email) do nothing',
      [email],
    );
    res.status(201).json({ ok: true, email });
  });

  app.post('/api/contact', async (req, res) => {
    const name = String(req.body?.name ?? '').trim().slice(0, 120);
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const subject = String(req.body?.subject ?? '').trim().slice(0, 160);
    const message = String(req.body?.message ?? '').trim().slice(0, 4000);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'invalid_email' });
    }
    if (message.length < 10) {
      return res.status(400).json({ error: 'message_too_short' });
    }

    await query(
      'insert into contact_messages (name, email, subject, message) values ($1, $2, $3, $4)',
      [name, email, subject, message],
    );
    res.status(201).json({ ok: true });
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));
  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}
