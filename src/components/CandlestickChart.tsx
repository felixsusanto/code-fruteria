import type { AgChartOptions } from "ag-charts-enterprise";
import { AgCharts } from "ag-charts-react";
import React, { useState } from "react";
import { AppContext } from "../context/app";
import { differenceInDays, eachDayOfInterval, subDays } from "date-fns";
import { createNoise2D } from "simplex-noise";
import seed from "seed-random";
import type { FruitName } from "../types/fruit";

interface BaseInfo {
  base: number;
  spread: number;
  avg: number;
}

export const fruitBase: Record<FruitName, BaseInfo> = {
  Banana:    { base: 20,  spread: 10, avg: 24.3 },
  Apple:     { base: 35,  spread: 30, avg: 41.7 },
  Orange:    { base: 37.5,spread: 25, avg: 39.8 },
  Kiwi:      { base: 55,  spread: 30, avg: 57.2 },
  Mango:     { base: 45,  spread: 30, avg: 47.6 },
  Pineapple: { base: 35,  spread: 20, avg: 36.9 },
  Grape:     { base: 50,  spread: 40, avg: 53.1 },
  Pear:      { base: 35,  spread: 20, avg: 37.4 },
  Lime:      { base: 45,  spread: 30, avg: 46.2 },
  Papaya:    { base: 37.5,spread: 25, avg: 39.1 },
} as const;

const noise2d = createNoise2D(seed("fruteria"));

const singleDataFruitNew = (date: Date, fruit: FruitName) => {
  const epoch = new Date(0);

  const { base, spread: maxSpread } = fruitBase[fruit];
  const halfMaxSpread = maxSpread / 2;
  const adjustedBase = base + halfMaxSpread;

  const xIncrement = 100;
  const xBefore = differenceInDays(subDays(date, 1), epoch) / xIncrement;
  const x = differenceInDays(date, epoch) / xIncrement;
  const prng = seed(`${x}`);
  const trDivFactor = 4;
  const transactionalSpread = halfMaxSpread / trDivFactor;
  const y = fruit
    .split("")
    .map((c) => c.charCodeAt(0))
    .reduce((acc, curr) => acc + curr, 0);
  const pointBefore = adjustedBase + noise2d(xBefore, y) * halfMaxSpread;
  const point = adjustedBase + noise2d(x, y) * halfMaxSpread;
  const isPositive = point - pointBefore > 0 ? prng() < 0.8 : prng() < 0.2;
  const points = Array(4)
    .fill("")
    .map(() => {
      return prng() * transactionalSpread;
    })
    .sort();
  return {
    date,
    high: point + Math.max(...points),
    low: point + Math.min(...points),
    open: point + (isPositive ? points.at(1)! : points.at(2)!), 
    close: point + (isPositive ? points.at(2)! : points.at(1)!),
  };
};

const getFruitData = (from: Date, to: Date, fruit: FruitName) => {
  const days = eachDayOfInterval({ start: from, end: to });
  const t = days.map((d) => {
    return singleDataFruitNew(d, fruit);
  });
  return t;
};

interface CandlestickChartProps {
  fruit: string;
}
export const CandlestickChart: React.FC<CandlestickChartProps> = (props) => {
  const { theme } = React.useContext(AppContext);
  React.useEffect(() => {
    const data = getFruitData(
      new Date("2023-08-01"),
      new Date("2023-11-01"),
      props.fruit as FruitName
    );
    setOptions((prev) => ({
      ...prev,
      data,
    }));
  }, []);
  React.useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    }));
  }, [theme]);

  const [options, setOptions] = useState<AgChartOptions>({
    theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    title: {
      text: props.fruit + " Historic Prices",
    },
    subtitle: {
      text: "Daily High and Low Prices",
    },
    footnote: {
      text: "1 Aug 2023 - 1 Nov 2023",
    },
    series: [
      {
        type: "candlestick",
        xKey: "date",
        xName: "Date",
        lowKey: "low",
        highKey: "high",
        openKey: "open",
        closeKey: "close",
      },
    ],
  });

  return <AgCharts options={options} style={{ height: "100%" }} />;
};
