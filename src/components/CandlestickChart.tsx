import type { AgChartOptions } from "ag-charts-enterprise";
import { AgCharts } from "ag-charts-react";
import React, { useState } from "react";
import { AppContext } from "../context/app";

interface HistoricValue {
  date: string;
  high: number;
  low: number;
  open: number;
  close: number;
  adjClose: number;
}

const getData = async () => {
  const response = await fetch(
    "http://localhost:3000/historic/Banana?id=T001&from=2022-01-01&to=2022-03-31"
  );
  return await (response.json() as Promise<HistoricValue[]>);
};

interface CandlestickChartProps {
  fruit: string;
}
export const CandlestickChart: React.FC<CandlestickChartProps> = (props) => {
  const { theme } = React.useContext(AppContext);
  React.useEffect(() => {
    getData().then((data) => {
      const newData = data.map((o) => ({
        ...o,
        date: new Date(o.date),
      }));
      setOptions((prev) => ({ ...prev, data: newData }));
    });
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
