import { randomUUID } from 'node:crypto';
import { connection } from 'next/server';
import { createOrder, listOrders } from '../../data/order-store';
import { validateNewOrder } from '../../data/order-validation';

export async function GET() {
  await connection();
  return Response.json({ orders: listOrders() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const result = validateNewOrder(body);
  if (!result.success) {
    return Response.json({ error: result.message }, { status: 400 });
  }

  const order = createOrder(randomUUID(), result.value);
  return Response.json({ order }, { status: 201 });
}
