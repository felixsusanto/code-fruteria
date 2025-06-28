import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginComponent } from "./LoginComponent";

// Mock window.matchMedia
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

describe("LoginComponent", () => {
  const setup = (onLoginSuccess = jest.fn()) => {
    render(<LoginComponent onLoginSuccess={onLoginSuccess} />);
    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });
    return { usernameInput, passwordInput, loginButton, onLoginSuccess };
  };

  it("renders login form", () => {
    setup();
    expect(
      screen.getByRole("heading", {
        name: /login/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation error if username is empty", async () => {
    const { loginButton } = setup();
    fireEvent.click(loginButton);
    expect(
      await screen.findByText(/please input your username/i)
    ).toBeInTheDocument();
  });

  it("calls onLoginSuccess on correct credentials", async () => {
    const { usernameInput, passwordInput, loginButton, onLoginSuccess } =
      setup();
    fireEvent.change(usernameInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });

  it("shows error message on invalid credentials", async () => {
    const { usernameInput, passwordInput, loginButton, onLoginSuccess } =
      setup();
    fireEvent.change(usernameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it("shows error message if only username is correct", async () => {
    const { usernameInput, passwordInput, loginButton } = setup();
    fireEvent.change(usernameInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("shows error message if only password is correct", async () => {
    const { usernameInput, passwordInput, loginButton } = setup();
    fireEvent.change(usernameInput, { target: { value: "wrong" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
