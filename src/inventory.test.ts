import { describe, it, expect, beforeEach } from 'vitest';
import { Inventory } from './inventory.js';
import { subtotal, applyDiscount } from './pricing.js';

describe('Inventory.add', () => {
  let inv: Inventory;

  beforeEach(() => {
    inv = new Inventory();
  });

  it('adds a new item', () => {
    inv.add('SKU-1', 5, 1000);
    const item = inv.get('SKU-1');
    expect(item).toEqual({ sku: 'SKU-1', qty: 5, priceCents: 1000 });
  });

  it('accumulates qty when same sku is added again', () => {
    inv.add('SKU-1', 3, 500);
    inv.add('SKU-1', 2, 600);
    expect(inv.get('SKU-1')?.qty).toBe(5);
  });

  it('updates priceCents to latest value when same sku is added again', () => {
    inv.add('SKU-1', 3, 500);
    inv.add('SKU-1', 1, 999);
    expect(inv.get('SKU-1')?.priceCents).toBe(999);
  });

  it('throws when qty is zero', () => {
    expect(() => inv.add('SKU-1', 0, 100)).toThrow('qty must be positive');
  });

  it('throws when qty is negative', () => {
    expect(() => inv.add('SKU-1', -1, 100)).toThrow('qty must be positive');
  });
});

describe('Inventory.remove', () => {
  let inv: Inventory;

  beforeEach(() => {
    inv = new Inventory();
    inv.add('SKU-A', 10, 250);
  });

  it('reduces qty by the given amount', () => {
    inv.remove('SKU-A', 3);
    expect(inv.get('SKU-A')?.qty).toBe(7);
  });

  it('deletes item when qty reaches zero', () => {
    inv.remove('SKU-A', 10);
    expect(inv.get('SKU-A')).toBeUndefined();
  });

  it('throws for unknown sku', () => {
    expect(() => inv.remove('MISSING', 1)).toThrow('unknown sku: MISSING');
  });

  it('throws when removing more than available stock', () => {
    expect(() => inv.remove('SKU-A', 11)).toThrow('insufficient stock for SKU-A');
  });
});

describe('Inventory.list', () => {
  it('returns all items', () => {
    const inv = new Inventory();
    inv.add('A', 1, 100);
    inv.add('B', 2, 200);
    const skus = inv.list().map(i => i.sku).sort();
    expect(skus).toEqual(['A', 'B']);
  });

  it('returns empty array when inventory is empty', () => {
    expect(new Inventory().list()).toEqual([]);
  });
});

describe('subtotal', () => {
  it('returns 0 for empty list', () => {
    expect(subtotal([])).toBe(0);
  });

  it('calculates qty × priceCents for a single item', () => {
    expect(subtotal([{ sku: 'X', qty: 3, priceCents: 200 }])).toBe(600);
  });

  it('sums across multiple items', () => {
    expect(subtotal([
      { sku: 'A', qty: 2, priceCents: 150 },
      { sku: 'B', qty: 1, priceCents: 300 },
    ])).toBe(600);
  });
});

describe('applyDiscount', () => {
  it('applies a percent discount', () => {
    expect(applyDiscount(1000, { kind: 'percent', value: 10 })).toBe(900);
  });

  it('applies a flat discount', () => {
    expect(applyDiscount(1000, { kind: 'flat', value: 250 })).toBe(750);
  });

  it('clamps percent discount at 0 when value exceeds total', () => {
    expect(applyDiscount(100, { kind: 'percent', value: 200 })).toBe(0);
  });

  it('clamps flat discount at 0 when value exceeds total', () => {
    expect(applyDiscount(100, { kind: 'flat', value: 500 })).toBe(0);
  });

  it('rounds fractional percent discount result', () => {
    // 10% of 333 = 33.3 → rounds to 33, result = 300
    expect(applyDiscount(333, { kind: 'percent', value: 10 })).toBe(300);
  });
});

describe('integration', () => {
  it('full workflow: add, remove, subtotal, discount', () => {
    const inv = new Inventory();
    inv.add('WIDGET', 5, 1000);
    inv.add('GADGET', 2, 2500);
    inv.remove('WIDGET', 1);

    const total = subtotal(inv.list());
    // 4 × 1000 + 2 × 2500 = 9000
    expect(total).toBe(9000);

    const discounted = applyDiscount(total, { kind: 'percent', value: 10 });
    expect(discounted).toBe(8100);
  });
});
