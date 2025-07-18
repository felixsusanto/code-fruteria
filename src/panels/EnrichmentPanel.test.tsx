import { render } from "@testing-library/react";
import { EnrichmentPanel } from "./EnrichmentPanel";
import type { Fruit } from "./FruitBookPanel";

jest.mock("ag-grid-react", () => ({
  AgGridReact: jest.fn(() => <div>Mocked AgGridReact</div>),
}));

describe("EnrichmentPanel", () => {
  const mockFruit: Fruit = {
    id: "123",
    country: "Spain",
    name: "test",
    type: "Apple",
    status: "Fresh",
    details: "Red and juicy",
  };

  it("renders without crashing when selectedFruit is null", () => {
    const { container } = render(<EnrichmentPanel selectedFruit={null} />);
  });

  it("renders the grid with fruit properties when selectedFruit is provided", () => {
    render(<EnrichmentPanel selectedFruit={mockFruit} />);
  });

  it("renders no rows when selectedFruit is null", () => {
    const { queryByText } = render(<EnrichmentPanel selectedFruit={null} />);
    expect(queryByText("ID")).not.toBeInTheDocument();
    expect(queryByText("Country")).not.toBeInTheDocument();
    expect(queryByText("Type")).not.toBeInTheDocument();
    expect(queryByText("Status")).not.toBeInTheDocument();
    expect(queryByText("Details")).not.toBeInTheDocument();
  });
});
