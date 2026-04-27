import type { Item } from './inventory.js';

export interface Discount {
  kind: 'percent' | 'flat';
  value: number; // percent (0-100) or flat cents
}

export function subtotal(items: Item[]): number {
  return items.reduce((s, i) => s + i.qty * i.priceCents, 0);
}

export function applyDiscount(total: number, d: Discount): number {
  if (d.kind === 'percent') {
    const off = Math.round((total * d.value) / 100);
    return Math.max(0, total - off);
  }
  return Math.max(0, total - d.value);
}
