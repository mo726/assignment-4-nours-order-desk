'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  orderStatuses,
  productCatalogue,
  type Order,
  type OrderInput,
  type OrderStatus,
} from '../data/orders';

type FormValues = {
  customerName: string;
  phone: string;
  product: string;
  quantity: string;
  unitPrice: string;
  status: OrderStatus;
};

const emptyForm: FormValues = {
  customerName: '',
  phone: '',
  product: productCatalogue[0].name,
  quantity: '1',
  unitPrice: String(productCatalogue[0].suggestedPrice),
  status: 'Pending',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.customerName === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.product === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.unitPrice === 'number' &&
    typeof value.status === 'string' &&
    orderStatuses.includes(value.status as OrderStatus) &&
    typeof value.createdAt === 'string'
  );
}

async function responseError(response: Response) {
  const payload: unknown = await response.json().catch(() => null);
  if (isRecord(payload) && typeof payload.error === 'string') {
    return payload.error;
  }
  return `Request failed with HTTP ${response.status}.`;
}

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('/api/orders', { cache: 'no-store' });
  if (!response.ok) throw new Error(await responseError(response));

  const payload: unknown = await response.json();
  if (
    !isRecord(payload) ||
    !Array.isArray(payload.orders) ||
    !payload.orders.every(isOrder)
  ) {
    throw new Error('The orders service returned an invalid response.');
  }
  return payload.orders;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getStatusClass(status: OrderStatus) {
  if (status === 'Delivered') return 'status-delivered';
  if (status === 'Preparing') return 'status-preparing';
  return 'status-pending';
}

function OrderForm({
  order,
  busy,
  onCancel,
  onSubmit,
}: {
  order: Order | null;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (input: OrderInput) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>(
    order
      ? {
          customerName: order.customerName,
          phone: order.phone,
          product: order.product,
          quantity: String(order.quantity),
          unitPrice: String(order.unitPrice),
          status: order.status,
        }
      : emptyForm,
  );
  const [error, setError] = useState<string | null>(null);

  function change<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const quantity = Number(values.quantity);
    const unitPrice = Number(values.unitPrice);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      setError('Enter a quantity from 1 to 99.');
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setError('Enter a valid unit price of $0 or more.');
      return;
    }

    try {
      await onSubmit({
        customerName: values.customerName.trim(),
        phone: values.phone.trim(),
        product: values.product.trim(),
        quantity,
        unitPrice,
        status: order ? values.status : 'Pending',
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'The order could not be saved. Please try again.',
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void submit(event)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Customer name
          <input
            required
            maxLength={100}
            autoComplete="name"
            className="field-input"
            value={values.customerName}
            onChange={(event) => change('customerName', event.target.value)}
            placeholder="e.g. Maya Hassan"
          />
        </label>
        <label className="field-label">
          Phone number
          <input
            required
            maxLength={40}
            autoComplete="tel"
            className="field-input"
            value={values.phone}
            onChange={(event) => change('phone', event.target.value)}
            placeholder="+1 (555) 010-1234"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1.4fr_0.7fr_0.8fr]">
        <label className="field-label">
          Product
          <select
            className="field-input"
            value={values.product}
            onChange={(event) => {
              const product = productCatalogue.find(
                (item) => item.name === event.target.value,
              );
              change('product', event.target.value);
              if (!order && product) {
                change('unitPrice', String(product.suggestedPrice));
              }
            }}
          >
            {productCatalogue.map((product) => (
              <option key={product.name} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Quantity
          <input
            required
            type="number"
            min="1"
            max="99"
            step="1"
            className="field-input"
            value={values.quantity}
            onChange={(event) => change('quantity', event.target.value)}
          />
        </label>
        <label className="field-label">
          Unit price (USD)
          <input
            required
            type="number"
            min="0"
            max="1000000"
            step="0.01"
            className="field-input"
            value={values.unitPrice}
            onChange={(event) => change('unitPrice', event.target.value)}
          />
        </label>
      </div>
      {order ? (
        <label className="field-label max-w-xs">
          Status
          <select
            className="field-input"
            value={values.status}
            onChange={(event) => change('status', event.target.value as OrderStatus)}
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#eee8de] pt-4">
        <button type="button" className="button-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="button-primary" disabled={busy}>
          {busy ? 'Saving…' : order ? 'Save changes' : 'Save order'}
        </button>
      </div>
    </form>
  );
}

export function OrderDesk() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      setOrders(await fetchOrders());
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : 'Orders could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchOrders()
      .then((result) => {
        if (!cancelled) setOrders(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPageError(
            error instanceof Error ? error.message : 'Orders could not be loaded.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === 'Pending').length,
      delivered: orders.filter((order) => order.status === 'Delivered').length,
    }),
    [orders],
  );

  async function openOrder(id: string) {
    setPageError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(await responseError(response));
      const payload: unknown = await response.json();
      if (!isRecord(payload) || !isOrder(payload.order)) {
        throw new Error('The order service returned an invalid response.');
      }
      setSelectedOrder(payload.order);
      setFormMode(null);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Order details could not be loaded.');
    }
  }

  async function saveOrder(input: OrderInput) {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(
        formMode === 'edit' && selectedOrder
          ? `/api/orders/${encodeURIComponent(selectedOrder.id)}`
          : '/api/orders',
        {
          method: formMode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        },
      );
      if (!response.ok) throw new Error(await responseError(response));
      const payload: unknown = await response.json();
      if (!isRecord(payload) || !isOrder(payload.order)) {
        throw new Error('The orders service returned an invalid saved order.');
      }

      const savedOrder = payload.order;
      setSelectedOrder(savedOrder);
      setFormMode(null);
      setNotice(
        formMode === 'edit'
          ? 'Order changes saved.'
          : `Order for ${savedOrder.customerName} saved.`,
      );
      await loadOrders();
    } finally {
      setBusy(false);
    }
  }

  async function removeOrder(order: Order) {
    if (!window.confirm(`Delete the order for ${order.customerName}? This cannot be undone.`)) {
      return;
    }

    setBusy(true);
    setPageError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(await responseError(response));
      if (selectedOrder?.id === order.id) setSelectedOrder(null);
      setNotice(`Order for ${order.customerName} deleted.`);
      await loadOrders();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'The order could not be deleted.');
    } finally {
      setBusy(false);
    }
  }

  function startCreate() {
    setPageError(null);
    setNotice(null);
    setSelectedOrder(null);
    setFormMode('create');
  }

  function startEdit() {
    setPageError(null);
    setNotice(null);
    setFormMode('edit');
  }

  function closeForm() {
    setFormMode(null);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M10 11h12l1 14H9l1-14Z" />
                <path d="M13 11a3 3 0 0 1 6 0" />
                <path d="M13 17c0 2 6 2 6 4" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#907b63]">
                Nour&apos;s workspace
              </p>
              <p className="font-display text-xl font-semibold tracking-tight text-[#2e2a25]">
                Order Desk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#887f74] sm:inline">
              Candle orders, made simple
            </span>
            <button type="button" className="button-primary" onClick={startCreate}>
              <span aria-hidden="true" className="text-lg leading-none">+</span>
              New order
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <div className="hero-card">
            <p className="eyebrow text-[#ddc6a5]">YOUR ORDERS, IN ONE PLACE</p>
            <h1 className="font-display mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              A little more calm in every order.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#ded6ca]">
              Keep customer details close, know what needs preparing, and never lose track of a candle order.
            </p>
            <div className="hero-decoration" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard label="All orders" value={summary.total} tone="neutral" />
            <SummaryCard label="Pending" value={summary.pending} tone="amber" />
            <SummaryCard label="Delivered" value={summary.delivered} tone="green" />
          </div>
        </section>

        {pageError ? (
          <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e9c9c0] bg-[#fff4f1] px-4 py-3 text-sm text-[#8b3c2b]">
            <span>{pageError}</span>
            <button type="button" className="font-semibold underline" onClick={() => void loadOrders()}>
              Try again
            </button>
          </div>
        ) : null}
        {notice ? (
          <p role="status" className="mb-5 rounded-xl border border-[#d6e5d7] bg-[#f2f8f1] px-4 py-3 text-sm text-[#416d49]">
            {notice}
          </p>
        ) : null}

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
          <div className="surface-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee8de] px-5 py-5 sm:px-6">
              <div>
                <p className="eyebrow">ORDER OVERVIEW</p>
                <h2 className="font-display mt-1 text-xl font-semibold text-[#302b26]">
                  Your order list
                </h2>
              </div>
              <span className="rounded-full bg-[#f4f0e9] px-3 py-1 text-xs font-medium text-[#746a5d]">
                {summary.total} {summary.total === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {loading ? (
              <div role="status" className="space-y-3 p-6">
                <p className="text-sm text-[#81786e]">Loading your orders…</p>
                <div className="h-12 animate-pulse rounded-lg bg-[#f5f2ed]" />
                <div className="h-12 animate-pulse rounded-lg bg-[#f5f2ed]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <div aria-hidden="true" className="empty-icon">✳</div>
                <h3 className="font-display text-lg font-semibold text-[#342f29]">
                  Your order desk is ready
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#83796d]">
                  Add Nour&apos;s first order to keep the customer, candle, and next step together.
                </p>
                <button type="button" className="button-primary mt-5" onClick={startCreate}>
                  Create the first order
                </button>
              </div>
            ) : (
              <>
                <div className="hidden grid-cols-[minmax(145px,1.3fr)_minmax(135px,1fr)_70px_90px_110px] gap-3 px-6 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9084] md:grid">
                  <span>Customer</span>
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Total</span>
                  <span>Status</span>
                </div>
                <ul className="divide-y divide-[#f0ebe3]">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <button
                        type="button"
                        onClick={() => void openOrder(order.id)}
                        className={`order-row ${selectedOrder?.id === order.id ? 'order-row-selected' : ''}`}
                        aria-label={`View order for ${order.customerName}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-[#332f2a]">{order.customerName}</span>
                          <span className="mt-1 block text-xs text-[#9a9084] md:hidden">
                            {order.product} · Qty {order.quantity}
                          </span>
                          <span className="mt-1 hidden text-xs text-[#9a9084] md:block">{order.phone}</span>
                        </span>
                        <span className="hidden truncate text-sm text-[#70685e] md:block">{order.product}</span>
                        <span className="hidden text-sm text-[#70685e] md:block">{order.quantity}</span>
                        <span className="hidden text-sm font-medium text-[#453f38] md:block">
                          {formatCurrency(order.quantity * order.unitPrice)}
                        </span>
                        <span className="flex items-center justify-between gap-2 md:justify-start">
                          <span className={`status-pill ${getStatusClass(order.status)}`}>{order.status}</span>
                          <span className="text-xs text-[#9a9084] md:hidden">
                            {formatCurrency(order.quantity * order.unitPrice)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="surface-card min-h-[350px]">
            {formMode ? (
              <div className="p-5 sm:p-6">
                <p className="eyebrow">{formMode === 'edit' ? 'UPDATE DETAILS' : 'NEW CUSTOMER ORDER'}</p>
                <h2 className="font-display mb-5 mt-1 text-xl font-semibold text-[#302b26]">
                  {formMode === 'edit' ? 'Edit order' : 'Add an order'}
                </h2>
                <OrderForm
                  key={`${formMode}-${selectedOrder?.id ?? 'new'}`}
                  order={formMode === 'edit' ? selectedOrder : null}
                  busy={busy}
                  onCancel={closeForm}
                  onSubmit={saveOrder}
                />
              </div>
            ) : selectedOrder ? (
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">ORDER DETAILS</p>
                    <h2 className="font-display mt-1 text-xl font-semibold text-[#302b26]">
                      {selectedOrder.customerName}
                    </h2>
                  </div>
                  <span className={`status-pill ${getStatusClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#82796e]">Added {formatDate(selectedOrder.createdAt)}</p>
                <dl className="detail-list mt-6">
                  <Detail label="Phone" value={selectedOrder.phone} />
                  <Detail label="Product" value={selectedOrder.product} />
                  <Detail label="Quantity" value={String(selectedOrder.quantity)} />
                  <Detail label="Unit price" value={formatCurrency(selectedOrder.unitPrice)} />
                  <div className="detail-total">
                    <dt>Order total</dt>
                    <dd>{formatCurrency(selectedOrder.quantity * selectedOrder.unitPrice)}</dd>
                  </div>
                </dl>
                <div className="mt-6 flex gap-3 border-t border-[#eee8de] pt-5">
                  <button type="button" className="button-secondary flex-1" onClick={startEdit} disabled={busy}>
                    Edit order
                  </button>
                  <button type="button" className="button-danger" onClick={() => void removeOrder(selectedOrder)} disabled={busy}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[350px] flex-col justify-center p-6">
                <p className="eyebrow">ORDER DETAILS</p>
                <h2 className="font-display mt-2 text-xl font-semibold text-[#302b26]">
                  Choose an order
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#82796e]">
                  Select any order in your list to see the customer details and make a change.
                </p>
                <div className="mt-7 border-t border-[#eee8de] pt-5">
                  <p className="eyebrow">QUICK REFERENCE</p>
                  <ul className="mt-3 space-y-2.5">
                    {productCatalogue.map((product) => (
                      <li key={product.name} className="flex justify-between gap-3 text-sm">
                        <span className="text-[#686055]">{product.name}</span>
                        <span className="font-medium text-[#473f35]">{formatCurrency(product.suggestedPrice)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-5 text-[#9a9084]">
                    Suggested prices are a starting point. Each order&apos;s unit price can be changed.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </section>
        <footer className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9a9084]">
          <span>Nour&apos;s Order Desk</span>
          <span>Order statuses: Pending · Preparing · Delivered</span>
        </footer>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'neutral' | 'amber' | 'green';
}) {
  return (
    <div className={`summary-card summary-${tone}`}>
      <span className="text-[11px] font-medium leading-4 text-[#82796e] sm:text-xs">{label}</span>
      <span className="font-display mt-3 block text-2xl font-semibold text-[#302b26] sm:text-3xl">
        {value}
      </span>
      <span aria-hidden="true" className="summary-dot" />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
