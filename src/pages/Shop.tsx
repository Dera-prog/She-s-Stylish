import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AppHead, BackBar, Empty, Screen, SectionHead } from '../components/Chrome';
import { ProductCard } from '../components/ProductCard';
import { IconArrow, IconChevron, IconSearch } from '../components/Icons';
import { categories, collections, occasionIds, products, type Product } from '../lib/data';

type Sort = 'Curated' | 'Price · low' | 'Price · high' | 'Newest';

function sortProducts(list: Product[], sort: Sort) {
  const copy = [...list];
  if (sort === 'Price · low') copy.sort((a, b) => a.price - b.price);
  if (sort === 'Price · high') copy.sort((a, b) => b.price - a.price);
  if (sort === 'Newest') copy.sort((a, b) => Number(b.badge === 'NEW') - Number(a.badge === 'NEW'));
  return copy;
}

function SortBar({ sort, setSort }: { sort: Sort; setSort: (s: Sort) => void }) {
  const options: Sort[] = ['Curated', 'Newest', 'Price · low', 'Price · high'];
  return (
    <div className="filterbar">
      {options.map((o) => (
        <button key={o} className={`chip ${sort === o ? 'chip--on' : ''}`} onClick={() => setSort(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

const collectionModels: Record<string, string> = {
  'soft-power': '/assets/model-office.png',
  boardroom: '/assets/model-check.png',
  lavender: '/assets/model-lavender.png',
};

const collectionCopy: Record<string, { title: string; story: string }> = {
  'soft-power': {
    title: 'Denim, softened.',
    story:
      'Indigo cut clean, topstitched in red, finished with a slit that moves. The everyday power edit — structured denim and leather you can live in from morning to late.',
  },
  boardroom: {
    title: 'Sharply cut.',
    story:
      'Asymmetric hems, pinstriped peplums and a leather wrap that means business. Sharp lines and soft power, cut for a woman who sets the agenda.',
  },
  lavender: {
    title: 'A little joy, elegantly worn.',
    story:
      'Crystal bows, lilac frills and butter-soft leather. The after-hours edit, made for the softest kind of confidence.',
  },
};

function Grid({ list }: { list: Product[] }) {
  return (
    <div className="grid2" style={{ paddingTop: 18 }}>
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default function Shop() {
  return (
    <Screen>
      <AppHead sub="Explore the house" />
      <div className="pagetitle">
        <h1>Shop</h1>
        <div className="micro">The full wardrobe · {products.length} pieces</div>
      </div>

      <Link className="searchbar shopsearch" to="/search">
        <IconSearch size={16} />
        <span>Search the wardrobe</span>
      </Link>

      <SectionHead title="Categories" />
      <div className="catgrid">
        {categories.slice(1).map((c) => {
          const count = products.filter((p) => p.category === c.name).length;
          return (
            <Link
              key={c.name}
              className={`cattile${c.image ? '' : ' cattile--text'}`}
              to={`/shop/category/${encodeURIComponent(c.name)}`}
            >
              {c.image && <img src={c.image} alt="" />}
              <div className="cattile__body">
                <h3>{c.name}</h3>
                <p>{count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : 'Arriving soon'}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="divider-label">Browse</div>
      <div className="rowlist">
        <Link className="rowlist__row" to="/browse/new">
          New arrivals
          <span>
            {products.filter((p) => p.badge === 'NEW').length} pieces <IconChevron size={14} />
          </span>
        </Link>
        <Link className="rowlist__row" to="/browse/best">
          Best sellers
          <span>
            {products.filter((p) => p.badge === 'BESTSELLER').length} pieces <IconChevron size={14} />
          </span>
        </Link>
        <Link className="rowlist__row" to="/browse/occasion">
          Occasion wear
          <span>
            {occasionIds.length} pieces <IconChevron size={14} />
          </span>
        </Link>
        <Link className="rowlist__row" to="/size-guide">
          Size guide
          <span>
            Fit &amp; measurements <IconChevron size={14} />
          </span>
        </Link>
      </div>

      <SectionHead title="The edits" />
      {collections.map((c) => (
        <Link key={c.id} className="piece" to={`/collection/${c.id}`}>
          <img src={collectionModels[c.id]} alt="" />
          <div className="piece__body">
            <div className="micro">{c.note}</div>
            <h3>{c.name}</h3>
          </div>
          <span className="piece__arrow">
            <IconArrow size={15} />
          </span>
        </Link>
      ))}

      <div className="quote-block" style={{ marginBottom: 26 }}>
        <p>&ldquo;Style is a way to say who you are without having to speak.&rdquo;</p>
        <div className="micro">Rachel Zoe</div>
      </div>
    </Screen>
  );
}

export function CategoryPage() {
  const { name = '' } = useParams();
  const meta = categories.find((c) => c.name === name);
  const [sort, setSort] = useState<Sort>('Curated');

  const list = useMemo(() => {
    let base: Product[];
    if (!meta || meta.name === 'All pieces') base = products;
    else base = products.filter((p) => p.category === meta.name);
    return sortProducts(base, sort);
  }, [meta, name, sort]);

  if (!meta) return <Navigate to="/shop" replace />;

  if (list.length === 0) {
    return (
      <Screen>
        <BackBar
          title={meta.name}
          right={
            <Link className="iconbtn" to="/search" aria-label="Search">
              <IconSearch size={18} />
            </Link>
          }
        />
        <Empty
          title={`${meta.name} is arriving.`}
          copy="This line is still in the atelier. The denim and leather skirts are ready now — the rest follows soon."
          to={`/shop/category/${encodeURIComponent('Jeans and Leather Skirt')}`}
          cta="Shop jeans & leather"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BackBar
        title={meta.name}
        right={
          <Link className="iconbtn" to="/search" aria-label="Search">
            <IconSearch size={18} />
          </Link>
        }
      />
      {meta.image && (
        <div
          style={{
            position: 'relative',
            margin: '4px 22px 0',
            height: 188,
            overflow: 'hidden',
            background: 'var(--cream)',
          }}
        >
          <img
            src={meta.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(24,18,10,0.05) 30%, rgba(24,18,10,0.62))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 16,
              bottom: 14,
              right: 16,
              color: '#fffaf0',
            }}
          >
            <div className="micro" style={{ color: '#e8dcc8' }}>
              {meta.note}
            </div>
            <h2 className="display" style={{ fontSize: 28, marginTop: 6 }}>
              {meta.name}
            </h2>
          </div>
        </div>
      )}
      <div className="micro" style={{ padding: '16px 22px 0' }}>
        {list.length} {list.length === 1 ? 'piece' : 'pieces'} · prices in Naira
      </div>
      <SortBar sort={sort} setSort={setSort} />
      <Grid list={list} />
    </Screen>
  );
}

export function CollectionPage() {
  const { id = '' } = useParams();
  const collection = collections.find((c) => c.id === id);
  const [sort, setSort] = useState<Sort>('Curated');

  const list = useMemo(() => {
    if (!collection) return [];
    const base = collection.ids
      ? products.filter((p) => collection.ids!.includes(p.id))
      : products.filter((p) => p.collection === collection.name);
    return sortProducts(base, sort);
  }, [collection, sort]);

  if (!collection) return <Navigate to="/shop" replace />;

  const copy = collectionCopy[collection.id];

  return (
    <Screen>
      <BackBar
        title={collection.name}
        right={
          <Link className="iconbtn" to="/search" aria-label="Search">
            <IconSearch size={18} />
          </Link>
        }
      />
      <div
        style={{
          position: 'relative',
          margin: '4px 22px 0',
          height: 330,
          overflow: 'hidden',
          background: 'linear-gradient(170deg, #f0e5d4, #ddcbb1)',
        }}
      >
        <img
          src={collectionModels[collection.id]}
          alt=""
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -26,
            height: '112%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 24px 28px rgba(60,42,22,0.2))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(30,22,12,0.28) 0%, transparent 40%, rgba(30,22,12,0.55))',
          }}
        />
        <div style={{ position: 'absolute', left: 18, top: 18, right: 18, color: '#fbf5e9' }}>
          <div className="micro" style={{ color: '#f2e6d2' }}>
            {collection.name} · {list.length} {list.length === 1 ? 'piece' : 'pieces'}
          </div>
        </div>
        <div className="display" style={{ position: 'absolute', left: 18, bottom: 18, right: 18, fontSize: 34, color: '#fffaf1' }}>
          {copy.title}
        </div>
      </div>

      <div className="stack" style={{ paddingTop: 22 }}>
        <div className="eyebrow">The story</div>
        <p style={{ fontSize: 11.5, lineHeight: 1.75, color: '#6f6356', margin: '10px 0 0' }}>
          {copy.story}
        </p>
      </div>

      <SectionHead title="In this edit" link="All pieces" to="/shop" />
      <SortBar sort={sort} setSort={setSort} />
      <Grid list={list} />
      <div style={{ height: 16 }} />
    </Screen>
  );
}

const browseMeta: Record<string, { title: string; eyebrow: string }> = {
  new: { title: 'New arrivals', eyebrow: 'Fresh from the atelier' },
  best: { title: 'Best sellers', eyebrow: 'The pieces she keeps returning to' },
  occasion: { title: 'Occasion wear', eyebrow: 'For the evenings that matter' },
};

export function BrowsePage() {
  const { kind = '' } = useParams();
  const meta = browseMeta[kind];
  const [sort, setSort] = useState<Sort>('Curated');

  const list = useMemo(() => {
    let base: Product[] = [];
    if (kind === 'new') base = products.filter((p) => p.badge === 'NEW');
    if (kind === 'best') base = products.filter((p) => p.badge === 'BESTSELLER');
    if (kind === 'occasion')
      base = products.filter((p) => occasionIds.includes(p.id));
    return sortProducts(base, sort);
  }, [kind, sort]);

  if (!meta) return <Navigate to="/shop" replace />;

  return (
    <Screen>
      <BackBar
        title={meta.title}
        right={
          <Link className="iconbtn" to="/search" aria-label="Search">
            <IconSearch size={18} />
          </Link>
        }
      />
      <div className="pagetitle">
        <div className="micro" style={{ marginTop: 0, marginBottom: 8 }}>
          {meta.eyebrow}
        </div>
        <h1>{meta.title}</h1>
      </div>
      <div className="micro" style={{ padding: '14px 22px 0' }}>
        {list.length} {list.length === 1 ? 'piece' : 'pieces'}
      </div>
      <div style={{ height: 14 }} />
      <SortBar sort={sort} setSort={setSort} />
      <Grid list={list} />
      <div style={{ height: 16 }} />
    </Screen>
  );
}
