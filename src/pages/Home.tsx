import { Link } from 'react-router-dom';
import { AppHead, Screen, SectionHead, MARK_INK } from '../components/Chrome';
import { ProductCard } from '../components/ProductCard';
import { IconArrow, IconSearch } from '../components/Icons';
import { categories, products } from '../lib/data';
import { useStore } from '../lib/store';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { state } = useStore();
  const first = state.user?.name.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const newIn = products.filter((p) => p.badge === 'NEW').slice(0, 4);
  const wanted = products.filter((p) => p.badge === 'BESTSELLER');

  return (
    <Screen>
      <AppHead />
      <div className="greet">
        <div className="micro">{today} · Lagos</div>
        <h1>
          {greeting()}, <em>{first}</em>.
        </h1>
      </div>

      <Link className="searchbar" to="/search" style={{ marginTop: 16 }}>
        <IconSearch size={16} />
        <span>Search silk, aso oke, leather…</span>
      </Link>

      <Link className="hero" to="/collection/soft-power">
        <img className="hero__img" src="/assets/model-office.png" alt="" />
        <div className="hero__grad" />
        <div className="hero__eyebrow">New season · The Soft Power Edit</div>
        <div className="hero__copy">
          <h2>
            Power,
            <br />
            <em>softened.</em>
          </h2>
          <span className="hero__link">
            Discover the edit <IconArrow size={13} />
          </span>
        </div>
      </Link>

      <div className="chips">
        {categories.map((c, i) => (
          <Link
            key={c.name}
            className={`chip ${i === 0 ? 'chip--soft' : ''}`}
            to={c.name === 'All pieces' ? '/shop' : `/shop/category/${encodeURIComponent(c.name)}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <SectionHead title="New in" to="/browse/new" />
      <div className="grid2">
        {newIn.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <SectionHead title="Most wanted" to="/browse/best" link="Shop best sellers" />
      <div className="hscroll">
        {wanted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <Link className="edit-banner" to="/collection/boardroom">
        <img className="edit-banner__img" src="/assets/model-check.png" alt="" />
        <div className="edit-banner__body">
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>
            The Boardroom Edit
          </div>
          <h3>
            Tailored,
            <br />
            never tamed.
          </h3>
          <p>
            Prince-of-Wales check, chocolate silk and a gold-capped heel that means business.
          </p>
          <span className="link-arrow">
            Shop the edit <IconArrow size={13} />
          </span>
        </div>
      </Link>

      <Link className="piece" to="/collection/lavender" style={{ marginTop: 16 }}>
        <img src="/assets/model-lavender.png" alt="" />
        <div className="piece__body">
          <div className="micro">Lavender Hour</div>
          <h3>A little joy, elegantly worn.</h3>
        </div>
        <span className="piece__arrow">
          <IconArrow size={15} />
        </span>
      </Link>

      <div className="homefoot">
        <div className="micro" style={{ marginBottom: 10 }}>
          The house of
        </div>
        <div className="wordmark">She&rsquo;s Stylish</div>
        <p>&ldquo;For the woman who dresses for herself.&rdquo;</p>
        <div className="micro" style={{ marginTop: 16 }}>
          Lagos · Abuja · Port Harcourt
        </div>
        <img src={MARK_INK} alt="" style={{ width: 34, margin: '22px auto 0', opacity: 0.32 }} />
      </div>
    </Screen>
  );
}
