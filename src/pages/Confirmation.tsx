import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { byId, formatN } from '../lib/data';
import { useStore } from '../lib/store';
import { IconArrow, IconCheck } from '../components/Icons';

export default function Confirmation() {
  const { id = '' } = useParams();
  const { state } = useStore();
  const order = state.orders.find((o) => o.id === id);

  return (
    <div className="confirm">
      <motion.div
        className="confirm__ring"
        initial={{ scale: 0.65, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          initial={{ scale: 0, rotate: -18 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.35 }}
        >
          <IconCheck size={34} />
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        <h1>
          It&rsquo;s <em>yours</em>.
        </h1>
        <p>
          {order
            ? 'Your order is confirmed and being wrapped in signature tissue and ribbon. We will write the moment it leaves the atelier.'
            : 'Your order is confirmed. A receipt is on its way to your inbox.'}
        </p>
        <div className="confirm__num">
          Order <b>{order?.id ?? id}</b>
        </div>
      </motion.div>

      {order && (
        <motion.div
          className="confirm__items orderlines"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {order.lines.map((l) => {
            const p = byId(l.id);
            if (!p) return null;
            return (
              <div className="orderline" key={l.key}>
                <img src={p.image} alt="" />
                <div>
                  <b>{p.name}</b>
                  <div style={{ marginTop: 3 }}>
                    {l.size} · {l.colour} · Qty {l.qty}
                  </div>
                </div>
                <span className="orderline__price">{formatN(p.price * l.qty)}</span>
              </div>
            );
          })}
          <div className="sum__row sum__row--total" style={{ border: 0 }}>
            <span>Paid</span>
            <span>{formatN(order.total)}</span>
          </div>
        </motion.div>
      )}

      <div className="confirm__actions">
        {order && (
          <Link className="btn" to={`/track/${order.id}`}>
            <span>Track your order</span>
            <IconArrow size={16} />
          </Link>
        )}
        <Link className="btn btn--ghost" to="/shop">
          <span>Continue shopping</span>
          <IconArrow size={16} />
        </Link>
      </div>

      <div className="confirm__micro">
        Signature packaging · Delivered in {order?.method === 'express' ? '1–2' : '2–4'} working days
      </div>
    </div>
  );
}
