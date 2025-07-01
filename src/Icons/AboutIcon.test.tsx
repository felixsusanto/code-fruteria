import { render } from "@testing-library/react";
import AboutIcon from "./AboutIcon";

describe("AboutIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<AboutIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies default size when no size prop is given", () => {
    const { container } = render(<AboutIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "22");
    expect(svg).toHaveAttribute("height", "22");
  });

  it("applies custom size when size prop is provided", () => {
    const { container } = render(<AboutIcon size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("renders the main purple rectangle", () => {
    const { container } = render(<AboutIcon />);
    const rects = container.querySelectorAll("rect");
    expect(rects[0]).toHaveAttribute("x", "3");
    expect(rects[0]).toHaveAttribute("y", "3");
    expect(rects[0]).toHaveAttribute("width", "16");
    expect(rects[0]).toHaveAttribute("height", "16");
    expect(rects[0]).toHaveAttribute("rx", "4");
    expect(rects[0]).toHaveAttribute("fill", "#7c5fe6");
  });

  it("renders the white rectangles for icon details", () => {
    const { container } = render(<AboutIcon />);
    const rects = container.querySelectorAll("rect");
    expect(rects[1]).toHaveAttribute("x", "10");
    expect(rects[1]).toHaveAttribute("y", "7");
    expect(rects[1]).toHaveAttribute("width", "2");
    expect(rects[1]).toHaveAttribute("height", "2");
    expect(rects[1]).toHaveAttribute("rx", "1");
    expect(rects[1]).toHaveAttribute("fill", "#fff");

    expect(rects[2]).toHaveAttribute("x", "10");
    expect(rects[2]).toHaveAttribute("y", "10");
    expect(rects[2]).toHaveAttribute("width", "2");
    expect(rects[2]).toHaveAttribute("height", "5");
    expect(rects[2]).toHaveAttribute("rx", "1");
    expect(rects[2]).toHaveAttribute("fill", "#fff");
  });
});
