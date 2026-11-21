import { useEffect } from 'react';
import { fetchOrder } from './api';
import { useStore } from './store';

export function useLiveOrders() {
  const { state, dispatch } = useStore();
  const ids = state.orders.map((o) => o.id).join(',');

  useEffect(() => {
    if (!ids) return;
    let live = true;
    Promise.allSettled(ids.split(',').map((id) => fetchOrder(id))).then((results) => {
      if (!live) return;
      const orders = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<Awaited<ReturnType<typeof fetchOrder>>>).value);
      if (orders.length) dispatch({ type: 'orders', orders });
    });
    return () => {
      live = false;
    };
  }, [ids, dispatch]);
}
