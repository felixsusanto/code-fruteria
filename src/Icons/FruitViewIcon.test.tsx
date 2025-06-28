import React from "react";
import { render } from "@testing-library/react";
import FruitViewIcon from "./FruitViewIcon";

describe("FruitViewIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<FruitViewIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies default size when no size prop is provided", () => {
    const { container } = render(<FruitViewIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "22");
    expect(svg).toHaveAttribute("height", "22");
  });

  it("applies custom size when size prop is provided", () => {
    const { container } = render(<FruitViewIcon size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("renders the correct SVG elements", () => {
    const { container } = render(<FruitViewIcon />);
    expect(
      container.querySelector('circle[cx="11"][cy="11"][r="9"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('ellipse[cx="11"][cy="11"][rx="5"][ry="7"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('circle[cx="11"][cy="11"][r="2"]')
    ).toBeInTheDocument();
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });
});
