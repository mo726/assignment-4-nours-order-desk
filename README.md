# Nour's Order Desk

A single dashboard for Nour to record candle orders, find customer details, track preparation status, and remove accidental entries.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Order workflow

- View customer, product, quantity, total, and status in the order list.
- Open an order to see its phone number, unit price, total, and date.
- Create orders with a customer name, phone number, catalogue product, quantity, and editable unit price.
- Edit order information and set its status to Pending, Preparing, or Delivered.
- Delete an order only after confirming the action.
- See live counts for all, pending, and delivered orders.

Every list, detail, create, update, and delete action uses the `/api/orders` Route Handlers. Orders are held in server process memory for this MVP; restarting the server clears them. There is no database, account system, payment workflow, messaging integration, inventory tracking, or multi-product order support.

The teaching catalogue is Vanilla Candle ($8.00), Cedar Candle ($10.00), and Mini Gift Candle ($6.00), all in USD. Suggested prices can be edited per order.

## Validate

```bash
npm run lint
npm run build
```
