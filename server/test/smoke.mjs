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
check('11 categories', categories.status === 200 && categories.body.length === 11, `${categories.body?.length}`);

const wanted = [
  'Jeans and Leather Skirt',
  'Jeans and Leather Trouser',
  'Barrel Pants',
  'Adire and Aso Oke Skirt',
  'Tops',
  'Knit',
  'Bodysuits',
  'Blazer Jacket',
  'Fancy Jacket',
  'Elegant Dresses',
  'Corporate Dresses',
];
const names = (categories.body ?? []).map((category) => category.name);
check('requested categories present', wanted.every((name) => names.includes(name)), names.join(', '));

const all = await json('/api/products');
check('105 products', all.status === 200 && all.body.length === 105, `${all.body?.length}`);

const skirts = await json('/api/products?category=Jeans%20and%20Leather%20Skirt');
check('denim and leather line has 28 pieces', skirts.status === 200 && skirts.body.length === 28, `${skirts.body?.length}`);

const first = skirts.body?.[0];
check(
  'list carries real aggregates',
  typeof first?.rating === 'number' && typeof first?.reviews === 'number',
  JSON.stringify({ rating: first?.rating, reviews: first?.reviews }),
);

for (const name of ['Jeans and Leather Trouser', 'Adire and Aso Oke Skirt']) {
  const list = await json(`/api/products?category=${encodeURIComponent(name)}`);
  check(`awaiting stock: ${name}`, list.status === 200 && list.body.length === 0, `${list.body?.length}`);
}

const product = await json('/api/products/leather-wrap-maxi');
check(
  'product detail',
  product.status === 200 && product.body.price === 135000 && product.body.category === 'Jeans and Leather Skirt',
  JSON.stringify(product.body?.price),
);

const newest = await json('/api/products/crystal-bow-denim-skirt');
check(
  'bestseller seeded',
  newest.status === 200 && newest.body.price === 88000 && newest.body.badge === 'BESTSELLER',
  `${newest.status} ${newest.body?.price}`,
);

const collections = await json('/api/collections');
check('collections grouped', collections.status === 200 && collections.body.length === 3, JSON.stringify(collections.body?.length));

const stamp = Date.now();
const buyerEmail = `ada+smoke-${stamp}@shes-stylish.test`;
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
    customer: { name: 'Ada Adebayo', phone: '+234 801 234 5678', email: buyerEmail },
  }),
});

check('order created', order.status === 201, `${order.status} ${JSON.stringify(order.body?.error)}`);
check('order id format', /^SS-\d+$/.test(order.body?.id ?? ''), order.body?.id);
check('tracking format', /^NG-\d+-4821$/.test(order.body?.tracking ?? ''), order.body?.tracking);
check('subtotal', order.body?.subtotal === 146000, `${order.body?.subtotal}`);
check('discount 10%', order.body?.discount === 14600, `${order.body?.discount}`);
check('express delivery', order.body?.delivery === 7500, `${order.body?.delivery}`);
check('total', order.body?.total === 138900, `${order.body?.total}`);
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

const reviewProduct = 'crystal-bow-denim-skirt';
const before = await json(`/api/products/${reviewProduct}/reviews`);
check(
  'reviews read',
  before.status === 200 && typeof before.body?.summary?.count === 'number' && Array.isArray(before.body?.entries),
  `${before.status}`,
);
const startCount = before.body?.summary?.count ?? 0;

const missingReviews = await json('/api/products/not-a-piece/reviews');
check('reviews 404 for unknown piece', missingReviews.status === 404, `${missingReviews.status}`);

const postReview = (payload) =>
  json(`/api/products/${reviewProduct}/reviews`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

const created = await postReview({ name: 'Smoke Buyer', email: buyerEmail, rating: 5, body: 'The bows catch the light and the split walks well.' });
check('review accepted', created.status === 201 && created.body?.entry?.rating === 5, `${created.status}`);
check('buyer is badged verified', created.body?.entry?.verified === true, `${created.body?.entry?.verified}`);
check('aggregate includes new review', created.body?.summary?.count === startCount + 1, `${created.body?.summary?.count}`);

const duplicate = await postReview({ name: 'Smoke Buyer', email: buyerEmail.toUpperCase(), rating: 4, body: 'Trying a second review with the same address.' });
check('one review per buyer', duplicate.status === 409 && duplicate.body?.error === 'already_reviewed', `${duplicate.status}`);

const badRating = await postReview({ name: 'Smoke Buyer', email: `smoke-bad-${stamp}@shes-stylish.test`, rating: 9, body: 'Rating is out of range on purpose.' });
check('rejects bad rating', badRating.status === 400 && badRating.body?.error === 'invalid_rating', `${badRating.status}`);

const shortBody = await postReview({ name: 'Smoke Buyer', email: `smoke-short-${stamp}@shes-stylish.test`, rating: 4, body: 'Too short' });
check('rejects short review', shortBody.status === 400 && shortBody.body?.error === 'review_too_short', `${shortBody.status}`);

const stranger = await postReview({ name: 'Smoke Guest', email: `smoke-guest-${stamp}@shes-stylish.test`, rating: 3, body: 'Lovely wash, though I sized up for the split.' });
check('guest review accepted', stranger.status === 201, `${stranger.status}`);
check('guest not badged', stranger.body?.entry?.verified === false, `${stranger.body?.entry?.verified}`);

const guarded = await json('/api/admin/reviews');
check('review moderation requires key', guarded.status === 401, `${guarded.status}`);

const queue = await json('/api/admin/reviews', { headers: { 'x-admin-key': ADMIN_KEY } });
const mine = (queue.body ?? []).filter(
  (r) => r.email === buyerEmail || r.email === `smoke-guest-${stamp}@shes-stylish.test`,
);
check('admin sees both reviews', queue.status === 200 && mine.length === 2, `${mine.length}`);

for (const entry of mine) {
  const hide = await json(`/api/admin/reviews/${entry.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', 'x-admin-key': ADMIN_KEY },
    body: JSON.stringify({ status: 'hidden' }),
  });
  check(`hide review ${entry.id}`, hide.status === 200 && hide.body.status === 'hidden', `${hide.status}`);
}

const after = await json(`/api/products/${reviewProduct}/reviews`);
check('hidden reviews leave the shop', after.body?.summary?.count === startCount, `${after.body?.summary?.count}`);

const hiddenAgain = await json('/api/admin/reviews/999999', {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', 'x-admin-key': ADMIN_KEY },
  body: JSON.stringify({ status: 'hidden' }),
});
check('unknown review is 404', hiddenAgain.status === 404, `${hiddenAgain.status}`);

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
