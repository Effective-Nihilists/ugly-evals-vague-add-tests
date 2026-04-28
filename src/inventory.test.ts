import { describe, it, expect } from 'vitest';
import { Inventory } from './inventory.js';

describe('Inventory', () => {
  it('adds a new item', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    expect(inv.get('apple')).toEqual({ sku: 'apple', qty: 3, priceCents: 100 });
  });

  it('increments qty and updates price when adding existing sku', () => {
    const inv = new Inventory();
    inv.add('apple', 2, 100);
    inv.add('apple', 3, 150);
    expect(inv.get('apple')).toEqual({ sku: 'apple', qty: 5, priceCents: 150 });
  });

  it('throws when adding non-positive qty', () => {
    const inv = new Inventory();
    expect(() => inv.add('apple', 0, 100)).toThrow('qty must be positive');
    expect(() => inv.add('apple', -1, 100)).toThrow('qty must be positive');
  });

  it('removes partial qty', () => {
    const inv = new Inventory();
    inv.add('apple', 5, 100);
    inv.remove('apple', 2);
    expect(inv.get('apple')?.qty).toBe(3);
  });

  it('deletes item when removing all qty', () => {
    const inv = new Inventory();
    inv.add('apple', 3, 100);
    inv.remove('apple', 3);
    expect(inv.get('apple')).toBeUndefined();
  });

  it('throws when removing unknown sku', () => {
    const inv = new Inventory();
    expect(() => inv.remove('banana', 1)).toThrow('unknown sku: banana');
  });

  it('throws when removing more than available', () => {
    const inv = new Inventory();
    inv.add('apple', 2, 100);
    expect(() => inv.remove('apple', 3)).toThrow('insufficient stock for apple');
  });

  it('lists items', () => {
    const inv = new Inventory();
    inv.add('apple', 1, 100);
    inv.add('bread', 2, 250);
    const list = inv.list();
    expect(list).toHaveLength(2);
    expect(list.map((i) => i.sku).sort()).toEqual(['apple', 'bread']);
  });

  it('returns empty list when no items', () => {
    const inv = new Inventory();
    expect(inv.list()).toEqual([]);
  });
});
