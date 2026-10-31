import type { Order, OrderInput } from './orders';

const globalForOrders = globalThis as typeof globalThis & {
  orderDeskOrders?: Order[];
};

const orders = (globalForOrders.orderDeskOrders ??= []);

export function listOrders() {
  return [...orders].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export function getOrder(id: string) {
  return orders.find((order) => order.id === id) ?? null;
}

export function createOrder(id: string, input: OrderInput) {
  const order: Order = { ...input, id, createdAt: new Date().toISOString() };
  orders.unshift(order);
  return order;
}

export function updateOrder(id: string, changes: Partial<OrderInput>) {
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;

  orders[index] = { ...orders[index], ...changes };
  return orders[index];
}

export function deleteOrder(id: string) {
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return false;

  orders.splice(index, 1);
  return true;
}
