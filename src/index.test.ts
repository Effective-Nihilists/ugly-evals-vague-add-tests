import { describe, it, expect } from 'vitest';
import { runDemo } from './index.js';

describe('runDemo', () => {
  it('returns expected discounted total', () => {
    // apple 3*100 = 300, bread 1*250 = 250 => 550
    // remove 1 apple => 2*100 = 200 + 250 = 450
    // 10% off 450 => 405
    expect(runDemo()).toBe(405);
  });
});
