import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHead, Empty, Screen, TitleHead } from '../components/Chrome';
import {
  IconArrow,
  IconCheck,
  IconClose,
  IconGift,
  IconLock,
  IconMinus,
  IconPlus,
} from '../components/Icons';
import { byId, formatN } from '../lib/data';
import { cartTotals, PROMO_CODE, useStore } from '../lib/store';

export default function Bag() {
  const { state, dispatch, toast, cartCount } = useStore();
  const [code, setCode] = useState('');
  const lines = state.cart
    .map((line) => ({ line, product: byId(line.id) }))
    .filter((l) => l.product);
  const totals = cartTotals(state.cart, state.promo);

  const applyPromo = () => {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      dispatch({ type: 'promo', code: PROMO_CODE });
      toast('Promo applied · 10% off');
    } else {
      toast('That code is not valid');
    }
  };

  return (
    <Screen>
      <AppHead sub="Your selection" />
      <TitleHead
        title="Shopping bag"
        eyebrow="Ready when you are"
        right={
          <span className="bag__count">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        }
      />

      {lines.length === 0 ? (
        <>
          <Empty
            title="Your bag is quiet."
            copy="Nothing chosen yet. The new season is waiting — start with the pieces everyone is asking about."
            to="/browse/best"
            cta="Shop best sellers"
          />
          <div className="quote-block">
            <p>&ldquo;Buy less, choose well, make it last.&rdquo;</p>
            <div className="micro">Vivienne Westwood</div>
          </div>
        </>
      ) : (
        <div className="bag" style={{ marginTop: 10 }}>
          {lines.map(({ line, product }) => {
            if (!product) return null;
            return (
              <div className="line" key={line.key}>
                <Link className="line__media" to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="line__body">
                  <Link to={`/product/${product.id}`} className="line__name">
                    {product.name}
                  </Link>
                  <div className="line__meta">
                    {line.size} · {line.colour}
                  </div>
                  <div className="line__row">
                    <div className="qty">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => dispatch({ type: 'qty', key: line.key, qty: line.qty - 1 })}
                      >
                        <IconMinus size={13} />
                      </button>
                      <span>{line.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => dispatch({ type: 'qty', key: line.key, qty: line.qty + 1 })}
                      >
                        <IconPlus size={13} />
                      </button>
                    </div>
                    <span className="line__price">{formatN(product.price * line.qty)}</span>
                  </div>
                  <Link className="line__edit" to={`/product/${product.id}`} style={{ display: 'inline-block', marginTop: 10 }}>
                    Edit size or colour
                  </Link>
                </div>
                <button
                  className="line__remove"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => {
                    dispatch({ type: 'remove', key: line.key });
                    toast('Removed from bag');
                  }}
                >
                  <IconClose size={15} />
                </button>
              </div>
            );
          })}

          <div className="bag__gift">
            <IconGift size={20} />
            <div>
              <b>Signature packaging, always</b>
              Wrapped in tissue and ribbon with a handwritten note. Add a gift message at checkout.
            </div>
          </div>

          <div className={`promo ${state.promo ? 'promo--on' : ''}`}>
            {state.promo ? (
              <span className="promo__tag">
                <IconCheck size={13} /> {state.promo} applied · 10% off
              </span>
            ) : (
              <>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  placeholder="Promo code"
                  aria-label="Promo code"
                />
                <button onClick={applyPromo} aria-label="Apply promo code">
                  <IconArrow size={16} />
                </button>
              </>
            )}
          </div>

          <div className="sum">
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
              <span>Delivery · standard</span>
              <span>{formatN(totals.delivery)}</span>
            </div>
            <div className="sum__row sum__row--total">
              <span>Total</span>
              <span>{formatN(totals.total)}</span>
            </div>
          </div>

          <div className="bag__cta">
            <Link className="btn" to="/checkout">
              <span>Checkout</span>
              <IconArrow size={16} />
            </Link>
          </div>
          <div className="secure">
            <IconLock size={12} /> Secure checkout · delivered across Nigeria
          </div>

          <div className="quote-block" style={{ marginBottom: 26 }}>
            <p>&ldquo;Elegance is not standing out, but being remembered.&rdquo;</p>
            <div className="micro">Giorgio Armani</div>
          </div>
        </div>
      )}
    </Screen>
  );
}
