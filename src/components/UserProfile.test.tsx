import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "./UserProfile";

describe("UserProfile", () => {
  const onLogout = jest.fn();
  const onThemeToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the profile button", () => {
    render(<UserProfile onLogout={onLogout} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows popover when profile button is clicked", () => {
    render(<UserProfile onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("user@email.com")).toBeInTheDocument();
    expect(screen.getByText("Do you want to log out?")).toBeInTheDocument();
  });

  it("calls onLogout and closes popover when Log out is clicked", () => {
    render(<UserProfile onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Log out"));
    expect(onLogout).toHaveBeenCalled();
    // Popover should close
    expect(
      screen.queryByText("Do you want to log out?")
    ).not.toBeInTheDocument();
  });

  it("closes popover when Cancel is clicked", () => {
    render(<UserProfile onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText("Do you want to log out?")
    ).not.toBeInTheDocument();
  });

  it("closes popover when clicking outside", () => {
    render(<UserProfile onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(
      screen.getByText("Do you want to log out?").parentElement!.parentElement!
        .parentElement!
    );
    expect(
      screen.queryByText("Do you want to log out?")
    ).not.toBeInTheDocument();
  });

  it("renders theme switch if onThemeToggle is provided", () => {
    render(
      <UserProfile
        onLogout={onLogout}
        onThemeToggle={onThemeToggle}
        theme="dark"
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/Theme/)).toBeInTheDocument();
  });
});
