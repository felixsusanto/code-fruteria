import { createNoise2D } from "simplex-noise";
import type { FruitName } from "../types/fruit";
import seed from "seed-random";
import { interval } from "rxjs";
import { map, share } from 'rxjs/operators';

interface FruitData {
  name: FruitName;
  country: string;
  type: string;
  value?: {
    current: number;
    delta: number;
  };
  timeline?: number[];
}

export const fruitsBase: Record<FruitName, Partial<FruitData>> = {
  Banana: {
    name: "Banana",
    country: "Ecuador",
    type: "Tropical",
  },
  Apple: {
    name: "Apple",
    country: "Spain",
    type: "Temperate",
  },
  Orange: {
    name: "Orange",
    country: "Morocco",
    type: "Citrus",
  },
  Kiwi: {
    name: "Kiwi",
    country: "New Zealand",
    type: "Berry",
  },
  Mango: {
    name: "Mango",
    country: "Peru",
    type: "Tropical",
  },
  Pineapple: {
    name: "Pineapple",
    country: "Costa Rica",
    type: "Tropical",
  },
  Grape: {
    name: "Grape",
    country: "Italy",
    type: "Berry",
  },
  Pear: {
    name: "Pear",
    country: "Argentina",
    type: "Temperate",
  },
  Lime: {
    name: "Lime",
    country: "Mexico",
    type: "Citrus",
  },
  Papaya: {
    name: "Papaya",
    country: "Brazil",
    type: "Tropical",
  },
};

function* mockGeneratorFruitData(
  fruitName: FruitName,
  base: number,
  diff: number
): Generator<FruitData> {
  const fruitData = fruitsBase[fruitName];
  let index = 0;
  const div = 10;
  const prng = seed(fruitName);
  const simplexNoise = createNoise2D(prng);
  while (true) {
    index++;
    const prevValue = simplexNoise((index - 1) / div, 0) * diff + base;
    const value = simplexNoise(index / div, 0) * diff + base;
    fruitData.value = {
      current: value,
      delta: value - prevValue,
    };
    const arrLen = 10;
    fruitData.timeline = Array.from({ length: arrLen }, (_, i) => {
      const dayIndex = index - i;
      return simplexNoise(dayIndex / div, 0) * diff + base;
    }).reverse();
    // Simulate fetching data

    yield fruitData as FruitData;
  }
}

function* arrayMockGenerator() {
  const baseValues: Record<FruitName, [base: number, diff: number]> = {
    Banana: [20, 10],
    Apple: [35, 30],
    Orange: [37.5, 10],
    Kiwi: [55, 20],
    Mango: [45, 30],
    Pineapple: [35, 10],
    Grape: [50, 20],
    Pear: [35, 20],
    Lime: [45, 15],
    Papaya: [37.5, 13],
  };
  const generators = Object.entries(baseValues).map(
    ([fruitName, [base, diff]]) => {
      return mockGeneratorFruitData(fruitName as FruitName, base, diff);
    }
  );
  while (true) {
    yield generators
      .map((gen) => {
        if (Math.random() > 0.5) {
          return gen.next().value;
        }
        return null;
      })
      .filter((v) => !!v) as FruitData[];
  }
}
const generator = arrayMockGenerator();
const cold$ = interval(1000).pipe(map(() => generator.next().value));

export const hot$ = cold$.pipe(share());

