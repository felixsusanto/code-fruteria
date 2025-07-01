import { render } from "@testing-library/react";
import UserIcon from "./UserIcon";

describe("UserIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<UserIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders a circle with correct attributes", () => {
    const { container } = render(<UserIcon />);
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("cx", "10");
    expect(circle).toHaveAttribute("cy", "7");
    expect(circle).toHaveAttribute("r", "4");
    expect(circle).toHaveAttribute("stroke", "#555");
    expect(circle).toHaveAttribute("stroke-width", "1.5");
    expect(circle).toHaveAttribute("fill", "#e0e0e0");
  });

  it("renders a path with correct attributes", () => {
    const { container } = render(<UserIcon />);
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("d", "M3 17c0-2.5 3-4 7-4s7 1.5 7 4");
    expect(path).toHaveAttribute("stroke", "#555");
    expect(path).toHaveAttribute("stroke-width", "1.5");
    expect(path).toHaveAttribute("fill", "none");
    expect(path).toHaveAttribute("stroke-linecap", "round");
  });
});
