import { render, screen, fireEvent, act } from "@testing-library/react";
import { App } from "./App";
import { AppContext } from "./context/app";

// Mock dependencies
jest.mock("./Icons/AboutIcon", () => () => <span data-testid="about-icon" />);
jest.mock("./Icons/TermsIcon", () => () => <span data-testid="terms-icon" />);
jest.mock("./Icons/FruitViewIcon", () => () => <span data-testid="fruitview-icon" />);
jest.mock("./panels/AboutPanel", () => () => <div>AboutPanel</div>);
jest.mock("./panels/FruitBookPanel", () => ({ FruitBook: () => <div>FruitBookPanel</div> }));
jest.mock("./panels/FruitViewPanel", () => ({ FruitViewPanel: () => <div>FruitViewPanel</div> }));
jest.mock("./components/CandlestickChart", () => ({
  CandlestickChart: () => <div>CandlestickChart</div>,
}));
jest.mock("./components/ThemeToggleButton", () => ({
  ThemeToggleButton: ({ onThemeToggle }: any) => (
    <button data-testid="theme-toggle" onClick={() => onThemeToggle(true)}>
      Toggle Theme
    </button>
  ),
}));
jest.mock("react-grid-layout", () => {
  const Responsive = ({ children }: any) => <div>{children}</div>;
  Responsive.displayName = "Responsive";
  return {
    Responsive,
    WidthProvider: (Comp: any) => Comp,
  };
});
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    Menu: (props: any) => <div data-testid="menu">{props.items?.map((item: any) => <div key={item.key}>{item.extra}</div>)}</div>,
    Sider: ({ children, ...rest }: any) => <div data-testid="sider">{children}</div>,
    Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
    Header: ({ children }: any) => <div data-testid="header">{children}</div>,
    Content: ({ children }: any) => <div data-testid="content">{children}</div>,
    Avatar: ({ icon }: any) => <div data-testid="avatar">{icon}</div>,
    Dropdown: ({ children, ...rest }: any) => <div data-testid="dropdown">{children}</div>,
    Button: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
    Card: ({ children, title, extra, ...rest }: any) => (
      <div data-testid="card">
        <div data-testid="card-title">{title}{extra}</div>
        <div>{children}</div>
      </div>
    ),
    Divider: () => <div data-testid="divider" />,
    Typography: {
      Text: ({ children, ...rest }: any) => <span {...rest}>{children}</span>,
    },
    Flex: ({ children }: any) => <div>{children}</div>,
    Space: ({ children }: any) => <div>{children}</div>,
  };
});
jest.mock("antd/es/layout/layout", () => ({
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
  Content: ({ children }: any) => <div data-testid="content">{children}</div>,
}));
jest.mock("antd/es/layout/Sider", () => ({ children }: any) => <div data-testid="sider">{children}</div>);
jest.mock("./components/UtilityComponent", () => ({
  FullHeightWrapper: ({ children }: any) => <div>{children}</div>,
}));

const mockSetTheme = jest.fn();
const mockSetLoggedIn = jest.fn();

const renderApp = (contextOverrides = {}) =>
  render(
    <AppContext.Provider
      value={{
        theme: "light",
        setTheme: mockSetTheme,
        setLoggedIn: mockSetLoggedIn,
        userData: { user: "TestUser", email: "test@example.com" },
        ...contextOverrides,
      } as any}
    >
      <App />
    </AppContext.Provider>
  );

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders sidebar and header", () => {
    renderApp();
    expect(screen.getByTestId("sider")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("FRUTERIA")).toBeInTheDocument();
  });

  it("shows info when no panels are open", () => {
    renderApp();
    expect(screen.getByText(/No panels open/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag one from the navigation bar/i)).toBeInTheDocument();
  });

  it("toggles theme when theme button is clicked", () => {
    renderApp();
    fireEvent.click(screen.getByTestId("theme-toggle"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("logs out after inactivity", () => {
    const removeItemSpy = jest.spyOn(window.localStorage.__proto__, "removeItem");
    renderApp();
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000 + 1000);
    });
    expect(removeItemSpy).toHaveBeenCalledWith("isLoggedIn");
  });
});