import { Inventory } from './inventory.js';
import { applyDiscount, subtotal } from './pricing.js';

export function runDemo(): number {
  const inv = new Inventory();
  inv.add('apple', 3, 100);
  inv.add('bread', 1, 250);
  inv.remove('apple', 1);
  const total = subtotal(inv.list());
  return applyDiscount(total, { kind: 'percent', value: 10 });
}
