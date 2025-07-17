import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useContext } from "react";
import type { Fruit } from "./FruitBookPanel";
import { agGridDarkTheme, agGridLightTheme } from "../theme/theme";
import { AppContext } from "../context/app";

export const EnrichmentPanel: React.FC<{
  selectedFruit: null | Fruit;
}> = (props) => {
  const { theme } = useContext(AppContext);
  const columnDefs = React.useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "Property",
        field: "property",
      },
      {
        headerName: "Value",
        field: "value",
      },
    ];
  }, []);
  const rowData = React.useMemo(
    () =>
      props.selectedFruit && [
        { property: "ID", value: props.selectedFruit.id },
        { property: "Country", value: props.selectedFruit.country },
        { property: "Type", value: props.selectedFruit.type },
        { property: "Status", value: props.selectedFruit.status },
        { property: "Details", value: props.selectedFruit.details },
      ],
    [props.selectedFruit]
  );
  return (
    <div style={{ height: 270 }}>
      <AgGridReact
        theme={theme === "dark" ? agGridDarkTheme: agGridLightTheme}
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={{ width: 100, flex: 1 }}
      />
    </div>
  );
};
