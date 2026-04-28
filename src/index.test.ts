import { describe, it, expect } from 'vitest';
import { Inventory } from './inventory.js';
import { subtotal, applyDiscount } from './pricing.js';
import { runDemo } from './index.js';

describe('Inventory', () => {
  it('adds a new item and retrieves it', () => {
    const inv = new Inventory();
    inv.add('apple', 5, 100);
    const item = inv.get('apple');
    expect(item).toEqual({ sku: 'apple', qty: 5, priceCents: 100 });
  });

  it('adds to existing item quantity', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.add('apple', 2, 150);
    expect(inv.get('apple')!.qty).toBe(5);
    expect(inv.get('apple')!.priceCents).toBe(150);
  });

  it('throws when adding with non-positive qty', () => {
    const inv = new Inventory();
    expect(() => inv.add('apple', 0, 100)).toThrow('qty must be positive');
    expect(() => inv.add('apple', -1, 100)).toThrow('qty must be positive');
  });

  it('removes items and updates quantity', () => {
    const inv = new Inventory();
    inv.add('apple', 5, 100);
    inv.remove('apple', 3);
    expect(inv.get('apple')!.qty).toBe(2);
  });

  it('removes item entirely when qty reaches zero', () => {
    const inv = new Inventory();
    inv.add('apple', 2, 100);
    inv.remove('apple', 2);
    expect(inv.get('apple')).toBeUndefined();
  });

  it('throws when removing unknown sku', () => {
    const inv = new Inventory();
    expect(() => inv.remove('banana', 1)).toThrow('unknown sku: banana');
  });

  it('throws when removing more than available stock', () => {
    const inv = new Inventory();
    inv.add('apple', 2, 100);
    expect(() => inv.remove('apple', 5)).toThrow('insufficient stock for apple');
  });

  it('lists all items', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.add('bread', 1, 250);
    const list = inv.list();
    expect(list).toHaveLength(2);
    expect(list.map(i => i.sku).sort()).toEqual(['apple', 'bread']);
  });

  it('returns empty list when no items', () => {
    const inv = new Inventory();
    expect(inv.list()).toEqual([]);
  });
});

describe('subtotal', () => {
  it('calculates total from qty * priceCents', () => {
    const items = [
      { sku: 'apple', qty: 3, priceCents: 100 },
      { sku: 'bread', qty: 2, priceCents: 250 },
    ];
    expect(subtotal(items)).toBe(800);
  });

  it('returns 0 for empty array', () => {
    expect(subtotal([])).toBe(0);
  });
});

describe('applyDiscount', () => {
  it('applies percent discount', () => {
    expect(applyDiscount(1000, { kind: 'percent', value: 10 })).toBe(900);
  });

  it('applies flat discount', () => {
    expect(applyDiscount(1000, { kind: 'flat', value: 200 })).toBe(800);
  });

  it('clamps to zero when percent discount exceeds total', () => {
    expect(applyDiscount(50, { kind: 'percent', value: 100 })).toBe(0);
  });

  it('clamps to zero when flat discount exceeds total', () => {
    expect(applyDiscount(100, { kind: 'flat', value: 500 })).toBe(0);
  });

  it('handles zero discount', () => {
    expect(applyDiscount(500, { kind: 'percent', value: 0 })).toBe(500);
    expect(applyDiscount(500, { kind: 'flat', value: 0 })).toBe(500);
  });

  it('rounds percent discount correctly', () => {
    expect(applyDiscount(99, { kind: 'percent', value: 33 })).toBe(66);
  });
});

describe('runDemo', () => {
  it('returns the expected discounted total', () => {
    const result = runDemo();
    expect(result).toBe(405);
  });
});
