import { connection } from 'next/server';
import { deleteOrder, getOrder, updateOrder } from '../../../data/order-store';
import { validateOrderChanges } from '../../../data/order-validation';

type OrderRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: OrderRouteContext) {
  await connection();
  const { id } = await context.params;
  const order = getOrder(id);
  if (!order) {
    return Response.json({ error: 'Order not found.' }, { status: 404 });
  }
  return Response.json({ order });
}

export async function PATCH(request: Request, context: OrderRouteContext) {
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const result = validateOrderChanges(body);
  if (!result.success) {
    return Response.json({ error: result.message }, { status: 400 });
  }

  const order = updateOrder(id, result.value);
  if (!order) {
    return Response.json({ error: 'Order not found.' }, { status: 404 });
  }
  return Response.json({ order });
}

export async function DELETE(_request: Request, context: OrderRouteContext) {
  const { id } = await context.params;
  if (!deleteOrder(id)) {
    return Response.json({ error: 'Order not found.' }, { status: 404 });
  }
  return Response.json({ deleted: true });
}
