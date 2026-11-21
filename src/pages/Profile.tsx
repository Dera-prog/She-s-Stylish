import { Link } from 'react-router-dom';
import { AppHead, LinkRow, Screen, TitleHead } from '../components/Chrome';
import {
  IconArrow,
  IconBag,
  IconBell,
  IconGift,
  IconGrid,
  IconHeart,
  IconLock,
  IconSparkle,
  IconTruck,
  IconUser,
} from '../components/Icons';
import { formatN } from '../lib/data';
import { useStore } from '../lib/store';

const statusLabel = {
  placed: 'Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  out: 'Out for delivery',
  delivered: 'Delivered',
};

export default function Profile() {
  const { state, dispatch, toast } = useStore();
  const user = state.user;
  const latest = state.orders.slice(0, 2);

  return (
    <Screen>
      <AppHead sub="Your account" />
      <TitleHead title="Profile" eyebrow="A house of her own" />

      <div className="profile__card">
        <div className="micro">{user ? 'Member since 2026' : 'Browsing as a guest'}</div>
        <h2>{user?.name ?? 'Welcome to the house'}</h2>
        <p>{user?.email ?? 'Sign in to keep your orders and wishlist together'}</p>
        {user ? (
          <p style={{ marginTop: 4 }}>{user.phone}</p>
        ) : (
          <Link
            className="link-arrow"
            to="/login"
            style={{ color: '#f3dfbc', marginTop: 16, display: 'inline-flex' }}
          >
            Sign in <IconArrow size={13} />
          </Link>
        )}
      </div>

      <div className="profile__orders">
        <div className="profile__ordershead">
          <span>Recent orders</span>
          <Link to="/orders">All orders</Link>
        </div>
        {latest.length > 0 ? (
          latest.map((o) => (
            <Link className="profile__order" key={o.id} to={`/track/${o.id}`}>
              <div>
                <b>{o.id}</b>
                {o.lines.length} {o.lines.length === 1 ? 'piece' : 'pieces'} · {formatN(o.total)}
              </div>
              <span className={`pill ${o.status === 'delivered' ? 'pill--gold' : ''}`}>
                {statusLabel[o.status]}
              </span>
              <IconArrow size={13} className="chev" />
            </Link>
          ))
        ) : (
          <Link className="profile__order profile__order--empty" to="/shop">
            No orders yet — start the season
          </Link>
        )}
      </div>

      <div className="list">
        <div className="list__label">Your account</div>
        <LinkRow label="Personal information" to="/account/edit" icon={<IconUser size={17} />} />
        <LinkRow label="Saved addresses" to="/account/addresses" icon={<IconBag size={17} />} />
        <LinkRow label="My orders" to="/orders" icon={<IconTruck size={17} />} />

        <div className="list__label" style={{ marginTop: 22 }}>
          Preferences
        </div>
        <LinkRow label="Notifications" to="/notifications" icon={<IconBell size={17} />} />
        <LinkRow label="Preferences & security" to="/preferences" icon={<IconLock size={17} />} />
        <LinkRow label="Wishlist" to="/wishlist" icon={<IconHeart size={17} />} />
        <LinkRow label="App settings" to="/settings" icon={<IconGrid size={17} />} />

        <div className="list__label" style={{ marginTop: 22 }}>
          The house
        </div>
        <LinkRow label="Help & support" to="/support" icon={<IconSparkle size={17} />} />
        <LinkRow label="Contact us" to="/contact" icon={<IconGift size={17} />} />
        <LinkRow label="Store admin (demo)" to="/admin" icon={<IconGrid size={17} />} />

        {user && (
          <LinkRow
            label="Sign out"
            icon={<IconUser size={17} />}
            onClick={() => {
              dispatch({ type: 'logout' });
              toast('Signed out');
            }}
          />
        )}

        <div className="list__foot">
          <span>She&rsquo;s Stylish · v1.0</span>
          <span>Lagos, Nigeria</span>
        </div>
      </div>
    </Screen>
  );
}
