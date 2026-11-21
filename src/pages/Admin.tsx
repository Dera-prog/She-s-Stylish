import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BackBar, Screen, TitleHead } from '../components/Chrome';
import { IconArrow, IconSearch, IconSparkle } from '../components/Icons';
import { formatN, products, categories } from '../lib/data';
import { useStore, type OrderStatus } from '../lib/store';
import { ADMIN_KEY_STORE, ApiError, advanceOrder, fetchAdminOrders, type AdminOrder } from '../lib/api';

const label: Record<OrderStatus, string> = {
  placed: 'Order placed',
  processing: 'Processing',
  shipped: 'Shipped',
  out: 'Out for delivery',
  delivered: 'Delivered',
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  placed: 'processing',
  processing: 'shipped',
  shipped: 'out',
  out: 'delivered',
  delivered: null,
};

type Tab = 'overview' | 'orders' | 'catalogue';

export default function Admin() {
  const { dispatch, toast } = useStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [q, setQ] = useState('');
  const [key, setKey] = useState('');
  const [entry, setEntry] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const unlock = async (candidate: string) => {
    setBusy(true);
    setProblem(null);
    try {
      const list = await fetchAdminOrders(candidate);
      localStorage.setItem(ADMIN_KEY_STORE, candidate);
      setKey(candidate);
      setOrders(list);
      setUnlocked(true);
      setEntry('');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem(ADMIN_KEY_STORE);
        setProblem('That key did not match.');
      } else {
        setProblem('The order service is unavailable right now.');
      }
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORE);
    if (stored) void unlock(stored);
  }, []);

  const catalogue = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) =>
      [p.name, p.category, p.sub, p.collection].join(' ').toLowerCase().includes(term),
    );
  }, [q]);

  if (!unlocked) {
    return (
      <Screen>
        <BackBar title="Store admin" />
        <div className="empty">
          <img className="empty__mark" src="/assets/logo-mark-ink.png" alt="" />
          <h2>For the house only.</h2>
          <p>Enter the store key to manage orders and the catalogue.</p>
          <div style={{ width: '100%', maxWidth: 300 }}>
            <div className="field" style={{ textAlign: 'left' }}>
              <label htmlFor="admin-key">Store key</label>
              <input
                id="admin-key"
                type="password"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button
              className="btn"
              style={{ marginTop: 12 }}
              disabled={busy || !entry.trim()}
              onClick={() => void unlock(entry.trim())}
            >
              <span>{busy ? 'Checking…' : 'Unlock'}</span>
              <IconArrow size={15} />
            </button>
          </div>
          {problem && (
            <div className="notice" style={{ margin: '18px 0 0', textAlign: 'left' }}>
              {problem}
            </div>
          )}
        </div>
      </Screen>
    );
  }

  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const sold = orders.reduce((n, o) => n + o.pieces, 0);
  const awaiting = orders.filter((o) => o.status !== 'delivered').length;

  const advance = async (order: AdminOrder) => {
    const next = nextStatus[order.status];
    if (!next) {
      toast('Order already delivered');
      return;
    }
    try {
      const updated = await advanceOrder(key, order.id, next);
      setOrders((list) =>
        list.map((x) => (x.id === order.id ? { ...x, status: updated.status } : x)),
      );
      dispatch({ type: 'orders', orders: [updated] });
      toast(`${order.id} · ${label[next]}`);
    } catch {
      toast('Could not update the order. Try again.');
    }
  };

  return (
    <Screen>
      <BackBar title="Store admin" right={<span className="status status--gold">Live</span>} />

      <div className="profile__card" style={{ marginTop: 2 }}>
        <div className="micro">The atelier · Lagos</div>
        <h2>Store operations</h2>
        <p>Orders, catalogue and sales at a glance</p>
      </div>

      <div className="seg">
        {(['overview', 'orders', 'catalogue'] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="metricgrid" style={{ marginTop: 16 }}>
            <div className="metric">
              <div className="micro">Revenue</div>
              <b>{formatN(revenue)}</b>
              <span>{orders.length} orders placed</span>
            </div>
            <div className="metric">
              <div className="micro">Average order</div>
              <b>{formatN(aov)}</b>
              <span>Across all orders</span>
            </div>
            <div className="metric">
              <div className="micro">Pieces sold</div>
              <b>{sold}</b>
              <span>Units in orders</span>
            </div>
            <div className="metric">
              <div className="micro">Awaiting delivery</div>
              <b>{awaiting}</b>
              <span>Still in the queue</span>
            </div>
          </div>

          <div className="divider-label">Recent orders</div>
          {orders.length === 0 ? (
            <div className="notice" style={{ margin: '12px 22px 0' }}>
              <b>No orders yet.</b> Orders appear here as soon as checkout completes.
            </div>
          ) : (
            <div className="profile__orders" style={{ marginTop: 12 }}>
              {orders.slice(0, 3).map((o) => (
                <Link className="profile__order" key={o.id} to={`/track/${o.id}`}>
                  <div>
                    <b>{o.id}</b>
                    {o.pieces} pieces · {formatN(o.total)}
                  </div>
                  <span className={`pill ${o.status === 'delivered' ? 'pill--gold' : ''}`}>
                    {label[o.status]}
                  </span>
                  <IconArrow size={13} className="chev" />
                </Link>
              ))}
            </div>
          )}

          <div className="divider-label">Catalogue</div>
          <div className="metricgrid" style={{ marginTop: 12 }}>
            <div className="metric">
              <div className="micro">Live products</div>
              <b>{products.length}</b>
              <span>Across {categories.length - 1} categories</span>
            </div>
            <div className="metric">
              <div className="micro">New in</div>
              <b>{products.filter((p) => p.badge === 'NEW').length}</b>
              <span>This season</span>
            </div>
          </div>

          <div className="stack" style={{ marginTop: 18 }}>
            <button className="btn btn--ghost" onClick={() => setTab('catalogue')}>
              <span>Manage catalogue</span>
              <IconArrow size={16} />
            </button>
            <Link className="btn btn--ghost" to="/shop" style={{ marginTop: 10 }}>
              <span>View storefront</span>
              <IconSparkle size={16} />
            </Link>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          <TitleHead title="Orders" eyebrow="Fulfilment queue" />
          {orders.length === 0 ? (
            <div className="notice" style={{ margin: '16px 22px 0' }}>
              <b>The queue is clear.</b> New orders appear the moment checkout completes.
            </div>
          ) : (
            <div className="tbl" style={{ marginTop: 16 }}>
              {orders.map((o) => (
                <div className="tbl__row" key={o.id} style={{ gridTemplateColumns: '1fr auto' }}>
                  <div>
                    <b>{o.id}</b>
                    <span style={{ display: 'block', marginTop: 3, fontSize: 8.5 }}>
                      {new Date(o.date).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      · {o.pieces} pieces · {o.address.split(',')[0]}
                    </span>
                  </div>
                  <div style={{ display: 'grid', justifyItems: 'end', gap: 6 }}>
                    <span className="price">{formatN(o.total)}</span>
                    <button
                      className={`status ${o.status === 'delivered' ? 'status--gold' : 'status--ink'}`}
                      onClick={() => void advance(o)}
                    >
                      {label[o.status]} {o.status !== 'delivered' && '→'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="confirm__micro"
            style={{ marginTop: 20, marginBottom: 26, padding: '0 22px' }}
          >
            Tap a status to advance the order · updates the customer timeline
          </div>
        </>
      )}

      {tab === 'catalogue' && (
        <>
          <div className="searchbar" style={{ marginTop: 16 }}>
            <IconSearch size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the catalogue"
              aria-label="Search catalogue"
            />
          </div>
          <div className="micro" style={{ padding: '14px 22px 4px' }}>
            {catalogue.length} of {products.length} pieces
          </div>
          <div className="tbl">
            {catalogue.map((p) => (
              <Link className="tbl__row" key={p.id} to={`/product/${p.id}`} style={{ gridTemplateColumns: '1fr auto' }}>
                <span className="tbl__thumb">
                  <img src={p.image} alt="" />
                  <span style={{ minWidth: 0 }}>
                    <b style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </b>
                    <span>
                      {p.category} · {p.collection.replace('The ', '')}
                    </span>
                  </span>
                </span>
                <span style={{ display: 'grid', justifyItems: 'end', gap: 5 }}>
                  <span className="price">{formatN(p.price)}</span>
                  {p.badge ? (
                    <span className="status">{p.badge}</span>
                  ) : (
                    <span className="status">In catalogue</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
          <div
            className="confirm__micro"
            style={{ marginTop: 20, marginBottom: 26, padding: '0 22px' }}
          >
            Tap a piece to view it on the storefront
          </div>
        </>
      )}
    </Screen>
  );
}
