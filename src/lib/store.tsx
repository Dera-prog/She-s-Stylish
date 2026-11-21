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

export type OrderLine = {
  key: string;
  id: string;
  name?: string;
  size: string;
  colour: string;
  qty: number;
  price?: number;
};

export type Order = {
  id: string;
  date: string;
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: OrderStatus;
  tracking: string;
  address: string;
  method: 'standard' | 'express';
};

export type User = { name: string; email: string; phone: string };

export type Address = {
  id: string;
  label: string;
  line: string;
  city: string;
  state: string;
  phone: string;
};

type State = {
  user: User | null;
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  promo: string | null;
  addresses: Address[];
  defaultAddress: string | null;
};

const initialState: State = {
  user: null,
  cart: [],
  wishlist: [],
  orders: [],
  promo: null,
  addresses: [],
  defaultAddress: null,
};

type Action =
  | { type: 'add'; id: string; size: string; colour: string }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'wish'; id: string }
  | { type: 'promo'; code: string | null }
  | { type: 'order'; order: Order }
  | { type: 'orders'; orders: Order[] }
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'address'; address: Address }
  | { type: 'unaddress'; id: string }
  | { type: 'defaultAddress'; id: string | null };

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
    case 'orders': {
      const fresh = new Map(action.orders.map((o) => [o.id, o]));
      const known = new Set(state.orders.map((o) => o.id));
      return {
        ...state,
        orders: [
          ...action.orders.filter((o) => !known.has(o.id)),
          ...state.orders.map((o) => (fresh.has(o.id) ? { ...o, ...fresh.get(o.id) } : o)),
        ],
      };
    }
    case 'login':
      return { ...state, user: action.user };
    case 'logout':
      return { ...state, user: null, orders: [] };
    case 'address': {
      const exists = state.addresses.some((a) => a.id === action.address.id);
      const addresses = exists
        ? state.addresses.map((a) => (a.id === action.address.id ? action.address : a))
        : [...state.addresses, action.address];
      return {
        ...state,
        addresses,
        defaultAddress: state.defaultAddress ?? action.address.id,
      };
    }
    case 'unaddress': {
      const addresses = state.addresses.filter((a) => a.id !== action.id);
      return {
        ...state,
        addresses,
        defaultAddress:
          state.defaultAddress === action.id ? (addresses[0]?.id ?? null) : state.defaultAddress,
      };
    }
    case 'defaultAddress':
      return { ...state, defaultAddress: action.id };
    default:
      return state;
  }
}

const KEY = 'shes-stylish-v2';

function loadState(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      user: parsed.user ?? null,
      cart: (Array.isArray(parsed.cart) ? parsed.cart : []).filter((line) => Boolean(byId(line.id))),
      wishlist: (Array.isArray(parsed.wishlist) ? parsed.wishlist : []).filter((id) =>
        Boolean(byId(id)),
      ),
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      promo: parsed.promo ?? null,
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
      defaultAddress: parsed.defaultAddress ?? null,
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

export const orderSteps: { key: OrderStatus; label: string; note: string }[] = [
  { key: 'placed', label: 'Order placed', note: 'Your pieces are reserved.' },
  { key: 'processing', label: 'Processing', note: 'We are preparing your pieces.' },
  { key: 'shipped', label: 'Shipped', note: 'Handed to our delivery partner.' },
  { key: 'out', label: 'Out for delivery', note: 'With your rider across Lagos.' },
  { key: 'delivered', label: 'Delivered', note: 'Signed for, with care.' },
];
