import { differenceInDays, eachDayOfInterval } from "date-fns";
import { createNoise2D } from "simplex-noise";
import seed from "seed-random";


const fruitKeys = [
  "Banana",
  "Apple",
  "Orange",
  "Kiwi",
  "Mango",
  "Pineapple",
  "Grape",
  "Pear",
  "Lime",
  "Papaya",
] as const;

export type FruitType = (typeof fruitKeys)[number];
const fruitBase: Record<FruitType, any> = {
  Banana: { base: 20, spread: 10 },
  Apple: { base: 35, spread: 30 },
  Orange: { base: 37.5, spread: 25 },
  Kiwi: { base: 55, spread: 30 },
  Mango: { base: 45, spread: 30 },
  Pineapple: { base: 35, spread: 20 },
  Grape: { base: 50, spread: 40 },
  Pear: { base: 35, spread: 20 },
  Lime: { base: 45, spread: 30 },
  Papaya: { base: 37.5, spread: 25 },
} as const;

export interface HistoricValue {
  date: string;
  high: number;
  low: number;
  open: number;
  close: number;
  adjClose: number;
}


export function* historicGenerator(
  id: string,
  fruit: FruitType,
  from: Date,
  to: Date
) {
  const prng = seed(id);
  const simplex = createNoise2D(prng);
  const { base, spread } = fruitBase[fruit];

  const days = eachDayOfInterval({ start: from, end: to });
  let mutableBase = base + spread * 2;
  for (const day of days) {
    const i = days.indexOf(day); 
    const date = day.toISOString().split("T")[0];
    const yCoords = [1, 2, 3, 4, 5].map((i) => i * 1);
    const epoch = new Date(1970, 0, 1);
    const x = differenceInDays(day, epoch);
    const values = yCoords
      .map((y) => {
        const noiseValue = simplex(x, y);
        if (y === 1) console.log(x, noiseValue);
        return mutableBase + noiseValue * spread;
      });
    const high = Math.max(...values);
    const low = Math.min(...values);
    const rest = values.filter((v) => v !== high && v !== low);
    const shuffled = rest.sort(() => prng() - 0.5);
    const [open, close, adjClose] = shuffled;
    const restObj = { open, close, adjClose };
    mutableBase = (high + low) / 2; // Update base for next iteration
    yield {
      date,
      high,
      low,
      ...restObj,
    } as HistoricValue;
  }
}

