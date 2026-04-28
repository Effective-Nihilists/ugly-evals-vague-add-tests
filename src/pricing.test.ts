import { describe, it, expect } from 'vitest';
import { subtotal, applyDiscount } from './pricing.js';

describe('subtotal', () => {
  it('calculates subtotal for multiple items', () => {
    const items = [
      { sku: 'a', qty: 2, priceCents: 100 },
      { sku: 'b', qty: 1, priceCents: 250 },
    ];
    expect(subtotal(items)).toBe(450);
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
    expect(applyDiscount(1000, { kind: 'flat', value: 200 })).toBe(800);
  });

  it('clamps result to 0 when discount exceeds total', () => {
    expect(applyDiscount(100, { kind: 'flat', value: 200 })).toBe(0);
    expect(applyDiscount(100, { kind: 'percent', value: 150 })).toBe(0);
  });
});
