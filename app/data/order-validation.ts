import { orderStatuses, type OrderChanges, type OrderInput } from './orders';

type ValidationResult<T> =
  | { success: true; value: T }
  | { success: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateFields(
  body: unknown,
  partial: boolean,
): ValidationResult<OrderChanges> {
  if (!isRecord(body)) {
    return { success: false, message: 'The request body must be an object.' };
  }

  const changes: OrderChanges = {};
  const fields: Array<keyof OrderInput> = [
    'customerName',
    'phone',
    'product',
    'quantity',
    'unitPrice',
    'status',
  ];

  for (const field of fields) {
    if (!(field in body)) {
      if (!partial) {
        return { success: false, message: `The ${field} field is required.` };
      }
      continue;
    }

    const value = body[field];
    if (field === 'customerName' || field === 'phone' || field === 'product') {
      if (typeof value !== 'string' || value.trim().length === 0) {
        return { success: false, message: `${field} must be a non-empty string.` };
      }
      if (value.trim().length > (field === 'phone' ? 40 : 100)) {
        return { success: false, message: `${field} is too long.` };
      }
      changes[field] = value.trim();
      continue;
    }

    if (field === 'quantity') {
      if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 99) {
        return {
          success: false,
          message: 'quantity must be a whole number between 1 and 99.',
        };
      }
      changes.quantity = Number(value);
      continue;
    }

    if (field === 'unitPrice') {
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 1_000_000
      ) {
        return {
          success: false,
          message: 'unitPrice must be a number between 0 and 1,000,000.',
        };
      }
      changes.unitPrice = Math.round(value * 100) / 100;
      continue;
    }

    if (
      typeof value !== 'string' ||
      !orderStatuses.includes(value as (typeof orderStatuses)[number])
    ) {
      return {
        success: false,
        message: 'status must be Pending, Preparing, or Delivered.',
      };
    }
    changes.status = value as (typeof orderStatuses)[number];
  }

  return { success: true, value: changes };
}

export function validateNewOrder(body: unknown): ValidationResult<OrderInput> {
  const result = validateFields(body, false);
  return result.success
    ? { success: true, value: result.value as OrderInput }
    : result;
}

export function validateOrderChanges(
  body: unknown,
): ValidationResult<OrderChanges> {
  const result = validateFields(body, true);
  if (!result.success) return result;
  if (Object.keys(result.value).length === 0) {
    return { success: false, message: 'Provide at least one field to update.' };
  }
  return result;
}
