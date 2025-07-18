import type { AgChartOptions } from "ag-charts-enterprise";
import { AgCharts } from "ag-charts-react";
import React, { useState } from "react";
import { AppContext } from "../context/app";
import { differenceInDays, eachDayOfInterval, format, startOfMonth, startOfQuarter, startOfYear, subDays } from "date-fns";
import { createNoise2D } from "simplex-noise";
import seed from "seed-random";
import type { FruitName } from "../types/fruit";
import { Flex, Segmented, Select } from "antd";

interface BaseInfo {
  base: number;
  spread: number;
  avg: number;
}

export const fruitBase: Record<FruitName, BaseInfo> = {
  Banana: { base: 20, spread: 10, avg: 24.3 },
  Apple: { base: 35, spread: 30, avg: 41.7 },
  Orange: { base: 37.5, spread: 25, avg: 39.8 },
  Kiwi: { base: 55, spread: 30, avg: 57.2 },
  Mango: { base: 45, spread: 30, avg: 47.6 },
  Pineapple: { base: 35, spread: 20, avg: 36.9 },
  Grape: { base: 50, spread: 40, avg: 53.1 },
  Pear: { base: 35, spread: 20, avg: 37.4 },
  Lime: { base: 45, spread: 30, avg: 46.2 },
  Papaya: { base: 37.5, spread: 25, avg: 39.1 },
} as const;

const noise2d = createNoise2D(seed("fruteria"));

const singleDataFruit = (date: Date, fruit: FruitName) => {
  const epoch = new Date(0);

  const { base, spread: maxSpread } = fruitBase[fruit];
  const halfMaxSpread = maxSpread / 2;
  const adjustedBase = base + halfMaxSpread;

  const xIncrement = 40;
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
  const isPositive = point - pointBefore > 0 ? prng() < 0.7 : prng() < 0.3;
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
    return singleDataFruit(d, fruit);
  });
  return t;
};

const rangeOptions = ["YTD", "MTD", "QTD", "3M", "6M", "1Y"] as const;
export type RangeOption = (typeof rangeOptions)[number];

export const CandlestickChart: React.FC = () => {
  const { theme } = React.useContext(AppContext);
  const [fruit, setFruit] = useState<FruitName>("Banana" satisfies FruitName);
  const [range, setRange] = useState<string>("3M");
  React.useEffect(() => {
    const today = new Date();
    const rangeMap: Record<RangeOption, [Date, Date]> = {
      YTD: [startOfYear(today), today],
      MTD: [startOfMonth(today), today],
      QTD: [startOfQuarter(today), today],
      "3M": [subDays(today, 90), today],
      "6M": [subDays(today, 180), today],
      "1Y": [subDays(today, 365), today],
    };
    const [from, to] = rangeMap[range as RangeOption];
    const data = getFruitData(
      from,
      to,
      fruit
    );
    setOptions((prev) => ({
      ...prev,
      data,
      title: {
        text: fruit + " Historic Prices",
      },
      footnote: {
        text: `${format(from, "d MMM yyyy")} - ${format(to, "d MMM yyyy")}`,
      },
    }));
  }, [fruit, range]);
  React.useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    }));
  }, [theme]);

  const [options, setOptions] = useState<AgChartOptions>({
    theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    title: {
      text: fruit + " Historic Prices",
    },
    subtitle: {
      text: "Daily High and Low Prices",
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

  const selectOptions = React.useMemo(() => {
    return Object.keys(fruitBase).map((fruit) => ({
      value: fruit,
      label: fruit,
    }))
  }, []);

  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex style={{marginBottom: 8}}>
        <div style={{ flex: 1}}>
          <Segmented<string>
            options={["YTD", "MTD", "QTD", "3M", "6M", "1Y"]}
            value={range}
            onChange={(value) => {
              setRange(value); // string
            }}
          />
        </div>
        <div>
          <Select
            defaultValue={selectOptions[0].value}
            style={{ width: 120 }}
            // onChange={handleChange}
            onChange={(val) => setFruit(val as FruitName)}
            options={selectOptions}
          />
        </div>
      </Flex>
      <Flex style={{ flex: 1 }}>
        <AgCharts options={options} style={{ height: "100%", width: "100%" }} />
      </Flex>
    </Flex>
  );
};
