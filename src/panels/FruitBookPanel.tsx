import React, { useState, useRef, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeAlpine,
  colorSchemeDarkBlue,
} from "ag-grid-community";
import type {
  ColDef,
  RowDoubleClickedEvent,
  GridApi,
  RowStyle,
} from "ag-grid-community";
import { Drawer, theme as antdTheme } from "antd";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import { EnrichmentPanel } from "./EnrichmentPanel";
import { AppContext } from "../context/app";

// Register ag-grid modules (required for module-based builds)
ModuleRegistry.registerModules([AllCommunityModule]);

export interface Fruit {
  id: string;
  name: string;
  country: string;
  type: string;
  status: string;
  details: string;
}

const params = {
  fontFamily: "monospace",
  headerFontWeight: 700,
};

const darkTheme = themeAlpine.withPart(colorSchemeDarkBlue).withParams({
  ...params,
  borderRadius: 0,
});
const lightTheme = themeAlpine.withParams({ ...params, borderRadius: 0 });

const fruits: Fruit[] = [
  {
    id: "F001",
    name: "Banana",
    country: "Ecuador",
    type: "Tropical",
    status: "Available",
    details: "Organic, Fair Trade",
  },
  {
    id: "F002",
    name: "Apple",
    country: "Spain",
    type: "Temperate",
    status: "Available",
    details: "Fuji, Premium",
  },
  {
    id: "F003",
    name: "Orange",
    country: "Morocco",
    type: "Citrus",
    status: "Low Stock",
    details: "Navel, Sweet",
  },
  {
    id: "F004",
    name: "Kiwi",
    country: "New Zealand",
    type: "Berry",
    status: "Available",
    details: "Green, Large",
  },
  {
    id: "F005",
    name: "Mango",
    country: "Peru",
    type: "Tropical",
    status: "Pending",
    details: "Kent, Air Freight",
  },
  {
    id: "F006",
    name: "Pineapple",
    country: "Costa Rica",
    type: "Tropical",
    status: "Available",
    details: "Extra Sweet",
  },
  {
    id: "F007",
    name: "Grape",
    country: "Italy",
    type: "Berry",
    status: "Available",
    details: "Red Globe",
  },
  {
    id: "F008",
    name: "Pear",
    country: "Argentina",
    type: "Temperate",
    status: "Available",
    details: "Williams, Fresh",
  },
  {
    id: "F009",
    name: "Lime",
    country: "Mexico",
    type: "Citrus",
    status: "Low Stock",
    details: "Seedless",
  },
  {
    id: "F010",
    name: "Papaya",
    country: "Brazil",
    type: "Tropical",
    status: "Available",
    details: "Formosa",
  },
];

const defaultColDef = {
  flex: 1,
  resizable: true,
};

export const FruitBook: React.FC = () => {
  const { theme } = useContext(AppContext);
  const {
    token: { colorError, colorPrimary, colorBgBase, colorWarning, colorSplit },
  } = antdTheme.useToken();
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const gridRef = useRef<GridApi<Fruit>>(null);

  const onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
    setSelectedFruit(event.data);
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current?.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      setSelectedFruit(selectedNodes[0].data ?? null);
    }
  };

  const columnDefs: ColDef[] = React.useMemo(
    () => [
      { headerName: "ID", field: "id", minWidth: 90 },
      { headerName: "Fruit", field: "name", minWidth: 120 },
      { headerName: "Country", field: "country", minWidth: 120 },
      { headerName: "Type", field: "type", minWidth: 120 },
      {
        headerName: "Status",
        field: "status",
        minWidth: 120,
        cellStyle: (params: { value: string }) => ({
          color:
            params.value === "Available"
              ? colorPrimary
              : params.value === "Pending"
              ? colorWarning
              : colorError,
          fontWeight: 700,
          background: colorBgBase,
        }),
      },
      { headerName: "Details", field: "details", minWidth: 180 },
    ],
    [colorBgBase]
  );

  return (
    <>
      <div style={{ padding: 0, background: "#232b3e", height: "100%" }}>
        <div
          className="ag-theme-alpine"
          style={{
            height: "100%",
            width: "100%",
            // border: "1px solid #7c5fe6",
          }}
        >
          <AgGridReact<Fruit>
            onGridReady={(e) => {
              gridRef.current = e.api;
            }}
            theme={theme === "dark" ? darkTheme : lightTheme}
            rowData={fruits}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            headerHeight={38}
            rowHeight={38}
            rowSelection="single"
            onSelectionChanged={onSelectionChanged}
            onRowDoubleClicked={onRowDoubleClicked}
            getRowStyle={(params) => {
              if (selectedFruit && params.data?.id === selectedFruit.id) {
                return {
                  background: colorPrimary,
                } as RowStyle;
              }
              return {
                background:
                  params.node.rowIndex !== null &&
                  params.node.rowIndex % 2 === 0
                    ? colorBgBase
                    : colorSplit,
              } as RowStyle;
            }}
            suppressCellFocus={true}
          />
        </div>
      </div>
      <Drawer
        title={`${selectedFruit?.name} Enrichment`}
        placement="right"
        closable={false}
        onClose={() => setSelectedFruit(null)}
        open={!!selectedFruit}
        getContainer={false}
      >
        <EnrichmentPanel selectedFruit={selectedFruit} />
      </Drawer>
    </>
  );
};
