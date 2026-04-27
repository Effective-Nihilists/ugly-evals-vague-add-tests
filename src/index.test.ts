import { describe, it, expect } from 'vitest';
import { Inventory } from './inventory.ts';
import { subtotal, applyDiscount } from './pricing.ts';
import { runDemo } from './index.ts';

describe('Inventory', () => {
  it('add and list items', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.add('bread', 1, 250);
    expect(inv.list()).toEqual([
      { sku: 'apple', qty: 3, priceCents: 100 },
      { sku: 'bread', qty: 1, priceCents: 250 },
    ]);
  });

  it('add updates existing sku', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.add('apple', 2, 150);
    expect(inv.get('apple')).toEqual({ sku: 'apple', qty: 5, priceCents: 150 });
  });

  it('remove reduces quantity', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.remove('apple', 1);
    expect(inv.get('apple')).toEqual({ sku: 'apple', qty: 2, priceCents: 100 });
  });

  it('remove deletes sku when qty reaches zero', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.remove('apple', 3);
    expect(inv.get('apple')).toBeUndefined();
  });

  it('throws when removing unknown sku', () => {
    const inv = new Inventory();
    expect(() => inv.remove('apple', 1)).toThrow('unknown sku: apple');
  });

  it('throws when removing more than available', () => {
    const inv = new Inventory();
    inv.add('apple', 2, 100);
    expect(() => inv.remove('apple', 3)).toThrow('insufficient stock for apple');
  });

  it('throws when adding non-positive qty', () => {
    const inv = new Inventory();
    expect(() => inv.add('apple', 0, 100)).toThrow('qty must be positive');
    expect(() => inv.add('apple', -1, 100)).toThrow('qty must be positive');
  });
});

describe('pricing', () => {
  describe('subtotal', () => {
    it('sums items', () => {
      const items = [
        { sku: 'apple', qty: 3, priceCents: 100 },
        { sku: 'bread', qty: 1, priceCents: 250 },
      ];
      expect(subtotal(items)).toBe(550);
    });

    it('returns 0 for empty list', () => {
      expect(subtotal([])).toBe(0);
    });
  });

  describe('applyDiscount', () => {
    it('applies percent discount', () => {
      expect(applyDiscount(1000, { kind: 'percent', value: 10 })).toBe(900);
    });

    it('applies flat discount', () => {
      expect(applyDiscount(1000, { kind: 'flat', value: 150 })).toBe(850);
    });

    it('does not go below zero', () => {
      expect(applyDiscount(100, { kind: 'percent', value: 150 })).toBe(0);
      expect(applyDiscount(100, { kind: 'flat', value: 500 })).toBe(0);
    });

    it('rounds percent discount correctly', () => {
      expect(applyDiscount(999, { kind: 'percent', value: 10 })).toBe(899);
    });
  });
});

describe('runDemo', () => {
  it('runs without error and returns a number', () => {
    const result = runDemo();
    expect(typeof result).toBe('number');
  });

  it('returns expected value from demo logic', () => {
    const result = runDemo();
    expect(result).toBe(405);
  });
});