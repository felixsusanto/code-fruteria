import React from "react";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import { agGridDarkTheme, agGridLightTheme } from "../theme/theme";
import {
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
import type { FruitName } from "../types/fruit";

import { fruitsBase, hot$ } from "../stream/livePrice";

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

const LivePricePanel: React.FC = () => {
  const gridApiRef = React.useRef<GridApi<FruitData> | null>(null);
  const { theme } = React.useContext(AppContext);
  const { token } = antdTheme.useToken();
  const { colorBgBase, colorSplit } = token;
  React.useEffect(() => {
    const subscription = hot$.subscribe((data) => {
      const api = gridApiRef.current;
      if (!api || !data) return;
      api.applyTransaction({ update: data });
    });
    return () => {
      subscription.unsubscribe();
    }
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
          flex: 1,
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
