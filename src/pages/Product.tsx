import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BackBar, Empty, Screen, SectionHead, Stars } from '../components/Chrome';
import { ProductCard } from '../components/ProductCard';
import {
  IconArrow,
  IconBack,
  IconChevron,
  IconHeart,
  IconLock,
  IconShare,
  IconTruck,
} from '../components/Icons';
import { byId, formatN, products } from '../lib/data';
import { useStore } from '../lib/store';

function Acc({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="acc">
      <button className="acc__head" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        <span
          style={{
            transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform .25s',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <IconChevron size={14} />
        </span>
      </button>
      {open && <div className="acc__body">{children}</div>}
    </div>
  );
}

export default function ProductPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const product = byId(id);
  const { state, dispatch, toast } = useStore();
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState(product && product.sizes.length === 1 ? product.sizes[0] : '');
  const [open, setOpen] = useState<string | null>('details');
  const [slide, setSlide] = useState(1);

  if (!product) {
    return (
      <Screen nonav>
        <BackBar title="Not found" />
        <Empty
          title="This piece has moved."
          copy="It may have sold out or been archived. The rest of the wardrobe is waiting."
          to="/shop"
          cta="Back to shop"
        />
      </Screen>
    );
  }

  const saved = state.wishlist.includes(product.id);
  const related = products
    .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
    .slice(0, 4);

  const add = (buyNow = false) => {
    if (!size) {
      toast('Select a size first');
      return;
    }
    dispatch({ type: 'add', id: product.id, size, colour: product.colours[colour].name });
    toast('Added to your bag');
    if (buyNow) nav('/bag');
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.desc, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast('Link copied');
      }
    } catch {
      /* user dismissed */
    }
  };

  return (
    <Screen nonav>
      <div className="gallery">
        <div
          className="gallery__track"
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth) + 1);
          }}
        >
          <div className="gallery__slide">
            <img src={product.image} alt={product.name} />
          </div>
          {product.model && (
            <div className="gallery__slide gallery__slide--model">
              <img src={product.model} alt={`${product.name} on the model`} />
            </div>
          )}
        </div>
        <div className="gallery__bar">
          <button className="iconbtn iconbtn--glass" aria-label="Back" onClick={() => nav(-1)}>
            <IconBack size={18} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="iconbtn iconbtn--glass"
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={saved}
              onClick={() => {
                dispatch({ type: 'wish', id: product.id });
                toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
              }}
            >
              <IconHeart size={17} filled={saved} />
            </button>
            <button className="iconbtn iconbtn--glass" aria-label="Share" onClick={share}>
              <IconShare size={16} />
            </button>
          </div>
        </div>
        <div className="gallery__count">
          {slide} / {product.model ? 2 : 1}
        </div>
      </div>

      <div className="pdp">
        <div className="pdp__top">
          <div>
            <div className="eyebrow">{product.collection}</div>
            <h1 className="pdp__name">{product.name}</h1>
          </div>
        </div>
        <div className="pdp__price">{formatN(product.price)}</div>
        <div className="pdp__rating">
          <Stars value={product.rating} />
          <span>
            {product.rating} · {product.reviews} reviews
          </span>
        </div>

        <div className="pdp__row">
          <span className="pdp__label">Colour</span>
          <span className="pdp__label" style={{ textTransform: 'none', letterSpacing: '0.04em' }}>
            {product.colours[colour].name}
          </span>
        </div>
        <div className="swatches">
          {product.colours.map((c, i) => (
            <button
              key={c.name}
              className={`swatch ${i === colour ? 'swatch--on' : ''}`}
              style={{ background: c.hex }}
              aria-label={c.name}
              aria-pressed={i === colour}
              onClick={() => setColour(i)}
            />
          ))}
        </div>

        <div className="pdp__row">
          <span className="pdp__label">Size</span>
          <Link className="textlink" to="/size-guide">
            Size guide
          </Link>
        </div>
        <div className="sizes">
          {product.sizes.map((s) => (
            <button
              key={s}
              className={`size ${s === size ? 'size--on' : ''}`}
              aria-pressed={s === size}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="stock">In stock · ships within 24 hours</div>

        <Acc
          title="The details"
          open={open === 'details'}
          onToggle={() => setOpen(open === 'details' ? null : 'details')}
        >
          <p style={{ margin: 0 }}>{product.desc}</p>
          <div style={{ marginTop: 10, fontSize: 9, letterSpacing: '0.06em', color: '#9a8e80' }}>
            {product.fabric} · {product.care}
          </div>
        </Acc>
        <Acc
          title="Size & fit"
          open={open === 'fit'}
          onToggle={() => setOpen(open === 'fit' ? null : 'fit')}
        >
          <table className="sizetable">
            <thead>
              <tr>
                <th>Size</th>
                <th>Bust (cm)</th>
                <th>Waist (cm)</th>
                <th>Hip (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>XS</td>
                <td>80–84</td>
                <td>62–66</td>
                <td>88–92</td>
              </tr>
              <tr>
                <td>S</td>
                <td>84–88</td>
                <td>66–70</td>
                <td>92–96</td>
              </tr>
              <tr>
                <td>M</td>
                <td>88–92</td>
                <td>70–74</td>
                <td>96–100</td>
              </tr>
              <tr>
                <td>L</td>
                <td>92–98</td>
                <td>74–80</td>
                <td>100–106</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>98–104</td>
                <td>80–86</td>
                <td>106–112</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 10, fontSize: 9, color: '#9a8e80' }}>
            Fits true to size. Between sizes? Take the larger — the cut is considered, not tight.
          </div>
        </Acc>
        <Acc
          title="Delivery & returns"
          open={open === 'delivery'}
          onToggle={() => setOpen(open === 'delivery' ? null : 'delivery')}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <IconTruck size={18} />
            <span>
              Lagos standard delivery in 2–4 working days (₦3,500). Express next-day available at
              checkout (₦7,500). Nationwide delivery in 3–7 working days.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <IconLock size={16} />
            <span>
              Complimentary returns within 7 days on unworn pieces with tags attached. Request a
              return from your order page.
            </span>
          </div>
        </Acc>

        <div className="divider-label">Reviews</div>
        <div className="ratingbox">
          <div>
            <b>{product.rating}</b>
            <span>{product.reviews} reviews</span>
          </div>
          <div style={{ flex: 1 }}>
            <Stars value={product.rating} size={12} />
            <div style={{ marginTop: 6, fontSize: 9, color: '#8a7e71' }}>
              94% would recommend · verified buyers
            </div>
          </div>
        </div>
        <div className="review">
          <div className="review__head">
            <b>Amaka O.</b>
            <span>Verified · 2 weeks ago</span>
          </div>
          <p>
            &ldquo;The fabric is weightier than I expected in the best way. It holds its shape and
            the fit is exactly as described.&rdquo;
          </p>
        </div>
        <div className="review">
          <div className="review__head">
            <b>Ifeoma A.</b>
            <span>Verified · 1 month ago</span>
          </div>
          <p>
            &ldquo;Wore it to a board meeting and then to dinner. It did both jobs beautifully.&rdquo;
          </p>
        </div>
      </div>

      <SectionHead title="Complete the look" to="/shop" link="Shop all" />
      <div className="hscroll">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="dock">
        <button
          className={`dock__icon ${saved ? 'dock__icon--on' : ''}`}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={() => {
            dispatch({ type: 'wish', id: product.id });
            toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
          }}
        >
          <IconHeart size={19} filled={saved} />
        </button>
        <button className="btn" onClick={() => add()}>
          <span>Add to bag · {formatN(product.price)}</span>
          <IconArrow size={16} />
        </button>
      </div>
    </Screen>
  );
}
