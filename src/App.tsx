import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNav, Toast } from './components/Chrome';
import { IconArrow } from './components/Icons';
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import Ads from './pages/Ads';
import Home from './pages/Home';
import Shop, { BrowsePage, CategoryPage, CollectionPage } from './pages/Shop';
import ProductPage from './pages/Product';
import Wishlist from './pages/Wishlist';
import Bag from './pages/Bag';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import { OrdersPage, ReturnPage, TrackPage } from './pages/Orders';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Search from './pages/Search';
import SizeGuide from './pages/SizeGuide';
import Admin from './pages/Admin';
import {
  Addresses,
  Contact,
  EditProfile,
  Notifications,
  Preferences,
  Settings,
  Support,
} from './pages/Account';

const NAV = new Set(['/home', '/shop', '/wishlist', '/bag', '/profile']);
const NAV_PREFIX = ['/shop/', '/collection/', '/browse/'];

function App() {
  const { pathname } = useLocation();
  const showNav = NAV.has(pathname) || NAV_PREFIX.some((p) => pathname.startsWith(p));

  return (
    <div className="stage">
      <aside className="stage__note">
        <div className="micro">She&rsquo;s Stylish · Est. 2026</div>
        <h2>
          The wardrobe you were
          <br />
          promised.
        </h2>
        <p>
          A luxury womenswear boutique for Lagos — denim softened, leather cut sharp, and pieces
          that carry from the office to the evening. Enter the boutique to browse the collection or
          replay the three-act campaign.
        </p>
        <div style={{ display: 'flex', gap: 18, marginTop: 26 }}>
          <Link className="stage__link" to="/" style={{ marginTop: 0 }}>
            Replay intro <IconArrow size={12} />
          </Link>
          <Link className="stage__link" to="/home" style={{ marginTop: 0 }}>
            Enter boutique <IconArrow size={12} />
          </Link>
        </div>
      </aside>

      <div className="phone">
        <div className="viewport">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/ads" element={<Ads />} />

            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/category/:name" element={<CategoryPage />} />
            <Route path="/collection/:id" element={<CollectionPage />} />
            <Route path="/browse/:kind" element={<BrowsePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/size-guide" element={<SizeGuide />} />

            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation/:id" element={<Confirmation />} />

            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/track/:id" element={<TrackPage />} />
            <Route path="/order/:id" element={<TrackPage />} />
            <Route path="/return/:id" element={<ReturnPage />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/account/edit" element={<EditProfile />} />
            <Route path="/account/addresses" element={<Addresses />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Auth />} />

            <Route path="/search" element={<Search />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>

          {showNav && <BottomNav />}
          <Toast />
        </div>
      </div>
    </div>
  );
}

export default App;
