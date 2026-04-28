import { describe, expect, it } from 'vitest';
import { Inventory } from './inventory.js';
import { applyDiscount, subtotal } from './pricing.js';

describe('Inventory', () => {
  it('adds new items and merges qty for existing sku while updating price', () => {
    const inv = new Inventory();
    inv.add('A', 2, 100);
    inv.add('A', 3, 150);
    expect(inv.get('A')).toEqual({ sku: 'A', qty: 5, priceCents: 150 });
  });

  it('rejects non-positive qty on add', () => {
    const inv = new Inventory();
    expect(() => inv.add('A', 0, 100)).toThrow(/positive/);
    expect(() => inv.add('A', -1, 100)).toThrow(/positive/);
  });

  it('removes qty and deletes sku when stock reaches zero', () => {
    const inv = new Inventory();
    inv.add('A', 4, 100);
    inv.remove('A', 4);
    expect(inv.get('A')).toBeUndefined();
    expect(inv.list()).toEqual([]);
  });

  it('throws when removing more than in stock or unknown sku', () => {
    const inv = new Inventory();
    inv.add('A', 2, 100);
    expect(() => inv.remove('A', 3)).toThrow(/insufficient/);
    expect(() => inv.remove('B', 1)).toThrow(/unknown sku/);
  });
});

describe('pricing', () => {
  it('computes subtotal across multiple items', () => {
    const total = subtotal([
      { sku: 'A', qty: 2, priceCents: 150 },
      { sku: 'B', qty: 3, priceCents: 100 },
    ]);
    expect(total).toBe(600);
  });

  it('returns 0 for empty cart', () => {
    expect(subtotal([])).toBe(0);
  });

  it('applies percent discount with rounding', () => {
    // 10% of 1005 = 100.5 -> rounds to 101 -> 904
    expect(applyDiscount(1005, { kind: 'percent', value: 10 })).toBe(904);
  });

  it('applies flat discount and never goes negative', () => {
    expect(applyDiscount(500, { kind: 'flat', value: 200 })).toBe(300);
    expect(applyDiscount(100, { kind: 'flat', value: 999 })).toBe(0);
  });

  it('clamps percent discount over 100% to zero', () => {
    expect(applyDiscount(500, { kind: 'percent', value: 150 })).toBe(0);
  });
});
