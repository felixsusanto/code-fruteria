import React from "react";
import { render, screen } from "@testing-library/react";
import AboutPanel from "./AboutPanel";

describe("AboutPanel", () => {
  it("renders the About title", () => {
    render(<AboutPanel />);
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/fruteria/i)).toBeInTheDocument();
  });

  it("mentions React and trading app", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/built with React/i)).toBeInTheDocument();
    expect(screen.getByText(/trading app for fruit/i)).toBeInTheDocument();
  });

  it("renders the playful signature", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();
    expect(screen.getByText(/🍌 and ❤️/i)).toBeInTheDocument();
  });

  it("has correct styles on the title", () => {
    render(<AboutPanel />);
    const title = screen.getByText("About");
    expect(title).toHaveStyle({
      fontWeight: "700",
      fontSize: "22px",
      margin: "0px",
    });
  });
});
