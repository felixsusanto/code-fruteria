import { render, screen, fireEvent } from "@testing-library/react";
import { FruitViewPanel } from "./FruitViewPanel";
import * as antd from "antd";

// Mock Ant Design message to avoid side effects
jest.spyOn(antd.message, "success").mockImplementation(jest.fn());
jest.spyOn(antd.message, "error").mockImplementation(jest.fn());
jest.spyOn(antd.message, "info").mockImplementation(jest.fn());

describe("FruitViewPanel", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders inventory list", () => {
    render(<FruitViewPanel />);
    expect(screen.getByText(/apple:/i)).toBeInTheDocument();
    expect(screen.getByText(/banana:/i)).toBeInTheDocument();
    expect(screen.getByText(/orange:/i)).toBeInTheDocument();
  });

  it("buys fruit when enough inventory", () => {
    render(<FruitViewPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: 2 } });
    fireEvent.click(screen.getByText("Buy"));
    expect(screen.getByText("Bought 2 apple(s).")).toBeInTheDocument();
    expect(antd.message.success).toHaveBeenCalledWith("Bought 2 apple(s).");
  });

  it("shows error when buying more than available", () => {
    render(<FruitViewPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: 20 } });
    fireEvent.click(screen.getByText("Buy"));
    expect(
      screen.getByText("Not enough apples in inventory.")
    ).toBeInTheDocument();
    expect(antd.message.error).toHaveBeenCalledWith(
      "Not enough apples in inventory."
    );
  });

  it("sells fruit and updates inventory", () => {
    render(<FruitViewPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: 3 } });
    fireEvent.click(screen.getByText("Sell"));
    expect(screen.getByText("Sold 3 apple(s).")).toBeInTheDocument();
    expect(antd.message.info).toHaveBeenCalledWith("Sold 3 apple(s).");
  });
});
