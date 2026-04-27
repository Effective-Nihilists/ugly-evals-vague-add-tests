export interface Item {
  sku: string;
  qty: number;
  priceCents: number;
}

export class Inventory {
  private items = new Map<string, Item>();

  add(sku: string, qty: number, priceCents: number): void {
    if (qty <= 0) throw new Error('qty must be positive');
    const existing = this.items.get(sku);
    if (existing) {
      existing.qty += qty;
      existing.priceCents = priceCents;
    } else {
      this.items.set(sku, { sku, qty, priceCents });
    }
  }

  remove(sku: string, qty: number): void {
    const item = this.items.get(sku);
    if (!item) throw new Error(`unknown sku: ${sku}`);
    if (qty > item.qty) throw new Error(`insufficient stock for ${sku}`);
    item.qty -= qty;
    if (item.qty === 0) this.items.delete(sku);
  }

  get(sku: string): Item | undefined {
    return this.items.get(sku);
  }

  list(): Item[] {
    return Array.from(this.items.values());
  }
}
