export type Fruit = 'apple' | 'banana' | 'orange';

export interface FruitInventory {
  [fruit: string]: number;
}

export class MockFruitMachine {
  private inventory: FruitInventory = {
    apple: 10,
    banana: 8,
    orange: 15,
  };

  getInventory(): FruitInventory {
    return { ...this.inventory };
  }

  buy(fruit: Fruit, amount: number): boolean {
    if (this.inventory[fruit] >= amount) {
      this.inventory[fruit] -= amount;
      return true;
    }
    return false;
  }

  sell(fruit: Fruit, amount: number): void {
    this.inventory[fruit] += amount;
  }
}
