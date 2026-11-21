import { Link } from 'react-router-dom';
import { IconHeart } from './Icons';
import { formatN, type Product } from '../lib/data';
import { useStore } from '../lib/store';

export function ProductCard({ product }: { product: Product }) {
  const { state, dispatch, toast } = useStore();
  const saved = state.wishlist.includes(product.id);
  const href = `/product/${product.id}`;

  return (
    <div className="pcard">
      <Link className="pcard__media" to={href} aria-label={product.name}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="pcard__badge">{product.badge}</span>}
      </Link>
      <button
        className={`pcard__wish ${saved ? 'pcard__wish--on' : ''}`}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
        aria-pressed={saved}
        onClick={() => {
          dispatch({ type: 'wish', id: product.id });
          toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
        }}
      >
        <IconHeart size={15} filled={saved} />
      </button>
      <Link to={href}>
        <div className="pcard__name">{product.name}</div>
        <div className="pcard__meta">{product.collection}</div>
        <div className="pcard__price">{formatN(product.price)}</div>
      </Link>
    </div>
  );
}
