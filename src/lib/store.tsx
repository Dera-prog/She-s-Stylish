import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { byId } from './data';

export type CartLine = { key: string; id: string; size: string; colour: string; qty: number };
export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'out' | 'delivered';

export type Order = {
  id: string;
  date: string;
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: OrderStatus;
  tracking: string;
  address: string;
  method: 'standard' | 'express';
};

type User = { name: string; email: string; phone: string };

type State = {
  user: User | null;
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  promo: string | null;
};

const initialState: State = {
  user: { name: 'Ada Adebayo', email: 'ada.adebayo@example.com', phone: '+234 801 234 5678' },
  cart: [],
  wishlist: ['ribbed-navy-dress', 'espresso-bag'],
  orders: [],
  promo: null,
};

type Action =
  | { type: 'add'; id: string; size: string; colour: string }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'wish'; id: string }
  | { type: 'promo'; code: string | null }
  | { type: 'order'; order: Order }
  | { type: 'orderstatus'; id: string; status: OrderStatus }
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const key = `${action.id}|${action.size}|${action.colour}`;
      const existing = state.cart.find((l) => l.key === key);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + 1) } : l)),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { key, id: action.id, size: action.size, colour: action.colour, qty: 1 }],
      };
    }
    case 'qty':
      return {
        ...state,
        cart: state.cart
          .map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l))
          .filter((l) => l.qty > 0),
      };
    case 'remove':
      return { ...state, cart: state.cart.filter((l) => l.key !== action.key) };
    case 'wish':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((w) => w !== action.id)
          : [action.id, ...state.wishlist],
      };
    case 'promo':
      return { ...state, promo: action.code };
    case 'order':
      return { ...state, orders: [action.order, ...state.orders], cart: [], promo: null };
    case 'orderstatus':
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: action.status } : o)),
      };
    case 'login':
      return { ...state, user: action.user };
    case 'logout':
      return { ...state, user: null, orders: [] };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

const KEY = 'shes-stylish-v1';

function loadState(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      user: parsed.user ?? initialState.user,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : initialState.wishlist,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      promo: parsed.promo ?? null,
    };
  } catch {
    return initialState;
  }
}

export const DELIVERY_STANDARD = 3500;
export const DELIVERY_EXPRESS = 7500;
export const PROMO_CODE = 'STYLISH10';

export function cartTotals(cart: CartLine[], promo: string | null, method: 'standard' | 'express' = 'standard') {
  const subtotal = cart.reduce((sum, line) => sum + (byId(line.id)?.price ?? 0) * line.qty, 0);
  const discount = promo === PROMO_CODE ? Math.round(subtotal * 0.1) : 0;
  const delivery = cart.length ? (method === 'express' ? DELIVERY_EXPRESS : DELIVERY_STANDARD) : 0;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

type StoreValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
  cartCount: number;
  toast: (message: string) => void;
  toastMessage: string | null;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToastMessage(null), 2200);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      dispatch,
      cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
      toast,
      toastMessage,
    }),
    [state, toast, toastMessage],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function orderNumber(existing: Order[] = []) {
  const base = 1024 + existing.length + 1;
  return `SS-${base}`;
}

export function makeOrder(
  cart: CartLine[],
  promo: string | null,
  method: 'standard' | 'express',
  existing: Order[],
  address = '12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
): Order {
  const t = cartTotals(cart, promo, method);
  const num = orderNumber(existing);
  return {
    id: num,
    date: new Date().toISOString(),
    lines: cart.map((l) => ({ ...l })),
    subtotal: t.subtotal,
    delivery: t.delivery,
    discount: t.discount,
    total: t.total,
    status: 'processing',
    tracking: `NG-${num.replace('SS-', '')}-4821`,
    address,
    method,
  };
}

export const orderSteps: { key: OrderStatus; label: string; note: string }[] = [
  { key: 'placed', label: 'Order placed', note: 'Your pieces are reserved.' },
  { key: 'processing', label: 'Processing', note: 'Payment confirmed. We are preparing your pieces.' },
  { key: 'shipped', label: 'Shipped', note: 'Handed to our delivery partner.' },
  { key: 'out', label: 'Out for delivery', note: 'With your rider across Lagos.' },
  { key: 'delivered', label: 'Delivered', note: 'Signed for, with care.' },
];
