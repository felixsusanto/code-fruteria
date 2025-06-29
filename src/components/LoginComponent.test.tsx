import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
beforeEach(() => {
  /*
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;
  */
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
    .mockRejectedValueOnce({ message: "Failed to fetch" })
    .mockRejectedValueOnce({ message: "error" })
    .mockRejectedValueOnce({});
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("<LoginComponent />", () => {
  it("should render without error", async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    render(<LoginComponent onLoginSuccess={spy} />);
    const username = screen.getByRole("textbox", {
      name: /username/i,
    });
    await user.click(username);
    await user.keyboard("admin");
    const password = screen.getByPlaceholderText(/enter your password/i);
    await user.click(password);
    await user.keyboard("1234");
    const login = screen.getByRole("button", {
      name: /login/i,
    });
    await user.click(login);
    expect(spy).toHaveBeenCalled();
    await user.click(password);
    await user.keyboard("12345");
    await user.click(login);
    await user.click(login);
    await user.click(login);
  });
});
