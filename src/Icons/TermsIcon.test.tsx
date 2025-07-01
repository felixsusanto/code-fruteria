import { render } from "@testing-library/react";
import TermsIcon from "./TermsIcon";

describe("TermsIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<TermsIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies default size when no size prop is given", () => {
    const { container } = render(<TermsIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "22");
    expect(svg).toHaveAttribute("height", "22");
  });

  it("applies custom size when size prop is provided", () => {
    const { container } = render(<TermsIcon size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("renders the correct rectangles with expected attributes", () => {
    const { container } = render(<TermsIcon />);
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(3);

    // Outer rectangle
    expect(rects[0]).toHaveAttribute("x", "3");
    expect(rects[0]).toHaveAttribute("y", "3");
    expect(rects[0]).toHaveAttribute("width", "16");
    expect(rects[0]).toHaveAttribute("height", "16");
    expect(rects[0]).toHaveAttribute("rx", "4");
    expect(rects[0]).toHaveAttribute("fill", "#7c5fe6");

    // First inner rectangle
    expect(rects[1]).toHaveAttribute("x", "6");
    expect(rects[1]).toHaveAttribute("y", "7");
    expect(rects[1]).toHaveAttribute("width", "10");
    expect(rects[1]).toHaveAttribute("height", "2");
    expect(rects[1]).toHaveAttribute("rx", "1");
    expect(rects[1]).toHaveAttribute("fill", "#fff");

    // Second inner rectangle
    expect(rects[2]).toHaveAttribute("x", "6");
    expect(rects[2]).toHaveAttribute("y", "11");
    expect(rects[2]).toHaveAttribute("width", "6");
    expect(rects[2]).toHaveAttribute("height", "2");
    expect(rects[2]).toHaveAttribute("rx", "1");
    expect(rects[2]).toHaveAttribute("fill", "#fff");
  });
});
