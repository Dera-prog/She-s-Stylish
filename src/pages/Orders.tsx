import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BackBar, Empty, Screen, TitleHead } from '../components/Chrome';
import { IconArrow, IconBag, IconCheck, IconChevron, IconTruck } from '../components/Icons';
import { byId, formatN } from '../lib/data';
import { orderSteps, useStore, type OrderStatus } from '../lib/store';

const statusLabel: Record<OrderStatus, string> = {
  placed: 'Order placed',
  processing: 'Processing',
  shipped: 'Shipped',
  out: 'Out for delivery',
  delivered: 'Delivered',
};

const statusHeading: Record<OrderStatus, string> = {
  placed: 'Order placed',
  processing: 'Being wrapped',
  shipped: 'On its way',
  out: 'Out for delivery',
  delivered: 'Delivered with care',
};

const dt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export function OrdersPage() {
  const { state } = useStore();
  return (
    <Screen>
      <BackBar title="My orders" />
      <TitleHead title="Orders" eyebrow="Every piece, accounted for" />

      {state.orders.length === 0 ? (
        <Empty
          title="No orders yet."
          copy="When you place an order it will live here, with tracking and easy returns."
          to="/browse/new"
          cta="Shop new arrivals"
        />
      ) : (
        <div className="profile__orders" style={{ marginBottom: 24 }}>
          {state.orders.map((o) => (
            <Link className="profile__order" key={o.id} to={`/track/${o.id}`}>
              <div>
                <b>{o.id}</b>
                {dt(o.date)} · {o.lines.length} {o.lines.length === 1 ? 'piece' : 'pieces'} ·{' '}
                {formatN(o.total)}
              </div>
              <span className={`pill ${o.status === 'delivered' ? 'pill--gold' : ''}`}>
                {statusLabel[o.status]}
              </span>
              <IconChevron size={14} className="chev" />
            </Link>
          ))}
        </div>
      )}

      <div className="notice" style={{ margin: '0 22px 30px' }}>
        <b>Returns, simply.</b> Request a return or exchange within 7 days of delivery from the
        order page. Pieces must be unworn with tags attached.
      </div>
    </Screen>
  );
}

export function TrackPage() {
  const { id = '' } = useParams();
  const { state } = useStore();
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Screen>
        <BackBar title="Track order" />
        <Empty
          title="That order isn't here."
          copy="It may belong to another account, or the link may be old. Your order history is a tap away."
          to="/orders"
          cta="View my orders"
        />
      </Screen>
    );
  }

  const current = orderSteps.findIndex((s) => s.key === order.status);
  const eta = new Date(
    new Date(order.date).getTime() + (order.method === 'express' ? 1 : 4) * 86400000,
  );

  return (
    <Screen>
      <BackBar title="Track order" />
      <div className="track">
        <div className="track__status">
          <h2>{statusHeading[order.status]}</h2>
          <span className={`pill ${order.status === 'delivered' ? 'pill--gold' : ''}`}>
            {statusLabel[order.status]}
          </span>
        </div>
        <div className="micro" style={{ paddingTop: 12 }}>
          {order.id} · placed {dt(order.date)}
        </div>

        <div className="timeline">
          {orderSteps.map((s, idx) => {
            const cls =
              idx < current ? 'tstep tstep--done' : idx === current ? 'tstep tstep--on' : 'tstep';
            return (
              <div className={cls} key={s.key}>
                <span className="tstep__dot">{idx < current && <IconCheck size={9} />}</span>
                <div>
                  <div className="tstep__label">{s.label}</div>
                  <div className="tstep__note">{s.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="track__box">
          <IconTruck size={20} />
          <div>
            <b>{order.tracking}</b>
            <br />
            {order.method === 'express' ? 'Express · next day' : 'Standard · 2–4 working days'} ·
            estimated {eta.toLocaleDateString('en-NG', { day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div className="track__box">
          <IconBag size={20} />
          <div>
            <b>Delivering to</b>
            <br />
            {order.address}
          </div>
        </div>
      </div>

      <div className="divider-label">In this order</div>
      <div className="bag" style={{ marginTop: 6 }}>
        {order.lines.map((l) => {
          const p = byId(l.id);
          if (!p) return null;
          return (
            <div className="line" key={l.key}>
              <Link className="line__media" to={`/product/${p.id}`}>
                <img src={p.image} alt="" />
              </Link>
              <div className="line__body">
                <Link className="line__name" to={`/product/${p.id}`}>
                  {p.name}
                </Link>
                <div className="line__meta">
                  {l.size} · {l.colour} · Qty {l.qty}
                </div>
                <div className="line__row">
                  <span className="line__edit">Wrapped in signature tissue</span>
                  <span className="line__price">{formatN(p.price * l.qty)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="sum">
          <div className="sum__row">
            <span>Subtotal</span>
            <span>{formatN(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="sum__row sum__row--save">
              <span>Discount</span>
              <span>−{formatN(order.discount)}</span>
            </div>
          )}
          <div className="sum__row">
            <span>Delivery</span>
            <span>{formatN(order.delivery)}</span>
          </div>
          <div className="sum__row sum__row--total">
            <span>Total</span>
            <span>{formatN(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="split" style={{ margin: '18px 22px 0' }}>
        <Link className="btn btn--ghost btn--sm" to={`/return/${order.id}`}>
          <span>Return or exchange</span>
        </Link>
        <Link className="btn btn--ghost btn--sm" to="/support">
          <span>Need help</span>
        </Link>
      </div>
      <div className="confirm__micro" style={{ marginBottom: 26 }}>
        Payment secured by Paystack · Support 9am–7pm WAT
      </div>
    </Screen>
  );
}

export function ReturnPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const { state, toast } = useStore();
  const order = state.orders.find((o) => o.id === id);
  const [item, setItem] = useState(order?.lines[0]?.key ?? '');
  const [reason, setReason] = useState('Size or fit');
  const [note, setNote] = useState('');

  if (!order) {
    return (
      <Screen>
        <BackBar title="Return or exchange" />
        <Empty
          title="This order isn't here."
          copy="Open your order history and choose the order you'd like to return."
          to="/orders"
          cta="View my orders"
        />
      </Screen>
    );
  }

  const submit = () => {
    toast('Return request sent');
    nav(`/track/${order.id}`);
  };

  return (
    <Screen>
      <BackBar title="Return or exchange" />
      <TitleHead title="Return, simply." eyebrow={`Order ${order.id}`} />
      <div className="stack" style={{ marginTop: 18 }}>
        <div className="eyebrow">1 · Choose the piece</div>
        <div style={{ marginTop: 10 }}>
          {order.lines.map((l) => {
            const p = byId(l.id);
            if (!p) return null;
            return (
              <button
                key={l.key}
                className={`opt ${item === l.key ? 'opt--on' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => setItem(l.key)}
              >
                <span className="opt__radio" />
                <span className="opt__body">
                  <span className="opt__title">
                    <span>{p.name}</span>
                    <span className="opt__price">{formatN(p.price)}</span>
                  </span>
                  <span className="opt__note">
                    {l.size} · {l.colour}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="eyebrow" style={{ marginTop: 22 }}>
          2 · Tell us why
        </div>
        <select
          className="select"
          style={{ marginTop: 10 }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-label="Return reason"
        >
          {['Size or fit', 'Not as expected', 'Changed my mind', 'Damaged or faulty', 'Wrong item'].map(
            (r) => (
              <option key={r}>{r}</option>
            ),
          )}
        </select>
        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="return-note">Anything else? (optional)</label>
          <textarea
            id="return-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tell us a little more"
            style={{
              width: '100%',
              minHeight: 86,
              border: '1px solid var(--line)',
              background: '#fcf8f1',
              padding: 12,
              fontSize: 11.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div className="notice" style={{ marginTop: 14 }}>
          <b>Returns within 7 days.</b> Pieces must be unworn with tags attached. We'll arrange a
          pickup in Lagos, or send a return label for other states.
        </div>

        <button className="btn" style={{ marginTop: 16 }} onClick={submit} disabled={!item}>
          <span>Submit return request</span>
          <IconArrow size={16} />
        </button>
      </div>
      <div style={{ height: 24 }} />
    </Screen>
  );
}
