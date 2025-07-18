import React from "react";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import { agGridDarkTheme, agGridLightTheme } from "../theme/theme";
import {
  type ColDef,
  type GridApi,
  type ICellRendererParams,
  type RowStyle,
} from "ag-grid-community";
import { theme as antdTheme, Avatar, Tag } from "antd";
import { AppContext } from "../context/app";
import apple from "../assets/images/apple.png";
import banana from "../assets/images/banana.png";
import grape from "../assets/images/grape.png";
import kiwi from "../assets/images/kiwi.png";
import lime from "../assets/images/lime.png";
import mango from "../assets/images/mango.png";
import orange from "../assets/images/orange.png";
import papaya from "../assets/images/papaya.png";
import pear from "../assets/images/pear.png";
import pineapple from "../assets/images/pineapple.png";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import seed from "seed-random";
import { createNoise2D } from "simplex-noise";
import type { FruitName } from "../types/fruit";

interface LivePricePanelProps {}

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

type AvatarInfo = Record<FruitName, string>;

const fruitAvatars: AvatarInfo = {
  Banana: banana,
  Apple: apple,
  Orange: orange,
  Kiwi: kiwi,
  Mango: mango,
  Pineapple: pineapple,
  Grape: grape,
  Pear: pear,
  Lime: lime,
  Papaya: papaya,
};

const fruitsBase: Record<FruitName, Partial<FruitData>> = {
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
  let index = 0;
  const generators = Object.entries(baseValues).map(
    ([fruitName, [base, diff]]) => {
      return mockGeneratorFruitData(fruitName as FruitName, base, diff);
    }
  );
  while (true) {
    index++;
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

const LivePricePanel: React.FC<LivePricePanelProps> = () => {
  const gridApiRef = React.useRef<GridApi<FruitData> | null>(null);
  const { theme } = React.useContext(AppContext);
  const { token } = antdTheme.useToken();
  const { colorBgBase, colorSplit } = token;
  React.useEffect(() => {
    const generator = arrayMockGenerator();
    const interval = setInterval(() => {
      const data = generator.next().value;
      const api = gridApiRef.current;
      if (data && api) {
        // setRowData(data);
        api.applyTransaction({update: data});
        // api.setGridOption("rowData", data);
        // api.refreshCells();
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const gridProps = React.useMemo<AgGridReactProps>(() => {
    return {
      onGridReady: (params) => {
        gridApiRef.current = params.api;
        params.api.setGridOption("rowData", Object.values(fruitsBase));
      },
      defaultColDef: {
        width: 120,
      },
      getRowId: (params) => params.data.name,
      headerHeight: 38,
      rowHeight: 45,
      getRowStyle: (params) => {
        return {
          background:
            params.node.rowIndex !== null && params.node.rowIndex % 2 === 0
              ? colorBgBase
              : colorSplit,
        } as RowStyle;
      },
      suppressCellFocus: true,
      columnDefs: [
        {
          headerName: "Fruit",
          field: "name",
          cellRenderer: (params: ICellRendererParams) => {
            return (
              <div>
                <Avatar
                  src={<img src={fruitAvatars[params.value as FruitName]} />}
                  size="small"
                />{" "}
                {params.value}
              </div>
            );
          },
        },
        { headerName: "Country", field: "country" },
        { headerName: "Type", field: "type" },
        {
          headerName: "Total Value",
          width: 170,
          field: "value",
          cellStyle: { textAlign: "right" },
          cellRenderer: (params: ICellRendererParams) => {
            const value = params.value as
              | { current: number; delta: number }
              | undefined;
            if (!value) {
              return <span>N/A</span>;
            }
            return (
              <div>
                <span
                  style={{
                    marginRight: 8,
                    color:
                      value.delta > 0 ? token.colorSuccess : token.colorError,
                  }}
                >
                  {value.delta > 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                  {value.delta.toFixed(2)}
                </span>
                <span>
                  <Tag color="green">${value.current.toFixed(2)}</Tag>
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Timeline",
          field: "timeline",
          cellRenderer: "agSparklineCellRenderer",
          cellRendererParams: {
            sparklineOptions: {
              type: "bar",
              stroke: "transparent",
              fill: token.colorPrimary,
            },
          },
        },
      ],
    };
  }, [theme]);
  return (
    <AgGridReact<FruitData>
      {...gridProps}
      theme={theme === "dark" ? agGridDarkTheme : agGridLightTheme}
    />
  );
};

export default LivePricePanel;
