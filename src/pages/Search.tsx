import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { IconBack, IconChevron, IconClose, IconSearch } from '../components/Icons';
import { categories, popularSearches, products } from '../lib/data';

const RECENT_KEY = 'shes-recent';

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function Search() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>(loadRecent);

  const remember = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setRecent((prev) => {
      const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  const ql = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!ql) return [];
    return products.filter((p) =>
      [p.name, p.category, p.sub, p.collection, p.desc, ...p.colours.map((c) => c.name)]
        .join(' ')
        .toLowerCase()
        .includes(ql),
    );
  }, [ql]);

  return (
    <div className="searchpage">
      <div className="searchtop">
        <button className="iconbtn" onClick={() => nav(-1)} aria-label="Back">
          <IconBack size={20} />
        </button>
        <div className="searchbar">
          <IconSearch size={16} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ql && remember(q)}
            placeholder="Search the wardrobe"
            aria-label="Search the wardrobe"
          />
          {q && (
            <button onClick={() => setQ('')} aria-label="Clear search">
              <IconClose size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="searchbody">
        {!ql && (
          <>
            {recent.length > 0 && (
              <div className="searchhint">
                <div className="micro">Recent searches</div>
                <div className="chips" style={{ padding: 0 }}>
                  {recent.map((r) => (
                    <button
                      key={r}
                      className="chip"
                      onClick={() => {
                        setQ(r);
                        remember(r);
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="searchhint">
              <div className="micro">Popular now</div>
              <div className="chips" style={{ padding: 0 }}>
                {popularSearches.map((s) => (
                  <button
                    key={s}
                    className="chip chip--soft"
                    onClick={() => {
                      setQ(s);
                      remember(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider-label">Shop by category</div>
            <div className="rowlist" style={{ marginTop: 12 }}>
              {categories.slice(1, 5).map((c) => (
                <Link
                  key={c.name}
                  className="rowlist__row"
                  to={`/shop/category/${encodeURIComponent(c.name)}`}
                >
                  {c.name}
                  <span>
                    {c.note} <IconChevron size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        {ql && (
          <div className="searchres">
            <div className="micro" style={{ padding: '14px 22px 0' }}>
              {results.length} {results.length === 1 ? 'piece' : 'pieces'} for &ldquo;{q.trim()}&rdquo;
            </div>
            {results.length > 0 ? (
              <div className="grid2" style={{ paddingTop: 16 }}>
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="noresult">
                <h3>Nothing quite yet.</h3>
                <p style={{ fontSize: 10.5, lineHeight: 1.7 }}>
                  Try &ldquo;ribbed&rdquo;, &ldquo;leather&rdquo;, &ldquo;gold&rdquo; or a category
                  like workwear.
                </p>
                <div className="chips" style={{ justifyContent: 'center', padding: 0, flexWrap: 'wrap' }}>
                  {popularSearches.slice(0, 3).map((s) => (
                    <button key={s} className="chip" onClick={() => setQ(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
