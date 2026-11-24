import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  IconArrow,
  IconBack,
  IconBag,
  IconBell,
  IconChevron,
  IconGrid,
  IconHeart,
  IconHome,
  IconSearch,
  IconUser,
} from './Icons';
import { useStore } from '../lib/store';

export const MARK = '/assets/logo-mark.png';
export const MARK_INK = '/assets/logo-mark-ink.png';

export function Screen({
  children,
  nonav = false,
  className = '',
}: {
  children: ReactNode;
  nonav?: boolean;
  className?: string;
}) {
  return <div className={`page ${nonav ? 'page--nonav' : ''} ${className}`}>{children}</div>;
}

export function AppHead({ sub = 'Luxury womenswear · Lagos' }: { sub?: string }) {
  const { cartCount } = useStore();
  return (
    <header className="apphead">
      <div>
        <Link to="/home" className="wordmark">
          She&rsquo;s Stylish
        </Link>
        <div className="apphead__sub">{sub}</div>
      </div>
      <div className="headicons">
        <Link className="iconbtn" to="/search" aria-label="Search">
          <IconSearch size={19} />
        </Link>
        <Link className="iconbtn" to="/notifications" aria-label="Notifications">
          <IconBell size={19} />
          <span className="dot" />
        </Link>
        <Link className="iconbtn" to="/bag" aria-label={`Shopping bag, ${cartCount} items`}>
          <IconBag size={19} />
          {cartCount > 0 && <span className="dot" />}
        </Link>
      </div>
    </header>
  );
}

export function TitleHead({
  title,
  eyebrow,
  right,
}: {
  title: ReactNode;
  eyebrow?: string;
  right?: ReactNode;
}) {
  return (
    <div className="pagetitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div>
        {eyebrow && <div className="micro" style={{ marginTop: 0, marginBottom: 9 }}>{eyebrow}</div>}
        <h1>{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function SectionHead({
  title,
  to,
  link = 'View all',
}: {
  title: string;
  to?: string;
  link?: string;
}) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {to && (
        <Link className="link" to={to}>
          {link}
        </Link>
      )}
    </div>
  );
}

export function BackBar({
  title,
  right,
  to,
}: {
  title?: ReactNode;
  right?: ReactNode;
  to?: string;
}) {
  const nav = useNavigate();
  return (
    <div className="backbar">
      <button
        className="iconbtn"
        aria-label="Back"
        onClick={() => (to ? nav(to) : nav(-1))}
      >
        <IconBack />
      </button>
      {title && <div className="backbar__center">{title}</div>}
      <div style={{ minWidth: 38, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

export function Empty({
  title,
  copy,
  to,
  cta,
}: {
  title: string;
  copy: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="empty">
      <img className="empty__mark" src={MARK_INK} alt="" />
      <h2>{title}</h2>
      <p>{copy}</p>
      <Link className="btn" to={to}>
        <span>{cta}</span>
        <IconArrow size={15} />
      </Link>
    </div>
  );
}

const TABS = [
  { to: '/home', label: 'Home', icon: IconHome },
  { to: '/shop', label: 'Shop', icon: IconGrid },
  { to: '/wishlist', label: 'Wishlist', icon: IconHeart },
  { to: '/bag', label: 'Bag', icon: IconBag },
  { to: '/profile', label: 'Profile', icon: IconUser },
];

export function BottomNav() {
  const { cartCount, state } = useStore();
  return (
    <nav className="tabbar" aria-label="Primary">
      {TABS.map((t) => {
        const Icon = t.icon;
        const badge =
          t.to === '/bag' ? cartCount : t.to === '/wishlist' ? state.wishlist.length : 0;
        return (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) => `tab ${isActive ? 'tab--on' : ''}`}
          >
            <Icon size={20} />
            <span>{t.label}</span>
            {badge > 0 && <span className="tab__badge">{badge}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function Toast() {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;
  return <div className="toast">{toastMessage}</div>;
}

export function Stars({ value, size = 9 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  return (
    <span
      className="stars"
      style={{ fontSize: size }}
      role="img"
      aria-label={`${value} out of 5`}
    >
      {'★★★★★'}
      <span className="stars__fill" style={{ width: `${pct}%` }} aria-hidden="true">
        {'★★★★★'}
      </span>
    </span>
  );
}

export function LinkRow({
  label,
  to,
  icon,
  onClick,
}: {
  label: string;
  to?: string;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  const body = (
    <>
      {icon}
      <span>{label}</span>
      <IconChevron size={15} className="chev" />
    </>
  );
  if (to) {
    return (
      <Link className="list__row" to={to}>
        {body}
      </Link>
    );
  }
  return (
    <button className="list__row" onClick={onClick}>
      {body}
    </button>
  );
}
