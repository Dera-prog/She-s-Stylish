import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Chrome';
import { IconArrow, IconBack, IconCheck, IconLock, IconTruck } from '../components/Icons';
import { byId, formatN } from '../lib/data';
import { cartTotals, useStore } from '../lib/store';
import { createOrder } from '../lib/api';

const STATES = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Enugu', 'Kano', 'Kaduna', 'Delta'];

export default function Checkout() {
  const nav = useNavigate();
  const { state, dispatch, toast } = useStore();
  const saved =
    state.addresses.find((a) => a.id === state.defaultAddress) ?? state.addresses[0] ?? null;
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'standard' | 'express'>('standard');
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: state.user?.name ?? '',
    phone: state.user?.phone ?? saved?.phone ?? '',
    email: state.user?.email ?? '',
    street: saved?.line ?? '',
    city: saved?.city ?? 'Lekki',
    stateName: saved?.state ?? 'Lagos',
    landmark: '',
  });

  const totals = cartTotals(state.cart, state.promo, method);
  const lines = state.cart.map((l) => ({ line: l, product: byId(l.id) })).filter((l) => l.product);

  if (state.cart.length === 0 && !placing) {
    return (
      <Screen nonav>
        <div className="backbar">
          <button className="iconbtn" onClick={() => nav('/bag')} aria-label="Back to bag">
            <IconBack />
          </button>
          <div className="backbar__center">Checkout</div>
          <div style={{ minWidth: 38 }} />
        </div>
        <div className="empty">
          <h2>Nothing to check out.</h2>
          <p>Your bag is empty. Choose a piece first and come back.</p>
          <Link className="btn" to="/shop">
            <span>Shop the wardrobe</span>
            <IconArrow size={15} />
          </Link>
        </div>
      </Screen>
    );
  }

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = () => {
    if (step === 1) {
      if (!form.name.trim() || !form.phone.trim() || !form.street.trim()) {
        toast('Add your name, phone and street');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        toast('Add an email for your receipt');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    void place();
  };

  const place = async () => {
    setPlacing(true);
    try {
      const address = [
        form.street.trim(),
        form.city.trim(),
        form.stateName,
        form.landmark.trim(),
        'Nigeria',
      ]
        .filter(Boolean)
        .join(', ');
      const order = await createOrder({
        items: state.cart.map((line) => ({
          id: line.id,
          size: line.size,
          colour: line.colour,
          qty: line.qty,
        })),
        method,
        promo: state.promo,
        address,
        customer: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
        },
      });
      dispatch({ type: 'order', order });
      const known = state.addresses.some(
        (a) => a.line === form.street.trim() && a.city === form.city.trim(),
      );
      if (!known) {
        dispatch({
          type: 'address',
          address: {
            id: `a-${Date.now()}`,
            label: 'Delivery',
            line: form.street.trim(),
            city: form.city.trim(),
            state: form.stateName,
            phone: form.phone.trim(),
          },
        });
      }
      nav(`/confirmation/${order.id}`, { replace: true });
    } catch {
      setPlacing(false);
      toast('The order could not be placed. Check your connection and try again.');
    }
  };

  return (
    <Screen nonav className="checkout">
      <div className="backbar">
        <button
          className="iconbtn"
          onClick={() => (step > 1 ? setStep(step - 1) : nav('/bag'))}
          aria-label={step > 1 ? 'Previous step' : 'Back to bag'}
        >
          <IconBack />
        </button>
        <div className="backbar__center">Checkout</div>
        <div style={{ minWidth: 38, display: 'grid', placeItems: 'center' }}>
          <IconLock size={15} />
        </div>
      </div>

      <div className="checksteps">
        {['Delivery', 'Payment', 'Review'].map((label, idx) => {
          const n = idx + 1;
          const cls =
            step > n ? 'checkstep checkstep--done' : step === n ? 'checkstep checkstep--on' : 'checkstep';
          return (
            <div key={label} className={cls}>
              <div className="checkstep__dot">{step > n ? <IconCheck size={12} /> : n}</div>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <>
          <div className="block">
            <div className="block__head">
              <h2>Delivery details</h2>
              {saved && (
                <button
                  className="link"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      street: saved.line,
                      city: saved.city,
                      stateName: saved.state,
                      phone: saved.phone || f.phone,
                    }))
                  }
                >
                  Use saved address
                </button>
              )}
            </div>
            <div className="field">
              <label htmlFor="ck-name">Full name</label>
              <input id="ck-name" value={form.name} onChange={set('name')} autoComplete="name" />
            </div>
            <div className="fieldrow">
              <div className="field">
                <label htmlFor="ck-phone">Phone</label>
                <input id="ck-phone" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="ck-email">Email</label>
                <input id="ck-email" value={form.email} onChange={set('email')} type="email" autoComplete="email" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ck-street">Street address</label>
              <input id="ck-street" value={form.street} onChange={set('street')} autoComplete="street-address" placeholder="House number and street" />
            </div>
            <div className="fieldrow">
              <div className="field">
                <label htmlFor="ck-city">City / area</label>
                <input id="ck-city" value={form.city} onChange={set('city')} />
              </div>
              <div className="field">
                <label htmlFor="ck-state">State</label>
                <select id="ck-state" className="select" value={form.stateName} onChange={set('stateName')}>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="ck-landmark">Landmark (optional)</label>
              <input id="ck-landmark" value={form.landmark} onChange={set('landmark')} placeholder="Helps the rider find you" />
            </div>
            <div className="notice" style={{ marginTop: 14 }}>
              <b>Delivering within Lagos.</b> Orders placed before 2pm are wrapped and dispatched the
              same day.
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="block">
            <div className="block__head">
              <h2>Delivery method</h2>
            </div>
            <button
              className={`opt ${method === 'standard' ? 'opt--on' : ''}`}
              style={{ width: '100%', textAlign: 'left' }}
              onClick={() => setMethod('standard')}
            >
              <span className="opt__radio" />
              <span className="opt__body">
                <span className="opt__title">
                  <span>Standard delivery</span>
                  <span className="opt__price">{formatN(3500)}</span>
                </span>
                <span className="opt__note">2–4 working days · signature on delivery</span>
              </span>
            </button>
            <button
              className={`opt ${method === 'express' ? 'opt--on' : ''}`}
              style={{ width: '100%', textAlign: 'left' }}
              onClick={() => setMethod('express')}
            >
              <span className="opt__radio" />
              <span className="opt__body">
                <span className="opt__title">
                  <span>Express delivery</span>
                  <span className="opt__price">{formatN(7500)}</span>
                </span>
                <span className="opt__note">Next day within Lagos · order before 2pm</span>
              </span>
            </button>
          </div>

          <div className="block">
            <div className="block__head">
              <h2>Payment</h2>
            </div>
            <div className="notice">
              <b>Pay on delivery.</b> Settle by card or cash with the rider when your pieces arrive.
              Nothing is charged now.
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="block">
            <div className="block__head">
              <h2>Your order</h2>
              <Link className="link" to="/bag">
                Edit bag
              </Link>
            </div>
            <div className="orderlines">
              {lines.map(({ line, product }) =>
                product ? (
                  <div className="orderline" key={line.key}>
                    <img src={product.image} alt="" />
                    <div>
                      <b>{product.name}</b>
                      <div style={{ marginTop: 3 }}>
                        {line.size} · {line.colour} · Qty {line.qty}
                      </div>
                    </div>
                    <span className="orderline__price">{formatN(product.price * line.qty)}</span>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          <div className="block">
            <div className="block__head">
              <h2>Deliver to</h2>
              <button className="link" onClick={() => setStep(1)}>
                Change
              </button>
            </div>
            <div className="addresscard">
              <IconTruck size={20} />
              <div>
                <b>{form.name}</b>
                <br />
                {form.street}
                <br />
                {form.city}, {form.stateName}
                {form.landmark ? ` · ${form.landmark}` : ''}
                <br />
                {form.phone}
              </div>
            </div>
          </div>

          <div className="block">
            <div className="block__head">
              <h2>Summary</h2>
              <button className="link" onClick={() => setStep(2)}>
                {method === 'express' ? 'Express' : 'Standard'}
              </button>
            </div>
            <div className="sum" style={{ marginTop: 0 }}>
              <div className="sum__row">
                <span>Subtotal</span>
                <span>{formatN(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="sum__row sum__row--save">
                  <span>Discount · {state.promo}</span>
                  <span>−{formatN(totals.discount)}</span>
                </div>
              )}
              <div className="sum__row">
                <span>Delivery · {method}</span>
                <span>{formatN(totals.delivery)}</span>
              </div>
              <div className="sum__row sum__row--total">
                <span>Total</span>
                <span>{formatN(totals.total)}</span>
              </div>
            </div>
            <div className="terms">
              By placing this order you agree to the delivery and returns policy. Returns are
              accepted within 7 days on unworn pieces with tags attached.
            </div>
          </div>
        </>
      )}

      <div className="dock">
        <div className="dock__total">
          <span>{step === 3 ? 'Total due' : 'Estimated'}</span>
          <b>{formatN(totals.total)}</b>
        </div>
        <button className="btn" onClick={next} disabled={placing}>
          {placing ? (
            <span className="spinner" />
          ) : (
            <>
              <span>{step === 3 ? 'Place order' : 'Continue'}</span>
              <IconArrow size={16} />
            </>
          )}
        </button>
      </div>
    </Screen>
  );
}
