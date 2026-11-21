import { Link } from 'react-router-dom';
import { AppHead, Empty, Screen, TitleHead } from '../components/Chrome';
import { ProductCard } from '../components/ProductCard';
import { IconArrow, IconHeart } from '../components/Icons';
import { byId, type Product } from '../lib/data';
import { useStore } from '../lib/store';

export default function Wishlist() {
  const { state, dispatch, toast } = useStore();
  const items = state.wishlist
    .map((id) => byId(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <Screen>
      <AppHead sub="Saved for later" />
      <TitleHead
        title="Wishlist"
        eyebrow="Your edit, kept"
        right={<span className="wish__count">{items.length} saved</span>}
      />

      {items.length === 0 ? (
        <Empty
          title="Nothing saved yet."
          copy="Tap the heart on any piece to keep it here. We'll tell you if it's running low."
          to="/shop"
          cta="Find something to love"
        />
      ) : (
        <>
          <div className="grid2" style={{ paddingTop: 20 }}>
            {items.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
                <div className="wish-actions">
                  <button
                    className="btn"
                    onClick={() => {
                      dispatch({
                        type: 'add',
                        id: p.id,
                        size: p.sizes[0],
                        colour: p.colours[0].name,
                      });
                      toast('Added to your bag');
                    }}
                  >
                    Add to bag
                  </button>
                  <button
                    className="btn btn--ghost"
                    onClick={() => {
                      dispatch({ type: 'wish', id: p.id });
                      toast('Removed from wishlist');
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="wishcard">
            <img className="wishcard__mark" src="/assets/logo-mark-ink.png" alt="" />
            <div className="eyebrow">A note from the house</div>
            <h3>Your edit is a portrait.</h3>
            <p>
              Saved pieces stay here across visits. If one is nearly sold out, we&rsquo;ll let you
              know before it goes.
            </p>
            <Link className="link-arrow" to="/shop" style={{ marginTop: 18 }}>
              Keep exploring <IconArrow size={13} />
            </Link>
          </div>

          <div className="divider-label">
            <IconHeart size={12} /> Saved with care
          </div>
        </>
      )}
    </Screen>
  );
}
