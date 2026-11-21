import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BackBar, Screen, TitleHead } from '../components/Chrome';
import { IconArrow, IconSearch, IconSparkle } from '../components/Icons';
import { formatN, products } from '../lib/data';
import { useStore, type OrderStatus } from '../lib/store';

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
  const { state, dispatch, toast } = useStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [q, setQ] = useState('');

  const revenue = state.orders.reduce((n, o) => n + o.total, 0);
  const aov = state.orders.length ? Math.round(revenue / state.orders.length) : 0;
  const sold = state.orders.reduce((n, o) => n + o.lines.reduce((m, l) => m + l.qty, 0), 0);

  const catalogue = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) =>
      [p.name, p.category, p.sub, p.collection].join(' ').toLowerCase().includes(term),
    );
  }, [q]);

  if (!state.user) {
    return (
      <Screen>
        <BackBar title="Store admin" />
        <div className="empty">
          <img className="empty__mark" src="/assets/logo-mark-ink.png" alt="" />
          <h2>For the house only.</h2>
          <p>Sign in to manage orders, inventory and the storefront.</p>
          <Link className="btn" to="/login">
            <span>Sign in</span>
            <IconArrow size={15} />
          </Link>
        </div>
      </Screen>
    );
  }

  const advance = (id: string, status: OrderStatus) => {
    const next = nextStatus[status];
    if (!next) {
      toast('Order already delivered');
      return;
    }
    dispatch({ type: 'orderstatus', id, status: next });
    toast(`${id} · ${label[next]}`);
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
              <span>{state.orders.length} orders placed</span>
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
              <div className="micro">Wishlist saves</div>
              <b>{state.wishlist.length}</b>
              <span>Saved by this customer</span>
            </div>
          </div>

          <div className="divider-label">Recent orders</div>
          {state.orders.length === 0 ? (
            <div className="notice" style={{ margin: '12px 22px 0' }}>
              <b>No orders yet.</b> Place a demo order from the storefront and it will appear here
              instantly — statuses can then be advanced from the Orders tab.
            </div>
          ) : (
            <div className="profile__orders" style={{ marginTop: 12 }}>
              {state.orders.slice(0, 3).map((o) => (
                <Link className="profile__order" key={o.id} to={`/track/${o.id}`}>
                  <div>
                    <b>{o.id}</b>
                    {o.lines.length} pieces · {formatN(o.total)}
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
              <span>Across 6 categories</span>
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
          <TitleHead
            title="Orders"
            eyebrow="Fulfilment queue"
          />
          {state.orders.length === 0 ? (
            <div className="notice" style={{ margin: '16px 22px 0' }}>
              <b>The queue is clear.</b> New orders appear the moment checkout completes.
            </div>
          ) : (
            <div className="tbl" style={{ marginTop: 16 }}>
              {state.orders.map((o) => (
                <div className="tbl__row" key={o.id} style={{ gridTemplateColumns: '1fr auto' }}>
                  <div>
                    <b>{o.id}</b>
                    <span style={{ display: 'block', marginTop: 3, fontSize: 8.5 }}>
                      {new Date(o.date).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      · {o.lines.length} pieces · {o.address.split(',')[0]}
                    </span>
                  </div>
                  <div style={{ display: 'grid', justifyItems: 'end', gap: 6 }}>
                    <span className="price">{formatN(o.total)}</span>
                    <button
                      className={`status ${o.status === 'delivered' ? 'status--gold' : 'status--ink'}`}
                      onClick={() => advance(o.id, o.status)}
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
