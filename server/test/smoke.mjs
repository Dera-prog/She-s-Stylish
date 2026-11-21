const API = process.env.API_URL ?? 'http://localhost:4010';
const ADMIN_KEY = process.env.ADMIN_KEY ?? 'dev-admin-key';

let failures = 0;

function check(label, ok, detail = '') {
  if (ok) {
    console.log(`PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

async function json(path, init) {
  const response = await fetch(`${API}${path}`, init);
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

const health = await json('/health');
check('health', health.status === 200 && health.body?.ok === true, JSON.stringify(health.body));

const categories = await json('/api/categories');
check('10 categories', categories.status === 200 && categories.body.length === 10, `${categories.body?.length}`);

const wanted = [
  'Jeans and Leather Skirt',
  'Jeans and Leather Trouser',
  'Barrel Pants',
  'Aso Oke Barrel Pants',
  'Adire and Aso Oke Skirt',
  'Knit Tops',
  'Blazer Jacket',
  'Corporate Dresses',
];
const names = (categories.body ?? []).map((category) => category.name);
check('requested categories present', wanted.every((name) => names.includes(name)), names.join(', '));

const all = await json('/api/products');
check('22 products', all.status === 200 && all.body.length === 22, `${all.body?.length}`);

const live = await json('/api/products?category=Jeans%20and%20Leather%20Skirt');
check('denim and leather line has pieces', live.status === 200 && live.body.length === 22, `${live.body?.length}`);

for (const name of ['Jeans and Leather Trouser', 'Knit Tops', 'Accessories']) {
  const list = await json(`/api/products?category=${encodeURIComponent(name)}`);
  check(`category still empty: ${name}`, list.status === 200 && list.body.length === 0, `${list.body?.length}`);
}

const product = await json('/api/products/leather-wrap-maxi');
check(
  'product detail',
  product.status === 200 && product.body.price === 148000 && product.body.category === 'Jeans and Leather Skirt',
  JSON.stringify(product.body?.price),
);

const newest = await json('/api/products/crystal-bow-denim-skirt');
check('new skirt seeded', newest.status === 200 && newest.body.price === 98000 && newest.body.category === 'Jeans and Leather Skirt', `${newest.status} ${newest.body?.price}`);

const collections = await json('/api/collections');
check('collections grouped', collections.status === 200 && collections.body.length === 3, JSON.stringify(collections.body));

const order = await json('/api/orders', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    items: [
      { id: 'denim-midi-skirt', size: 'M', colour: 'Deep Indigo', qty: 1 },
      { id: 'crystal-bow-denim-skirt', size: 'S', colour: 'Light Blue', qty: 1 },
    ],
    method: 'express',
    promo: 'STYLISH10',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    customer: { name: 'Ada Adebayo', phone: '+234 801 234 5678' },
  }),
});

check('order created', order.status === 201, `${order.status} ${JSON.stringify(order.body?.error)}`);
check('order id format', /^SS-10\d\d$/.test(order.body?.id ?? ''), order.body?.id);
check('tracking format', /^NG-10\d\d-4821$/.test(order.body?.tracking ?? ''), order.body?.tracking);
check('subtotal', order.body?.subtotal === 166000, `${order.body?.subtotal}`);
check('discount 10%', order.body?.discount === 16600, `${order.body?.discount}`);
check('express delivery', order.body?.delivery === 7500, `${order.body?.delivery}`);
check('total', order.body?.total === 156900, `${order.body?.total}`);
check('status processing', order.body?.status === 'processing', order.body?.status);
check('two lines', order.body?.lines?.length === 2, `${order.body?.lines?.length}`);
check('two events', order.body?.events?.length === 2, `${order.body?.events?.length}`);

const tracked = await json(`/api/track/${order.body?.tracking}`);
check('track by tracking', tracked.status === 200 && tracked.body.id === order.body?.id, tracked.body?.id);
check('timeline has 5 steps', tracked.body?.timeline?.length === 5, `${tracked.body?.timeline?.length}`);

const denied = await json(`/api/admin/orders/${order.body?.id}/status`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ status: 'shipped' }),
});
check('admin requires key', denied.status === 401, `${denied.status}`);

const shipped = await json(`/api/admin/orders/${order.body?.id}/status`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', 'x-admin-key': ADMIN_KEY },
  body: JSON.stringify({ status: 'shipped' }),
});
check('admin advances status', shipped.status === 200 && shipped.body.status === 'shipped', shipped.body?.status);
check('event appended', shipped.body?.events?.length === 3, `${shipped.body?.events?.length}`);

const badStatus = await json(`/api/admin/orders/${order.body?.id}/status`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', 'x-admin-key': ADMIN_KEY },
  body: JSON.stringify({ status: 'teleported' }),
});
check('rejects unknown status', badStatus.status === 400, `${badStatus.status}`);

const unknown = await json('/api/orders', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    items: [{ id: 'not-a-piece', size: 'M', colour: 'Black', qty: 1 }],
    address: 'Lagos',
  }),
});
check('rejects unknown product', unknown.status === 400, `${unknown.status}`);

const list = await json('/api/admin/orders', { headers: { 'x-admin-key': ADMIN_KEY } });
check(
  'admin lists the queue',
  list.status === 200 && list.body.some((o) => o.id === order.body?.id) && typeof list.body[0]?.pieces === 'number',
  `${list.status}`,
);

const contact = await json('/api/contact', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    name: 'Smoke check',
    email: 'smoke@shes-stylish.test',
    subject: 'Smoke',
    message: 'Checking the contact endpoint stores notes correctly.',
  }),
});
check('contact accepts a message', contact.status === 201 && contact.body.ok === true, `${contact.status}`);

const badContact = await json('/api/contact', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'nope', message: 'short' }),
});
check('contact validates email', badContact.status === 400, `${badContact.status}`);

const email = `smoke-${Date.now()}@shes-stylish.test`;
const newsletter = await json('/api/newsletter', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email }),
});
check('newsletter signup', newsletter.status === 201 && newsletter.body.ok === true, `${newsletter.status}`);

console.log(failures === 0 ? '\nAll smoke checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
