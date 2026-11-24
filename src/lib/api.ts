import type { Order, OrderLine, OrderStatus } from './store';

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';
export const ADMIN_KEY_STORE = 'shes-admin-key';

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code?: string) {
    super(code ?? 'request_failed');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, 'unreachable');
  }
  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ApiError(res.status || 0, 'unavailable');
  }
  if (!res.ok) {
    const code = typeof body === 'object' && body && 'error' in body ? String((body as { error: unknown }).error) : undefined;
    throw new ApiError(res.status, code);
  }
  return body as T;
}

type ApiLine = {
  id: string;
  name?: string;
  size: string;
  colour: string;
  qty: number;
  price?: number;
};

type ApiOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  method: 'standard' | 'express';
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  tracking: string;
  address: string;
  lines: ApiLine[];
};

const lineKey = (line: ApiLine) => `${line.id}|${line.size}|${line.colour}`;

export function toOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    date: order.date,
    status: order.status,
    method: order.method,
    subtotal: order.subtotal,
    discount: order.discount,
    delivery: order.delivery,
    total: order.total,
    tracking: order.tracking,
    address: order.address,
    lines: order.lines.map<OrderLine>((line) => ({
      key: lineKey(line),
      id: line.id,
      name: line.name,
      size: line.size,
      colour: line.colour,
      qty: line.qty,
      price: line.price,
    })),
  };
}

export type NewOrder = {
  items: { id: string; size: string; colour: string; qty: number }[];
  method: 'standard' | 'express';
  promo: string | null;
  address: string;
  customer: { name: string; email: string; phone: string };
};

export async function createOrder(payload: NewOrder): Promise<Order> {
  return toOrder(await request<ApiOrder>('/orders', { method: 'POST', body: JSON.stringify(payload) }));
}

export async function fetchOrder(id: string): Promise<Order> {
  return toOrder(await request<ApiOrder>(`/orders/${encodeURIComponent(id)}`));
}

export type AdminOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  method: 'standard' | 'express';
  total: number;
  address: string;
  pieces: number;
};

export async function fetchAdminOrders(key: string): Promise<AdminOrder[]> {
  return request<AdminOrder[]>('/admin/orders', { headers: { 'x-admin-key': key } });
}

export async function advanceOrder(key: string, id: string, status: OrderStatus): Promise<Order> {
  return toOrder(
    await request<ApiOrder>(`/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'x-admin-key': key },
      body: JSON.stringify({ status }),
    }),
  );
}

export async function sendMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  await request<{ ok: boolean }>('/contact', { method: 'POST', body: JSON.stringify(payload) });
}

export type ReviewSummary = { count: number; average: number; recommend: number | null };

export type Review = {
  id: number;
  name: string;
  rating: number;
  body: string;
  date: string;
  verified: boolean;
};

export type ReviewBundle = { summary: ReviewSummary; entries: Review[] };

export async function fetchReviews(productId: string): Promise<ReviewBundle> {
  return request<ReviewBundle>(`/products/${encodeURIComponent(productId)}/reviews`);
}

export async function submitReview(
  productId: string,
  payload: { name: string; email: string; rating: number; body: string },
): Promise<{ summary: ReviewSummary; entry: Review }> {
  return request(`/products/${encodeURIComponent(productId)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
