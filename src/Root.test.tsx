import React from "react";
import Root from "./Root";
import { render, act } from "@testing-library/react";
import { LoginComponent as lc } from "./components/LoginComponent";

const LoginComponent = lc as unknown as jest.Mock;

jest.mock("./components/LoginComponent", () => ({
  LoginComponent: jest.fn().mockImplementation(() => <div>LoginComponent</div>),
}));
jest.mock("./App", () => ({
  App: jest.fn().mockImplementation(() => <div>App</div>),
}));

describe("<Root />", () => {
  it("should render without error", async () => {
    render(<Root />);
    expect(LoginComponent).toHaveBeenCalled();
    const [{ onLoginSuccess }] = LoginComponent.mock.lastCall ?? [];
    expect(onLoginSuccess).toBeDefined();
    act(() => onLoginSuccess());
  });
});
