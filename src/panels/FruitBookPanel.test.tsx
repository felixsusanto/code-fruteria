import { FruitBook } from "./FruitBookPanel";
import { render, act } from "@testing-library/react";
import { AgGridReact as agr } from "ag-grid-react";

const AgGridReact = agr as unknown as jest.Mock;
jest.mock("./EnrichmentPanel");
jest.mock("../theme/theme", () => ({
  agGridDarkTheme: null,
  agGridLightTheme: null,
}));
jest.mock("ag-grid-community");
jest.mock("ag-grid-react", () => {
  return {
    AgGridReact: jest.fn().mockImplementation(() => <div>AgGridReact Y</div>),
  };
});

describe("FruitBook", () => {
  it("renders without crashing", async () => {
    const api = {
      getSelectedNodes: jest.fn(),
    };
    render(<FruitBook />);
    expect(AgGridReact).toHaveBeenCalled();
    // Access the mock via require to get the jest.fn instance
    const [
      { getRowStyle, onGridReady, onSelectionChanged, onRowDoubleClicked },
    ] = AgGridReact.mock.lastCall ?? [];
    expect(getRowStyle).toBeDefined();
    onGridReady({ api });
    getRowStyle({ node: { rowIndex: 1 } });
    getRowStyle({ node: { rowIndex: 2 } });
    onSelectionChanged();
    api.getSelectedNodes.mockReturnValue([{ data: { id: "id" } }]);
    await act(() => onSelectionChanged());
    await act(() => onRowDoubleClicked({ data: { id: "id" } }));
  });
});
