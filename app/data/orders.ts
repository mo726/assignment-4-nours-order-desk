export const orderStatuses = ['Pending', 'Preparing', 'Delivered'] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  createdAt: string;
};

export type OrderInput = Omit<Order, 'id' | 'createdAt'>;

export type OrderChanges = Partial<OrderInput>;

export const productCatalogue = [
  { name: 'Vanilla Candle', suggestedPrice: 8 },
  { name: 'Cedar Candle', suggestedPrice: 10 },
  { name: 'Mini Gift Candle', suggestedPrice: 6 },
] as const;
